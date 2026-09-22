"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

// Producto completo (con costo y margen) para el formulario de administración.
export const getAdminProduct = async (slug: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") return null;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { ProductImage: true },
  });
  if (!product) return null;

  return {
    ...product,
    images: product.ProductImage.map((image) => image.url),
  };
};
