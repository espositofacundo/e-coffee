import type { Presentation } from "@/interfaces/product.interface";

interface StockItem {
  productId: string;
  quantity: number;
  presentation: Presentation;
}

// Cuánto descuenta cada ítem: el ½ kg se fracciona del kilo (0,5 kg).
export const stockAmount = (presentation: Presentation, quantity: number) =>
  (presentation === "medio_kg" ? 0.5 : 1) * quantity;

// Total a descontar por producto (un pedido puede tener ½ kg y 1 kg del mismo).
export const stockByProduct = (items: StockItem[]) => {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(
      item.productId,
      (totals.get(item.productId) ?? 0) + stockAmount(item.presentation, item.quantity)
    );
  }
  return totals;
};
