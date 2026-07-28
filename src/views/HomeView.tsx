"use client";

import { Suspense } from "react";
import { useProductFiltersUrl } from "@/hooks/useProductFiltersUrl";
import { useProductsPaginated } from "@/hooks";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/shared/ProductFilters";
import { Pagination } from "@/components/shared/Pagination";

function HomeContent() {
  const { filters, pagination, updateFilters, updatePagination } =
    useProductFiltersUrl();

  const { data, isLoading, error } = useProductsPaginated({
    ...pagination,
    ...filters,
  });

  const handlePageChange = (page: number) => {
    updatePagination({ ...pagination, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Catalogo de Productos
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error al cargar los productos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Catalogo de Productos
        </h1>
        <p className="text-slate-600 mt-2">
          Encuentra los mejores articulos para el hogar.
        </p>
      </div>

      <ProductFilters onFiltersChange={updateFilters} isLoading={isLoading} />

      <ProductGrid productos={data?.data} isLoading={isLoading} />

      <Pagination
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 1}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </main>
  );
}

export function HomeView() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="h-96 animate-pulse bg-slate-100 rounded-lg" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
