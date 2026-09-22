"use client";

import { useCartStore } from "@/store/ui/cart/cart-store";
import { currencyFormat } from "@/utils/currency";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoArrowForward, IoCartOutline } from "react-icons/io5";

// Barra fija abajo con el resumen del carrito mientras se recorre el catálogo.
const CartBar = () => {
  const [loaded, setLoaded] = useState(false);
  const { itemsInCart, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded || itemsInCart === 0) return null;

  return (
    <div className="fade-in sticky bottom-4 z-[5] mt-8 flex justify-center">
      <Link
        href="/cart"
        className="flex w-full sm:w-auto items-center justify-between gap-6 rounded-full bg-brand-green px-5 py-3 text-white shadow-xl hover:bg-brand-green-dark"
      >
        <span className="flex items-center gap-2">
          <IoCartOutline size={22} />
          {itemsInCart} {itemsInCart === 1 ? "producto" : "productos"}
        </span>
        <span className="flex items-center gap-2 font-bold">
          {currencyFormat(total)} <IoArrowForward size={18} />
        </span>
      </Link>
    </div>
  );
};

export default CartBar;
