"use client";

import ProductImage from "@/components/product/product-image/productImage";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { currencyFormat } from "@/utils/currency";
import { presentationLabel } from "@/utils/presentation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GrEdit } from "react-icons/gr";

const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p className="text-gray-500">Cargando…</p>;

  return (
    <div className="card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-cream-dark">
        <h2 className="font-bold">Productos</h2>
        <Link href="/cart" className="flex items-center gap-2 text-sm underline">
          <GrEdit /> Editar
        </Link>
      </div>
      <div className="divide-y divide-brand-cream-dark">
        {cart.map((product) => (
          <div
            key={`${product.id}-${product.presentation}-${product.variant ?? ""}`}
            className="flex items-center gap-3 px-4 py-3"
          >
            <ProductImage
              src={product.image}
              alt={product.title}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-tight">{product.title}</p>
              <p className="text-sm text-gray-600">
                {product.quantity} × {presentationLabel[product.presentation]}
                {product.variant && ` · ${product.variant}`}
              </p>
            </div>
            <span className="font-semibold">
              {currencyFormat(product.price * product.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsInCart;
