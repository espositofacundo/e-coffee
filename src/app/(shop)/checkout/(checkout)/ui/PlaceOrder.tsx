"use client";

import { placeOrder } from "@/actions/order/place-order";
import { useAddressStore } from "@/store/ui/address/address-store";
import { useCartStore } from "@/store/ui/cart/cart-store";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { BsCartCheckFill } from "react-icons/bs";
import { CgCoffee } from "react-icons/cg";

import { GrEdit } from "react-icons/gr";

const PlaceOrder = () => {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrdern, setisPlacingOrdern] = useState(false);

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, total, totalWithDelivery } = useCartStore(
    (state) => state.getSummaryInformation()
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setisPlacingOrdern(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setisPlacingOrdern(false);
      setErrorMessage(resp.message);
      return;
    }

    clearCart();
    router.push('/orders/'+resp.order?.id) // Navigate to /dashboard
    
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
        <h2 className="text-2xl mb-2">Datos de la orden</h2>

        <div className="mb-4 grid grid-cols-2">
          <p>Nombre:</p>
          <p className="text-right">{address.firstName}</p>
          <p>Direcció de entrega:</p>
          <p className="text-right">
            {address.address === ""
              ? "Para consumir en el local"
              : address.address}
          </p>
          <p>Celular:</p>
          <p className="text-right">{address.phone}</p>
        </div>
        <div className="flex flex-col w-full  ">
          <Link
            href="/checkout/address"
            className="font-bold flex w-full underline "
          >
            <GrEdit className="w-6 h-6 mr-3 " />
            Upss! Quiero editar mis datos
          </Link>
        </div>

        <div className="w-full h-px bg-gray-200 my-4 col-span-2" />

        <h2 className="text-2xl mb-2">Resumen de orden</h2>
        <div className="grid grid-cols-2">
          <span>No. Productos</span>
          <span className="text-right">{itemsInCart}</span>

          <span>Subtotal</span>
          <span className="text-right">${subTotal}</span>
          <span className="">Delivery:</span>
          <span className="text-right">
            ${address.address === "" ? "0" : totalWithDelivery - total}
          </span>

          <span className="mt-2 text-2xl">Total:</span>
          <span className="mt-2 text-2xl text-right">
            ${address.address === "" ? total : totalWithDelivery}
          </span>
        </div>
        <div
          className={
            itemsInCart === 0
              ? `mt-5 mb-2 w-full hidden `
              : `mt-5 mb-2 w-full  `
          }
        >
          <p className="text-red-500">{errorMessage}</p>

          <button
            onClick={onPlaceOrder}
            className={clsx({
              "btn-primary flex": !isPlacingOrdern,
              "btn-disabled flex": isPlacingOrdern,

            })}
          >
            <CgCoffee className="w-6 h-6 mr-1 " /> Confirmar Orden
          </button>
        </div>
       
      </div>
    </>
  );
};

export default PlaceOrder;
