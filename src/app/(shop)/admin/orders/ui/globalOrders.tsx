"use client";

import React from "react";
import type { Orders } from "@/interfaces/orders.interface";



interface Props {
  orders: Orders[];
}

const GlobalOrders = ({ orders }: Props) => {
  const today = new Date(); // Obtén la fecha de hoy
  
  // Filtra las órdenes que se crearon hoy
  const ordersToday = orders.filter(order => {
    const createdAt = new Date(order.createdAt || "");
    // Compara solo la fecha, sin la parte de tiempo
    return createdAt.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  });

  const ordersMesa = ordersToday.filter(order => ['1', '2', '3', '4'].includes(order.address || ""));
  
  // Calcula el total de las órdenes de hoy
  const totalToday = ordersToday.reduce((subtotal, order) => subtotal + order.total, 0);
  const numberOfOrdersToday = ordersToday.length;

  const totalordersMesa = ordersMesa.reduce((subtotal, order) => subtotal + order.total, 0);
  const numberOfordersMesa = ordersMesa.length;

  const ordersPagadas = ordersToday.filter(order => order.isPaid === true);
  const totalpagadas = ordersPagadas.reduce((subtotal, order) => subtotal + order.total, 0);

  const averagePreparationTime = ordersToday.reduce((totalTime, order) => {
    // Verifica si DisReadyForDelivery y createdAt están definidos y son instancias válidas de Date
    if (order.DisReadyForDelivery instanceof Date && order.createdAt instanceof Date) {
      const preparationTime = order.DisReadyForDelivery.getTime() - order.createdAt.getTime();
      return totalTime + preparationTime;
    }
    return totalTime;
  }, 0) / numberOfOrdersToday;

  const averagePreparationTimeInMinutes = averagePreparationTime / 60000;

  const averageDelivered = ordersToday.reduce((totalTime, order) => {
    // Verifica si DisReadyForDelivery y createdAt están definidos y son instancias válidas de Date
    if (order.DisDelivered instanceof Date && order.createdAt instanceof Date) {
      const deliveryTime = order.DisDelivered.getTime() - order.createdAt.getTime();
      return totalTime + deliveryTime;
    }
    return totalTime;
  }, 0) / numberOfOrdersToday;

  const averagedeliveryTime = averageDelivered / 60000;
  
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Total | Prom
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Total delivery | Prom
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Total mesas | Prom
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Catidad de tickets
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
           Total Pagado | Pendiente
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Tiempo prometido de elaboración
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 pl-1 py-4 text-center"
          >
            Tiempo prometido de entrega
          </th>

          
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
            $ {totalToday} | $ {Math.floor(totalToday/numberOfOrdersToday)}
          </td>
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
          $ {totalToday - totalordersMesa} | $ {Math.floor((totalToday - totalordersMesa) /(numberOfOrdersToday - numberOfordersMesa))}
          </td>
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
          $ {totalordersMesa} | $ {Math.floor(totalordersMesa/numberOfordersMesa)}
          </td>
         
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
            {numberOfOrdersToday}
          </td>

          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
            $ {totalpagadas} | $ {totalToday-totalpagadas}
          </td>
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">

            {Math.floor(averagePreparationTimeInMinutes)} Min

       
          </td>
          
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center">
          {Math.floor(averagedeliveryTime)} Min
          </td>
          <td className="pl-1 py-4 whitespace-nowrap text-sm font-medium text-center"></td>
     
        </tr>
      </tbody>
    </table>
  );
};

export default GlobalOrders;
