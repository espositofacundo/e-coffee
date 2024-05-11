// Archivo donde está definida getPaginatedProductsWithImages

"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  categoryId?: string | null;  // Aceptar string, undefined o null
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  categoryId = null,  // Permitir nulo
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
      // Agregar condición para ignorar el filtro de categoría si categoryId es nulo
      const products = await prisma.product.findMany({
          where: {
              ...(categoryId && { categoryId: categoryId }),
          },
          take: take,
          skip: (page - 1) * take,
          include: {
              ProductImage: {
                  take: 1,
                  select: {
                      url: true,
                  },
              },
          },
      });

      const totalCount = await prisma.product.count({
          where: {
              ...(categoryId && { categoryId: categoryId }),
          }
      });
      const totalPage = Math.ceil(totalCount / take);

      return {
          currentPage: page,
          totalPages: totalPage,
          products: products.map(product => ({
              ...product,
              images: product.ProductImage.map(image => image.url),
          })),
      };
  } catch (error) {
      throw new Error("Error al cargar los productos: ");
  }
};
