"use client";

import type { getAdminProducts } from "@/actions/products/get-admin-products";
import { updateProductAvailability } from "@/actions/products/update-product-availability";
import ProductImage from "@/components/product/product-image/productImage";
import { currencyFormat } from "@/utils/currency";
import { slugify } from "@/utils/slugify";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IoSearchOutline } from "react-icons/io5";

type AdminProduct = Awaited<ReturnType<typeof getAdminProducts>>["products"][number];

interface Props {
  products: AdminProduct[];
}

const ProductsTable = ({ products }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const term = slugify(search);
  const visibleProducts = term
    ? products.filter((product) =>
        slugify(`${product.title} ${product.category.name}`).includes(term)
      )
    : products;

  const toggleAvailability = (product: AdminProduct) => {
    setPendingId(product.id);
    startTransition(async () => {
      const resp = await updateProductAvailability(product.id, !product.available);
      if (!resp.ok) alert(resp.message);
      router.refresh();
      setPendingId(null);
    });
  };

  return (
    <>
      <div className="relative mb-4">
        <IoSearchOutline
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto o categoría"
          className="input pl-10"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-cream-dark/60 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold text-right">½ kg</th>
              <th className="px-4 py-3 font-semibold text-right">1 kg / unidad</th>
              <th className="px-4 py-3 font-semibold text-center">Disponible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-cream-dark">
            {visibleProducts.map((product) => (
              <tr key={product.id} className={clsx(!product.available && "bg-gray-50 text-gray-500")}>
                <td className="px-4 py-2.5">
                  <Link
                    href={`/admin/product/${product.slug}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <ProductImage
                      src={product.ProductImage[0]?.url}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />
                    <span>
                      <span className="font-semibold">{product.title}</span>
                      {product.variants.length > 0 && (
                        <span className="block text-xs text-gray-500">
                          {product.variants.join(", ")}
                        </span>
                      )}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{product.category.name}</td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {product.priceHalf ? currencyFormat(product.priceHalf) : "—"}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap font-semibold">
                  {currencyFormat(product.price)}
                  <span className="font-normal text-gray-500">
                    {product.unit === "kg" ? " /kg" : " c/u"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => toggleAvailability(product)}
                    disabled={pendingId === product.id}
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap disabled:opacity-50",
                      product.available
                        ? "bg-brand-green-light text-brand-green"
                        : "bg-gray-200 text-gray-600"
                    )}
                    title="Cambiar disponibilidad"
                  >
                    {product.available ? "Disponible" : "Sin stock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleProducts.length === 0 && (
          <p className="p-6 text-center text-gray-600">No hay productos que coincidan.</p>
        )}
      </div>
    </>
  );
};

export default ProductsTable;
