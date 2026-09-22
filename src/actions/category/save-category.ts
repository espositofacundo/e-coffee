"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(100),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const revalidateCategories = () => {
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
};

export const saveCategory = async (input: {
  id?: string;
  name: string;
  sortOrder: number;
}) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "El nombre de la categoría es obligatorio" };
  }

  const { id, ...data } = parsed.data;
  try {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      await prisma.category.create({ data });
    }
    revalidateCategories();
    return { ok: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: `Ya existe la categoría "${data.name}"` };
    }
    console.log(error);
    return { ok: false, message: "No se pudo guardar la categoría" };
  }
};

export const deleteCategory = async (id: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  const products = await prisma.product.count({ where: { categoryId: id } });
  if (products > 0) {
    return {
      ok: false,
      message: "La categoría tiene productos. Movelos a otra categoría antes de eliminarla.",
    };
  }

  try {
    await prisma.category.delete({ where: { id } });
    revalidateCategories();
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo eliminar la categoría" };
  }
};
