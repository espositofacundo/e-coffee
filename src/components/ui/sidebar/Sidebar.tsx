"use client";

import { UseUiStore } from "@/store/ui/ui-store";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

const Sidebar = () => {

    const isSideMenuOpen = UseUiStore(state => state.isSideMenuOpen);
    const closeMenu = UseUiStore(state => state.closeSideMenu);


  return (


    <div>
        {
            isSideMenuOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
            )
        }

        {
            isSideMenuOpen && (
                <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"></div>
            )
        }
      
    
      <nav className={
        clsx(
            "fixed pr-2 pt-4 pl-2 sm:p-5 right-0 top-0  sm:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
            {
                "translate-x-full": !isSideMenuOpen
            }
        )
      }>
        <div className="flex justify-between">
          <div className="relative w-full">
            <IoSearchOutline size={24} className="absolute top-2 left-2 " />
            <input
              type="text"
              placeholder="Buscar"
              className="w-11/12 bg-blue-100 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <IoCloseOutline
            size={40}
            className="    cursor-pointer mr-1 sm:mr-4 bg-red-200  rounded"
            onClick={() => closeMenu()}
          />
        </div>
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoPersonOutline size={30} />
          <span className="ml-3 text-xl">Perfil</span>
        </Link>
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoTicketOutline size={30} />
          <span className="ml-3 text-xl">Ordenes</span>
        </Link>
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogInOutline size={30} />
          <span className="ml-3 text-xl bg-green-200 p-1 rounded">Login</span>
        </Link>
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogOutOutline size={30} />
          <span className="ml-3 text-xl bg-red-200 p-2 rounded">Logout</span>
        </Link>
        <div className="w-full h-px bg-gray-200 mt-5 sm:my-10" />
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoShirtOutline size={30} />
          <span className="ml-3 text-xl">Productos</span>
        </Link>
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoTicketOutline size={30} />
          <span className="ml-3 text-xl">Ordenes</span>
        </Link>
        <Link
          href="/"
          className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
        >
          <IoPeopleOutline size={30} />
          <span className="ml-3 text-xl">Usuarios</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
