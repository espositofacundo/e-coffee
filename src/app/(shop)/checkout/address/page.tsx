import { getLastAddress } from "@/actions/order/get-last-address";
import Title from "@/components/ui/title/Title";
import { AddressForm } from "./ui/addressForm";

export const metadata = {
  title: "Datos de entrega",
};

export default async function AddressPage() {
  const lastAddress = await getLastAddress();

  return (
    <div className="max-w-xl">
      <Title title="Datos de entrega" subtitle="¿A dónde te llevamos el pedido?" />
      <AddressForm lastAddress={lastAddress} />
    </div>
  );
}
