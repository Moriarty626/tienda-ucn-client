"use client";

import { useState } from "react";
import { useProductsPaginated } from "@/hooks";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/shared/ProductFilters";
import { Pagination } from "@/components/shared/Pagination";
import { FilterOptions, PaginationParams } from "@/domain/types";

interface ProductsViewProps {
  title?: string;
  description?: string;
}

export function ProductsView({
  title = "Todos los Productos",
  description = "Explora nuestro catalogo completo de suministros y quimicos.",
}: ProductsViewProps) {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
  });

  const [filters, setFilters] = useState<FilterOptions>({});

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useProductsPaginated({
    ...pagination,
    ...filters,
  });

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error al cargar los productos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-600 mt-2">{description}</p>
      </div>

      <ProductFilters
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      <ProductGrid productos={paginatedData?.data} isLoading={isLoading} />

      <Pagination
        currentPage={paginatedData?.page || 1}
        totalPages={paginatedData?.totalPages || 1}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </main>
  );
}
