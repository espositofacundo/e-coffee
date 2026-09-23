import { OrderStatusBadge, PaidBadge } from "@/components/orders/OrderStatusBadge";
import type { OrderStatus } from "@/interfaces/orders.interface";
import { currencyFormat } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { formatOrderNumber } from "@/utils/order-status";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

export interface OrderRow {
  id: string;
  number: number;
  status: OrderStatus;
  isPaid: boolean;
  itemsInOrder: number;
  total: number;
  createdAt: Date;
}

export const OrdersList = ({ orders }: { orders: OrderRow[] }) => (
  <div className="card divide-y divide-brand-cream-dark">
    {orders.map((order) => (
      <Link
        key={order.id}
        href={`/orders/${order.id}`}
        className="flex items-center gap-4 px-4 py-4 hover:bg-brand-cream/60"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Pedido {formatOrderNumber(order.number)}</span>
            <OrderStatusBadge status={order.status} />
            <PaidBadge isPaid={order.isPaid} />
          </div>
          <p className="text-sm text-gray-600 mt-0.5">
            {formatDateTime(order.createdAt)} · {order.itemsInOrder} productos
          </p>
        </div>
        <span className="font-bold">{currencyFormat(order.total)}</span>
        <IoChevronForward className="text-gray-400" />
      </Link>
    ))}
  </div>
);
