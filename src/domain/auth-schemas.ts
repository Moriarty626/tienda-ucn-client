import { z } from "zod";

const normalizeRut = (rut: string) => rut.replace(/\./g, "").toUpperCase();

const isValidRut = (rut: string) => {
  const normalizedRut = normalizeRut(rut);

  if (!/^\d{7,8}-[0-9K]$/.test(normalizedRut)) {
    return false;
  }

  const [body, verifier] = normalizedRut.split("-");
  const rutNumber = Number.parseInt(body, 10);

  if (!Number.isFinite(rutNumber)) {
    return false;
  }

  let multiplierIndex = 0;
  let sum = 1;

  for (let current = rutNumber; current !== 0; current = Math.floor(current / 10)) {
    sum = (sum + (current % 10) * (9 - (multiplierIndex++ % 6))) % 11;
  }

  const expectedVerifier = String.fromCharCode(sum !== 0 ? sum + 47 : 75);
  return expectedVerifier === verifier;
};

const isAdult = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);

  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

// Esquema para Login
export const LoginSchema = z.object({
  email: z
    .string("Email es requerido")
    .min(1, "Email es requerido")
    .email("Email invalido"),
  password: z
    .string("Contraseña es requerida")
    .min(1, "Contraseña es requerida")
    .min(6, "Contraseña debe tener al menos 6 caracteres"),
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
    rut: z
      .string("RUT es requerido")
      .min(1, "RUT es requerido")
      .regex(/^\d{7,8}-[0-9kK]$/, "RUT debe tener formato XXXXXXXX-X")
      .refine(isValidRut, "El RUT no es válido"),
    phoneNumber: z
      .string("Telefono es requerido")
      .min(1, "Telefono es requerido")
      .regex(/^\+569\s\d{8}$/, "Telefono debe tener formato +569 XXXXXXXX"),
    birthDate: z
      .string("Fecha de nacimiento es requerida")
      .min(1, "Fecha de nacimiento es requerida")
      .refine(isAdult, "Debes ser mayor de 18 años para registrarte"),
    gender: z.enum(["Masculino", "Femenino", "Otro"], {
      error: "Genero es requerido",
    }),
    password: z
      .string("Contraseña es requerida")
      .min(1, "Contraseña es requerida")
      .min(8, "Contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Contraseña debe contener al menos una mayuscula")
      .regex(/[a-z]/, "Contraseña debe contener al menos una minuscula")
      .regex(/[0-9]/, "Contraseña debe contener al menos un numero")
      .regex(
        /[!@#$%^&*]/,
        "Contraseña debe contener al menos un caracter especial (!@#$%^&*)"
      ),
    confirmPassword: z.string("Confirmar contraseña es requerido"),
    terminos: z
      .boolean("Debe aceptar los terminos y condiciones")
      .refine((val) => val === true, "Debe aceptar los terminos y condiciones"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

// Esquema para cambio de contraseña
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string("Contraseña actual es requerida")
      .min(1, "Contraseña actual es requerida"),
    newPassword: z
      .string("Nueva contraseña es requerida")
      .min(8, "Contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Contraseña debe contener al menos una mayuscula")
      .regex(/[a-z]/, "Contraseña debe contener al menos una minuscula")
      .regex(/[0-9]/, "Contraseña debe contener al menos un numero")
      .regex(
        /[!@#$%^&*]/,
        "Contraseña debe contener al menos un caracter especial (!@#$%^&*)"
      ),
    confirmPassword: z.string("Confirmar contraseña es requerido"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña no puede ser igual a la actual",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

// Esquema para recuperacion de contraseña
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
      .string("Nueva contraseña es requerida")
      .min(8, "Contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Contraseña debe contener al menos una mayuscula")
      .regex(/[a-z]/, "Contraseña debe contener al menos una minuscula")
      .regex(/[0-9]/, "Contraseña debe contener al menos un numero")
      .regex(
        /[!@#$%^&*]/,
        "Contraseña debe contener al menos un caracter especial (!@#$%^&*)"
      ),
    confirmPassword: z.string("Confirmar contraseña es requerido"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
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
