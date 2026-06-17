import { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Valida datos usando un esquema Zod y retorna errores formateados
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: [
        {
          field: "general",
          message: "Error desconocido en la validacion",
        },
      ],
    };
  }
}

/**
 * Convierte errores de Zod a un objeto de campo => mensaje
 */
export function zodErrorsToDictionary(
  error: z.ZodError
): Record<string, string> {
  const dictionary: Record<string, string> = {};

  error.issues.forEach((err) => {
    const field = err.path.join(".");
    dictionary[field] = err.message;
  });

  return dictionary;
}

/**
 * Obtiene el primer error de un campo especifico
 */
export function getFieldError(
  error: z.ZodError,
  fieldPath: string
): string | null {
  const fieldErrors = error.issues.filter(
    (err) => err.path.join(".") === fieldPath
  );
  return fieldErrors.length > 0 ? fieldErrors[0].message : null;
}

/**
 * Valida y formatea para componentes de formulario
 */
export function formatValidationErrors(
  error: z.ZodError
): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err) => {
    const fieldName = err.path.join(".");
    if (!formatted[fieldName]) {
      formatted[fieldName] = err.message;
    }
  });

  return formatted;
}
