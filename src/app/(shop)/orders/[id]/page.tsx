export const revalidate = 0;

import { getOrderById } from "@/actions/order/get-order-by-id";
import { auth } from "@/auth.config";
import ProductImage from "@/components/product/product-image/productImage";
import { OrderControls } from "@/components/orders/OrderControls";
import { PaidBadge } from "@/components/orders/OrderStatusBadge";
import Title from "@/components/ui/title/Title";
import { store } from "@/config/store";
import { currencyFormat } from "@/utils/currency";
import { formatDateTime, formatShortDateTime } from "@/utils/date";
import {
  formatOrderNumber,
  orderStatusLabel,
  orderSteps,
  paymentMethodLabel,
} from "@/utils/order-status";
import { presentationLabel } from "@/utils/presentation";
import { buildOrderMessage, whatsappLink } from "@/utils/whatsapp";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";
import { IoCheckmark, IoCheckmarkCircle } from "react-icons/io5";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    nuevo?: string;
  };
}

export const metadata = {
  title: "Pedido",
};

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ ok, order }, session] = await Promise.all([getOrderById(params.id), auth()]);

  if (!ok || !order) {
    redirect("/");
  }

  const isAdmin = session?.user.role === "admin";
  const message = buildOrderMessage(order);
  const currentStep = orderSteps.indexOf(order.status);
  const stepDates = [order.createdAt, order.preparingAt, order.shippedAt, order.deliveredAt];

  return (
    <>
      <Title
        title={`Pedido ${formatOrderNumber(order.number)}`}
        subtitle={`Hecho el ${formatDateTime(order.createdAt)}`}
      />

      {searchParams.nuevo && (
        <div className="mb-6 rounded-xl bg-brand-green-light border border-brand-green/20 p-4 flex gap-3">
          <IoCheckmarkCircle size={28} className="shrink-0 text-brand-green" />
          <div>
            <p className="font-bold text-brand-green">¡Recibimos tu pedido!</p>
            <p className="text-sm">
              Mandanos el detalle por WhatsApp para coordinar la entrega.
            </p>
          </div>
        </div>
      )}

      {order.status === "cancelado" ? (
        <div className="card p-4 mb-6 text-center font-semibold text-gray-600">
          Este pedido fue cancelado
        </div>
      ) : (
        <ol className="card p-4 sm:p-5 mb-6 grid grid-cols-4 gap-2">
          {orderSteps.map((step, index) => {
            const done = index <= currentStep;
            const date = stepDates[index];
            return (
              <li key={step} className="flex flex-col items-center text-center relative">
                {index > 0 && (
                  <span
                    className={clsx(
                      "absolute top-4 right-1/2 w-full h-0.5 -z-0",
                      done ? "bg-brand-green" : "bg-brand-cream-dark"
                    )}
                  />
                )}
                <span
                  className={clsx(
                    "relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border-2",
                    done
                      ? "bg-brand-green border-brand-green text-white"
                      : "bg-white border-brand-cream-dark text-gray-400"
                  )}
                >
                  {done ? <IoCheckmark /> : index + 1}
                </span>
                <span className={clsx("mt-2 text-xs sm:text-sm font-semibold", !done && "text-gray-400")}>
                  {orderStatusLabel[step]}
                </span>
                <span className="text-[11px] text-gray-500">
                  {done && date ? formatShortDateTime(date) : " "}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
        <div className="card divide-y divide-brand-cream-dark">
          {order.OrderItem.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <ProductImage
                src={item.product.ProductImage[0]?.url}
                alt={item.product.title}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">{item.product.title}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} × {presentationLabel[item.presentation]}
                  {item.variant && ` · ${item.variant}`} · {currencyFormat(item.price)}
                </p>
              </div>
              <span className="font-semibold">
                {currencyFormat(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 text-sm">
            <span>Envío</span>
            <span className="font-semibold text-brand-green">Gratis</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-xl font-bold">
            <span>Total</span>
            <span>{currencyFormat(order.total)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold mb-2">Entrega</h2>
            <div className="text-sm space-y-0.5">
              <p className="font-semibold">{order.firstName}</p>
              <p>{order.address}</p>
              <p>{order.phone}</p>
              {order.notes && <p className="text-gray-600">{order.notes}</p>}
            </div>
            <div className="mt-3 pt-3 border-t border-brand-cream-dark flex items-center justify-between text-sm">
              <span>{paymentMethodLabel[order.paymentMethod]}</span>
              <PaidBadge isPaid={order.isPaid} />
            </div>
          </div>

          {isAdmin && (
            <div className="card p-5">
              <h2 className="font-bold mb-3">Gestionar pedido</h2>
              <OrderControls orderId={order.id} status={order.status} isPaid={order.isPaid} />
            </div>
          )}

          <div className="card p-5">
            <h2 className="font-bold">Enviá tu pedido por WhatsApp</h2>
            <p className="text-sm text-gray-600 mb-3">
              Se abre WhatsApp con el detalle ya escrito.
            </p>
            <div className="flex flex-col gap-2">
              {store.contacts.map((contact) => (
                <a
                  key={contact.whatsapp}
                  href={whatsappLink(contact.whatsapp, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5A] px-4 py-2.5 font-semibold text-white transition-colors"
                >
                  <BsWhatsapp size={18} /> Enviar a {contact.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
