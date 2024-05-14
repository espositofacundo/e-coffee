"use client";

import React from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaCashRegister } from "react-icons/fa";

import {
  MdOutlineCancel,
  MdOutlineDeliveryDining,
  MdOutlinePaid,
} from "react-icons/md";
import { TbChefHat } from "react-icons/tb";
import Link from "next/link";
import type { Orders } from "@/interfaces/orders.interface";
import { updateOrders } from "@/actions/order/update-orders";

import { format } from "date-fns";

interface Props {
  orders: Orders[];
}

const OrderTable = ({ orders }: Props) => {
  


  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            #ID
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Mesa / Direccion de entrega
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Total
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Estado de la orden
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Estado del pago
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Orden creada
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            En proceso
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Listo para entrega
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Entregado
          </th>

          
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
              <button
                className={
                  order.isDelivered && order.isPaid
                    ? "btn-success"
                    : "btn-primary"
                }
              >
                <Link href={`/orders/${order.id}`} className="hover:underline">
                  {order.id.split("-").at(1)}
                </Link>
              </button>
            </td>
            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
              {order.address === "1" ||
              order.address === "2" ||
              order.address === "3" ||
              order.address === "4" ? (
                <span className="btn-mesa">Mesa: {order.address}</span>
              ) : (
                <div className=" ">
                  <span className="btn-delivery mr-2 ">{order.address} </span>{" "}
                  <span className="btn-delivery">{order.phone} </span>{" "}
                </div>
              )}
            </td>
            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
             $ {order.total}
            </td>
            <td className="text-sm text-gray-900 font-light  pt-6 whitespace-nowrap flex justify-center">
              {!order?.isOkforCook &&
              !order?.isReadyForDelivery &&
              !order?.isDelivered ? (
                <div className="flex items-center">
                  <FaCashRegister size={15}></FaCashRegister>
                  <span className="mx-2">Por hacer</span>
                  {order.isPaid === true ? (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-green-200 rounded-full">
                        <MdOutlinePaid size={20} />
                      </div>{" "}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-red-200 rounded-full">
                        <MdOutlineCancel size={20} />
                      </div>{" "}
                    </div>
                  )}
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
                  {order.isPaid === true ? (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-green-200 rounded-full">
                        <MdOutlinePaid size={20} />
                      </div>{" "}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-red-200 rounded-full">
                        <MdOutlineCancel size={20} />
                      </div>{" "}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
              {order?.isOkforCook &&
              order?.isReadyForDelivery &&
              !order?.isDelivered ? (
                <div className="flex items-center">
                  <MdOutlineDeliveryDining size={15}></MdOutlineDeliveryDining>
                  <span className="mx-2">Yendo!</span>
                  {order.isPaid === true ? (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-green-200 rounded-full">
                        <MdOutlinePaid size={20} />
                      </div>{" "}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-red-200 rounded-full">
                        <MdOutlineCancel size={20} />
                      </div>{" "}
                    </div>
                  )}
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
                  {order.isPaid === true ? (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-green-200 rounded-full">
                        <MdOutlinePaid size={20} />
                      </div>{" "}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>| </span>{" "}
                      <div className="bg-red-200 rounded-full">
                        <MdOutlineCancel size={20} />
                      </div>{" "}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </td>
            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
              <div className="flex flex-col items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={order.isPaid}
                  onChange={(e) =>
                    updateOrders(
                      order.id,
                      order.isOkforCook,
                      e.target.checked,
                      order.isReadyForDelivery,
                      order.isDelivered
                    )
                  }
                  className="text-sm"
                />
                <span className="text-xs">
                  {order.DisPaid
                    ? format(new Date(order.DisPaid), "HH:mm:ss-dd/MM ")
                    : "-"}
                </span>
              </div>
            </td>

            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
              <span className="text-xs">
                {order.createdAt
                  ? format(new Date(order.createdAt), "HH:mm:ss-dd/MM ")
                  : "-"}
              </span>
            </td>

            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
              <div className="flex flex-col items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={order.isOkforCook}
                  onChange={(e) =>
                    updateOrders(
                      order.id,
                      e.target.checked,
                      order.isPaid,
                      order.isReadyForDelivery,
                      order.isDelivered
                    )
                  }
                  className="text-sm"
                />

                <span className="text-xs">
                  {order.DisOkforCook
                    ? format(new Date(order.DisOkforCook), "HH:mm:ss-dd/MM ")
                    : "-"}
                </span>
              </div>
            </td>

            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
              <div className="flex flex-col items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={order.isReadyForDelivery}
                  onChange={(e) =>
                    updateOrders(
                      order.id,
                      order.isOkforCook,
                      order.isPaid,
                      e.target.checked,
                      order.isDelivered
                    )
                  }
                  className="text-sm"
                />

                <span className="text-xs">
                  {order.DisReadyForDelivery
                    ? format(
                        new Date(order.DisReadyForDelivery),
                        "HH:mm:ss-dd/MM "
                      )
                    : "-"}
                </span>
              </div>
            </td>

            <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
              <div className="flex flex-col items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={order.isDelivered}
                  onChange={(e) =>
                    updateOrders(
                      order.id,
                      order.isOkforCook,
                      order.isPaid,
                      order.isReadyForDelivery,
                      e.target.checked
                    )
                  }
                  className="text-sm"
                />

                <span className="text-xs">
                  {order.DisDelivered
                    ? format(new Date(order.DisDelivered), "HH:mm:ss-dd/MM ")
                    : "-"}
                </span>
              </div>
            </td>

            
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
