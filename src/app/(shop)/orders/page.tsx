export const revalidate = 0;

import { getOrdersByUser } from "@/actions/order/get-order-by-user";
import { auth } from "@/auth.config";
import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { GuestOrders } from "./ui/GuestOrders";
import { OrdersList } from "./ui/OrdersList";

export const metadata = {
  title: "Mis pedidos",
};

export default async function OrdersPage() {
  const session = await auth();

  // Sin cuenta: los pedidos quedan guardados en el navegador del cliente.
  if (!session?.user) {
    return (
      <>
        <Title title="Mis pedidos" />
        <GuestOrders />
      </>
    );
  }

  const { orders = [] } = await getOrdersByUser();

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
        <OrdersList orders={orders} />
      )}
    </>
  );
}
