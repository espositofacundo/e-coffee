// Siempre en hora de Argentina, aunque el servidor esté en UTC.
const timeZone = "America/Argentina/Buenos_Aires";

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone,
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone });

export const formatDateTime = (date: Date) => dateTimeFormatter.format(date);

export const formatShortDateTime = (date: Date) => shortFormatter.format(date);

// "2026-09-21": sirve para comparar si dos fechas caen el mismo día.
export const dayKey = (date: Date) => dayFormatter.format(date);
