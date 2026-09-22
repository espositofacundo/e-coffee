import type { Presentation, SaleUnit } from "@/interfaces/product.interface";

interface PricedProduct {
  unit: SaleUnit;
  price: number;
  priceHalf: number | null;
}

export const presentationLabel: Record<Presentation, string> = {
  medio_kg: "½ kg",
  kg: "1 kg",
  unidad: "Unidad",
};

// Presentaciones que se pueden pedir de un producto, con su precio.
export const getPresentations = (product: PricedProduct) => {
  if (product.unit === "unidad") {
    return [{ presentation: "unidad" as Presentation, price: product.price }];
  }

  const presentations: { presentation: Presentation; price: number }[] = [];
  if (product.priceHalf) {
    presentations.push({ presentation: "medio_kg", price: product.priceHalf });
  }
  presentations.push({ presentation: "kg", price: product.price });
  return presentations;
};

export const getPresentationPrice = (
  product: PricedProduct,
  presentation: Presentation
) =>
  getPresentations(product).find((p) => p.presentation === presentation)
    ?.price ?? null;
