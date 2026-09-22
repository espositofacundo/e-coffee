"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getAllOrders = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "Debe de ser un usuario administrador" };
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { ok: true, orders };
};
