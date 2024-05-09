export const revalidate = 0;
import Title from "@/components/ui/title/Title";

import { redirect } from "next/navigation";
import UsersTable from "./ui/UsersTable";
import { getPaginatedUsers } from "@/actions/user/get-paginated-users";
import Pagination from "@/components/ui/pagination/Pagination";



export default async function OrdersPays() {
  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Users" />

      <div className="mb-10">
       <UsersTable users={users}></UsersTable>

       <Pagination totalPages={2}></Pagination>
      </div>
    </>
  );
}
