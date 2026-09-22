export const revalidate = 0;

import { getCategories } from "@/actions/category/get-category";
import { getProductbySlug } from "@/actions/products/get-product-by-slug";
import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCheckmarkCircle, IoChevronBack } from "react-icons/io5";
import { ProductForm } from "./ui/ProductForm";

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    guardado?: string;
  };
}

export const metadata = {
  title: "Editar producto",
};

export default async function AdminProductPage({ params, searchParams }: Props) {
  const { slug } = params;

  const [product, categories] = await Promise.all([
    slug === "new" ? null : getProductbySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== "new") {
    redirect("/admin/products");
  }

  return (
    <>
      <Link
        href="/admin/products"
        className="mt-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-green"
      >
        <IoChevronBack /> Productos
      </Link>
      <Title title={product ? "Editar producto" : "Nuevo producto"} />
      {searchParams.guardado && product && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-brand-green-light px-4 py-3">
          <span className="flex items-center gap-2 font-semibold text-brand-green">
            <IoCheckmarkCircle size={20} /> Producto guardado
          </span>
          <Link href={`/product/${product.slug}`} className="text-sm underline">
            Ver en el catálogo
          </Link>
        </div>
      )}
      <ProductForm
        key={product?.updatedAt.toISOString() ?? "new"}
        product={product ?? {}}
        categories={categories}
      />
    </>
  );
}
