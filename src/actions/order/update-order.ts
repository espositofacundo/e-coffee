"use server";

import { auth } from "@/auth.config";
import type { OrderStatus } from "@/interfaces/orders.interface";
import prisma from "@/lib/prisma";
import { orderSteps } from "@/utils/order-status";
import { revalidatePath } from "next/cache";

const revalidateOrder = (orderId: string) => {
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
};

// Fecha de cada paso del seguimiento, según el estado nuevo.
const stepDates = [
  ["preparando", "preparingAt"],
  ["en_camino", "shippedAt"],
  ["entregado", "deliveredAt"],
] as const;

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  try {
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    const now = new Date();
    const data: Record<string, unknown> = { status };

    if (status === "cancelado") {
      data.cancelledAt = now;
    } else {
      data.cancelledAt = null;
      const newStep = orderSteps.indexOf(status);
      // Si se vuelve a un paso anterior, se borran las fechas de los pasos siguientes.
      for (const [step, field] of stepDates) {
        data[field] =
          orderSteps.indexOf(step) <= newStep ? order[field] ?? now : null;
      }
    }

    await prisma.order.update({ where: { id: orderId }, data });
    revalidateOrder(orderId);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo actualizar el pedido" };
  }
};

export const updateOrderPaid = async (orderId: string, isPaid: boolean) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid, paidAt: isPaid ? new Date() : null },
    });
    revalidateOrder(orderId);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo actualizar el pedido" };
  }
};
