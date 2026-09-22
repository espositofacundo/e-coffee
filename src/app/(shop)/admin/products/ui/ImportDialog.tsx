"use client";

import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { importFromSheet, type PriceRow, type SheetImportResult } from "./price-rows";

interface Props {
  rows: PriceRow[];
  onApply: (rows: PriceRow[], result: SheetImportResult) => void;
  onClose: () => void;
}

export const ImportDialog = ({ rows, onApply, onClose }: Props) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const apply = () => {
    const result = importFromSheet(rows, text);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.matched === 0) {
      setError("No encontré ningún producto con esos nombres.");
      return;
    }
    onApply(result.rows, result);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-2xl p-5 shadow-2xl" role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Importar desde la planilla</h2>
            <p className="text-sm text-gray-600">
              En Excel seleccioná la tabla <strong>con la fila de títulos</strong> (Productos, Costo,
              Margen, Precio 1 kg / unidad), copiala y pegala acá. Los productos se buscan por nombre,
              así que el orden no importa.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-cream-dark" aria-label="Cerrar">
            <IoCloseOutline size={26} />
          </button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          rows={10}
          placeholder={"Productos\tCosto\tIVA\tMargen\tPrecio ½ kg\tPrecio 1 kg / unidad\nNuez Mariposa Extra Light\t$12.711\t1,00\t1,350\t$9.215\t$17.160"}
          className="input mt-4 font-mono text-xs whitespace-pre"
        />
        <p className="mt-1 text-xs text-gray-500">
          El ½ kg y el IVA se ignoran: el ½ kg se calcula solo. Nada se guarda hasta que toques
          “Guardar cambios”.
        </p>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={apply} disabled={!text.trim()} className="btn-primary disabled:opacity-50">
            Aplicar a la grilla
          </button>
        </div>
      </div>
    </div>
  );
};
