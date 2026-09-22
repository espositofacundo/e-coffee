import type { OrderStatus, PaymentMethod } from "@/interfaces/orders.interface";

export const orderStatusLabel: Record<OrderStatus, string> = {
  pendiente: "Recibido",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// Pasos del seguimiento, en orden (cancelado queda afuera).
export const orderSteps: OrderStatus[] = [
  "pendiente",
  "preparando",
  "en_camino",
  "entregado",
];

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  efectivo: "Efectivo al recibir",
  transferencia: "Transferencia",
};

export const formatOrderNumber = (number: number) =>
  `#${number.toString().padStart(4, "0")}`;
