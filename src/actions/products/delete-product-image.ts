"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  try {
    if (imageUrl.startsWith("http")) {
      const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";
      await cloudinary.uploader.destroy(imageName);
    }

    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: { product: { select: { slug: true } } },
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo eliminar la imagen" };
  }
};
