"use client";

import clsx from "clsx";
import { useRef, useState } from "react";

interface Props {
  cellId: string;
  value: number | null;
  format: (value: number) => string;
  parse: (text: string) => number | null;
  onCommit: (value: number | null) => void;
  // Mover el foco a la fila de arriba (-1) o de abajo (+1), como en Excel.
  onNavigate: (delta: number) => void;
  // Pegado de varias celdas (texto con tabs o saltos de línea copiado de una planilla).
  onPasteBlock: (text: string) => void;
  placeholder?: string;
  changed?: boolean;
  invalid?: boolean;
  // Bloqueada, con el motivo como ayuda (ej. margen sin costo).
  disabledReason?: string;
  ariaLabel: string;
}

// Celda numérica editable: muestra el valor formateado y, al entrar, el texto
// para editar. El cambio se aplica al salir, con Enter o con las flechas.
export const NumberCell = ({
  cellId,
  value,
  format,
  parse,
  onCommit,
  onNavigate,
  onPasteBlock,
  placeholder,
  changed,
  invalid,
  disabledReason,
  ariaLabel,
}: Props) => {
  const [draft, setDraft] = useState<string | null>(null);
  const draftRef = useRef<string | null>(null);
  const display = value === null ? "" : format(value);

  const setDraftValue = (next: string | null) => {
    draftRef.current = next;
    setDraft(next);
  };

  const commit = () => {
    const text = draftRef.current;
    setDraftValue(null);
    if (text === null) return;

    const trimmed = text.trim();
    const next = trimmed === "" ? null : parse(trimmed);
    // Texto que no es un número: se descarta y queda el valor anterior.
    if (trimmed !== "" && next === null) return;
    if (next !== value) onCommit(next);
  };

  return (
    <input
      data-cell={cellId}
      aria-label={ariaLabel}
      readOnly={!!disabledReason}
      title={disabledReason}
      inputMode="decimal"
      autoComplete="off"
      value={draft ?? display}
      placeholder={placeholder}
      onFocus={(e) => {
        if (disabledReason) return;
        setDraftValue(display);
        const input = e.currentTarget;
        requestAnimationFrame(() => input.select());
      }}
      onChange={(e) => setDraftValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          commit();
          onNavigate(e.key === "ArrowUp" || (e.key === "Enter" && e.shiftKey) ? -1 : 1);
        } else if (e.key === "Escape") {
          setDraftValue(null);
          e.currentTarget.blur();
        }
      }}
      onPaste={(e) => {
        const text = e.clipboardData.getData("text");
        if (/[\t\n]/.test(text.trim())) {
          e.preventDefault();
          setDraftValue(null);
          onPasteBlock(text);
        }
      }}
      className={clsx(
        "w-full min-w-0 rounded px-2 py-1.5 text-right tabular-nums outline-none transition-colors",
        disabledReason
          ? "cursor-not-allowed focus:ring-1 focus:ring-gray-300"
          : "focus:bg-white focus:ring-2 focus:ring-brand-green",
        invalid ? "bg-red-50 text-red-700" : changed ? "bg-amber-50" : "bg-transparent",
        "placeholder:text-gray-300"
      )}
    />
  );
};
