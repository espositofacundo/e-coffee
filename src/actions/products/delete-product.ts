"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProduct = async (productId: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  const ordersWithProduct = await prisma.orderItem.count({
    where: { productId },
  });
  if (ordersWithProduct > 0) {
    return {
      ok: false,
      message:
        "Este producto ya está en pedidos, no se puede eliminar. Marcalo como sin stock para ocultarlo.",
    };
  }

  try {
    const product = await prisma.product.delete({
      where: { id: productId },
      include: { ProductImage: true },
    });

    for (const image of product.ProductImage) {
      if (!image.url.startsWith("http")) continue;
      const imageName = image.url.split("/").pop()?.split(".")[0] ?? "";
      await cloudinary.uploader.destroy(imageName).catch(console.log);
    }

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo eliminar el producto" };
  }
};
