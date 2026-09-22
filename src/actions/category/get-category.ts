"use server";

import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    return await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { Product: true } } },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};
