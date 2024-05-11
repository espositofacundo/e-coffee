export const revalidate = 0;
import { getOrderById } from "@/actions/order/get-order-by-id";
import Title from "@/components/ui/title/Title";
import { format } from 'date-fns';

import clsx from "clsx";
import Image from "next/image";

import { redirect } from "next/navigation";

import { BsFillCartCheckFill } from "react-icons/bs";

import { FaCashRegister } from "react-icons/fa";
import { IoCardOutline } from "react-icons/io5";
import { MdOutlineDeliveryDining } from "react-icons/md";

import { TbChefHat } from "react-icons/tb";
import PaymentMethods from "../../checkout/payment/paymentMethod";
import ProductImage from "@/components/product/product-image/productImage";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;

  // Todo: llamar el server action

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }
  if (order) {
    const { id, total, address = "", ...rest } = order;

    // Ahora puedes pasar solo los datos necesarios a PaymentMethods
    // Asumiendo que PaymentMethods solo necesita id, total y address

    return (
      <div className="flex justify-center items-center mb-72 px-5 sm:px-0">
        <div className="flex flex-col w-[1000px]  ">
          <Title title={`Orden # ${id.split("-").at(1)}`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex flex-col mt-5">
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-gray-500": !order?.isPaid,
                    "bg-green-700": order?.isPaid,
                  }
                )}
              >
                <IoCardOutline size={30} />

                <span className="mx-2">
                  {order?.isPaid ? "Orden pagada" : "Orden pendiente de pago"}
                </span>
              </div>

              {!order?.isOkforCook &&
              !order?.isReadyForDelivery &&
              !order?.isDelivered ? (
                <>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-gray-500">
                    <FaCashRegister size={30}></FaCashRegister>
                    <span className="mx-2">
                      Orden confirmada: {order.createdAt ? format(new Date(order.createdAt), "HH:mm:ss - dd/MM ") : '-'}
                    </span>
                  </div>
                </>
              ) : (
                <></>
              )}

              {order?.isOkforCook &&
              !order?.isReadyForDelivery &&
              !order?.isDelivered ? (
                <>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700">
                    <FaCashRegister size={30}></FaCashRegister>
                    <span className="mx-2">Tomamos tu pedido</span>
                  </div>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-blue-700">
                    <TbChefHat size={30}></TbChefHat>
                    <span className="mx-2">Estamos preparando tu pedido</span>
                  </div>
                </>
              ) : (
                <></>
              )}

              {order?.isOkforCook &&
              order?.isReadyForDelivery &&
              !order?.isDelivered ? (
                <>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700">
                    <FaCashRegister size={30}></FaCashRegister>
                    <span className="mx-2">Tomamos tu pedido</span>
                  </div>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700">
                    <TbChefHat size={30}></TbChefHat>
                    <span className="mx-2">Tu pedido esta listo</span>
                  </div>

                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-blue-700">
                    <MdOutlineDeliveryDining
                      size={30}
                    ></MdOutlineDeliveryDining>
                    <span className="mx-2">Estamos llegando...</span>
                  </div>
                </>
              ) : (
                <></>
              )}

              {order?.isOkforCook &&
              order?.isReadyForDelivery &&
              order?.isDelivered ? (
                <>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700">
                    <FaCashRegister size={30}></FaCashRegister>
                    <span className="mx-2">Tomamos tu pedido</span>
                  </div>
                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700">
                    <TbChefHat size={30}></TbChefHat>
                    <span className="mx-2">Tu pedido esta listo</span>
                  </div>

                  <div className="flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700">
                    <BsFillCartCheckFill size={30}></BsFillCartCheckFill>
                    <span className="mx-2">
                      tu pedido fue enviado con éxito
                    </span>
                  </div>
                </>
              ) : (
                <></>
              )}

              {order?.OrderItem.map((product) => (
                <div
                  key={product.product.slug}
                  className="flex  my-4 bg-white rounded-xl shadow-xl "
                >
                  <ProductImage
                    src={product.product.ProductImage[0].url}
                    width={100}
                    height={100}
                    style={{
                      width: "auto",
                      height: "full",
                      objectFit: "cover",
                    }}
                    alt={product.product.title}
                    className="mr-5 rounded"
                    priority={true}
                  />
                  <div className="w-full">
                    <p className="font-bold">{product.product.title}</p>
                    <p>
                      ${product.price} x {product.quantity}{" "}
                    </p>
                    <p className="font-bold bg-green-200 w-1/2">
                      Subtotal: ${product.price * product.quantity}
                    </p>

                    <div className="flex justify-between p-4">
                      <button className="pr-2"></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
              <h2 className="text-2xl mb-2">Dirección de entrega</h2>

              <div className="mb-4">
                <p>{order?.firstName}</p>
                <p>{order?.address}</p>
                <p>{order?.phone}</p>
              </div>

              <div className="w-full h-px bg-gray-200 my-4 col-span-2" />

              <h2 className="text-2xl mb-2">Resumen de orden</h2>
              <div className="grid grid-cols-2 pb-4">
                <span>No. Productos</span>
                <span className="text-right">{order?.itemsInOrder}</span>

                <span>Subtotal</span>
                <span className="text-right">${order?.subtotal}</span>
                <span>Delivery</span>
                <span className="text-right">${order?.Delivery}</span>

                <span>Impuestos</span>
                <span className="text-right">${order?.tax}</span>

                <div className="w-full h-px bg-gray-200 my-4 col-span-2" />

                <span className="mt-2 text-2xl">Total:</span>
                <span className="mt-2 text-2xl text-right">
                  ${order?.total}
                </span>
              </div>
            </div>
          </div>
          <PaymentMethods id={id} total={total} address={address} />
        </div>
      </div>
    );
  }
}
