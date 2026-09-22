export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "en_camino"
  | "entregado"
  | "cancelado";

export type PaymentMethod = "efectivo" | "transferencia";

export interface Address {
  firstName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

export interface Orders {
  id: string;
  number: number;
  total: number;
  itemsInOrder: number;
  status: OrderStatus;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  firstName: string;
  phone: string;
  address: string;
  notes: string | null;
  createdAt: Date;
}
