"use client";

import { placeOrder } from "@/actions/order/place-order";
import { useAddressStore } from "@/store/ui/address/address-store";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { useMyOrdersStore } from "@/store/ui/orders/my-orders-store";
import { currencyFormat } from "@/utils/currency";
import { paymentMethodLabel } from "@/utils/order-status";
import {
  shippingCostFor,
  shippingLabel,
  zoneLabel,
  type ShippingSettings,
} from "@/utils/shipping";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GrEdit } from "react-icons/gr";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const PlaceOrder = ({ settings }: { settings: ShippingSettings }) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useMyOrdersStore((state) => state.addOrder);
  const { itemsInCart, subTotal } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  // El envío depende de la zona que eligió; el servidor lo vuelve a calcular al confirmar.
  const shipping = address.zone ? shippingCostFor(subTotal, address.zone, settings) : 0;
  const total = subTotal + shipping;

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || isPlacingOrder) return;
    if (itemsInCart === 0) router.replace("/cart");
    else if (!address.address || !address.zone) router.replace("/checkout/address");
  }, [loaded, isPlacingOrder, itemsInCart, address.address, address.zone, router]);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage("");

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      presentation: product.presentation,
      variant: product.variant,
    }));

    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message ?? "No se pudo registrar el pedido");
      return;
    }

    // Se guarda en el navegador para que lo vea en "Mis pedidos" aunque no tenga cuenta.
    if (resp.order?.id) addOrder(resp.order.id);
    router.replace("/orders/" + resp.order?.id + "?nuevo=1");
    clearCart();
  };

  if (!loaded) return <p className="text-gray-500">Cargando…</p>;

  return (
    <div className="card p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold">Entrega</h2>
        <Link href="/checkout/address" className="flex items-center gap-2 text-sm underline">
          <GrEdit /> Editar
        </Link>
      </div>
      <div className="text-sm space-y-0.5">
        <p className="font-semibold">{address.firstName}</p>
        <p>{address.address}</p>
        <p>{address.phone}</p>
        {address.zone && (
          <p className="text-gray-600">{zoneLabel(address.zone, settings)}</p>
        )}
        {address.notes && <p className="text-gray-600">{address.notes}</p>}
        <p className="pt-1">
          <span className="text-gray-600">Pago:</span>{" "}
          {paymentMethodLabel[address.paymentMethod]}
        </p>
      </div>

      <div className="my-4 h-px bg-brand-cream-dark" />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Productos</span>
          <span>{itemsInCart}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currencyFormat(subTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span className={clsx(shipping === 0 && "font-semibold text-brand-green")}>
            {shippingLabel(shipping)}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-brand-cream-dark flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>{currencyFormat(total)}</span>
      </div>

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || itemsInCart === 0}
        className={clsx("w-full mt-5 py-3", {
          "btn-primary": !isPlacingOrder,
          "btn-disabled": isPlacingOrder,
        })}
      >
        <IoCheckmarkCircleOutline size={22} />
        {isPlacingOrder ? "Enviando pedido…" : "Confirmar pedido"}
      </button>
      <p className="mt-2 text-xs text-center text-gray-500">
        Los precios se confirman al registrar el pedido.
      </p>
    </div>
  );
};

export default PlaceOrder;
