import Title from "@/components/ui/title/Title";
import CartView from "./ui/CartView";

export const metadata = {
  title: "Carrito",
};

export default function CartPage() {
  return (
    <>
      <Title title="Tu pedido" />
      <CartView />
    </>
  );
}
