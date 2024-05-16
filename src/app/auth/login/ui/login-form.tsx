"use client";

import Link from "next/link";

import React, { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth/login";
import { IoInformationOutline } from "react-icons/io5";
import clsx from "clsx";


const LoginForm = () => {
 
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (state === "Success") {
  
      window.location.replace('/')


    }
  }, [state]);

  return (
    <form action={dispatch}>
      <h1 className="text-4xl mb-10">Ingresar</h1>

      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          className="px-5 py-2 border bg-blue-200 rounded mb-5"
          type="email"
          name="email"
          defaultValue={'modoinvitado@ecoffee.com'}
     
        />

        <label htmlFor="email">Contraseña</label>
        <input
          className="px-5 py-2 border bg-blue-200 rounded mb-5"
          type="password"
          name="password"
          defaultValue={'123123'}

        />

        <div
          className="flex h-2 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state === "CredentialsSignin" && (
            <>
              <IoInformationOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">Credencial invalida</p>
            </>
          )}
        </div>

        

        <LoginButton />

        <span className="text-xs text-gray-500">Puedes utilizar nuestra cuenta de invitado sino deseas hacer el registro. En caso de quieras poder ver tus ordenes y aprovechar de nuestro sistema de puntos clickea en Crear nueva cuenta. </span>

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        

        <Link href="/auth/new-account" className="btn-success text-center mb-12 ">
          Crear una nueva cuenta
        </Link>

 
      </div>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx({
        "btn-primary": !pending,
        "btn-disabled": pending,
      })}
      disabled={pending}
    >
      Ingresar
    </button>
  );
}

export default LoginForm;
