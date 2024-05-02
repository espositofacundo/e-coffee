"use server";

import prisma from "@/lib/prisma";
import { sleep } from "@/utils/sleep";

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {

    await sleep(3);
    
    //aca obtentengo el producto

    const stock = await prisma.product.findFirst({
      where: { slug: slug },
      select: { inStock: true },
    });

    return stock?.inStock ?? 0;
  } catch (error) {
    return 0;
  }
};
