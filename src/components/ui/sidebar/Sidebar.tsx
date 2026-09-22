"use client";

import { logout } from "@/actions/auth/logout";
import { UseUiStore } from "@/store/ui/ui-store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  IoCartOutline,
  IoCloseOutline,
  IoFileTrayFullOutline,
  IoLeafOutline,
  IoListOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoPricetagsOutline,
  IoReceiptOutline,
} from "react-icons/io5";

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: IconType;
  label: string;
  onClick: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-brand-cream-dark transition-colors"
  >
    <Icon size={24} />
    <span className="text-lg">{label}</span>
  </Link>
);

const Sidebar = () => {
  const isSideMenuOpen = UseUiStore((state) => state.isSideMenuOpen);
  const closeMenu = UseUiStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div>
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
        />
      )}

      <nav
        className={clsx(
          "fixed right-0 top-0 z-30 h-screen w-[85vw] sm:w-[380px] overflow-y-auto bg-brand-cream p-5 shadow-2xl transform transition-transform duration-300",
          { "translate-x-full": !isSideMenuOpen }
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600 truncate">
            {session?.user.email}
          </span>
          <button
            onClick={closeMenu}
            className="p-1 rounded-lg hover:bg-brand-cream-dark"
            aria-label="Cerrar menú"
          >
            <IoCloseOutline size={32} />
          </button>
        </div>

        <SidebarLink href="/" icon={IoLeafOutline} label="Catálogo" onClick={closeMenu} />
        <SidebarLink href="/cart" icon={IoCartOutline} label="Mi carrito" onClick={closeMenu} />

        {isAuthenticated && (
          <>
            <SidebarLink href="/orders" icon={IoReceiptOutline} label="Mis pedidos" onClick={closeMenu} />
            <SidebarLink href="/profile" icon={IoPersonOutline} label="Mi cuenta" onClick={closeMenu} />
            <button
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-brand-cream-dark transition-colors"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              <IoLogOutOutline size={24} />
              <span className="text-lg">Salir</span>
            </button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <SidebarLink href="/auth/login" icon={IoLogInOutline} label="Ingresar" onClick={closeMenu} />
            <SidebarLink href="/auth/new-account" icon={IoPersonAddOutline} label="Crear cuenta" onClick={closeMenu} />
          </>
        )}

        {isAdmin && (
          <>
            <div className="h-px bg-brand-cream-dark my-4" />
            <p className="px-3 mb-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
              Administración
            </p>
            <SidebarLink href="/admin/orders" icon={IoFileTrayFullOutline} label="Pedidos" onClick={closeMenu} />
            <SidebarLink href="/admin/products" icon={IoPricetagsOutline} label="Productos y precios" onClick={closeMenu} />
            <SidebarLink href="/admin/categories" icon={IoListOutline} label="Categorías" onClick={closeMenu} />
            <SidebarLink href="/admin/users" icon={IoPeopleOutline} label="Usuarios" onClick={closeMenu} />
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
