"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getAdminProducts = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, products: [] };
  }

  const products = await prisma.product.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
    include: {
      category: { select: { name: true } },
      ProductImage: { take: 1, select: { url: true } },
    },
  });

  return { ok: true, products };
};
