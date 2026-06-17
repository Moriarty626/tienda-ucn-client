"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterFormData } from "@/domain";
import { FormInput } from "./FormInput";
import { FormCheckbox } from "./FormElements";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
  });

  const getPasswordRequirement = useCallback(
    (pattern: RegExp, label: string) => {
      const isValid = pattern.test(password || "");
      return (
        <li
          key={label}
          className={`text-xs ${isValid ? "text-green-600" : "text-slate-500"}`}
        >
          {isValid ? "✓" : "○"} {label}
        </li>
      );
    },
    [password]
  );

  const onFormSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage("");
      await onSubmit(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error en el registro"
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
        name="nombre"
        control={control}
        label="Nombre Completo"
        placeholder="Juan Perez"
        error={errors.nombre?.message}
        rules={{ required: "Nombre es requerido" }}
      />

      <FormInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        rules={{ required: "Email es requerido" }}
      />

      <div>
        <FormInput
          name="password"
          control={control}
          label="Contrasena"
          type="password"
          placeholder="Crea una contrasena segura"
          error={errors.password?.message}
          rules={{ required: "Contrasena es requerida" }}
          onFocus={() => setShowPasswordRequirements(true)}
          onBlur={() => setShowPasswordRequirements(false)}
          onChange={(e) => setPassword(e.target.value)}
        />

        {(showPasswordRequirements || password) && (
          <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Requisitos de contrasena:
            </p>
            <ul className="space-y-1">
              {getPasswordRequirement(/.{8,}/, "Al menos 8 caracteres")}
              {getPasswordRequirement(/[A-Z]/, "Al menos 1 mayuscula")}
              {getPasswordRequirement(/[a-z]/, "Al menos 1 minuscula")}
              {getPasswordRequirement(/[0-9]/, "Al menos 1 numero")}
              {getPasswordRequirement(
                /[!@#$%^&*]/,
                "Al menos 1 caracter especial"
              )}
            </ul>
          </div>
        )}
      </div>

      <FormInput
        name="confirmPassword"
        control={control}
        label="Confirmar Contrasena"
        type="password"
        placeholder="Confirma tu contrasena"
        error={errors.confirmPassword?.message}
        rules={{ required: "Confirmar contrasena es requerido" }}
      />

      <FormCheckbox
        name="terminos"
        control={control}
        labelText="Acepto los terminos y condiciones"
        error={errors.terminos?.message}
        rules={{ required: "Debes aceptar los terminos" }}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Registrando..." : "Crear Cuenta"}
      </Button>
    </form>
  );
}
