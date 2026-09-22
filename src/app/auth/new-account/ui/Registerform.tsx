"use client";

import { login } from "@/actions/auth/login";
import { registerUser } from "@/actions/auth/register";
import { titleFont } from "@/config/fonts";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  email: string;
  password: string;
};

interface Props {
  redirectTo: string;
}

const Registerform = ({ redirectTo }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async ({ email, password }) => {
    setErrorMessage("");
    const resp = await registerUser(email, password);
    if (!resp.ok) {
      setErrorMessage(resp.message ?? "No se pudo crear la cuenta");
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace(redirectTo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
      <h1 className={`${titleFont.className} text-3xl font-bold text-brand-green`}>
        Crear cuenta
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Con tu cuenta hacés pedidos y seguís su estado.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            autoFocus
            {...register("email", { required: true })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">Ingresá tu email</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="new-password"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">Mínimo 6 caracteres</p>
          )}
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx("w-full", isSubmitting ? "btn-disabled" : "btn-primary")}
        >
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </div>

      <p className="mt-5 text-center text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link
          href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-semibold underline"
        >
          Ingresá
        </Link>
      </p>
    </form>
  );
};

export default Registerform;
