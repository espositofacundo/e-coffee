"use server";

import prisma from "@/lib/prisma";
import { publicProductSelect } from "@/lib/product-select";

// Catálogo público: categorías en orden, con sus productos disponibles.
export const getCatalog = async () => {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      Product: {
        where: { available: true },
        orderBy: { title: "asc" },
        select: {
          ...publicProductSelect,
          ProductImage: { take: 1, select: { url: true } },
        },
      },
    },
  });

  return categories
    .filter((category) => category.Product.length > 0)
    .map(({ Product, ...category }) => ({
      ...category,
      products: Product.map(({ ProductImage, ...product }) => ({
        ...product,
        images: ProductImage.map((image) => image.url),
      })),
    }));
};

export type CatalogCategory = Awaited<ReturnType<typeof getCatalog>>[number];
