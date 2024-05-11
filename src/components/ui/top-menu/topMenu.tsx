"use client";
import { titleFont } from "@/config/fonts";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { UseUiStore } from "@/store/ui/ui-store";
import { CgCoffee } from "react-icons/cg";
import { useCartStore } from "@/store/ui/cart/cart-store";

const TopMenu = () => {
  const openSideMenu = UseUiStore((state) => state.openSideMenu);
  const totalItemsincart = useCartStore((state) => state.getTotalitems());
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  },[]);

  return (
    <nav className="flex px-5 justify-between items-center w-full bg-gray-300">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <span
            className={` antialiased font-bold flex items-center`}
          >
            <CgCoffee className="w-6 h-6 mr-1" />
          </span>
          <span className="mr-1">|</span>
          <span className="bg-green-200 p-1 rounded">E-coffee</span>
        </Link>
      </div>
      

      <div className="flex items-center">
        
        <Link href="/cart" className="mx-2">
          <div className="relative">
            {(loaded && totalItemsincart > 0) && (
              <span className="absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemsincart}
              </span>
            )}

            <IoCartOutline className="w-6 h-6" />
          </div>
        </Link>
        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all bg-gray-100 font-bold"
        >
          Menu
        </button>
      </div>
    </nav>
  );
};

export default TopMenu;
