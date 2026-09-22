export const revalidate = 0;

import { getOrdersByUser } from "@/actions/order/get-order-by-user";
import { OrderStatusBadge, PaidBadge } from "@/components/orders/OrderStatusBadge";
import Title from "@/components/ui/title/Title";
import { currencyFormat } from "@/utils/currency";
import { formatOrderNumber } from "@/utils/order-status";
import { formatDateTime } from "@/utils/date";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoChevronForward } from "react-icons/io5";

export const metadata = {
  title: "Mis pedidos",
};

export default async function OrdersPage() {
  const { ok, orders = [] } = await getOrdersByUser();

  if (!ok) {
    redirect("/auth/login?redirectTo=/orders");
  }

  return (
    <>
      <Title title="Mis pedidos" />

      {orders.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-lg font-semibold">Todavía no hiciste pedidos</p>
          <Link href="/" className="btn-primary mt-5">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-brand-cream-dark">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center gap-4 px-4 py-4 hover:bg-brand-cream/60"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">
                    Pedido {formatOrderNumber(order.number)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <PaidBadge isPaid={order.isPaid} />
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  {formatDateTime(order.createdAt)} ·{" "}
                  {order.itemsInOrder} productos
                </p>
              </div>
              <span className="font-bold">{currencyFormat(order.total)}</span>
              <IoChevronForward className="text-gray-400" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
