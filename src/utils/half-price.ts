import { halfKgPrice } from "./pricing";

interface StoredProduct {
  unit: "kg" | "unidad";
  price: number;
  priceHalf: number | null;
}

// Precio de ½ kg al guardar. Si el precio por kilo no cambió, se mantiene el
// ½ kg guardado: la lista original puede diferir $1–2 de la fórmula por redondeo.
export const resolveHalfPrice = (
  stored: StoredProduct | null,
  unit: "kg" | "unidad",
  price: number,
  sellsHalf: boolean,
  surcharge: number,
  surchargeChanged = false
) => {
  if (unit !== "kg" || !sellsHalf) return null;
  if (
    stored &&
    !surchargeChanged &&
    stored.unit === "kg" &&
    stored.price === price &&
    stored.priceHalf !== null
  ) {
    return stored.priceHalf;
  }
  return halfKgPrice(price, surcharge);
};
