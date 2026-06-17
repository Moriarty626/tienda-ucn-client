import { z } from "zod";

// Esquema para Usuario
export const UserSchema = z.object({
  id: z.string().or(z.number()),
  nombre: z.string(),
  email: z.string().email(),
  rol: z.enum(["usuario", "admin"]).default("usuario"),
  emailVerificado: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Esquema para respuesta de login
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string(),
  refreshToken: z.string().optional(),
  usuario: UserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Esquema para respuesta de registro
export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  usuario: UserSchema.pick({ id: true, email: true, nombre: true }),
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// Esquema para respuesta de verificacion de email
export const VerifyEmailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  usuario: UserSchema.optional(),
  token: z.string().optional(),
});

export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// Esquema para respuesta general de acciones
export const ActionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ActionResponse = z.infer<typeof ActionResponseSchema>;

// Esquema para error de respuesta
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
