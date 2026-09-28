import { getStoreSettings } from "@/actions/settings/get-store-settings";
import Title from "@/components/ui/title/Title";
import CartView from "./ui/CartView";

export const metadata = {
  title: "Carrito",
};

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <>
      <Title title="Tu pedido" />
      <CartView
        settings={{
          freeZoneLabel: settings.freeZoneLabel,
          freeShippingFrom: settings.freeShippingFrom,
          shippingCost: settings.shippingCost,
        }}
      />
    </>
  );
}
