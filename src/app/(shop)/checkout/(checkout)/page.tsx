import Title from "@/components/ui/title/Title";
import PlaceOrder from "./ui/PlaceOrder";
import ProductsInCart from "./ui/ProductsInCart";

export const metadata = {
  title: "Confirmar pedido",
};

export default function CheckoutPage() {
  return (
    <>
      <Title title="Revisá tu pedido" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
        <ProductsInCart />
        <PlaceOrder />
      </div>
    </>
  );
}
