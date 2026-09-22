"use client";

import QuantitySelector from "@/components/product/quantity-selector/QuantitySelector";
import type { Presentation, Product } from "@/interfaces/product.interface";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { currencyFormat } from "@/utils/currency";
import { getPresentations, presentationLabel } from "@/utils/presentation";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { IoCartOutline, IoCheckmarkCircle } from "react-icons/io5";

interface Props {
  product: Product;
}

const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const presentations = getPresentations(product);

  const [presentation, setPresentation] = useState<Presentation>(
    presentations[presentations.length - 1].presentation
  );
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [missingVariant, setMissingVariant] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const price =
    presentations.find((p) => p.presentation === presentation)?.price ?? 0;

  if (!product.available) {
    return (
      <p className="mt-6 rounded-lg bg-brand-gold-light px-4 py-3 font-semibold text-brand-gold-dark">
        Sin stock por ahora
      </p>
    );
  }

  const addToCart = () => {
    if (product.variants.length > 0 && !variant) {
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
      quantity,
    });
    setQuantity(1);
    setAddedToCart(true);
  };

  return (
    <div className="mt-6 space-y-5">
      <div>
        <p className="label">Presentación</p>
        <div className="flex flex-wrap gap-2">
          {presentations.map((option) => (
            <button
              key={option.presentation}
              type="button"
              onClick={() => setPresentation(option.presentation)}
              className={clsx(
                "rounded-lg border px-4 py-2 text-left transition-colors",
                presentation === option.presentation
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-brand-cream-dark bg-white hover:border-brand-green"
              )}
            >
              <span className="block text-xs opacity-80">
                {presentationLabel[option.presentation]}
              </span>
              <span className="font-bold">{currencyFormat(option.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {product.variants.length > 0 && (
        <div>
          <label htmlFor="variant" className="label">
            Variedad
          </label>
          <select
            id="variant"
            value={variant}
            onChange={(e) => {
              setVariant(e.target.value);
              setMissingVariant(false);
            }}
            className={clsx("input max-w-xs", {
              "border-red-500 ring-2 ring-red-200": missingVariant,
            })}
          >
            <option value="">Elegí variedad…</option>
            {product.variants.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {missingVariant && (
            <p className="text-sm text-red-600 mt-1">Elegí una variedad</p>
          )}
        </div>
      )}

      <div>
        <p className="label">Cantidad</p>
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white border border-brand-cream-dark px-4 py-3">
        <span className="text-gray-600">Subtotal</span>
        <span className="text-xl font-bold">{currencyFormat(price * quantity)}</span>
      </div>

      <button onClick={addToCart} className="btn-primary w-full py-3 text-lg">
        <IoCartOutline size={22} /> Agregar al carrito
      </button>

      {addedToCart && (
        <div className="fade-in flex items-center justify-between gap-3 rounded-lg bg-brand-green-light px-4 py-3">
          <span className="flex items-center gap-2 font-semibold text-brand-green">
            <IoCheckmarkCircle size={22} /> Agregado al carrito
          </span>
          <Link href="/cart" className="font-semibold underline">
            Ver carrito
          </Link>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
