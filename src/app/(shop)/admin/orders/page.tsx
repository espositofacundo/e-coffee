export const revalidate = 0;

import { getPaginatedOrders } from "@/actions/order/get-paginated-orders";
import Title from "@/components/ui/title/Title";

import { redirect } from "next/navigation";
import OrderTable from "./ui/OrderTable";
import GlobalOrders from "./ui/globalOrders";



export default async function OrdersPays() {
  const { ok, orders = [] } = await getPaginatedOrders();
 

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Orders" />
     
      <div className="mb-10">
        <GlobalOrders orders={orders}/>
      </div>

      <div className="mb-10">
        <OrderTable orders={orders}/>
      </div>

    </>
  );
}
