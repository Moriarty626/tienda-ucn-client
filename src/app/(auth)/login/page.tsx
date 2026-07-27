"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { LoginSchema, type LoginFormData } from "@/domain/auth-schemas";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await authService.login(data.email, data.password);

    if (result?.error) {
      toast.error("Credenciales invalidas. Revisa tu email o contrasena.");
      return;
    }

    toast.success("Sesion iniciada correctamente.");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Contrasena
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
      >
        {isSubmitting ? "Iniciando sesion..." : "Iniciar sesion"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Iniciar sesion</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-48 animate-pulse bg-slate-100 rounded-md" />
        }
      >
        <LoginForm />
      </Suspense>

      <p className="mt-4 text-sm text-slate-500 text-center">
        No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Registrate
        </Link>
      </p>
    </div>
  );
}
