// Fórmulas de precios, las mismas de la planilla de Timón & Pumba:
//   precio (kg o unidad) = costo × margen   (margen = multiplicador, 1,35 = 35 %)
//   precio ½ kg          = precio × (0,5 + recargo)   (recargo 3,7 % → × 0,537)
// Se usan en la pantalla de precios y en el servidor, que es el que decide.

export const DEFAULT_HALF_KG_SURCHARGE = 3.7;

// Márgenes aceptados: por debajo de 1 se vendería a pérdida.
export const MIN_MARKUP = 1;
export const MAX_MARKUP = 10;

export const priceFromCost = (cost: number, markup: number) =>
  Math.round(cost * markup);

export const markupFromPrice = (cost: number, price: number) => price / cost;

export const halfKgPrice = (price: number, surcharge: number) =>
  Math.round(price * (0.5 + surcharge / 100));

export const isValidMarkup = (markup: number) =>
  Number.isFinite(markup) && markup >= MIN_MARKUP && markup <= MAX_MARKUP;

// Lee números escritos o copiados de la planilla: "$12.711", "1,350", "17160".
// Coma = decimal; punto seguido de grupos de 3 dígitos = separador de miles.
export const parseSheetNumber = (text: string): number | null => {
  let value = text.replace(/[$\s %]/g, "");
  if (!value) return null;

  if (value.includes(",")) {
    value = value.replace(/\./g, "").replace(",", ".");
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(value)) {
    value = value.replace(/\./g, "");
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const markupFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const decimalFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 2,
});

// 1.35 → "1,350"
export const formatMarkup = (markup: number) => markupFormatter.format(markup);

// 12711 → "12.711", 12711.5 → "12.711,5"
export const formatSheetNumber = (value: number) => decimalFormatter.format(value);
