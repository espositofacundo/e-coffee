"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUser = async (email: string, password: string) => {
  const parsed = registerSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, message: "Revisá el email y la contraseña (mínimo 6 caracteres)" };
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        password: bcryptjs.hashSync(parsed.data.password),
      },
      select: {
        id: true,
        email: true,
      },
    });
    return { ok: true, user };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Ya existe una cuenta con ese email" };
    }
    console.log(error);
    return { ok: false, message: "No se pudo crear la cuenta" };
  }
};
