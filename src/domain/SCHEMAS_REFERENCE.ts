// Referencia de Esquemas de Autenticacion

/***
 * ESQUEMAS DE FORMULARIOS
 * =======================
 *
 * 1. LoginSchema
 *    - email: string (formato email)
 *    - password: string (minimo 6 caracteres)
 *
 * 2. RegisterSchema
 *    - nombre: string (2-100 caracteres, solo letras y espacios)
 *    - email: string (formato email, convertido a minusculas)
 *    - password: string (minimo 8 caracteres, debe incluir mayuscula, minuscula, numero, especial)
 *    - confirmPassword: string (debe coincidir con password)
 *    - terminos: boolean (debe ser true)
 *
 * 3. ChangePasswordSchema
 *    - currentPassword: string (obligatorio)
 *    - newPassword: string (minimo 8 caracteres, mayor complejidad)
 *    - confirmPassword: string (debe coincidir)
 *    - Validacion: newPassword != currentPassword
 *
 * 4. ForgotPasswordSchema
 *    - email: string (formato email)
 *
 * 5. ResetPasswordSchema
 *    - token: string (token de recuperacion)
 *    - newPassword: string (minimo 8 caracteres)
 *    - confirmPassword: string (debe coincidir)
 *
 * 6. EditProfileSchema
 *    - nombre: string (2-100 caracteres)
 *    - telefono: string (opcional, solo digitos y caracteres especiales)
 *    - direccion: string (opcional, maximo 255 caracteres)
 *
 * 7. VerifyEmailSchema
 *    - email: string (formato email)
 *    - code: string (exactamente 6 digitos numericos)
 *
 *
 * ESQUEMAS DE RESPUESTA
 * ====================
 *
 * 1. UserSchema
 *    - id: string | number
 *    - nombre: string
 *    - email: string
 *    - rol: "usuario" | "admin"
 *    - emailVerificado: boolean
 *    - createdAt: ISO datetime (opcional)
 *    - updatedAt: ISO datetime (opcional)
 *
 * 2. LoginResponseSchema
 *    - success: boolean
 *    - message: string
 *    - token: string (JWT)
 *    - refreshToken: string (opcional)
 *    - usuario: User
 *
 * 3. RegisterResponseSchema
 *    - success: boolean
 *    - message: string
 *    - usuario: { id, email, nombre }
 *
 * 4. VerifyEmailResponseSchema
 *    - success: boolean
 *    - message: string
 *    - usuario: User (opcional)
 *    - token: string (opcional)
 *
 * 5. ActionResponseSchema
 *    - success: boolean
 *    - message: string
 *
 * 6. ErrorResponseSchema
 *    - success: false
 *    - message: string
 *    - errors: Array<{ field, message }> (opcional)
 *
 *
 * FUNCIONES DE VALIDACION
 * =======================
 *
 * 1. validateData<T>(schema, data): ValidationResult<T>
 *    Valida datos usando un esquema Zod
 *    Retorna { success: boolean, data?: T, errors?: ValidationError[] }
 *
 * 2. zodErrorsToDictionary(error): Record<string, string>
 *    Convierte ZodError a objeto campo => mensaje
 *
 * 3. getFieldError(error, fieldPath): string | null
 *    Obtiene el primer error de un campo especifico
 *
 * 4. formatValidationErrors(error): Record<string, string>
 *    Formatea errores para usar en componentes de formulario
 *
 *
 * EJEMPLO DE USO
 * ==============
 *
 * import { LoginSchema, validateData } from "@/domain";
 * import { formatValidationErrors } from "@/lib/validation";
 *
 * const formData = { email: "user@example.com", password: "123456" };
 *
 * // Opcion 1: Con funcion helper
 * const result = validateData(LoginSchema, formData);
 * if (!result.success) {
 *   console.log(result.errors);
 * }
 *
 * // Opcion 2: Direct parse
 * try {
 *   const validatedData = LoginSchema.parse(formData);
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     const formatted = formatValidationErrors(error);
 *     // formatted = { "email": "Email invalido" }
 *   }
 * }
 */
