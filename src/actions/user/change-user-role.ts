"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }
  if (session.user.id === userId) {
    return { ok: false, message: "No podés cambiar tu propio rol" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role === "admin" ? "admin" : "user" },
    });

    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo actualizar el rol" };
  }
};
