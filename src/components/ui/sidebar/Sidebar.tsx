"use client";

import { logout } from "@/actions/auth/logout";

import { UseUiStore } from "@/store/ui/ui-store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
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
  const isSideMenuOpen = UseUiStore((state) => state.isSideMenuOpen);
  const closeMenu = UseUiStore((state) => state.closeSideMenu);

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const isAdmin = session?.user.role === "admin" ? true : false;

  return (
    <div>
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
      )}

      {isSideMenuOpen && (
        <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"></div>
      )}

      <nav
        className={clsx(
          "fixed pr-2 pt-4 pl-2 sm:p-5 right-0 top-0  sm:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <div className="flex justify-end">
          
          <IoCloseOutline
            size={40}
            className="    cursor-pointer mr-1 sm:mr-4 bg-red-200  rounded"
            onClick={() => closeMenu()}
          />
        </div>

        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={() => closeMenu()}
              className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>
            <Link
              href="/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>

            <button
              className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
              onClick={() => logout()}
            >
              <IoLogOutOutline size={30} />
              <span className="ml-3 text-xl bg-red-200 p-2 rounded">
                Logout
              </span>
            </button>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl bg-green-200 p-1 rounded">Login</span>
          </Link>
        )}

        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 mt-5 sm:my-10" />
            <Link
              href="/admin/products"
              className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center mt-5 sm:mt-10 p-1 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
