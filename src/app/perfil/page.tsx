"use client";

import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { User, Mail, ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PerfilPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mi Perfil</h1>
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Mail size={12} /> {user?.email}
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
            <ShieldCheck size={16} />
            Cuenta de administrador
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/pedidos">Ver mis pedidos</Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin">Panel de administracion</Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => authService.logout()}
          >
            <LogOut size={16} className="mr-2" />
            Cerrar sesion
          </Button>
        </div>
      </div>
    </div>
  );
}
