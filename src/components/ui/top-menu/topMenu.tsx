"use client";

import { titleFont } from "@/config/fonts";
import { store } from "@/config/store";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { UseUiStore } from "@/store/ui/ui-store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCartOutline, IoMenu } from "react-icons/io5";

const TopMenu = () => {
  const openSideMenu = UseUiStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalitems());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="sticky top-0 z-10 bg-brand-cream/95 backdrop-blur border-b border-brand-cream-dark">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt={store.name}
            width={512}
            height={512}
            className="h-11 w-auto"
            priority
          />
          <span
            className={`${titleFont.className} text-lg sm:text-xl font-bold text-brand-green`}
          >
            {store.name}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="hidden sm:block px-3 py-2 font-medium rounded-lg hover:bg-brand-cream-dark"
          >
            Catálogo
          </Link>
          <Link
            href="/cart"
            className="p-2 rounded-lg hover:bg-brand-cream-dark"
            aria-label="Carrito"
          >
            <div className="relative">
              {loaded && totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.25rem] text-center text-xs rounded-full px-1 font-bold bg-brand-gold text-white">
                  {totalItemsInCart}
                </span>
              )}
              <IoCartOutline className="w-7 h-7" />
            </div>
          </Link>
          <button
            onClick={openSideMenu}
            className="p-2 rounded-lg hover:bg-brand-cream-dark"
            aria-label="Abrir menú"
          >
            <IoMenu className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
