import Title from "@/components/ui/title/Title";
import { initialData } from "@/interfaces";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoCardOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";

const productInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}

const OrdenDePago = ({ params }: Props) => {
  const { id } = params;

  // todo: verificar
  //redirect(/)

  return (
    <div className="flex justify-center items-center mb-72 px-5 sm:px-0">
      <div className="flex flex-col w-[1000px]  ">
        <Title title={`Orden # ${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-red-500':false,
                  'bg-green-700':true,
                }
              )
            }>
              <IoCardOutline size={30}/>
              {/*<span className="mx-2">Pendiente de pago</span>*/}
              <span className="mx-2">Orden pagada</span>
            </div>

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
                  <p>${product.price} x 3 </p>
                  <p className="font-bold bg-green-200 w-1/2">
                    Subtotal: ${product.price * 3}
                  </p>

                  <div className="flex justify-between p-4">
                    <button className="pr-2"></button>
                  </div>
                </div>
              </div>
            ))}

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
                  <CiDeliveryTruck></CiDeliveryTruck>
                  <p className="font-bold pl-2"> Delivery</p>
                </div>

                <p>$2000 x 1 </p>
                <p className="font-bold bg-green-200 w-1/2">Subtotal: $2000</p>

                <div className="flex justify-between p-4">
                  <button className="pr-2"></button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>

            <div className="mb-4">
              <p>Juan Perez</p>
              <p>Av. siempre viva 123</p>
              <p>223-0303-456</p>
            </div>

            <div className="w-full h-px bg-gray-200 my-4 col-span-2" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2 pb-4">
              <span>No. Productos</span>
              <span className="text-right">3 articulos</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span>Impuestos</span>
              <span className="text-right">$100</span>

              <div className="w-full h-px bg-gray-200 my-4 col-span-2" />

              <span className="mt-2 text-2xl">Total:</span>
              <span className="mt-2 text-2xl text-right">$100</span>
            </div>

            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-red-500':false,
                  'bg-green-700':true,
                }
              )
            }>
              <IoCardOutline size={30}/>
              {/*<span className="mx-2">Pendiente de pago</span>*/}
              <span className="mx-2">Orden pagada</span>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdenDePago;
