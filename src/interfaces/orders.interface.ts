export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "en_camino"
  | "entregado"
  | "cancelado";

export type PaymentMethod = "efectivo" | "transferencia";

// Dentro de la zona sin cargo o fuera de ella. La elige el cliente en el checkout.
export type DeliveryZone = "centro" | "fuera";

export interface Address {
  firstName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
  // "" mientras no eligió zona: el formulario la pide antes de continuar.
  zone: DeliveryZone | "";
}

export interface Orders {
  id: string;
  number: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  itemsInOrder: number;
  status: OrderStatus;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  zone: DeliveryZone;
  firstName: string;
  phone: string;
  address: string;
  notes: string | null;
  createdAt: Date;
}
