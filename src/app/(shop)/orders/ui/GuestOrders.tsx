"use client";

import { getOrdersByIds } from "@/actions/order/get-orders-by-ids";
import { useMyOrdersStore } from "@/store/ui/orders/my-orders-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrdersList, type OrderRow } from "./OrdersList";

// Pedidos de un cliente sin cuenta: los ids quedan guardados en su navegador.
export const GuestOrders = () => {
  const orderIds = useMyOrdersStore((state) => state.orderIds);
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    if (orderIds.length === 0) {
      setOrders([]);
      return;
    }
    getOrdersByIds(orderIds).then(setOrders);
  }, [orderIds]);

  if (orders === null) return <p className="text-gray-500">Cargando…</p>;

  if (orders.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-semibold">Todavía no hiciste pedidos</p>
        <p className="text-gray-600 mt-1">
          Acá vas a ver los pedidos que hagas desde este teléfono o computadora.
        </p>
        <Link href="/" className="btn-primary mt-5">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <>
      <OrdersList orders={orders} />
      <p className="mt-3 text-sm text-gray-500">
        Estos pedidos están guardados en este navegador. Si entrás desde otro dispositivo,
        abrí el link que te quedó al confirmar el pedido.
      </p>
    </>
  );
};
