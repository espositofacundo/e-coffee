"use server";

import prisma from "@/lib/prisma";

// La configuración es una sola fila; si todavía no existe se crea con los valores por defecto.
export const getStoreSettings = async () =>
  prisma.storeSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
