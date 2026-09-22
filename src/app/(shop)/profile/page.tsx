import { auth } from "@/auth.config";
import Title from "@/components/ui/title/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoReceiptOutline } from "react-icons/io5";

export const metadata = {
  title: "Mi cuenta",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login?redirectTo=/profile");
  }

  return (
    <div className="max-w-xl">
      <Title title="Mi cuenta" />
      <div className="card p-5 space-y-2">
        <p>
          <span className="text-gray-600">Email:</span> {session.user.email}
        </p>
        <p>
          <span className="text-gray-600">Tipo de cuenta:</span>{" "}
          {session.user.role === "admin" ? "Administrador" : "Cliente"}
        </p>
      </div>
      <Link href="/orders" className="btn-primary mt-4">
        <IoReceiptOutline size={20} /> Ver mis pedidos
      </Link>
    </div>
  );
}
