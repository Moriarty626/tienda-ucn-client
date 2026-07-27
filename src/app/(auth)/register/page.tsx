"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { RegisterSchema, type RegisterFormData } from "@/domain/auth-schemas";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      toast.success("Cuenta creada. Revisa tu email para verificarla.");
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const responseData = (error as {
        response?: {
          data?: {
            message?: string;
            title?: string;
            errors?: Record<string, string[]>;
            detail?: string;
          };
        };
      })?.response?.data;

      const firstFieldError = responseData?.errors
        ? Object.values(responseData.errors)[0]?.[0]
        : undefined;

      const msg =
        (status === 409
          ? "Ya existe una cuenta con esos datos. Revisa tu email y completa la verificacion si ya te registraste antes."
          : undefined) ||
        responseData?.message ||
        responseData?.title ||
        responseData?.detail ||
        firstFieldError ||
        "Error al crear la cuenta.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
        <p className="text-slate-500 text-sm mt-1">
          Completa el formulario para registrarte
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            autoComplete="name"
            {...register("nombre")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>

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
            htmlFor="rut"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            RUT
          </label>
          <input
            id="rut"
            type="text"
            autoComplete="off"
            placeholder="12345678-9"
            {...register("rut")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.rut && (
            <p className="mt-1 text-xs text-red-600">{errors.rut.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Telefono
          </label>
          <input
            id="phoneNumber"
            type="tel"
            autoComplete="tel"
            placeholder="+569 12345678"
            {...register("phoneNumber")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Fecha de nacimiento
          </label>
          <input
            id="birthDate"
            type="date"
            autoComplete="bday"
            {...register("birthDate")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.birthDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Genero
          </label>
          <select
            id="gender"
            {...register("gender")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={isSubmitting}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona tu genero
            </option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
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
            autoComplete="new-password"
            {...register("password")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Confirmar contrasena
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <input
            id="terminos"
            type="checkbox"
            {...register("terminos")}
            className="mt-0.5"
            disabled={isSubmitting}
          />
          <label htmlFor="terminos" className="text-sm text-slate-600">
            Acepto los terminos y condiciones de uso
          </label>
        </div>
        {errors.terminos && (
          <p className="text-xs text-red-600">{errors.terminos.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500 text-center">
        Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
