"use server";

import { auth } from "@/auth.config";
import type { Address } from "@/interfaces/orders.interface";
import prisma from "@/lib/prisma";

// Datos de entrega del último pedido del usuario, para autocompletar el checkout.
export const getLastAddress = async (): Promise<Address | null> => {
  const session = await auth();
  if (!session?.user) return null;

  const lastOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      firstName: true,
      phone: true,
      address: true,
      notes: true,
      paymentMethod: true,
    },
  });
  if (!lastOrder) return null;

  return { ...lastOrder, notes: lastOrder.notes ?? "" };
};
