import { signIn, signOut } from "next-auth/react";
import { axiosClient } from "@/clients";
import type { RegisterFormData } from "@/domain/auth-schemas";

type RegisterPayload = Omit<RegisterFormData, "confirmPassword" | "terminos">;

export const authService = {
  login: async (email: string, password: string) => {
    return signIn("credentials", { email, password, redirect: false });
  },

  register: async (data: RegisterPayload) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    return signOut({ callbackUrl: "/" });
  },
};
