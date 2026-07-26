"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useTransition } from "react";
import { FilterOptions, PaginationParams } from "@/domain/types";

interface FiltersAndPagination {
  filters: FilterOptions;
  pagination: PaginationParams;
}

// Hook para sincronizar filtros y paginacion con URL parameters
export function useProductFiltersUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [state, setState] = useState<FiltersAndPagination>({
    filters: {},
    pagination: { page: 1, limit: 12 },
  });

  // Sincronizar URL con estado
  useEffect(() => {
    const newFilters: FilterOptions = {};
    const newPagination: PaginationParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
    };

    if (searchParams.get("categoria")) {
      newFilters.categoria = searchParams.get("categoria") as
        | "Electronica"
        | "Ropa"
        | "Hogar"
        | "Juguetes"
        | "Libros"
        | "";
    }

    if (searchParams.get("precioMin")) {
      newFilters.precioMin = parseFloat(searchParams.get("precioMin") || "");
    }

    if (searchParams.get("precioMax")) {
      newFilters.precioMax = parseFloat(searchParams.get("precioMax") || "");
    }

    if (searchParams.get("search")) {
      newFilters.search = searchParams.get("search") || "";
    }

    // Este setState es intencional para sincronizar con URL parameters
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      filters: newFilters,
      pagination: newPagination,
    });
  }, [searchParams]);

  const updateUrl = useCallback(
    (newFilters: FilterOptions, newPagination: PaginationParams) => {
      const params = new URLSearchParams();

      if (newFilters.categoria) {
        params.set("categoria", newFilters.categoria);
      }

      if (newFilters.precioMin !== undefined && !isNaN(newFilters.precioMin) && newFilters.precioMin >= 0) {
        params.set("precioMin", newFilters.precioMin.toString());
      }

      if (newFilters.precioMax !== undefined && !isNaN(newFilters.precioMax) && newFilters.precioMax >= 0) {
        params.set("precioMax", newFilters.precioMax.toString());
      }

      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      params.set("page", newPagination.page.toString());
      params.set("limit", newPagination.limit.toString());

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router]
  );

  const updateFilters = useCallback(
    (newFilters: FilterOptions) => {
      updateUrl(newFilters, { ...state.pagination, page: 1 });
    },
    [state.pagination, updateUrl]
  );

  const updatePagination = useCallback(
    (newPagination: PaginationParams) => {
      updateUrl(state.filters, newPagination);
    },
    [state.filters, updateUrl]
  );

  return {
    filters: state.filters,
    pagination: state.pagination,
    updateFilters,
    updatePagination,
  };
}
