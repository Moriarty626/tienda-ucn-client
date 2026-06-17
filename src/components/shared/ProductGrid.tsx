"use client";

import { Producto } from "@/domain/Producto";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  productos: Producto[] | undefined;
  isLoading?: boolean;
}

export function ProductGrid({ productos, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
