import type { Presentation } from "@/interfaces/product.interface";
import type { PaymentMethod } from "@/interfaces/orders.interface";
import { currencyFormat } from "./currency";
import { formatOrderNumber, paymentMethodLabel } from "./order-status";
import { presentationLabel } from "./presentation";

interface OrderForMessage {
  number: number;
  total: number;
  firstName: string;
  phone: string;
  address: string;
  notes: string | null;
  paymentMethod: PaymentMethod;
  OrderItem: {
    quantity: number;
    price: number;
    presentation: Presentation;
    variant: string | null;
    product: { title: string };
  }[];
}

export const buildOrderMessage = (order: OrderForMessage) => {
  const items = order.OrderItem.map(
    (item) =>
      `• ${item.quantity} × ${presentationLabel[item.presentation]} ${item.product.title}` +
      `${item.variant ? ` (${item.variant})` : ""} — ${currencyFormat(item.price * item.quantity)}`
  );

  return [
    `¡Hola! Hice el pedido ${formatOrderNumber(order.number)} en la web:`,
    ...items,
    `Total: ${currencyFormat(order.total)} (envío gratis)`,
    "",
    `Entrega: ${order.firstName} - ${order.address}`,
    `Tel: ${order.phone}`,
    ...(order.notes ? [`Aclaraciones: ${order.notes}`] : []),
    `Pago: ${paymentMethodLabel[order.paymentMethod]}`,
  ].join("\n");
};

export const whatsappLink = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
