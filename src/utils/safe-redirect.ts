// Solo se permite volver a rutas internas (evita redirecciones a otros sitios).
export const safeRedirect = (path: string | undefined, fallback = "/") =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
