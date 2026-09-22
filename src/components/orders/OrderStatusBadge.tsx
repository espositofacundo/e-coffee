import type { OrderStatus } from "@/interfaces/orders.interface";
import { orderStatusLabel } from "@/utils/order-status";
import clsx from "clsx";

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={clsx(
      "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
      {
        "bg-amber-100 text-amber-800": status === "pendiente",
        "bg-sky-100 text-sky-800": status === "preparando",
        "bg-violet-100 text-violet-800": status === "en_camino",
        "bg-brand-green-light text-brand-green": status === "entregado",
        "bg-gray-200 text-gray-600": status === "cancelado",
      }
    )}
  >
    {orderStatusLabel[status]}
  </span>
);

export const PaidBadge = ({ isPaid }: { isPaid: boolean }) => (
  <span
    className={clsx(
      "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
      isPaid ? "bg-brand-green-light text-brand-green" : "bg-red-50 text-red-700"
    )}
  >
    {isPaid ? "Pagado" : "Pago pendiente"}
  </span>
);
