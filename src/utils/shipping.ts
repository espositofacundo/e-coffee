import type { DeliveryZone } from "@/interfaces/orders.interface";
import { currencyFormat } from "./currency";

export interface ShippingSettings {
  freeZoneLabel: string;
  freeShippingFrom: number;
  shippingCost: number;
}

// El envío no se cobra dentro de la zona, ni cuando el pedido llega al mínimo.
export const shippingCostFor = (
  subtotal: number,
  zone: DeliveryZone,
  settings: ShippingSettings
) => (zone === "centro" || subtotal >= settings.freeShippingFrom ? 0 : settings.shippingCost);

export const zoneLabel = (zone: DeliveryZone, settings: ShippingSettings) =>
  zone === "centro" ? `Dentro de ${settings.freeZoneLabel}` : "Fuera de la zona sin cargo";

export const shippingLabel = (cost: number) =>
  cost === 0 ? "Sin cargo" : currencyFormat(cost);

// "Sin cargo desde $20.000" para avisar antes de elegir la zona.
export const freeFromLabel = (settings: ShippingSettings) =>
  `Sin cargo desde ${currencyFormat(settings.freeShippingFrom)}`;
