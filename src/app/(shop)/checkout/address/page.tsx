import { getLastAddress } from "@/actions/order/get-last-address";
import { getStoreSettings } from "@/actions/settings/get-store-settings";
import Title from "@/components/ui/title/Title";
import { AddressForm } from "./ui/addressForm";

export const metadata = {
  title: "Datos de entrega",
};

export default async function AddressPage() {
  const [lastAddress, settings] = await Promise.all([getLastAddress(), getStoreSettings()]);

  return (
    <div className="max-w-xl">
      <Title title="Datos de entrega" subtitle="¿A dónde te llevamos el pedido?" />
      <AddressForm
        lastAddress={lastAddress}
        settings={{
          freeZoneLabel: settings.freeZoneLabel,
          freeShippingFrom: settings.freeShippingFrom,
          shippingCost: settings.shippingCost,
        }}
      />
    </div>
  );
}
