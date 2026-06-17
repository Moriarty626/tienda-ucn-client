"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks";
import { authService } from "@/services/authService";
import { cartCountAtom } from "@/store/cart";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const cartCount = useAtomValue(cartCountAtom);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          TiendaUCN
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Catalogo
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Admin
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/pedidos"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Mis pedidos
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="relative flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isLoading ? (
            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/perfil"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <User size={18} />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={() => authService.logout()}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 transition-colors"
                aria-label="Cerrar sesion"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors"
            >
              Iniciar sesion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
