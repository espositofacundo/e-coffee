import Title from "@/components/ui/title/Title";

import React from "react";

import ProductsInCart from "./ui/ProductsInCart";
import PlaceOrder from "./ui/PlaceOrder";
import { FaCartShopping } from "react-icons/fa6";
import Link from "next/link";
import { TfiBackLeft } from "react-icons/tfi";

const PageCart = () => {
  return (
    <div className="flex justify-center items-center mb-72 px-5 sm:px-0">
      <div className="flex flex-col w-[1000px]  ">
        <Title title="verificar orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div>
            <ProductsInCart />
          </div>
          <div>
            <PlaceOrder />
            <div className="font-bold flex w-full underline pt-10 pb-2">
              <FaCartShopping></FaCartShopping>
              <Link href="/cart" className="underline ml-3 mb-5">
                Quiero editar mi carrito
              </Link>
            </div>

            <div className="flex flex-col w-full  ">
              <Link
                href="/cart"
                className="font-bold flex w-full underline justify-center "
              >
                <TfiBackLeft className="w-6 h-6 mr-3 " />
                Upss! quiero ir a buscar mi pedido / Estoy sentado en una mesa.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCart;
