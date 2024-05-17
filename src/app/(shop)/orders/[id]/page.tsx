export const revalidate = 10;
import { getOrderById } from "@/actions/order/get-order-by-id";
import Title from "@/components/ui/title/Title";
import { format } from "date-fns";

import clsx from "clsx";

import { redirect } from "next/navigation";

import { BsFillCartCheckFill } from "react-icons/bs";

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


  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }
  if (order) {
    const { id, total, address = "", ...rest } = order;

  

    return (
      <div className="flex justify-center items-center mb-72 px-5 sm:px-0">
        <div className="flex flex-col w-[1000px]  ">
          <Title title={`Orden # ${id.split("-").at(1)}`} />

          

          <div className="flex h-32 items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-full shadow-2xl">
            {/* Ordered */}

            {!order?.isOkforCook &&
            !order?.isReadyForDelivery &&
            !order?.isDelivered ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.createdAt
                      ? format(new Date(order.createdAt), "HH:mm")
                      : "-"}
                  </p>
                </div>

                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white">
                    <TbChefHat size={22}></TbChefHat>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisOkforCook
                      ? format(new Date(order.DisOkforCook), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white">
                    <MdOutlineDeliveryDining
                      size={22}
                    ></MdOutlineDeliveryDining>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisReadyForDelivery
                      ? format(
                          new Date(order.DisReadyForDelivery),
                          "HH:mm dd-MM"
                        )
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white">
                    <BsFillCartCheckFill size={18}></BsFillCartCheckFill>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisDelivered
                      ? format(new Date(order.DisDelivered), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* en proceso */}

            {order?.isOkforCook &&
            !order?.isReadyForDelivery &&
            !order?.isDelivered ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.createdAt
                      ? format(new Date(order.createdAt), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>

                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <TbChefHat size={22}></TbChefHat>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisOkforCook
                      ? format(new Date(order.DisOkforCook), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white">
                    <MdOutlineDeliveryDining
                      size={22}
                    ></MdOutlineDeliveryDining>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisReadyForDelivery
                      ? format(
                          new Date(order.DisReadyForDelivery),
                          "HH:mm dd-MM"
                        )
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white">
                    <BsFillCartCheckFill size={18}></BsFillCartCheckFill>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisDelivered
                      ? format(new Date(order.DisDelivered), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* en proceso */}

            {order?.isOkforCook &&
            order?.isReadyForDelivery &&
            !order?.isDelivered ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.createdAt
                      ? format(new Date(order.createdAt), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>

                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <TbChefHat size={22}></TbChefHat>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisOkforCook
                      ? format(new Date(order.DisOkforCook), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <MdOutlineDeliveryDining
                      size={22}
                    ></MdOutlineDeliveryDining>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisReadyForDelivery
                      ? format(
                          new Date(order.DisReadyForDelivery),
                          "HH:mm dd-MM"
                        )
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white">
                    <BsFillCartCheckFill size={18}></BsFillCartCheckFill>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisDelivered
                      ? format(new Date(order.DisDelivered), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* en proceso */}

            {order?.isOkforCook &&
            order?.isReadyForDelivery &&
            order?.isDelivered ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.createdAt
                      ? format(new Date(order.createdAt), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>

                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <TbChefHat size={22}></TbChefHat>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisOkforCook
                      ? format(new Date(order.DisOkforCook), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <MdOutlineDeliveryDining
                      size={22}
                    ></MdOutlineDeliveryDining>
                  </div>

                  <p className="text-xs mt-2">
                    {" "}
                    {order.DisReadyForDelivery
                      ? format(
                          new Date(order.DisReadyForDelivery),
                          "HH:mm dd-MM"
                        )
                      : "-"}
                  </p>
                </div>
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-900"></div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-900 text-white">
                    <BsFillCartCheckFill size={18}></BsFillCartCheckFill>
                  </div>

                  <p className="text-xs mt-2">
                    {order.DisDelivered
                      ? format(new Date(order.DisDelivered), "HH:mm dd-MM")
                      : "-"}
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 pt-10 gap-10">
            <div className="flex flex-col ">
              {order?.OrderItem.map((product) => (
                <div
                  key={product.product.slug}
                  className="flex bg-white rounded-xl mb-4 shadow-2xl"
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
                    <p className="font-bold w-1/2">
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
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-gray-900": !order?.isPaid,
                    "bg-green-900": order?.isPaid,
                  }
                )}
              >
                <IoCardOutline size={30} />
                <div className="flex justify-between w-full">
                  <span className="mx-2">
                    {order?.isPaid ? "Orden pagada" : "Orden pendiente de pago"}
                  </span>
                  <span>
                    {order.DisPaid
                      ? format(new Date(order.DisPaid), "HH:mm dd-MM")
                      : "-"}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl mb-2">Datos de la orden</h2>

              <div className="mb-4 grid grid-cols-2">
                <p>Nombre:</p>
                <p className="text-right">{order.firstName}</p>

                <p>
                  {order.address === "1" ||
                  order.address === "2" ||
                  order.address === "3" ||
                  order.address === "4"
                    ? `N° de mesa:`
                    : "Direccion:"}{" "}
                </p>
                <p className="text-right">
                  {order.address === "1" ||
                  order.address === "2" ||
                  order.address === "3" ||
                  order.address === "4"
                    ? `Mesa ${order.address}`
                    : order.address}
                </p>
                <p>Celular:</p>
                <p className="text-right">{order.phone}</p>
              </div>

              <div className="w-full h-px bg-gray-200 my-4 col-span-2" />

              <h2 className="text-2xl mb-2">Resumen de orden</h2>
              <div className="grid grid-cols-2 pb-4">
                <span>No. Productos</span>
                <span className="text-right">{order?.itemsInOrder}</span>

                <span>Subtotal</span>
                <span className="text-right">${order?.subtotal}</span>

                {order?.Delivery !== 0 ? (
                  <>
                    <span>Delivery</span>
                    <span className="text-right">${order?.Delivery}</span>
                  </>
                ) : (
                  <></>
                )}

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
