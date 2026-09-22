"use client";

import { updateOrderPaid, updateOrderStatus } from "@/actions/order/update-order";
import type { OrderStatus } from "@/interfaces/orders.interface";
import { orderStatusLabel } from "@/utils/order-status";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  orderId: string;
  status: OrderStatus;
  isPaid: boolean;
  compact?: boolean;
}

const statuses = Object.keys(orderStatusLabel) as OrderStatus[];

export const OrderControls = ({ orderId, status, isPaid, compact = false }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean; message?: string }>) => {
    startTransition(async () => {
      const resp = await action();
      if (!resp.ok) alert(resp.message ?? "No se pudo actualizar el pedido");
      router.refresh();
    });
  };

  return (
    <div
      className={clsx("flex gap-2", compact ? "items-center" : "flex-col sm:flex-row", {
        "opacity-60 pointer-events-none": isPending,
      })}
    >
      <select
        value={status}
        onChange={(e) => run(() => updateOrderStatus(orderId, e.target.value as OrderStatus))}
        className="rounded-lg border border-brand-cream-dark bg-white px-2 py-1.5 text-sm font-medium"
        aria-label="Estado del pedido"
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {orderStatusLabel[option]}
          </option>
        ))}
      </select>

      <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          checked={isPaid}
          onChange={(e) => run(() => updateOrderPaid(orderId, e.target.checked))}
          className="h-4 w-4 accent-brand-green"
        />
        Pagado
      </label>
    </div>
  );
};
