export type SaleUnit = "kg" | "unidad";
export type Presentation = "medio_kg" | "kg" | "unidad";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  unit: SaleUnit;
  price: number;
  priceHalf: number | null;
  variants: string[];
  available: boolean;
  categoryId: string;
  images: string[];
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  image?: string;
  presentation: Presentation;
  variant?: string;
  price: number;
  quantity: number;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}
