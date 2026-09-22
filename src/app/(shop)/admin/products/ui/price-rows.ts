import {
  MAX_MARKUP,
  halfKgPrice,
  isValidMarkup,
  markupFromPrice,
  parseSheetNumber,
  priceFromCost,
} from "@/utils/pricing";
import { slugify } from "@/utils/slugify";

export type PriceField = "cost" | "markup" | "price";

export const priceFields: PriceField[] = ["cost", "markup", "price"];

export interface PriceRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  variants: string[];
  categoryName: string;
  unit: "kg" | "unidad";
  cost: number | null;
  markup: number | null;
  price: number | null;
  // Precio de ½ kg guardado (el que ve hoy el cliente).
  priceHalf: number | null;
  sellsHalf: boolean;
  available: boolean;
}

// Aplica un valor editado como en la planilla: cualquier par define al tercero.
// - Costo: se mantiene el margen y se recalcula el precio; si no hay margen,
//   se deduce del precio actual.
// - Margen: se recalcula el precio.
// - Precio: si hay costo, se deduce el margen.
export const applyPriceChange = (
  row: PriceRow,
  field: PriceField,
  value: number | null
): PriceRow => {
  if (field === "cost") {
    if (value === null) return { ...row, cost: null, markup: null };
    if (row.markup !== null && isValidMarkup(row.markup)) {
      return { ...row, cost: value, price: priceFromCost(value, row.markup) };
    }
    if (row.price) return { ...row, cost: value, markup: markupFromPrice(value, row.price) };
    return { ...row, cost: value };
  }

  if (field === "markup") {
    // Sin costo el margen no tiene de dónde calcular el precio: se ignora.
    if (row.cost === null) return row;
    if (value !== null && isValidMarkup(value)) {
      return { ...row, markup: value, price: priceFromCost(row.cost, value) };
    }
    return { ...row, markup: value };
  }

  const price = value === null ? null : Math.round(value);
  if (price !== null && row.cost !== null) {
    return { ...row, price, markup: markupFromPrice(row.cost, price) };
  }
  return { ...row, price };
};

// Lee un valor escrito en una celda. El margen va como multiplicador (1,350);
// si alguien escribe el porcentaje (35), se convierte a 1,350.
export const parseCellValue = (field: PriceField, text: string) => {
  const value = parseSheetNumber(text);
  if (value === null) return null;
  if (field === "markup" && value > MAX_MARKUP && value <= 500) return 1 + value / 100;
  return value;
};

export const rowError = (row: PriceRow) => {
  if (row.cost !== null && row.cost <= 0) return "El costo tiene que ser mayor a 0";
  if (row.markup !== null && !isValidMarkup(row.markup)) return "Margen entre 1 y 10";
  if (!row.price || row.price <= 0) return "Falta el precio";
  return null;
};

export const halfPriceOf = (row: PriceRow, surcharge: number) =>
  row.unit === "kg" && row.sellsHalf && row.price ? halfKgPrice(row.price, surcharge) : null;

const sameNumber = (a: number | null, b: number | null) =>
  a === b || (a !== null && b !== null && Math.abs(a - b) < 1e-9);

export const isRowChanged = (row: PriceRow, original: PriceRow) =>
  !sameNumber(row.cost, original.cost) ||
  !sameNumber(row.markup, original.markup) ||
  !sameNumber(row.price, original.price) ||
  row.sellsHalf !== original.sellsHalf ||
  row.available !== original.available;

// Texto copiado de una planilla: filas separadas por salto de línea, columnas por tab.
export const parseClipboardTable = (text: string) => {
  const lines = text.replace(/\r/g, "").split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines.map((line) => line.split("\t"));
};

// ---- Importar desde la planilla (por nombre de producto) ----

type SheetColumn = "name" | "detail" | "cost" | "markup" | "price";

const headerPatterns: [RegExp, SheetColumn][] = [
  [/^producto/, "name"],
  [/^detalle/, "detail"],
  [/^costo/, "cost"],
  [/^margen/, "markup"],
  // "Precio 1 kg / unidad". El de ½ kg se calcula solo y se ignora (ver isHalfKgHeader).
  [/^precio-1-kg|^precio-unidad|^precio$/, "price"],
];

// "Precio ½ kg" pierde el "½" al normalizarse, así que se detecta antes.
const isHalfKgHeader = (header: string) => /½|1\/2|medio/i.test(header);

export interface SheetImportResult {
  rows: PriceRow[];
  matched: number;
  notFound: string[];
  ambiguous: string[];
  error?: string;
}

const findProduct = (rows: PriceRow[], name: string, detail: string) => {
  const candidates = rows.filter((row) => slugify(row.title) === slugify(name));
  if (candidates.length <= 1) return candidates;

  // Mismo nombre con distinto detalle (ej. Almohaditas “Lasfor”).
  const detailSlug = slugify(detail);
  if (!detailSlug) return candidates;
  return candidates.filter(
    (row) =>
      slugify(row.description) === detailSlug ||
      (row.variants.length > 0 && detailSlug.includes(slugify(row.variants[0])))
  );
};

export const importFromSheet = (rows: PriceRow[], text: string): SheetImportResult => {
  const table = parseClipboardTable(text);
  const headerIndex = table.findIndex((cells) =>
    cells.some((cell) => /^producto/.test(slugify(cell)))
  );
  if (headerIndex === -1) {
    return {
      rows,
      matched: 0,
      notFound: [],
      ambiguous: [],
      error: "No encontré la fila de títulos. Copiá la tabla incluyendo los encabezados (Productos, Costo, Margen…).",
    };
  }

  const columns = new Map<SheetColumn, number>();
  table[headerIndex].forEach((cell, index) => {
    if (isHalfKgHeader(cell)) return;
    const header = slugify(cell);
    const match = headerPatterns.find(([pattern]) => pattern.test(header));
    if (match && !columns.has(match[1])) columns.set(match[1], index);
  });
  if (!columns.has("cost") && !columns.has("markup") && !columns.has("price")) {
    return {
      rows,
      matched: 0,
      notFound: [],
      ambiguous: [],
      error: "No encontré columnas de Costo, Margen o Precio en lo que pegaste.",
    };
  }

  const read = (cells: string[], column: SheetColumn) => {
    const index = columns.get(column);
    return index === undefined ? "" : (cells[index] ?? "").trim();
  };

  let next = rows;
  let matched = 0;
  const notFound: string[] = [];
  const ambiguous: string[] = [];

  for (const cells of table.slice(headerIndex + 1)) {
    const name = read(cells, "name");
    const cost = parseCellValue("cost", read(cells, "cost"));
    const markup = parseCellValue("markup", read(cells, "markup"));
    const price = parseCellValue("price", read(cells, "price"));
    // Filas de categoría o vacías: sin números, se saltean.
    if (!name || (cost === null && markup === null && price === null)) continue;

    const found = findProduct(next, name, read(cells, "detail"));
    if (found.length === 0) {
      notFound.push(name);
      continue;
    }
    if (found.length > 1) {
      ambiguous.push(name);
      continue;
    }

    let row = found[0];
    if (cost !== null) row = applyPriceChange(row, "cost", cost);
    if (markup !== null) row = applyPriceChange(row, "markup", markup);
    // El precio de la planilla solo se usa si no hay costo y margen para calcularlo.
    if (price !== null && (row.cost === null || row.markup === null)) {
      row = applyPriceChange(row, "price", price);
    }

    const updated = row;
    next = next.map((r) => (r.id === updated.id ? updated : r));
    matched++;
  }

  return { rows: next, matched, notFound, ambiguous };
};
