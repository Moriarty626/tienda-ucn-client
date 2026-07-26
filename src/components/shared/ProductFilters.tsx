"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/domain/types";

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  isLoading?: boolean;
}

export function ProductFilters({
  onFiltersChange,
  initialFilters,
  isLoading,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categoria: initialFilters?.categoria || "",
    precioMin: initialFilters?.precioMin,
    precioMax: initialFilters?.precioMax,
    search: initialFilters?.search || "",
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFilters({
      categoria: initialFilters?.categoria || "",
      precioMin: initialFilters?.precioMin,
      precioMax: initialFilters?.precioMax,
      search: initialFilters?.search || "",
    });
  }, [
    initialFilters?.categoria,
    initialFilters?.precioMin,
    initialFilters?.precioMax,
    initialFilters?.search,
  ]);

  const triggerDebouncedChange = (newFilters: FilterOptions) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFiltersChange(newFilters);
    }, 450);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    const next = { ...filters, search };
    setFilters(next);
    triggerDebouncedChange(next);
  };

  const handleCategoryChange = (
    categoria: "Electronica" | "Ropa" | "Hogar" | "Juguetes" | "Libros" | ""
  ) => {
    const next = { ...filters, categoria };
    setFilters(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onFiltersChange(next);
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const precioMin =
      val !== "" && !isNaN(Number(val)) ? parseFloat(val) : undefined;
    const next = { ...filters, precioMin };
    setFilters(next);
    triggerDebouncedChange(next);
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const precioMax =
      val !== "" && !isNaN(Number(val)) ? parseFloat(val) : undefined;
    const next = { ...filters, precioMax };
    setFilters(next);
    triggerDebouncedChange(next);
  };

  const handleApplyFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onFiltersChange(filters);
  };

  const handleResetFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const reset: FilterOptions = {
      categoria: "",
      precioMin: undefined,
      precioMax: undefined,
      search: "",
    };
    setFilters(reset);
    onFiltersChange(reset);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-200">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre del producto..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Categoria
          </label>
          <select
            value={filters.categoria || ""}
            onChange={(e) =>
              handleCategoryChange(
                e.target.value as
                  | "Electronica"
                  | "Ropa"
                  | "Hogar"
                  | "Juguetes"
                  | "Libros"
                  | ""
              )
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Todas</option>
            <option value="Electronica">Electrónica</option>
            <option value="Hogar">Hogar</option>
            <option value="Libros">Libros</option>
            <option value="Juguetes">Juguetes</option>
            <option value="Ropa">Ropa</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Precio Minimo
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.precioMin || ""}
            onChange={handlePriceMinChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Precio Maximo
          </label>
          <input
            type="number"
            placeholder="10000"
            value={filters.precioMax || ""}
            onChange={handlePriceMaxChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            min="0"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleApplyFilters}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Aplicar Filtros
        </Button>
        <Button
          onClick={handleResetFilters}
          disabled={isLoading}
          variant="outline"
          className="border-slate-300"
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
}
