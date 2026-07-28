"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Producto } from "@/domain/Producto";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cartItemsAtom, CartItem } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const setCart = useSetAtom(cartItemsAtom);
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = (producto.stock ?? 0) <= 0;

  const addToCart = () => {
    if (isOutOfStock) {
      toast.error("Producto sin stock");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.stock) {
          toast.error(`Solo hay ${producto.stock} unidades disponibles en stock.`);
          return prev;
        }
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      const item: CartItem = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        precioFormateado: producto.precioFormateado,
        cantidad: 1,
        imagenUrl: producto.imagenUrl,
      };
      return [...prev, item];
    });
    toast.success(`${producto.nombre} agregado al carrito`, {
      duration: 1200,
      action: {
        label: "Ver carrito",
        onClick: () => {
          if (!isAuthenticated) {
            toast.error("Debe de iniciar sesion para continuar", {
              id: "auth-cart-toast",
            });
            router.push("/login?callbackUrl=/carrito");
          } else {
            router.push("/carrito");
          }
        },
      },
    });
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow relative">
      <CardHeader>
        <CardTitle className="text-lg">{producto.nombre}</CardTitle>
        <CardDescription>{producto.categoria}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-32 bg-slate-100 rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
          {producto.imagenUrl && !imgError ? (
            <Image
              src={producto.imagenUrl}
              alt={producto.nombre}
              fill
              className={`object-cover ${isOutOfStock ? "opacity-40 grayscale" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <span className="text-slate-400 text-sm">Imagen no disponible</span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md mb-1.5">
                Producto sin stock
              </span>
              {isAdmin && (
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7 px-2.5 flex items-center gap-1 shadow-sm font-semibold"
                  onClick={() => router.push(`/admin?edit=${producto.id}`)}
                >
                  <Pencil size={12} />
                  Modificar stock
                </Button>
              )}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900">
          {producto.precioFormateado}
        </p>
        <p className="text-xs mt-1 font-medium">
          {isOutOfStock ? (
            <span className="text-red-600 font-semibold">Producto sin stock</span>
          ) : (
            <span className="text-slate-500">Stock disponible: {producto.stock}</span>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {isOutOfStock && isAdmin ? (
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
            onClick={() => router.push(`/admin?edit=${producto.id}`)}
          >
            <Pencil size={15} />
            Modificar producto
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={isOutOfStock}
            onClick={addToCart}
            variant={isOutOfStock ? "secondary" : "default"}
          >
            {isOutOfStock ? "Producto sin stock" : "Agregar al carrito"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
