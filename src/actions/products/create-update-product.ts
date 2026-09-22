"use server";

import { getStoreSettings } from "@/actions/settings/get-store-settings";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { resolveHalfPrice } from "@/utils/half-price";
import {
  isValidMarkup,
  markupFromPrice,
  priceFromCost,
} from "@/utils/pricing";
import { slugify } from "@/utils/slugify";
import { Prisma, SaleUnit } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const emptyToNull = (value: unknown) =>
  value === "" || value === undefined || value === null ? null : value;

// undefined = no vino en el formulario (no se toca); "" = vacío (null).
const optionalNumber = (value: unknown) =>
  value === undefined ? undefined : value === "" || value === null ? null : Number(value);

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().max(255).default(""),
  description: z.string().trim().default(""),
  categoryId: z.string().uuid(),
  unit: z.nativeEnum(SaleUnit),
  cost: z.preprocess(emptyToNull, z.coerce.number().positive().nullable()),
  markup: z.preprocess(emptyToNull, z.coerce.number().nullable()),
  price: z.preprocess(
    emptyToNull,
    z.coerce
      .number()
      .min(0)
      .transform((val) => Math.round(val))
      .nullable()
  ),
  sellsHalf: z.preprocess((value) => value === "true", z.boolean()),
  stock: z.preprocess(optionalNumber, z.number().finite().nullable().optional()),
  variants: z.string().default(""),
  available: z.preprocess((value) => value === "true", z.boolean()),
});

export const createdUpdateProduct = async (formData: FormData) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  const productParsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false, message: "Revisá los datos del producto" };
  }

  const { id, variants, sellsHalf, cost, stock, ...rest } = productParsed.data;

  // Mismas reglas que la grilla de precios: con costo y margen, el precio sale
  // de la fórmula; con costo y precio, el margen se deduce.
  let { price, markup } = rest;
  if (cost === null) {
    markup = null;
  } else if (markup !== null) {
    if (!isValidMarkup(markup)) {
      return { ok: false, message: "El margen tiene que estar entre 1 y 10 (ej. 1,35)" };
    }
    price = priceFromCost(cost, markup);
  } else if (price) {
    markup = markupFromPrice(cost, price);
  }
  if (!price) {
    return { ok: false, message: "Falta el precio, o el costo y el margen para calcularlo" };
  }

  const [{ halfKgSurcharge }, stored] = await Promise.all([
    getStoreSettings(),
    id
      ? prisma.product.findUnique({
          where: { id },
          select: { unit: true, price: true, priceHalf: true },
        })
      : null,
  ]);
  const data = {
    ...rest,
    cost,
    markup,
    price,
    slug: slugify(rest.slug || rest.title),
    // Los productos por unidad no tienen precio por ½ kg.
    priceHalf: resolveHalfPrice(stored, rest.unit, price, sellsHalf, halfKgSurcharge),
    ...(stock !== undefined && { stock }),
    variants: variants
      .split(",")
      .map((variant) => variant.trim())
      .filter(Boolean),
  };

  let product;
  try {
    product = id
      ? await prisma.product.update({ where: { id }, data })
      : await prisma.product.create({ data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: `Ya existe un producto con el slug "${data.slug}"` };
    }
    console.log(error);
    return { ok: false, message: "No se pudo guardar el producto" };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${product.slug}`);

  const files = (formData.getAll("images") as File[]).filter(
    (file) => file.size > 0
  );
  if (files.length > 0) {
    const images = await uploadImages(files);
    if (!images) {
      return {
        ok: false,
        product,
        message: "El producto se guardó, pero no se pudieron subir las fotos",
      };
    }
    await prisma.productImage.createMany({
      data: images.map((url) => ({ url, productId: product.id })),
    });
  }

  return { ok: true, product };
};

const uploadImages = async (images: File[]) => {
  try {
    return await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const result = await cloudinary.uploader.upload(
          `data:${image.type || "image/png"};base64,${base64Image}`
        );
        return result.secure_url;
      })
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
