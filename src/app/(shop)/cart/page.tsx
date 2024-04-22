import QuantitySelector from "@/components/product/quantity-selector/QuantitySelector";
import Title from "@/components/ui/title/Title";
import { initialData } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CgCoffee } from "react-icons/cg";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaTrashRestore } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";

const productInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

const PageCart = () => {
  return (
    <div className="flex justify-center items-center mb-72 px-5 sm:px-0">
      <div className="flex flex-col w-[1000px]  ">
        <Title title="Carrito" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            {productInCart.map((product) => (
              <div
                key={product.slug}
                className="flex  my-4 bg-blue-100 shadow-xl "
              >
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="mr-5 rounded"
                />
                <div className="w-full">
                  <p className="font-bold">{product.title}</p>
                  <p>${product.price}</p>

                  <div className="flex justify-between p-4">
                    <QuantitySelector quantity={3}></QuantitySelector>
                    <button className="pr-2">
                      <FaTrashRestore size={30} className=""></FaTrashRestore>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <span className="text-xl">Volve al home y seguí comprando...</span>
            <div className="flex pt-2 ">
              <FaCartShopping></FaCartShopping>
              <Link href="/" className="underline ml-3 mb-5">
                Agregar mas productos a mi carrito.
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
          <h2 className="text-2xl mb-2 flex font-bold">
              <CgCoffee className="w-6 h-6 mr-1" />
              Lo voy a buscar / Para comer aca: 
            </h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 articulos</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span className="mt-2 text-2xl">Total:</span>
              <span className="mt-2 text-2xl text-right">$100</span>
            </div>

            <div className="mt-5 mb-2 w-full ">
              <Link
                className="flex btn-primary justify-center"
                href="/orders/123"
              >
                Confirmar pedido <CgCoffee className="w-6 h-6 ml-1" />
              </Link>
            </div>
            <div className="w-full h-px bg-gray-800 my-4 col-span-2" />

            <h2 className="text-2xl mb-2 flex font-bold">
              <TbTruckDelivery className="w-6 h-6 mr-1" />
              Lo quiero perdir por delivery:
            </h2>

            <div className="flex  my-4 bg-blue-100 shadow-xl ">
              <Image
                src={`/products/delivery.png`}
                width={100}
                height={100}
                alt="delivery"
                className="mr-5 rounded"
              />
              <div className="w-full">
                <div className="flex">
                  <TbTruckDelivery className="w-6 h-6 mr-1" />
                  <p className="font-bold pl-2"> Delivery</p>
                </div>

                <p>$2000 x 1 </p>
                <p className="font-bold bg-green-200 w-1/2">Subtotal: $2000</p>

                <div className="flex justify-between p-4">
                  <button className="pr-2"></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2">
              

              <span className="mt-2 text-2xl">Total:</span>
              <span className="mt-2 text-2xl text-right">$100</span>
            </div>

            <div className="mt-5 mb-2 w-full ">
              <Link
                className="flex btn-primary justify-center"
                href="/checkout/address"
              >
                <TbTruckDelivery className="w-6 h-6 mr-1" /> Pedir por delivery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCart;
