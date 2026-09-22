"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";
import { Prisma, SaleUnit } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const emptyToNull = (value: unknown) =>
  value === "" || value === undefined || value === null ? null : value;

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().max(255).default(""),
  description: z.string().trim().default(""),
  categoryId: z.string().uuid(),
  unit: z.nativeEnum(SaleUnit),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Math.round(val)),
  priceHalf: z.preprocess(
    emptyToNull,
    z.coerce
      .number()
      .min(0)
      .transform((val) => Math.round(val))
      .nullable()
  ),
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

  const { id, variants, ...rest } = productParsed.data;
  const data = {
    ...rest,
    slug: slugify(rest.slug || rest.title),
    // Los productos por unidad no tienen precio por ½ kg.
    priceHalf: rest.unit === "unidad" ? null : rest.priceHalf,
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
