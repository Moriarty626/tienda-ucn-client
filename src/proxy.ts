import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/perfil", "/pedidos", "/carrito"];
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isProtected = protectedRoutes.some((r) =>
    nextUrl.pathname.startsWith(r)
  );
  const isAdmin = adminRoutes.some((r) => nextUrl.pathname.startsWith(r));

  if ((isProtected || isAdmin) && !session) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`,
        req.url
      )
    );
  }

  if (isAdmin && session?.user?.rol !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/perfil/:path*",
    "/pedidos/:path*",
    "/carrito/:path*",
    "/admin/:path*",
  ],
};
