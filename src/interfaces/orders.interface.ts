export interface Orders {
  id: string;
  total: number;
  isPaid?: boolean;
  isOkforCook?: boolean;
  isReadyForDelivery?: boolean;
  isDelivered?: boolean;
  firstName?: string | null;
  address?: string | null;
  phone?: string | null;
  transactionId?: string | null;
  metodoDePago?: string | null;
  DisPaid?: Date | null;
  DisOkforCook?: Date | null;
  DisReadyForDelivery?: Date | null;
  DisDelivered?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}