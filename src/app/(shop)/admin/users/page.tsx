export const revalidate = 0;

import { getPaginatedUsers } from "@/actions/user/get-paginated-users";
import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";
import UsersTable from "./ui/UsersTable";

export const metadata = {
  title: "Usuarios",
};

export default async function AdminUsersPage() {
  const { ok, users = [], currentUserId } = await getPaginatedUsers();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title
        title="Usuarios"
        subtitle="Los administradores pueden cargar productos y gestionar pedidos."
      />
      <UsersTable
        users={users.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          orders: user._count.Order,
        }))}
        currentUserId={currentUserId}
      />
    </>
  );
}
