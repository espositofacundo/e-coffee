"use client";

import { changeUserRole } from "@/actions/user/change-user-role";
import { useRouter } from "next/navigation";

interface UserRow {
  id: string;
  email: string;
  role: string;
  orders: number;
}

interface Props {
  users: UserRow[];
  currentUserId?: string;
}

const UsersTable = ({ users, currentUserId }: Props) => {
  const router = useRouter();

  const onRoleChange = async (userId: string, role: string) => {
    const resp = await changeUserRole(userId, role);
    if (!resp.ok) alert(resp.message);
    router.refresh();
  };

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-brand-cream-dark/60 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold text-center">Pedidos</th>
            <th className="px-4 py-3 font-semibold">Rol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-cream-dark">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 text-center">{user.orders}</td>
              <td className="px-4 py-3">
                <select
                  value={user.role}
                  disabled={user.id === currentUserId}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  className="rounded-lg border border-brand-cream-dark bg-white px-2 py-1 disabled:opacity-60"
                >
                  <option value="admin">Administrador</option>
                  <option value="user">Cliente</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
