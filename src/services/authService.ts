import { signIn, signOut } from "next-auth/react";
import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import type { RegisterFormData, VerifyEmailFormData } from "@/domain/auth-schemas";

type RegisterPayload = Omit<RegisterFormData, "terminos">;

interface BackendRegisterPayload {
  name: string;
  email: string;
  rut: string;
  phoneNumber: string;
  birthDate: string;
  gender: "Masculino" | "Femenino" | "Otro";
  password: string;
  confirmPassword: string;
}

interface BackendVerifyEmailPayload {
  email: string;
  verificationCode: string;
}

/**
 * Servicio de autenticacion que encapsula todas las operaciones de auth
 * Integra NextAuth para manejo de sesiones y Axios para comunicacion con API
 */
export const authService = {
  /**
   * Login: Valida credenciales con el backend usando NextAuth
   * Almacena el token JWT en la sesion
   */
  login: async (email: string, password: string) => {
    return signIn("credentials", { email, password, redirect: false });
  },

  /**
   * Register: Crea nueva cuenta de usuario
   * Transforma datos del formulario al formato del backend
   * Requiere verificacion de email antes de poder loguear
   */
  register: async (data: RegisterPayload) => {
    const payload: BackendRegisterPayload = {
      name: data.nombre,
      email: data.email,
      rut: data.rut,
      phoneNumber: data.phoneNumber,
      birthDate: data.birthDate,
      gender: data.gender,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      const response = await axiosClient.post(API_ROUTES.auth.register, payload);
      return response.data;
    } catch (error) {
      // Re-throw para que el componente maneje el error
      throw error;
    }
  },

  /**
   * VerifyEmail: Verifica el email del usuario con codigo enviado
   * Requerido despues del registro para activar la cuenta
   */
  verifyEmail: async (data: VerifyEmailFormData) => {
    const payload: BackendVerifyEmailPayload = {
      email: data.email,
      verificationCode: data.code,
    };

    try {
      const response = await axiosClient.post(
        API_ROUTES.auth.emailVerification,
        payload
      );
      return response.data;
    } catch (error) {
      // Re-throw para que el componente maneje el error
      throw error;
    }
  },

  /**
   * Logout: Cierra la sesion del usuario
   * Limpia el token y redirige al home
   */
  logout: async () => {
    return signOut({ callbackUrl: "/" });
  },
};
