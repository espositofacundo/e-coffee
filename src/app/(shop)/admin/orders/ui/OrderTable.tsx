"use client";

import { OrderControls } from "@/components/orders/OrderControls";
import type { OrderStatus, Orders } from "@/interfaces/orders.interface";
import { currencyFormat } from "@/utils/currency";
import { formatShortDateTime } from "@/utils/date";
import { formatOrderNumber, orderStatusLabel, paymentMethodLabel } from "@/utils/order-status";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

interface Props {
  orders: Orders[];
}

type Filter = "activos" | OrderStatus | "todos";

const filters: { value: Filter; label: string }[] = [
  { value: "activos", label: "Activos" },
  { value: "pendiente", label: orderStatusLabel.pendiente },
  { value: "preparando", label: orderStatusLabel.preparando },
  { value: "en_camino", label: orderStatusLabel.en_camino },
  { value: "entregado", label: orderStatusLabel.entregado },
  { value: "cancelado", label: orderStatusLabel.cancelado },
  { value: "todos", label: "Todos" },
];

const OrderTable = ({ orders }: Props) => {
  const [filter, setFilter] = useState<Filter>("activos");

  const visibleOrders = orders.filter((order) => {
    if (filter === "todos") return true;
    if (filter === "activos") {
      return order.status !== "entregado" && order.status !== "cancelado";
    }
    return order.status === filter;
  });

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {filters.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={clsx(
              "shrink-0 rounded-full px-3 py-1 text-sm font-medium border",
              filter === option.value
                ? "bg-brand-green border-brand-green text-white"
                : "bg-white border-brand-cream-dark"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="card p-8 text-center text-gray-600">No hay pedidos en esta vista.</div>
      ) : (
        <div className="card divide-y divide-brand-cream-dark">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className="grid gap-3 px-4 py-4 md:grid-cols-[110px_1fr_120px_auto] md:items-center"
            >
              <div>
                <Link href={`/orders/${order.id}`} className="font-bold text-brand-green hover:underline">
                  {formatOrderNumber(order.number)}
                </Link>
                <p className="text-xs text-gray-500">{formatShortDateTime(order.createdAt)}</p>
              </div>

              <div className="min-w-0 text-sm">
                <p className="font-semibold">
                  {order.firstName} · <a href={`tel:${order.phone}`} className="font-normal underline">{order.phone}</a>
                </p>
                <p className="truncate">{order.address}</p>
                {order.notes && <p className="truncate text-gray-500">{order.notes}</p>}
              </div>

              <div className="text-sm">
                <p className="font-bold text-base">{currencyFormat(order.total)}</p>
                <p className="text-gray-500">{paymentMethodLabel[order.paymentMethod]}</p>
              </div>

              <OrderControls
                orderId={order.id}
                status={order.status}
                isPaid={order.isPaid}
                compact
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OrderTable;
