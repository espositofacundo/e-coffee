"use client";

import { authenticate } from "@/actions/auth/login";
import { titleFont } from "@/config/fonts";
import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IoInformationCircleOutline } from "react-icons/io5";

interface Props {
  redirectTo: string;
}

const LoginForm = ({ redirectTo }: Props) => {
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (state === "Success") {
      window.location.replace(redirectTo);
    }
  }, [state, redirectTo]);

  return (
    <form action={dispatch} className="card p-6">
      <h1 className={`${titleFont.className} text-3xl font-bold text-brand-green`}>
        Ingresar
      </h1>
      {redirectTo.startsWith("/checkout") && (
        <p className="mt-1 text-sm text-gray-600">
          Ingresá o creá tu cuenta para confirmar el pedido.
        </p>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" className="input" type="email" name="email" autoComplete="email" required />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <input
            id="password"
            className="input"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>

        {(state === "CredentialsSignin" || state === "UnknownError") && (
          <p className="flex items-center gap-1 text-sm text-red-600" aria-live="polite">
            <IoInformationCircleOutline size={18} />
            {state === "CredentialsSignin"
              ? "Email o contraseña incorrectos"
              : "No se pudo ingresar, probá de nuevo"}
          </p>
        )}

        <LoginButton />
      </div>

      <div className="flex items-center my-5 text-sm text-gray-500">
        <div className="flex-1 border-t border-brand-cream-dark" />
        <span className="px-2">¿Primera vez?</span>
        <div className="flex-1 border-t border-brand-cream-dark" />
      </div>

      <Link
        href={`/auth/new-account?redirectTo=${encodeURIComponent(redirectTo)}`}
        className="btn-secondary w-full"
      >
        Crear una cuenta
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx("w-full", pending ? "btn-disabled" : "btn-primary")}
      disabled={pending}
    >
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export default LoginForm;
