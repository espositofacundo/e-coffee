"use client";

import type { CatalogCategory } from "@/actions/products/get-catalog";
import ProductImage from "@/components/product/product-image/productImage";
import type { Presentation } from "@/interfaces/product.interface";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { currencyFormat } from "@/utils/currency";
import { getPresentations, presentationLabel } from "@/utils/presentation";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoAdd, IoCheckmark } from "react-icons/io5";

interface Props {
  product: CatalogCategory["products"][number];
}

const ProductRow = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const [variant, setVariant] = useState("");
  const [missingVariant, setMissingVariant] = useState(false);
  const [added, setAdded] = useState<Presentation | null>(null);

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(null), 1500);
    return () => clearTimeout(timeout);
  }, [added]);

  const hasVariants = product.variants.length > 0;

  const onAdd = (presentation: Presentation, price: number) => {
    if (hasVariants && !variant) {
      setMissingVariant(true);
      return;
    }

    addProductToCart({
      id: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      presentation,
      variant: variant || undefined,
      price,
      quantity: 1,
    });
    setAdded(presentation);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {product.images[0] && (
          <ProductImage
            src={product.images[0]}
            alt={product.title}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <Link
            href={`/product/${product.slug}`}
            className="font-semibold leading-tight hover:underline"
          >
            {product.title}
          </Link>
          {product.description && (
            <p className="text-sm text-gray-500 leading-snug">
              {product.description}
            </p>
          )}
          {hasVariants && (
            <select
              value={variant}
              onChange={(e) => {
                setVariant(e.target.value);
                setMissingVariant(false);
              }}
              className={clsx(
                "mt-1.5 rounded-md border bg-white px-2 py-1 text-sm",
                missingVariant
                  ? "border-red-500 ring-2 ring-red-200"
                  : "border-brand-cream-dark"
              )}
              aria-label={`Variedad de ${product.title}`}
            >
              <option value="">Elegí variedad…</option>
              {product.variants.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {missingVariant && (
            <p className="text-xs text-red-600 mt-1">Elegí una variedad para agregarlo</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 sm:justify-end">
        {getPresentations(product).map(({ presentation, price }) => (
          <button
            key={presentation}
            onClick={() => onAdd(presentation, price)}
            className={clsx(
              "flex flex-1 sm:flex-none sm:w-36 items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left transition-colors",
              added === presentation
                ? "bg-brand-green border-brand-green text-white"
                : "border-brand-green/40 bg-white hover:bg-brand-green-light"
            )}
            aria-label={`Agregar ${presentationLabel[presentation]} de ${product.title}`}
          >
            <span className="flex flex-col leading-tight">
              <span
                className={clsx(
                  "text-xs",
                  added === presentation ? "text-white/85" : "text-gray-500"
                )}
              >
                {presentationLabel[presentation]}
              </span>
              <span className="font-bold">{currencyFormat(price)}</span>
            </span>
            {added === presentation ? (
              <IoCheckmark size={20} />
            ) : (
              <IoAdd size={20} className="text-brand-green" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductRow;
