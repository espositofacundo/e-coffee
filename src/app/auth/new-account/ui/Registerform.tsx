"use client";

import { login } from "@/actions/auth/login";
import { registerUser } from "@/actions/auth/register";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  email: string;
  password: string;
};

const Registerform = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");
    const { email, password } = data;
    const resp = await registerUser(email, password);
    if (!resp.ok) {
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace("/checkout/address");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      {errors.email?.type === "required" && (
        <span className="text-red-500">El campo es requerido</span>
      )}
      <input
        className="px-5 py-2 border bg-blue-200 rounded mb-5"
        type="email"
        {...register("email", { required: true })}
        autoFocus
      />

      <label htmlFor="email">Contraseña</label>

      {errors.password?.type === "pattern" && (
        <span className="text-red-500">Debe tener al menos 6 digitos</span>
      )}
      {errors.password?.type === "required" && (
        <span className="text-red-500">El campo es requerido</span>
      )}

      <input
        className="px-5 py-2 border bg-blue-200 rounded mb-5"
        type="password"
        {...register("password", { required: true, pattern: /^.{6,}$/ })}
      />

      <button className="btn-primary">Registrate</button>
    </form>
  );
};

export default Registerform;
