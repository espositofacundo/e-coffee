"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  freeZoneLabel: z.string().trim().min(3).max(200),
  freeShippingFrom: z.number().min(0),
  shippingCost: z.number().min(0),
});

export const saveShippingSettings = async (input: z.infer<typeof schema>) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return { ok: false, message: "No permitido" };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revisá la zona y los montos" };
  }

  try {
    await prisma.storeSetting.update({ where: { id: 1 }, data: parsed.data });
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo guardar" };
  }

  // Los montos se muestran en el catálogo, el carrito y el checkout.
  revalidatePath("/", "layout");
  return { ok: true };
};
