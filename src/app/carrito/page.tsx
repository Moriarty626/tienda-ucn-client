"use client";

import { useAtom, useAtomValue } from "jotai";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartItemsAtom, cartTotalAtom } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function CarritoPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [items, setItems] = useAtom(cartItemsAtom);
  const total = useAtomValue(cartTotalAtom);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Debe de iniciar sesion para continuar", {
        id: "auth-cart-toast",
      });
      router.replace("/login?callbackUrl=/carrito");
    }
  }, [isLoading, isAuthenticated, router]);

  const updateCantidad = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Producto eliminado del carrito");
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      await axiosClient.post(API_ROUTES.orders.create, {
        items: items.map((i) => ({ productoId: i.id, cantidad: i.cantidad })),
      });
      setItems([]);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Pedido realizado correctamente");
      router.push("/");
    } catch (error: unknown) {
      const response = (error as {
        response?: {
          status?: number;
          data?: {
            detail?: string;
            message?: string;
            title?: string;
          };
        };
      })?.response;

      const responseData = response?.data;
      const status = response?.status;

      let msg =
        responseData?.detail ||
        responseData?.message ||
        responseData?.title ||
        "Error al procesar el pedido. Intenta de nuevo.";

      if (
        status === 409 ||
        msg.toLowerCase().includes("conflicto") ||
        msg.toLowerCase().includes("stock")
      ) {
        msg = "Stock no disponible";
      }

      toast.error(msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Tu carrito esta vacio
        </h1>
        <p className="text-slate-500 mb-6">
          Agrega productos desde el catalogo para comenzar.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/">Ver catalogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Carrito de Compras
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {item.nombre}
                </p>
                <p className="text-sm text-slate-500">
                  {item.precioFormateado} c/u
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCantidad(item.id, -1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-semibold">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => updateCantidad(item.id, 1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="font-bold text-slate-900 min-w-24 text-right">
                {formatPrice(item.precio * item.cantidad)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Resumen</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-slate-600"
              >
                <span className="truncate flex-1 mr-2">
                  {item.nombre} x{item.cantidad}
                </span>
                <span>{formatPrice(item.precio * item.cantidad)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-300 pt-4 flex justify-between font-bold text-lg text-slate-900 mb-6">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Procesando..." : "Confirmar pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
}
