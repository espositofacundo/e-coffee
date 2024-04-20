'use client'
import { titleFont } from "@/config/fonts";
import Link from "next/link";
import React from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { UseUiStore } from "@/store/ui/ui-store";
import { CgCoffee } from "react-icons/cg";

const TopMenu = () => {
  const openSideMenu = UseUiStore(state => state.openSideMenu);
  return (
    <nav className="flex px-5 justify-between items-center w-full bg-gray-300">
      <div className="flex items-center">
  <Link href="/" className="flex items-center">
    <span className={`${titleFont.className} antialiased font-bold flex items-center`}>
      <CgCoffee className="w-6 h-6 mr-1" />
    </span>
    <span className="mr-1">|</span>
    <span className="bg-green-200 p-1 rounded">E-coffee</span>
  </Link>
</div>
      <div className="hidden sm:block">
        <Link
          href="/category/coffee"
          className="m-2 px-4 rounded-md transition-all hover:bg-gray-100 font-bold text-xl"
        >
          Coffee
          
        </Link>
      
        <Link
          href="/category/delicias"
          className="m-2 px-4 rounded-md transition-all hover:bg-gray-100 font-bold text-xl "
        >
          Nuestras delicias
        </Link>
      </div>

      <div className="flex items-center">
        <Link href="/search">
          <IoSearchOutline className="w-6 h-6" />
        </Link>
        <Link href="/cart" className="mx-2">
          <div className="relative">
            <span className="absolute tex-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">3</span>
            <IoCartOutline className="w-6 h-6" />
          </div>
        </Link>
        <button onClick={openSideMenu} className="m-2 p-2 rounded-md transition-all bg-gray-100 font-bold">Menu</button>
      </div>

      
    </nav>
  );
};

export default TopMenu;
