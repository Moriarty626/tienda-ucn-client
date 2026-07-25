import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/domain/auth-schemas";
import { API_ROUTES } from "@/clients/apiRoutes";
import axios from "axios";

interface BackendLoginResponse {
  token: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const res = await axios.post<BackendLoginResponse>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.auth.login}`,
            { email: parsed.data.email, password: parsed.data.password }
          );

          const token = res.data?.token;
          if (!token) return null;

          return {
            id: parsed.data.email,
            name: parsed.data.email,
            email: parsed.data.email,
            rol: "Customer",
            token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.rol = (user as { rol: string }).rol;
        token.backendToken = (user as { token: string }).token;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as { rol?: string }).rol = token.rol as string;
      (session as { backendToken?: string }).backendToken =
        token.backendToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
