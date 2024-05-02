"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async (email: string, password: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        email: true,
      },
    });
    return {
      ok: true,
      user: user,
    };
  } catch (error) {
    
    return {
      ok: false,
      message: "No se pudo crear el usuario",
    };
  }
};
