"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfileSchema, type EditProfileFormData } from "@/domain";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormElements";
import { Button } from "@/components/ui/button";

interface EditProfileFormProps {
  initialData?: Partial<EditProfileFormData>;
  onSubmit: (data: EditProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EditProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
}: EditProfileFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: initialData,
    mode: "onBlur",
  });

  const onFormSubmit = async (data: EditProfileFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await onSubmit(data);
      setSuccessMessage("Perfil actualizado exitosamente");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error al actualizar perfil"
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
        name="nombre"
        control={control}
        label="Nombre Completo"
        placeholder="Juan Perez"
        error={errors.nombre?.message}
        rules={{ required: "Nombre es requerido" }}
      />

      <FormInput
        name="telefono"
        control={control}
        label="Telefono"
        type="tel"
        placeholder="+56 9 1234 5678"
        error={errors.telefono?.message}
        description="Formato: +56 9 1234 5678 (opcional)"
      />

      <FormTextarea
        name="direccion"
        control={control}
        label="Direccion"
        placeholder="Calle 123, Apartamento 4B"
        error={errors.direccion?.message}
        description="Direccion fisica (opcional)"
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
