"use client";

import { updateProductPrices } from "@/actions/products/update-product-prices";
import { currencyFormat } from "@/utils/currency";
import {
  formatMarkup,
  formatSheetNumber,
  isValidMarkup,
  parseSheetNumber,
} from "@/utils/pricing";
import { slugify } from "@/utils/slugify";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { IoClipboardOutline, IoSearchOutline } from "react-icons/io5";
import { ImportDialog } from "./ImportDialog";
import { NumberCell } from "./NumberCell";
import {
  applyPriceChange,
  halfPriceOf,
  isRowChanged,
  parseCellValue,
  parseClipboardTable,
  priceFields,
  rowError,
  type PriceField,
  type PriceRow,
} from "./price-rows";

interface Props {
  products: PriceRow[];
  halfKgSurcharge: number;
}

// "1 producto" / "3 productos".
const productCount = (count: number) => `${count} ${count === 1 ? "producto" : "productos"}`;

type Notice = { type: "ok" | "error"; text: string } | null;

const columnLabels: Record<PriceField, string> = {
  cost: "Costo",
  markup: "Margen",
  price: "Precio 1 kg / unidad",
};

const formatters: Record<PriceField, (value: number) => string> = {
  cost: formatSheetNumber,
  markup: formatMarkup,
  price: formatSheetNumber,
};

