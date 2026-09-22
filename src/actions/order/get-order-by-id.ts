"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Debe de estar autenticado" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: {
          select: {
            id: true,
            price: true,
            quantity: true,
            presentation: true,
            variant: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: { select: { url: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!order) throw `${id} no existe`;

    if (session.user.role !== "admin" && session.user.id !== order.userId) {
      throw `${id} no corresponde a este usuario.`;
    }

    return { ok: true, order };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "El pedido no existe" };
  }
};
