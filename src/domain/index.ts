// Exportar todos los esquemas de autenticacion
export {
  LoginSchema,
  RegisterSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  EditProfileSchema,
  VerifyEmailSchema,
  type LoginFormData,
  type RegisterFormData,
  type ChangePasswordFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type EditProfileFormData,
  type VerifyEmailFormData,
} from "./auth-schemas";

// Exportar esquemas de usuario y respuestas
export {
  UserSchema,
  LoginResponseSchema,
  RegisterResponseSchema,
  VerifyEmailResponseSchema,
  ActionResponseSchema,
  ErrorResponseSchema,
  type User,
  type LoginResponse,
  type RegisterResponse,
  type VerifyEmailResponse,
  type ActionResponse,
  type ErrorResponse,
} from "./User";
