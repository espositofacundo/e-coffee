export const revalidate = 0;

import { getAdminProducts } from "@/actions/products/get-admin-products";
import { getStoreSettings } from "@/actions/settings/get-store-settings";
import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoAdd } from "react-icons/io5";
import { PriceGrid } from "./ui/PriceGrid";
import type { PriceRow } from "./ui/price-rows";

export const metadata = {
  title: "Productos y precios",
};

export default async function AdminProductsPage() {
  const [{ ok, products }, settings] = await Promise.all([
    getAdminProducts(),
    getStoreSettings(),
  ]);

  if (!ok) {
    redirect("/auth/login");
  }

  const rows: PriceRow[] = products.map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    variants: product.variants,
    categoryName: product.category.name,
    unit: product.unit,
    cost: product.cost,
    markup: product.markup,
    price: product.price,
    priceHalf: product.priceHalf,
    sellsHalf: product.priceHalf !== null,
    available: product.available,
  }));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Title
          title="Productos y precios"
          subtitle={`${products.length} productos · Precio = costo × margen`}
        />
        <Link href="/admin/product/new" className="btn-primary mb-6 shrink-0">
          <IoAdd size={20} /> Nuevo producto
        </Link>
      </div>

      <PriceGrid products={rows} halfKgSurcharge={settings.halfKgSurcharge} />
    </>
  );
}
