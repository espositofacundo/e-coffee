import { safeRedirect } from "@/utils/safe-redirect";
import LoginForm from "./ui/login-form";

export const metadata = {
  title: "Ingresar",
};

interface Props {
  searchParams: {
    redirectTo?: string;
  };
}

// Sin redirección del servidor si ya hay sesión: al ingresar, el formulario
// recarga la página completa para que el menú tome la sesión nueva.
export default function LoginPage({ searchParams }: Props) {
  return <LoginForm redirectTo={safeRedirect(searchParams.redirectTo)} />;
}
