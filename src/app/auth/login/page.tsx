import { auth } from "@/auth.config";
import { safeRedirect } from "@/utils/safe-redirect";
import { redirect } from "next/navigation";
import LoginForm from "./ui/login-form";

export const metadata = {
  title: "Ingresar",
};

interface Props {
  searchParams: {
    redirectTo?: string;
  };
}

export default async function LoginPage({ searchParams }: Props) {
  const redirectTo = safeRedirect(searchParams.redirectTo);

  // Si ya tiene sesión (o acaba de ingresar), va directo a donde iba.
  const session = await auth();
  if (session?.user) {
    redirect(redirectTo);
  }

  return <LoginForm redirectTo={redirectTo} />;
}
