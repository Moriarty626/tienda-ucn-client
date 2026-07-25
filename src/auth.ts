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

          let userName = parsed.data.email;
          let userRole = "Customer";

          try {
            const payloadBase64 = token.split(".")[1];
            if (payloadBase64) {
              const base64 = payloadBase64
                .replace(/-/g, "+")
                .replace(/_/g, "/");
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split("")
                  .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                  )
                  .join("")
              );
              const decoded = JSON.parse(jsonPayload);
              const extractedName =
                decoded.name ||
                decoded.unique_name ||
                decoded[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ];
              if (extractedName) {
                userName = extractedName;
              }
              const extractedRole =
                decoded.role ||
                decoded[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];
              if (extractedRole) {
                userRole = extractedRole;
              }
            }
          } catch {
            // Fallback en caso de error de decodificación
          }

          return {
            id: parsed.data.email,
            name: userName,
            email: parsed.data.email,
            rol: userRole,
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
