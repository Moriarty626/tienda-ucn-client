"use client";

import Image from "next/image";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
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

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const setCart = useSetAtom(cartItemsAtom);

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === producto.id);
      if (existing) {
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
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{producto.nombre}</CardTitle>
        <CardDescription>{producto.categoria}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-32 bg-slate-100 rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
          {producto.imagenUrl ? (
            <Image
              src={producto.imagenUrl}
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-slate-400 text-sm">Imagen no disponible</span>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900">
          {producto.precioFormateado}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={addToCart}>
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