export const PriceGrid = ({ products, halfKgSurcharge }: Props) => {
  const router = useRouter();
  const [rows, setRows] = useState(products);
  const [surcharge, setSurcharge] = useState(halfKgSurcharge);
  const [surchargeText, setSurchargeText] = useState(formatSheetNumber(halfKgSurcharge));
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [costIncrease, setCostIncrease] = useState("");
  const [bulkMarkup, setBulkMarkup] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Después de guardar, el servidor devuelve los valores definitivos.
  useEffect(() => {
    setRows(products);
    setSurcharge(halfKgSurcharge);
    setSurchargeText(formatSheetNumber(halfKgSurcharge));
  }, [products, halfKgSurcharge]);

  const originals = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.categoryName))),
    [products]
  );

  const changedRows = rows.filter((row) => isRowChanged(row, originals.get(row.id)!));
  const invalidRows = changedRows.filter((row) => rowError(row));
  const surchargeChanged = surcharge !== halfKgSurcharge;
  const isDirty = changedRows.length > 0 || surchargeChanged;

  // Aviso del navegador si se quiere salir con cambios sin guardar.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const term = slugify(search);
  const visible = rows.filter(
    (row) =>
      (!category || row.categoryName === category) &&
      (!term || slugify(`${row.title} ${row.description}`).includes(term))
  );

  const replaceRows = (updated: PriceRow[]) => {
    const byId = new Map(updated.map((row) => [row.id, row]));
    setRows((current) => current.map((row) => byId.get(row.id) ?? row));
  };

  const updateRow = (row: PriceRow) => replaceRows([row]);

  const focusCell = (index: number, field: PriceField) => {
    document.querySelector<HTMLInputElement>(`[data-cell="${index}:${field}"]`)?.focus();
  };

  // Pegar un bloque de celdas copiado de Excel: completa hacia abajo y hacia la
  // derecha desde la celda elegida, en el orden en que se ve la grilla.
  const pasteBlock = (startIndex: number, startField: PriceField, text: string) => {
    const table = parseClipboardTable(text);
    const startColumn = priceFields.indexOf(startField);
    const updated: PriceRow[] = [];
    let values = 0;

    table.forEach((cells, offset) => {
      const target = visible[startIndex + offset];
      if (!target) return;
      let row = target;
      cells.forEach((cell, column) => {
        const field = priceFields[startColumn + column];
        if (!field) return;
        const raw = cell.trim();
        const value = parseCellValue(field, raw);
        // Texto que no es número: esa celda se saltea.
        if (value === null && raw !== "") return;
        row = applyPriceChange(row, field, value);
        values++;
      });
      updated.push(row);
    });

    replaceRows(updated);
    setNotice({
      type: "ok",
      text: `Se pegaron ${values} valores en ${productCount(updated.length)}, desde “${visible[startIndex].title}” hacia abajo. Revisalos antes de guardar.`,
    });
  };

  // Herramientas en bloque: se aplican a los productos que se ven (búsqueda / categoría).
  const applyToVisible = (update: (row: PriceRow) => PriceRow | null) => {
    const updated = visible.map(update).filter((row): row is PriceRow => row !== null);
    replaceRows(updated);
    return { applied: updated.length, skipped: visible.length - updated.length };
  };

  const skippedText = (skipped: number) =>
    skipped === 0
      ? ""
      : skipped === 1
        ? " (1 sin costo cargado quedó igual)"
        : ` (${skipped} sin costo cargado quedaron igual)`;

  const increaseCosts = () => {
    const percent = parseSheetNumber(costIncrease);
    if (percent === null || percent <= -100) {
      setNotice({ type: "error", text: "Escribí el porcentaje de aumento, por ejemplo 8 o 8,5." });
      return;
    }
    const { applied, skipped } = applyToVisible((row) =>
      row.cost === null
        ? null
        : applyPriceChange(row, "cost", Math.round(row.cost * (1 + percent / 100) * 100) / 100)
    );
    setCostIncrease("");
    setNotice({
      type: "ok",
      text: `Costo ${percent >= 0 ? "+" : ""}${formatSheetNumber(percent)} % en ${productCount(applied)}${skippedText(skipped)}. Los precios se recalcularon con su margen.`,
    });
  };

  const applyMarkup = () => {
    const markup = parseCellValue("markup", bulkMarkup);
    if (markup === null || !isValidMarkup(markup)) {
      setNotice({ type: "error", text: "El margen va como en la planilla: entre 1 y 10 (1,350 = 35 %)." });
      return;
    }
    const { applied, skipped } = applyToVisible((row) =>
      row.cost === null ? null : applyPriceChange(row, "markup", markup)
    );
    setBulkMarkup("");
    setNotice({
      type: "ok",
      text: `Margen ${formatMarkup(markup)} en ${productCount(applied)}${skippedText(skipped)}.`,
    });
  };

  const commitSurcharge = () => {
    const value = parseSheetNumber(surchargeText);
    if (value === null || value < 0 || value > 50) {
      setSurchargeText(formatSheetNumber(surcharge));
      return;
    }
    setSurcharge(value);
    setSurchargeText(formatSheetNumber(value));
  };

  const discard = () => {
    setRows(products);
    setSurcharge(halfKgSurcharge);
    setSurchargeText(formatSheetNumber(halfKgSurcharge));
    setNotice(null);
  };

  const save = async () => {
    if (invalidRows.length > 0) return;
    setIsSaving(true);
    setNotice(null);

    const resp = await updateProductPrices({
      rows: changedRows.map((row) => ({
        id: row.id,
        cost: row.cost,
        markup: row.cost === null ? null : row.markup,
        price: row.price ?? 0,
        sellsHalf: row.sellsHalf,
        available: row.available,
      })),
      halfKgSurcharge: surchargeChanged ? surcharge : undefined,
    });
    setIsSaving(false);

    if (!resp.ok) {
      setNotice({ type: "error", text: resp.message ?? "No se pudieron guardar los precios" });
      return;
    }
    setNotice({
      type: "ok",
      text:
        changedRows.length > 0
          ? `Listo: se guardaron ${productCount(changedRows.length)}. El catálogo ya muestra los precios nuevos.`
          : "Listo: se recalculó el ½ kg de todos los productos.",
    });
    router.refresh();
  };

  let lastCategory = "";

  return (
    <>
      {/* Búsqueda, categoría e importación */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[14rem]">
          <IoSearchOutline
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto"
            className="input pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input w-auto"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={() => setShowImport(true)} className="btn-secondary">
          <IoClipboardOutline size={18} /> Importar desde la planilla
        </button>
      </div>

      {/* Herramientas en bloque */}
      <div className="card mt-3 p-3 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
        <span className="font-semibold">
          A {visible.length === 1 ? "el producto" : `los ${visible.length} productos`} de la vista:
        </span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            increaseCosts();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="cost-increase">Aumentar costo</label>
          <input
            id="cost-increase"
            value={costIncrease}
            onChange={(e) => setCostIncrease(e.target.value)}
            inputMode="decimal"
            placeholder="8"
            className="input w-20 py-1 text-right"
          />
          <span>%</span>
          <button className="btn-secondary py-1">Aplicar</button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyMarkup();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="bulk-markup">Margen</label>
          <input
            id="bulk-markup"
            value={bulkMarkup}
            onChange={(e) => setBulkMarkup(e.target.value)}
            inputMode="decimal"
            placeholder="1,350"
            className="input w-24 py-1 text-right"
          />
          <button className="btn-secondary py-1">Aplicar</button>
        </form>
        <div className="flex items-center gap-2 sm:ml-auto">
          <label htmlFor="half-surcharge">Recargo ½ kg</label>
          <input
            id="half-surcharge"
            value={surchargeText}
            onChange={(e) => setSurchargeText(e.target.value)}
            onBlur={commitSurcharge}
            onKeyDown={(e) => e.key === "Enter" && commitSurcharge()}
            inputMode="decimal"
            className={clsx("input w-20 py-1 text-right", surchargeChanged && "bg-amber-50")}
          />
          <span className="text-gray-600">
            % → ½ kg = kilo × {formatMarkup(0.5 + surcharge / 100)}
          </span>
        </div>
      </div>

      {notice && (
        <p
          className={clsx(
            "mt-3 rounded-lg px-3 py-2 text-sm",
            notice.type === "ok" ? "bg-brand-green-light text-brand-green" : "bg-red-50 text-red-700"
          )}
        >
          {notice.text}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Escribí como en Excel: <strong>Enter</strong> o <strong>↓</strong> baja, <strong>↑</strong>{" "}
        sube, <strong>Tab</strong> avanza, <strong>Esc</strong> cancela. Cambiá cualquiera de los
        tres (costo, margen o precio) y se recalcula el resto. Si pegás una columna copiada de
        Excel, se completa hacia abajo en el orden de esta grilla.
      </p>

      {/* Grilla */}
      <div className="card mt-2 overflow-x-auto">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="sticky top-0 z-[1] bg-brand-green text-white text-left">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Producto</th>
              <th className="px-2 py-2.5 font-semibold text-center">Venta</th>
              {priceFields.map((field) => (
                <th key={field} className="px-3 py-2.5 font-semibold text-right w-36">
                  {columnLabels[field]}
                </th>
              ))}
              <th className="px-3 py-2.5 font-semibold text-right w-40">Precio ½ kg</th>
              <th className="px-3 py-2.5 font-semibold text-right w-28">Ganancia</th>
              <th className="px-3 py-2.5 font-semibold text-center w-24">Disponible</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => {
              const original = originals.get(row.id)!;
              const error = rowError(row);
              // Sin cambios en la fila ni en el recargo se muestra el ½ kg guardado,
              // que es el que ve el cliente (puede diferir $1 de la fórmula por redondeo).
              const half =
                !surchargeChanged &&
                row.price === original.price &&
                row.sellsHalf === original.sellsHalf
                  ? original.priceHalf
                  : halfPriceOf(row, surcharge);
              const profit = row.cost !== null && row.price ? row.price - row.cost : null;
              const showCategory = row.categoryName !== lastCategory;
              lastCategory = row.categoryName;

              return (
                <Fragment key={row.id}>
                  {showCategory && (
                    <tr>
                      <td
                        colSpan={8}
                        className="bg-brand-gold px-3 py-1.5 text-center font-bold text-white"
                      >
                        {row.categoryName}
                      </td>
                    </tr>
                  )}
                  <tr
                    className={clsx(
                      "border-b border-brand-cream-dark",
                      !row.available && "text-gray-400"
                    )}
                    title={error ?? undefined}
                  >
                    <td className="px-3 py-1">
                      <Link
                        href={`/admin/product/${row.slug}`}
                        className="font-medium hover:underline"
                      >
                        {row.title}
                      </Link>
                      {row.description && (
                        <span className="block text-xs text-gray-500">{row.description}</span>
                      )}
                    </td>
                    <td className="px-2 py-1 text-center text-xs text-gray-500">
                      {row.unit === "kg" ? "kg" : "unidad"}
                    </td>
                    {priceFields.map((field) => (
                      <td key={field} className="px-1 py-1">
                        <NumberCell
                          cellId={`${index}:${field}`}
                          ariaLabel={`${columnLabels[field]} de ${row.title}`}
                          value={row[field]}
                          format={formatters[field]}
                          parse={(text) => parseCellValue(field, text)}
                          placeholder={field === "markup" && row.cost === null ? "sin costo" : "—"}
                          disabledReason={
                            field === "markup" && row.cost === null
                              ? "Cargá primero el costo"
                              : undefined
                          }
                          changed={row[field] !== original[field]}
                          invalid={
                            (field === "markup" && row.markup !== null && !isValidMarkup(row.markup)) ||
                            (field === "price" && (!row.price || row.price <= 0))
                          }
                          onCommit={(value) => updateRow(applyPriceChange(row, field, value))}
                          onNavigate={(delta) => focusCell(index + delta, field)}
                          onPasteBlock={(text) => pasteBlock(index, field, text)}
                        />
                      </td>
                    ))}
                    <td
                      className={clsx(
                        "px-3 py-1 text-right tabular-nums",
                        row.sellsHalf !== original.sellsHalf && "bg-amber-50"
                      )}
                    >
                      {row.unit === "kg" ? (
                        <label className="flex items-center justify-end gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.sellsHalf}
                            onChange={(e) => updateRow({ ...row, sellsHalf: e.target.checked })}
                            className="h-4 w-4 accent-brand-green"
                            aria-label={`Vender ${row.title} por ½ kg`}
                          />
                          <span className={clsx("w-20", !row.sellsHalf && "text-gray-300")}>
                            {half ? currencyFormat(half) : "—"}
                          </span>
                        </label>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-1 text-right tabular-nums">
                      {profit === null ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <span className={clsx(profit < 0 && "text-red-600 font-semibold")}>
                          {currencyFormat(profit)}
                        </span>
                      )}
                    </td>
                    <td
                      className={clsx(
                        "px-3 py-1 text-center",
                        row.available !== original.available && "bg-amber-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={row.available}
                        onChange={(e) => updateRow({ ...row, available: e.target.checked })}
                        className="h-4 w-4 accent-brand-green"
                        aria-label={`${row.title} disponible`}
                      />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="p-6 text-center text-gray-600">No hay productos que coincidan.</p>
        )}
      </div>

      {/* Barra de guardado */}
      {isDirty && (
        <div className="fade-in sticky bottom-4 z-10 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-ink px-4 py-3 text-white shadow-2xl">
          <span className="text-sm">
            {changedRows.length > 0 && `${productCount(changedRows.length)} con cambios`}
            {changedRows.length > 0 && surchargeChanged && " · "}
            {surchargeChanged && "recargo ½ kg nuevo (se recalculan todos)"}
            {invalidRows.length > 0 && (
              <span className="ml-2 rounded bg-red-600 px-2 py-0.5 font-semibold">
                {invalidRows.length} con errores
              </span>
            )}
          </span>
          <div className="flex gap-2">
            <button onClick={discard} disabled={isSaving} className="btn-secondary py-1.5">
              Descartar
            </button>
            <button
              onClick={save}
              disabled={isSaving || invalidRows.length > 0}
              className={clsx("py-1.5", isSaving || invalidRows.length > 0 ? "btn-disabled" : "btn-primary")}
            >
              {isSaving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      {showImport && (
        <ImportDialog
          rows={rows}
          onClose={() => setShowImport(false)}
          onApply={(updated, result) => {
            setRows(updated);
            setShowImport(false);
            const problems = [
              result.notFound.length > 0 && `No encontré: ${result.notFound.join(", ")}.`,
              result.ambiguous.length > 0 &&
                `Hay más de un producto con el nombre ${result.ambiguous.join(", ")}: agregá la columna Detalle o cargalos a mano.`,
            ].filter(Boolean);
            setNotice({
              type: problems.length > 0 ? "error" : "ok",
              text: `Se importaron ${productCount(result.matched)}. ${problems.join(" ")} Revisá los cambios en amarillo y guardá.`,
            });
          }}
        />
      )}
    </>
  );
};
