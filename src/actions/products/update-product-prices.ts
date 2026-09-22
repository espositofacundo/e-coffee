"use server";

import { getStoreSettings } from "@/actions/settings/get-store-settings";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import {
  halfKgPrice,
  isValidMarkup,
  markupFromPrice,
  priceFromCost,
} from "@/utils/pricing";
import { resolveHalfPrice } from "@/utils/half-price";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const rowSchema = z.object({
  id: z.string().uuid(),
  cost: z.number().positive().nullable(),
  markup: z.number().nullable(),
  price: z.number().min(0),
  sellsHalf: z.boolean(),
  available: z.boolean(),
  // Solo viene si se editó en la grilla (así no se pisa lo que descontaron los pedidos).
  stock: z.number().finite().nullable().optional(),
});

const inputSchema = z.object({
  rows: z.array(rowSchema).max(1000),
  halfKgSurcharge: z.number().min(0).max(50).optional(),
});

export type PriceRowInput = z.infer<typeof rowSchema>;

// Guarda de una vez los cambios de la grilla de precios. Los precios se
// recalculan acá con las mismas fórmulas de la planilla.
export const updateProductPrices = async (input: z.infer<typeof inputSchema>) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Hay valores inválidos en la grilla" };
  }
  const { rows } = parsed.data;

  const settings = await getStoreSettings();
  const surcharge = parsed.data.halfKgSurcharge ?? settings.halfKgSurcharge;
  const surchargeChanged = surcharge !== settings.halfKgSurcharge;

  const products = await prisma.product.findMany({
    where: { id: { in: rows.map((row) => row.id) } },
    select: { id: true, title: true, unit: true, price: true, priceHalf: true },
  });

  const updates = [];
  for (const row of rows) {
    const product = products.find((p) => p.id === row.id);
    if (!product) continue;

    if (row.markup !== null && !isValidMarkup(row.markup)) {
      return {
        ok: false,
        message: `El margen de ${product.title} tiene que estar entre 1 y 10 (ej. 1,35)`,
      };
    }

    let { price, markup } = row;
    if (row.cost === null) {
      markup = null;
    } else if (markup !== null) {
      price = priceFromCost(row.cost, markup);
    } else if (price > 0) {
      markup = markupFromPrice(row.cost, price);
    }

    if (price <= 0) {
      return { ok: false, message: `Falta el precio de ${product.title}` };
    }

    updates.push(
      prisma.product.update({
        where: { id: row.id },
        data: {
          cost: row.cost,
          markup,
          price,
          priceHalf: resolveHalfPrice(
            product,
            product.unit,
            price,
            row.sellsHalf,
            surcharge,
            surchargeChanged
          ),
          available: row.available,
          ...(row.stock !== undefined && { stock: row.stock }),
        },
      })
    );
  }

  // Con un recargo nuevo se recalcula el ½ kg del resto de los productos que lo venden.
  if (surchargeChanged) {
    const editedIds = new Set(rows.map((row) => row.id));
    const halfProducts = await prisma.product.findMany({
      where: { unit: "kg", priceHalf: { not: null } },
      select: { id: true, price: true },
    });
    for (const product of halfProducts) {
      if (editedIds.has(product.id)) continue;
      updates.push(
        prisma.product.update({
          where: { id: product.id },
          data: { priceHalf: halfKgPrice(product.price, surcharge) },
        })
      );
    }
    updates.push(
      prisma.storeSetting.update({
        where: { id: 1 },
        data: { halfKgSurcharge: surcharge },
      })
    );
  }

  try {
    await prisma.$transaction(updates);
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudieron guardar los precios" };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/product/[slug]", "page");
  return { ok: true };
};
