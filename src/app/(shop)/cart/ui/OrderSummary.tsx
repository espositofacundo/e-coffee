"use client";

import { useCartStore } from "@/store/ui/cart/cart-store";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { CgCoffee } from "react-icons/cg";

const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const { itemsInCart, subTotal, total, tax, totalWithDelivery } = useCartStore(
    (state) => state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <>
      <div>
        <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
          <h2 className="text-2xl mb-2 flex font-bold">
            <CgCoffee className="w-6 h-6 mr-1" />
            Mi carrito:
          </h2>
          <div className="grid grid-cols-2">
            <span>No. Productos</span>
            <span className="text-right">{itemsInCart}</span>

            <span>Subtotal</span>
            <span className="text-right">${subTotal}</span>

            <span className="mt-2 text-2xl">Total:</span>
            <span className="mt-2 text-2xl text-right">${total}</span>
          </div>
          <div
            className={
              itemsInCart === 0
                ? `mt-5 mb-2 w-full hidden `
                : `mt-5 mb-2 w-full  `
            }
          >
            <Link
              className="flex btn-primary justify-center"
              href="/checkout/address"
            >
              <CgCoffee className="w-6 h-6 mr-1 " /> Confirmar pedido
            </Link>
          </div>
        </div>

        

       
      </div>
    </>
  );
};

export default OrderSummary;
