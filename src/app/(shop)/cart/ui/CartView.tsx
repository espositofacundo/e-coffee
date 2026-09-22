"use client";

import ProductImage from "@/components/product/product-image/productImage";
import QuantitySelector from "@/components/product/quantity-selector/QuantitySelector";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { currencyFormat } from "@/utils/currency";
import { presentationLabel } from "@/utils/presentation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoArrowForward, IoCartOutline, IoTrashOutline } from "react-icons/io5";

const CartView = () => {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const { itemsInCart, subTotal, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p className="text-gray-500">Cargando…</p>;

  if (cart.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center text-center">
        <IoCartOutline size={48} className="text-brand-gold" />
        <p className="mt-3 text-lg font-semibold">Tu carrito está vacío</p>
        <p className="text-gray-600">Sumá productos desde el catálogo.</p>
        <Link href="/" className="btn-primary mt-5">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
      <div className="card divide-y divide-brand-cream-dark">
        {cart.map((product) => (
          <div
            key={`${product.id}-${product.presentation}-${product.variant ?? ""}`}
            className="flex gap-3 p-4"
          >
            <ProductImage
              src={product.image}
              alt={product.title}
              width={72}
              height={72}
              className="h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-semibold leading-tight hover:underline"
                  >
                    {product.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {presentationLabel[product.presentation]}
                    {product.variant && ` · ${product.variant}`} ·{" "}
                    {currencyFormat(product.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeProduct(product)}
                  className="self-start p-1 text-gray-400 hover:text-red-600"
                  aria-label={`Quitar ${product.title}`}
                >
                  <IoTrashOutline size={20} />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <QuantitySelector
                  quantity={product.quantity}
                  onQuantityChange={(value) => updateProductQuantity(product, value)}
                />
                <span className="font-bold">
                  {currencyFormat(product.price * product.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold mb-3">Resumen</h2>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span>Productos</span>
            <span>{itemsInCart}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currencyFormat(subTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span className="font-semibold text-brand-green">Gratis</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-brand-cream-dark flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{currencyFormat(total)}</span>
        </div>

        <Link href="/checkout/address" className="btn-primary w-full mt-5 py-3">
          Continuar <IoArrowForward />
        </Link>
        <Link href="/" className="block text-center mt-3 text-sm underline text-gray-600">
          Seguir agregando productos
        </Link>
      </div>
    </div>
  );
};

export default CartView;
