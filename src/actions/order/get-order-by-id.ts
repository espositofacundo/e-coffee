"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
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

    // Un pedido sin cuenta lo ve cualquiera que tenga el link: el id es la llave.
    // Si es de una cuenta, solo esa cuenta o un administrador.
    if (order.userId !== null) {
      const session = await auth();
      const isAdmin = session?.user.role === "admin";
      if (!isAdmin && session?.user.id !== order.userId) {
        throw `${id} no corresponde a este usuario.`;
      }
    }

    return { ok: true, order };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "El pedido no existe" };
  }
};
