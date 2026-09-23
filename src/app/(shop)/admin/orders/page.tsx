export const revalidate = 0;

import { getAllOrders } from "@/actions/order/get-all-orders";
import { whatsappRecipients } from "@/lib/whatsapp-notify";
import Title from "@/components/ui/title/Title";
import { currencyFormat } from "@/utils/currency";
import { dayKey } from "@/utils/date";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { IoLogoWhatsapp } from "react-icons/io5";
import OrderTable from "./ui/OrderTable";

export const metadata = {
  title: "Pedidos",
};

export default async function AdminOrdersPage() {
  const { ok, orders = [] } = await getAllOrders();

  if (!ok) {
    redirect("/auth/login");
  }

  const recipients = whatsappRecipients();
  const today = dayKey(new Date());
  const ordersToday = orders.filter(
    (order) => order.status !== "cancelado" && dayKey(order.createdAt) === today
  );
  const stats = [
    { label: "Pedidos de hoy", value: ordersToday.length },
    {
      label: "Vendido hoy",
      value: currencyFormat(ordersToday.reduce((total, order) => total + order.total, 0)),
    },
    {
      label: "Por preparar",
      value: orders.filter((order) => order.status === "pendiente").length,
    },
    {
      label: "Sin cobrar",
      value: orders.filter((order) => !order.isPaid && order.status !== "cancelado").length,
    },
  ];

  return (
    <>
      <Title title="Pedidos" />

      <p
        className={clsx(
          "mb-4 rounded-lg px-3 py-2 text-sm",
          recipients.length > 0
            ? "bg-brand-green-light text-brand-green"
            : "bg-brand-gold-light text-brand-gold-dark"
        )}
      >
        {recipients.length > 0 ? (
          <>
            <IoLogoWhatsapp className="inline mb-0.5 mr-1" />
            Los pedidos nuevos se avisan por WhatsApp a {recipients.join(" y ")}.
          </>
        ) : (
          <>
            El aviso por WhatsApp todavía no está conectado: los pedidos nuevos aparecen acá,
            pero no llega ningún mensaje.
          </>
        )}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-brand-green">{stat.value}</p>
          </div>
        ))}
      </div>

      <OrderTable orders={orders} />
    </>
  );
}
