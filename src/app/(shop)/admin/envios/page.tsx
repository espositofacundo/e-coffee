export const revalidate = 0;

import { getStoreSettings } from "@/actions/settings/get-store-settings";
import { auth } from "@/auth.config";
import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";
import { ShippingForm } from "./ui/ShippingForm";

export const metadata = {
  title: "Envíos",
};

export default async function AdminShippingPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/auth/login");

  const settings = await getStoreSettings();

  return (
    <div className="max-w-xl">
      <Title
        title="Envíos"
        subtitle="Cuándo el envío no se cobra y cuánto sale cuando sí."
      />
      <ShippingForm
        settings={{
          freeZoneLabel: settings.freeZoneLabel,
          freeShippingFrom: settings.freeShippingFrom,
          shippingCost: settings.shippingCost,
        }}
      />
    </div>
  );
}
