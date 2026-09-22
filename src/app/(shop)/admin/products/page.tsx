export const revalidate = 0;

import { getAdminProducts } from "@/actions/products/get-admin-products";
import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoAdd } from "react-icons/io5";
import ProductsTable from "./ui/ProductsTable";

export const metadata = {
  title: "Productos",
};

export default async function AdminProductsPage() {
  const { ok, products } = await getAdminProducts();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Title title="Productos" subtitle={`${products.length} productos cargados`} />
        <Link href="/admin/product/new" className="btn-primary mb-6 shrink-0">
          <IoAdd size={20} /> Nuevo producto
        </Link>
      </div>

      <ProductsTable products={products} />
    </>
  );
}
