import type { Prisma } from "@prisma/client";

// Campos de producto que se pueden mostrar al público. El costo y el margen
// quedan afuera: todo lo que devuelven estas consultas llega al navegador.
export const publicProductSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  unit: true,
  price: true,
  priceHalf: true,
  variants: true,
  available: true,
  categoryId: true,
} satisfies Prisma.ProductSelect;
