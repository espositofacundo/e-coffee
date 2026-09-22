import { auth } from "@/auth.config";
import { safeRedirect } from "@/utils/safe-redirect";
import { redirect } from "next/navigation";
import Registerform from "./ui/Registerform";

export const metadata = {
  title: "Crear cuenta",
};

interface Props {
  searchParams: {
    redirectTo?: string;
  };
}

export default async function RegisterPage({ searchParams }: Props) {
  const redirectTo = safeRedirect(searchParams.redirectTo);

  const session = await auth();
  if (session?.user) {
    redirect(redirectTo);
  }

  return <Registerform redirectTo={redirectTo} />;
}
