"use client";

import { useProductsPaginated } from "@/hooks";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/shared/ProductFilters";
import { Pagination } from "@/components/shared/Pagination";
import { useProductFiltersUrl } from "@/hooks/useProductFiltersUrl";

interface ProductsViewProps {
  title?: string;
  description?: string;
}

export function ProductsView({
  title = "Todos los Productos",
  description = "Explora nuestro catalogo completo de suministros y quimicos.",
}: ProductsViewProps) {
  const { filters, pagination, updateFilters, updatePagination } =
    useProductFiltersUrl();

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useProductsPaginated({
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
        onFiltersChange={updateFilters}
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
