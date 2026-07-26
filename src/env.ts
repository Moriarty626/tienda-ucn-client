import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url("API base URL debe ser una URL valida"),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce
    .number()
    .int()
    .positive("API timeout debe ser un numero positivo"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET es requerido").optional(),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET es requerido").optional(),
});

const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
});

export default env;
