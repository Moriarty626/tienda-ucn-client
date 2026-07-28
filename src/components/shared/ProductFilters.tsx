"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/domain/types";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isLoading?: boolean;
  initialFilters?: FilterOptions;
}

type CategoryType = "Electronica" | "Ropa" | "Hogar" | "Juguetes" | "Libros" | "";

export function ProductFilters({
  onFiltersChange,
  isLoading,
  initialFilters,
}: ProductFiltersProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [categoria, setCategoria] = useState<CategoryType>(
    initialFilters?.categoria || ""
  );
  const [precioMinStr, setPrecioMinStr] = useState(
    initialFilters?.precioMin !== undefined ? String(initialFilters.precioMin) : ""
  );
  const [precioMaxStr, setPrecioMaxStr] = useState(
    initialFilters?.precioMax !== undefined ? String(initialFilters.precioMax) : ""
  );

  const [precioMinError, setPrecioMinError] = useState<string | null>(null);
  const [precioMaxError, setPrecioMaxError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  // Sincronizar estado local si initialFilters cambia (por ejemplo al sincronizar URL o Reset)
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.search !== undefined) setSearch(initialFilters.search || "");
      if (initialFilters.categoria !== undefined) setCategoria(initialFilters.categoria || "");
      const minStr = initialFilters.precioMin !== undefined ? String(initialFilters.precioMin) : "";
      const maxStr = initialFilters.precioMax !== undefined ? String(initialFilters.precioMax) : "";
      setPrecioMinStr(minStr);
      setPrecioMaxStr(maxStr);

      if (!minStr || /^\d+$/.test(minStr.trim())) setPrecioMinError(null);
      if (!maxStr || /^\d+$/.test(maxStr.trim())) setPrecioMaxError(null);
    }
  }, [initialFilters?.search, initialFilters?.categoria, initialFilters?.precioMin, initialFilters?.precioMax]);

  const validatePrice = (
    val: string
  ): { isValid: boolean; error: string | null; parsed?: number } => {
    const trimmed = val.trim();
    if (!trimmed) {
      return { isValid: true, error: null, parsed: undefined };
    }
    // Si contiene puntos, comas o cualquier caracter que no sea un dígito puro:
    if (/[.,]/.test(trimmed) || !/^\d+$/.test(trimmed)) {
      return {
        isValid: false,
        error: "Solo deben ser números (ejemplo: 2000) sin . y ,",
      };
    }
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num < 0) {
      return {
        isValid: false,
        error: "Solo deben ser números (ejemplo: 2000) sin . y ,",
      };
    }
    return { isValid: true, error: null, parsed: num };
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrecioMinStr(val);
    const validation = validatePrice(val);
    setPrecioMinError(validation.error);
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrecioMaxStr(val);
    const validation = validatePrice(val);
    setPrecioMaxError(validation.error);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const applyCurrentFilters = (overrides?: {
    search?: string;
    categoria?: CategoryType;
  }) => {
    const minVal = validatePrice(precioMinStr);
    const maxVal = validatePrice(precioMaxStr);

    setPrecioMinError(minVal.error);
    setPrecioMaxError(maxVal.error);

    if (!minVal.isValid || !maxVal.isValid) {
      return;
    }

    if (
      minVal.parsed !== undefined &&
      maxVal.parsed !== undefined &&
      minVal.parsed > maxVal.parsed
    ) {
      setPrecioMinError("El precio mínimo no puede ser mayor al máximo");
      return;
    }

    const nextSearch = overrides?.search !== undefined ? overrides.search : debouncedSearch;
    const nextCategory = overrides?.categoria !== undefined ? overrides.categoria : categoria;

    onFiltersChange({
      categoria: nextCategory,
      precioMin: minVal.parsed,
      precioMax: maxVal.parsed,
      search: nextSearch,
    });
  };

  const handleCategoryChange = (cat: CategoryType) => {
    setCategoria(cat);
    applyCurrentFilters({ categoria: cat });
  };

  const handleApplyFilters = () => {
    applyCurrentFilters();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoria("");
    setPrecioMinStr("");
    setPrecioMaxStr("");
    setPrecioMinError(null);
    setPrecioMaxError(null);

    onFiltersChange({
      categoria: "",
      precioMin: undefined,
      precioMax: undefined,
      search: "",
    });
  };

  useEffect(() => {
    applyCurrentFilters({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyFilters();
    }
  };

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
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Categoría
          </label>
          <select
            value={categoria}
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
            <option value="Electronica">Electronica</option>
            <option value="Ropa">Ropa</option>
            <option value="Hogar">Hogar</option>
            <option value="Juguetes">Juguetes</option>
            <option value="Libros">Libros</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Precio Mínimo
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={precioMinStr}
            onChange={handlePriceMinChange}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${precioMinError
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-blue-500"
              }`}
            disabled={isLoading}
          />
          {precioMinError && (
            <p className="mt-1 text-xs text-red-600 font-medium">{precioMinError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Precio Máximo
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="10000"
            value={precioMaxStr}
            onChange={handlePriceMaxChange}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${precioMaxError
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-blue-500"
              }`}
            disabled={isLoading}
          />
          {precioMaxError && (
            <p className="mt-1 text-xs text-red-600 font-medium">{precioMaxError}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleApplyFilters}
          disabled={isLoading || !!precioMinError || !!precioMaxError}
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
