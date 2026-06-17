import { z } from "zod";

// Esquema para Login
export const LoginSchema = z.object({
  email: z
    .string("Email es requerido")
    .min(1, "Email es requerido")
    .email("Email invalido"),
  password: z
    .string("Contrasena es requerida")
    .min(1, "Contrasena es requerida")
    .min(6, "Contrasena debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// Esquema para Registro
export const RegisterSchema = z
  .object({
    nombre: z
      .string("Nombre es requerido")
      .min(1, "Nombre es requerido")
      .min(2, "Nombre debe tener al menos 2 caracteres")
      .max(100, "Nombre no puede exceder 100 caracteres")
      .regex(
        /^[a-zA-Z\s\u00E1\u00E9\u00ED\u00F3\u00FA\u00C1\u00C9\u00CD\u00D3\u00DA\u00F1\u00D1]+$/,
        "Nombre solo puede contener letras y espacios"
      ),
    email: z
      .string("Email es requerido")
      .min(1, "Email es requerido")
      .email("Email invalido")
      .toLowerCase(),
    password: z
      .string("Contrasena es requerida")
      .min(1, "Contrasena es requerida")
      .min(8, "Contrasena debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Contrasena debe contener al menos una mayuscula")
      .regex(/[a-z]/, "Contrasena debe contener al menos una minuscula")
      .regex(/[0-9]/, "Contrasena debe contener al menos un numero")
      .regex(
        /[!@#$%^&*]/,
        "Contrasena debe contener al menos un caracter especial (!@#$%^&*)"
      ),
    confirmPassword: z.string("Confirmar contrasena es requerido"),
    terminos: z
      .boolean("Debe aceptar los terminos y condiciones")
      .refine((val) => val === true, "Debe aceptar los terminos y condiciones"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

// Esquema para cambio de contrasena
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string("Contrasena actual es requerida")
      .min(1, "Contrasena actual es requerida"),
    newPassword: z
      .string("Nueva contrasena es requerida")
      .min(8, "Contrasena debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Contrasena debe contener al menos una mayuscula")
      .regex(/[a-z]/, "Contrasena debe contener al menos una minuscula")
      .regex(/[0-9]/, "Contrasena debe contener al menos un numero")
      .regex(
        /[!@#$%^&*]/,
        "Contrasena debe contener al menos un caracter especial (!@#$%^&*)"
      ),
    confirmPassword: z.string("Confirmar contrasena es requerido"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contrasena no puede ser igual a la actual",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

// Esquema para recuperacion de contrasena
export const ForgotPasswordSchema = z.object({
  email: z
    .string("Email es requerido")
    .min(1, "Email es requerido")
    .email("Email invalido")
    .toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// Esquema para verificacion de token y nueva contrasena
export const ResetPasswordSchema = z
  .object({
    token: z.string("Token es requerido").min(1, "Token es requerido"),
    newPassword: z
      .string("Nueva contrasena es requerida")
      .min(8, "Contrasena debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Contrasena debe contener al menos una mayuscula")
      .regex(/[a-z]/, "Contrasena debe contener al menos una minuscula")
      .regex(/[0-9]/, "Contrasena debe contener al menos un numero")
      .regex(
        /[!@#$%^&*]/,
        "Contrasena debe contener al menos un caracter especial (!@#$%^&*)"
      ),
    confirmPassword: z.string("Confirmar contrasena es requerido"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

// Esquema para editar perfil
export const EditProfileSchema = z.object({
  nombre: z
    .string("Nombre es requerido")
    .min(1, "Nombre es requerido")
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-Z\s\u00E1\u00E9\u00ED\u00F3\u00FA\u00C1\u00C9\u00CD\u00D3\u00DA\u00F1\u00D1]+$/,
      "Nombre solo puede contener letras y espacios"
    ),
  telefono: z
    .string("Telefono es requerido")
    .min(1, "Telefono es requerido")
    .regex(/^[\d\s\-\+]+$/, "Telefono invalido")
    .optional()
    .or(z.literal("")),
  direccion: z
    .string("Direccion es requerida")
    .min(1, "Direccion es requerida")
    .max(255, "Direccion no puede exceder 255 caracteres")
    .optional()
    .or(z.literal("")),
});

export type EditProfileFormData = z.infer<typeof EditProfileSchema>;

// Esquema para verificacion de email
export const VerifyEmailSchema = z.object({
  email: z
    .string("Email es requerido")
    .min(1, "Email es requerido")
    .email("Email invalido"),
  code: z
    .string("Codigo es requerido")
    .min(1, "Codigo es requerido")
    .length(6, "Codigo debe tener 6 digitos")
    .regex(/^\d+$/, "Codigo debe contener solo numeros"),
});

export type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;
