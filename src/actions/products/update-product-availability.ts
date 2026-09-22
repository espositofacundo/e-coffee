"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateProductAvailability = async (
  productId: string,
  available: boolean
) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { available },
      select: { slug: true },
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath(`/product/${product.slug}`);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo actualizar el producto" };
  }
};
