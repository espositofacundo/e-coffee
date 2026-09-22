"use server";

import prisma from "@/lib/prisma";
import { publicProductSelect } from "@/lib/product-select";

// Producto para la página pública: sin costo ni margen.
export const getProductbySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      select: {
        ...publicProductSelect,
        ProductImage: { select: { url: true } },
        category: { select: { name: true } },
      },
      where: { slug },
    });

    if (!product) return null;

    const { ProductImage, ...rest } = product;
    return {
      ...rest,
      images: ProductImage.map((image) => image.url),
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el producto");
  }
};
