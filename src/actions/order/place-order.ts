"use server";

import { auth } from "@/auth.config";
import type { Address } from "@/interfaces/orders.interface";
import type { Presentation } from "@/interfaces/product.interface";
import prisma from "@/lib/prisma";
import { getPresentationPrice, presentationLabel } from "@/utils/presentation";
import { stockByProduct } from "@/utils/stock";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface ProductToOrder {
  productId: string;
  quantity: number;
  presentation: Presentation;
  variant?: string;
}

const itemsSchema = z
  .array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(999),
      presentation: z.enum(["medio_kg", "kg", "unidad"]),
      variant: z.string().optional(),
    })
  )
  .min(1, "El carrito está vacío");

const addressSchema = z.object({
  firstName: z.string().trim().min(2, "Falta el nombre"),
  phone: z.string().trim().min(6, "Falta el teléfono"),
  address: z.string().trim().min(3, "Falta la dirección"),
  notes: z.string().trim().default(""),
  paymentMethod: z.enum(["efectivo", "transferencia"]),
});

export const placeOrder = async (
  productsToOrder: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    return { ok: false, message: "Tenés que iniciar sesión para hacer el pedido" };
  }

  // La sesión puede seguir activa aunque la cuenta ya no exista (ej. si se borró).
  const userExists = await prisma.user.count({ where: { id: userId } });
  if (!userExists) {
    return {
      ok: false,
      message: "Tu sesión expiró. Cerrá sesión y volvé a ingresar para confirmar el pedido.",
    };
  }

  const itemsParsed = itemsSchema.safeParse(productsToOrder);
  const addressParsed = addressSchema.safeParse(address);
  if (!itemsParsed.success) {
    return { ok: false, message: itemsParsed.error.issues[0].message };
  }
  if (!addressParsed.success) {
    return { ok: false, message: addressParsed.error.issues[0].message };
  }
  const items = itemsParsed.data;
  const delivery = addressParsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
  });

  // Los precios se calculan acá, nunca se toman del carrito del cliente.
  const orderItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.available) {
      return {
        ok: false,
        message: `${product?.title ?? "Un producto"} ya no está disponible. Sacalo del carrito para continuar.`,
      };
    }

    const price = getPresentationPrice(product, item.presentation);
    if (price === null) {
      return {
        ok: false,
        message: `${product.title} no se vende por ${presentationLabel[item.presentation]}`,
      };
    }

    let variant: string | null = null;
    if (product.variants.length > 0) {
      if (!item.variant || !product.variants.includes(item.variant)) {
        return {
          ok: false,
          message: `Elegí una variedad para ${product.title}`,
        };
      }
      variant = item.variant;
    }

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      presentation: item.presentation,
      variant,
      price,
    });
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemsInOrder = orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  try {
    // El pedido y el descuento de stock van juntos: o se hacen los dos o ninguno.
    // Solo se descuenta en productos con stock cargado; si no alcanza, queda en negativo.
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId,
          subtotal,
          // El envío es gratis: el total es el subtotal.
          total: subtotal,
          itemsInOrder,
          firstName: delivery.firstName,
          phone: delivery.phone,
          address: delivery.address,
          notes: delivery.notes || null,
          paymentMethod: delivery.paymentMethod,
          OrderItem: { createMany: { data: orderItems } },
        },
      }),
      ...Array.from(stockByProduct(orderItems)).map(([productId, amount]) =>
        prisma.product.updateMany({
          where: { id: productId, stock: { not: null } },
          data: { stock: { decrement: amount } },
        })
      ),
    ]);

    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    return { ok: true, order };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo registrar el pedido" };
  }
};
