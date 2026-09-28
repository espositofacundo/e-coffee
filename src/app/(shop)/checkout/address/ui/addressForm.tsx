"use client";

import type { Address } from "@/interfaces/orders.interface";
import { useAddressStore } from "@/store/ui/address/address-store";
import { currencyFormat } from "@/utils/currency";
import { paymentMethodLabel } from "@/utils/order-status";
import { freeFromLabel, type ShippingSettings } from "@/utils/shipping";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoArrowForward } from "react-icons/io5";

interface Props {
  lastAddress: Address | null;
  settings: ShippingSettings;
}

export const AddressForm = ({ lastAddress, settings }: Props) => {
  const router = useRouter();
  const setAddress = useAddressStore((state) => state.setAddress);
  const storedAddress = useAddressStore((state) => state.address);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: {
      firstName: "",
      phone: "",
      address: "",
      notes: "",
      paymentMethod: "efectivo",
      zone: "",
    },
  });

  // Se completa con lo último que cargó en este navegador o, si no hay nada,
  // con los datos de su último pedido.
  useEffect(() => {
    if (storedAddress.firstName) {
      reset(storedAddress);
    } else if (lastAddress) {
      reset(lastAddress);
    }
  }, [storedAddress, lastAddress, reset]);

  const onSubmit = (data: Address) => {
    setAddress(data);
    router.push("/checkout");
  };

  const paymentMethod = watch("paymentMethod");
  const zone = watch("zone");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 sm:p-6 space-y-4">
      <div>
        <label htmlFor="firstName" className="label">
          Nombre y apellido
        </label>
        <input
          id="firstName"
          className="input"
          autoComplete="name"
          placeholder="Juan Pérez"
          {...register("firstName", { required: true, minLength: 2 })}
        />
        {errors.firstName && <FieldError text="Ingresá tu nombre" />}
      </div>

      <div>
        <label htmlFor="phone" className="label">
          Teléfono / WhatsApp
        </label>
        <input
          id="phone"
          type="tel"
          className="input"
          autoComplete="tel"
          placeholder="223 123-4567"
          {...register("phone", { required: true, minLength: 6 })}
        />
        {errors.phone && <FieldError text="Ingresá un teléfono de contacto" />}
      </div>

      <div>
        <label htmlFor="address" className="label">
          Dirección de entrega
        </label>
        <input
          id="address"
          className="input"
          autoComplete="street-address"
          placeholder="Calle 1234, piso y depto"
          {...register("address", { required: true, minLength: 3 })}
        />
        {errors.address && <FieldError text="Ingresá la dirección de entrega" />}
      </div>

      <div>
        <label htmlFor="notes" className="label">
          Aclaraciones <span className="font-normal text-gray-500">(opcional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          className="input"
          placeholder="Entre calles, timbre, horario en que estás…"
          {...register("notes")}
        />
      </div>

      <fieldset>
        <legend className="label">¿Dónde entregamos?</legend>
        <div className="grid gap-2">
          {(
            [
              {
                value: "centro" as const,
                title: `Dentro de ${settings.freeZoneLabel}`,
                detail: "Envío sin cargo",
              },
              {
                value: "fuera" as const,
                title: "Fuera de esa zona",
                detail: `${freeFromLabel(settings)}; si no, ${currencyFormat(settings.shippingCost)}`,
              },
            ]
          ).map((option) => (
            <label
              key={option.value}
              className={clsx(
                "cursor-pointer rounded-lg border px-3 py-2.5 transition-colors",
                zone === option.value
                  ? "border-brand-green bg-brand-green-light"
                  : "border-brand-cream-dark bg-white hover:border-brand-green"
              )}
            >
              <input
                type="radio"
                value={option.value}
                className="sr-only"
                {...register("zone", { required: true })}
              />
              <span className="font-medium">{option.title}</span>
              <span className="block text-sm text-gray-600">{option.detail}</span>
            </label>
          ))}
        </div>
        {errors.zone && <FieldError text="Elegí dónde entregamos el pedido" />}
      </fieldset>

      <fieldset>
        <legend className="label">¿Cómo vas a pagar?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["efectivo", "transferencia"] as const).map((method) => (
            <label
              key={method}
              className={clsx(
                "cursor-pointer rounded-lg border px-3 py-2.5 text-center font-medium transition-colors",
                paymentMethod === method
                  ? "border-brand-green bg-brand-green-light text-brand-green"
                  : "border-brand-cream-dark bg-white hover:border-brand-green"
              )}
            >
              <input
                type="radio"
                value={method}
                className="sr-only"
                {...register("paymentMethod", { required: true })}
              />
              {paymentMethodLabel[method]}
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn-primary w-full py-3">
        Revisar pedido <IoArrowForward />
      </button>
    </form>
  );
};

const FieldError = ({ text }: { text: string }) => (
  <p className="mt-1 text-sm text-red-600">{text}</p>
);
