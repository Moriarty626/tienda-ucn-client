"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginFormData } from "@/domain";
import { FormInput } from "./FormInput";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const onFormSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage("");
      await onSubmit(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error en el login"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <FormInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        rules={{ required: "Email es requerido" }}
      />

      <FormInput
        name="password"
        control={control}
        label="Contrasena"
        type="password"
        placeholder="Ingresa tu contrasena"
        error={errors.password?.message}
        rules={{ required: "Contrasena es requerida" }}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Cargando..." : "Iniciar Sesion"}
      </Button>
    </form>
  );
}
