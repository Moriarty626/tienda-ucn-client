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

export const authService = {
  login: async (email: string, password: string) => {
    return signIn("credentials", { email, password, redirect: false });
  },

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

    const response = await axiosClient.post(API_ROUTES.auth.register, payload);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailFormData) => {
    const payload: BackendVerifyEmailPayload = {
      email: data.email,
      verificationCode: data.code,
    };

    const response = await axiosClient.post(
      API_ROUTES.auth.emailVerification,
      payload
    );
    return response.data;
  },

  logout: async () => {
    return signOut({ callbackUrl: "/" });
  },
};
