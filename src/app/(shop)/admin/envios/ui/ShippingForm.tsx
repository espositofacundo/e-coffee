"use client";

import { saveShippingSettings } from "@/actions/settings/save-shipping-settings";
import { currencyFormat } from "@/utils/currency";
import { formatSheetNumber, parseSheetNumber } from "@/utils/pricing";
import type { ShippingSettings } from "@/utils/shipping";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ShippingForm = ({ settings }: { settings: ShippingSettings }) => {
  const router = useRouter();
  const [zone, setZone] = useState(settings.freeZoneLabel);
  const [freeFrom, setFreeFrom] = useState(formatSheetNumber(settings.freeShippingFrom));
  const [cost, setCost] = useState(formatSheetNumber(settings.shippingCost));
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const freeFromValue = parseSheetNumber(freeFrom);
  const costValue = parseSheetNumber(cost);
  const isValid = zone.trim().length >= 3 && freeFromValue !== null && costValue !== null;

  const save = async () => {
    if (!isValid) return;
    setIsSaving(true);
    setNotice(null);

    const resp = await saveShippingSettings({
      freeZoneLabel: zone.trim(),
      freeShippingFrom: freeFromValue,
      shippingCost: costValue,
    });
    setIsSaving(false);

    if (!resp.ok) {
      setNotice({ ok: false, text: resp.message ?? "No se pudo guardar" });
      return;
    }
    setNotice({ ok: true, text: "Listo: los pedidos nuevos usan estos valores." });
    router.refresh();
  };

  return (
    <div className="card p-5 sm:p-6 space-y-4">
      <div>
        <label htmlFor="zone" className="label">
          Zona con envío sin cargo
        </label>
        <input
          id="zone"
          className="input"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          placeholder="Juan B. Justo, Independencia, Libertad y la costa"
        />
        <p className="mt-1 text-xs text-gray-500">
          El cliente elige en el checkout si está dentro o fuera de esta zona.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="freeFrom" className="label">
            Sin cargo desde
          </label>
          <input
            id="freeFrom"
            inputMode="decimal"
            className="input text-right"
            value={freeFrom}
            onChange={(e) => setFreeFrom(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cost" className="label">
            Costo fuera de la zona
          </label>
          <input
            id="cost"
            inputMode="decimal"
            className="input text-right"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
      </div>

      <p className="rounded-lg bg-brand-cream px-3 py-2 text-sm">
        Queda así: dentro de <strong>{zone.trim() || "la zona"}</strong>, sin cargo. Fuera de esa
        zona, sin cargo desde{" "}
        <strong>{freeFromValue === null ? "—" : currencyFormat(freeFromValue)}</strong>; si no,{" "}
        <strong>{costValue === null ? "—" : currencyFormat(costValue)}</strong>.
      </p>

      {notice && (
        <p
          className={clsx(
            "rounded-lg px-3 py-2 text-sm",
            notice.ok ? "bg-brand-green-light text-brand-green" : "bg-red-50 text-red-700"
          )}
        >
          {notice.text}
        </p>
      )}

      <button
        onClick={save}
        disabled={!isValid || isSaving}
        className={clsx("w-full py-3", !isValid || isSaving ? "btn-disabled" : "btn-primary")}
      >
        {isSaving ? "Guardando…" : "Guardar"}
      </button>
    </div>
  );
};
