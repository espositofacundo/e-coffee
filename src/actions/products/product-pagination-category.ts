"use server";

import prisma from "@/lib/prisma";



interface PaginationOptions{
    page?: number;
    take?: number;
}

export const getPaginatedProductsWithImagesCat = async ({
    page = 1,
    take = 12,
}:PaginationOptions) => {
    if(isNaN(Number(page))) page = 1 ;
    if(page < 1) page = 1;



  try {

    

    // 1. Obtener los productos
    const products = await prisma.product.findMany({
        take: take,
        skip: (page-1) * take,
      include: {
        ProductImage: {
          take: 1,
          select: {
            url: true,
          },
        },
      },
    });

    // 2. obtener el todal de paginas

    const totalCount = await prisma.product.count({}) ;
    const totalPage = Math.ceil(totalCount/take)


    return {
      currentPage: page,
      totalPages: totalPage,

      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error("no se cargo los prductos");
  }
};