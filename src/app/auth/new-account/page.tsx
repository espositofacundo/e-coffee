import { safeRedirect } from "@/utils/safe-redirect";
import Registerform from "./ui/Registerform";

export const metadata = {
  title: "Crear cuenta",
};

interface Props {
  searchParams: {
    redirectTo?: string;
  };
}

export default function RegisterPage({ searchParams }: Props) {
  return <Registerform redirectTo={safeRedirect(searchParams.redirectTo)} />;
}
