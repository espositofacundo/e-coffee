export const revalidate = 0;

import { getOrdersByUser } from "@/actions/order/get-order-by-user";
import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaCashRegister } from "react-icons/fa";
import { IoCardOutline } from "react-icons/io5";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { TbChefHat } from "react-icons/tb";

export default async function OrdersPays() {
  const { ok, orders = [] } = await getOrdersByUser();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Estado de la orden
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 pl-1 py-4 text-left"
              >
                Estado del pago
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <button className="btn-primary ">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id.split("-").at(1)}
                    </Link>
                  </button>
                </td>
                <td className="text-sm text-gray-900 font-light pl-1 py-4 whitespace-nowrap">
                  {!order?.isOkforCook &&
                  !order?.isReadyForDelivery &&
                  !order?.isDelivered ? (
                    <div className="flex items-center">
                      <FaCashRegister size={15}></FaCashRegister>
                      <span className="mx-2">Por hacer</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {order?.isOkforCook &&
                  !order?.isReadyForDelivery &&
                  !order?.isDelivered ? (
                    <div className="flex items-center">
                      <TbChefHat size={15}></TbChefHat>
                      <span className="mx-2">En proceso</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {order?.isOkforCook &&
                  order?.isReadyForDelivery &&
                  !order?.isDelivered ? (
                    <div className="flex items-center">
                      <MdOutlineDeliveryDining
                        size={15}
                      ></MdOutlineDeliveryDining>
                      <span className="mx-2">Yendo!</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {order?.isOkforCook &&
                  order?.isReadyForDelivery &&
                  order?.isDelivered ? (
                    <div className="flex items-center">
                      <BsFillCartCheckFill size={15}></BsFillCartCheckFill>
                      <span className="mx-2">Enviado con éxito</span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>

                {order.isPaid ? (
                  <td className="flex items-center text-sm  text-gray-900 font-light pl-1 py-4 whitespace-nowrap">
                    <IoCardOutline className="text-green-800" />
                    <span className="mx-2 text-green-800">Pagada</span>
                  </td>
                ) : (
                  <td className="flex items-center text-sm  text-gray-900 font-light pl-1 py-4 whitespace-nowrap">
                    <IoCardOutline className="text-red-800" />
                    <span className="mx-2 text-red-800">No Pagada</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
