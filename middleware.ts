import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas protegidas - requieren autenticacion
  const protectedRoutes = ["/carrito", "/pedidos", "/perfil"];
  // Rutas administrativas - requieren ser admin
  const adminRoutes = ["/admin"];

  // Verificar si la ruta es protegida o administrativa
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtected || isAdmin) {
    const session = await auth();

    // Si no hay sesion, redirigir a login
    if (!session) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    // Si es ruta admin y el usuario no es admin, redirigir a home
    if (isAdmin && session.user?.rol?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Rutas publicas de autenticacion - si el usuario ya esta autenticado, redirigir
  const authRoutes = ["/login", "/register", "/verify-email"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Rutas protegidas
    "/carrito",
    "/pedidos",
    "/pedidos/:path*",
    "/perfil",
    "/perfil/:path*",
    "/admin",
    "/admin/:path*",
    // Rutas de autenticacion
    "/login",
    "/register",
    "/verify-email",
  ],
};


