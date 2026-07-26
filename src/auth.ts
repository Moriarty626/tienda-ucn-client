import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/domain/auth-schemas";
import { LoginResponseSchema } from "@/domain/User";
import axios from "axios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "dev-secret-tienda-ucn-local",
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            { email: parsed.data.email, password: parsed.data.password }
          );
          const result = LoginResponseSchema.safeParse(res.data);
          if (!result.success || !result.data.success) return null;

          const { usuario, token } = result.data;
          return {
            id: String(usuario.id),
            name: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
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
