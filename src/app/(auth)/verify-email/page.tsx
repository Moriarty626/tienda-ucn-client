"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { VerifyEmailForm } from "@/components/forms";
import { authService } from "@/services/authService";
import type { VerifyEmailFormData } from "@/domain/auth-schemas";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const handleSubmit = async (data: VerifyEmailFormData) => {
    try {
      await authService.verifyEmail(data);
      toast.success("Correo verificado correctamente. Ya puedes iniciar sesion.");
      router.push("/login");
    } catch (error: unknown) {
      const responseData = (error as {
        response?: {
          data?: {
            message?: string;
            title?: string;
            detail?: string;
            errors?: Record<string, string[]>;
          };
        };
      })?.response?.data;

      const firstFieldError = responseData?.errors
        ? Object.values(responseData.errors)[0]?.[0]
        : undefined;

      const msg =
        responseData?.message ||
        responseData?.title ||
        responseData?.detail ||
        firstFieldError ||
        "Error al verificar el correo.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Verificar correo</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ingresa el codigo de 6 digitos que enviamos a tu correo.
        </p>
      </div>

      {email ? (
        <VerifyEmailForm
          email={email}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm">
            No recibimos el correo en la URL. Vuelve al registro para continuar.
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Ir a registro
          </Link>
        </div>
      )}

      <p className="mt-4 text-sm text-slate-500 text-center">
        Ya verificaste tu cuenta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<div className="h-48 animate-pulse bg-slate-100 rounded-md" />}
    >
      <VerifyEmailContent />
    </Suspense>
  );
}