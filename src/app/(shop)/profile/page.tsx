import { auth } from "@/auth.config";
import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  return (
    <div>
      <Title title="Perfil" />

      <pre>{JSON.stringify(session.user, null, 2)}</pre>
      <h3>Role: {session.user.role}</h3>
      <h3>email:{session.user.email}</h3>
    </div>
  );
}
