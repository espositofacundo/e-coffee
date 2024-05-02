import Title from "@/components/ui/title/Title";

import Link from "next/link";
import React from "react";


import { FaCartShopping } from "react-icons/fa6";

import ProductsInCart from "./ui/ProductsInCart";
import OrderSummary from "./ui/OrderSummary";

const PageCart = () => {
  return (
    <div className="flex justify-center items-center mb-72 px-5 sm:px-0">
      <div className="flex flex-col w-[1000px]  ">
        <Title title="Carrito" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <ProductsInCart />

            <span className="text-xl">Volve al home y seguí comprando...</span>
            <div className="flex pt-2 ">
              <FaCartShopping></FaCartShopping>
              <Link href="/" className="underline ml-3 mb-5">
                Agregar mas productos a mi carrito.
              </Link>
            </div>
          </div>

          
            <OrderSummary />
          
        </div>
      </div>
    </div>
  );
};

export default PageCart;
