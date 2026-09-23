"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

// Pedidos guardados en el navegador de un cliente sin cuenta. Solo devuelve
// pedidos sin cuenta: el id (uuid) es la llave, igual que el link del pedido.
export const getOrdersByIds = async (ids: string[]) => {
  const parsed = z.array(z.string().uuid()).max(20).safeParse(ids);
  if (!parsed.success || parsed.data.length === 0) return [];

  return prisma.order.findMany({
    where: { id: { in: parsed.data }, userId: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      status: true,
      isPaid: true,
      itemsInOrder: true,
      total: true,
      createdAt: true,
    },
  });
};

export type OrderSummary = Awaited<ReturnType<typeof getOrdersByIds>>[number];
