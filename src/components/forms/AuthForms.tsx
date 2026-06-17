"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  type ChangePasswordFormData,
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
  ResetPasswordSchema,
  type ResetPasswordFormData,
  VerifyEmailSchema,
  type VerifyEmailFormData,
} from "@/domain";
import { FormInput } from "./FormInput";
import { Button } from "@/components/ui/button";

// ============= CHANGE PASSWORD FORM =============

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ChangePasswordForm({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });

  const onFormSubmit = async (data: ChangePasswordFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await onSubmit(data);
      setSuccessMessage("Contrasena actualizada exitosamente");
      reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error al cambiar contrasena"
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
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <FormInput
        name="currentPassword"
        control={control}
        label="Contrasena Actual"
        type="password"
        placeholder="Ingresa tu contrasena actual"
        error={errors.currentPassword?.message}
        rules={{ required: "Contrasena actual es requerida" }}
      />

      <FormInput
        name="newPassword"
        control={control}
        label="Nueva Contrasena"
        type="password"
        placeholder="Ingresa la nueva contrasena"
        error={errors.newPassword?.message}
        rules={{ required: "Nueva contrasena es requerida" }}
      />

      <FormInput
        name="confirmPassword"
        control={control}
        label="Confirmar Nueva Contrasena"
        type="password"
        placeholder="Confirma la nueva contrasena"
        error={errors.confirmPassword?.message}
        rules={{ required: "Confirmar contrasena es requerido" }}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Actualizando..." : "Cambiar Contrasena"}
      </Button>
    </form>
  );
}

// ============= FORGOT PASSWORD FORM =============

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onBlur",
  });

  const onFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setErrorMessage("");
      await onSubmit(data);
      setSuccessMessage("Se envio un enlace de recuperacion a tu email");
      reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error en la recuperacion"
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
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
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
        description="Ingresa el email de tu cuenta para recibir instrucciones de recuperacion"
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Enviando..." : "Enviar Enlace de Recuperacion"}
      </Button>
    </form>
  );
}

// ============= RESET PASSWORD FORM =============

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ResetPasswordForm({
  token,
  onSubmit,
  isLoading = false,
}: ResetPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token },
    mode: "onBlur",
  });

  const onFormSubmit = async (data: ResetPasswordFormData) => {
    try {
      setErrorMessage("");
      await onSubmit(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error al restaurar contrasena"
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
        name="newPassword"
        control={control}
        label="Nueva Contrasena"
        type="password"
        placeholder="Ingresa la nueva contrasena"
        error={errors.newPassword?.message}
        rules={{ required: "Nueva contrasena es requerida" }}
      />

      <FormInput
        name="confirmPassword"
        control={control}
        label="Confirmar Nueva Contrasena"
        type="password"
        placeholder="Confirma la nueva contrasena"
        error={errors.confirmPassword?.message}
        rules={{ required: "Confirmar contrasena es requerido" }}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Actualizando..." : "Restaurar Contrasena"}
      </Button>
    </form>
  );
}

// ============= VERIFY EMAIL FORM =============

interface VerifyEmailFormProps {
  email: string;
  onSubmit: (data: VerifyEmailFormData) => Promise<void>;
  isLoading?: boolean;
  onResendCode?: () => Promise<void>;
}

export function VerifyEmailForm({
  email,
  onSubmit,
  isLoading = false,
  onResendCode,
}: VerifyEmailFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: { email },
    mode: "onBlur",
  });

  const onFormSubmit = async (data: VerifyEmailFormData) => {
    try {
      setErrorMessage("");
      await onSubmit(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error al verificar email"
      );
    }
  };

  const handleResendCode = async () => {
    if (onResendCode) {
      try {
        setResendLoading(true);
        await onResendCode();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Error al reenviar codigo"
        );
      } finally {
        setResendLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
        Se envio un codigo de 6 digitos a {email}
      </div>

      <FormInput
        name="code"
        control={control}
        label="Codigo de Verificacion"
        placeholder="000000"
        error={errors.code?.message}
        rules={{ required: "Codigo es requerido" }}
        description="Ingresa los 6 digitos que recibiste"
      />

      <FormInput
        name="email"
        control={control}
        type="hidden"
        rules={{ required: false }}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Verificando..." : "Verificar Email"}
      </Button>

      {onResendCode && (
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={resendLoading}
          variant="outline"
          className="w-full"
        >
          {resendLoading ? "Reenviando..." : "Reenviar Codigo"}
        </Button>
      )}
    </form>
  );
}
