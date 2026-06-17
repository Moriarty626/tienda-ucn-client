"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generar numero de paginas a mostrar (ej: 1 2 3 4 5)
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots.filter((i) => typeof i === "number") as number[];
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        onClick={handlePrevious}
        disabled={!canGoPrevious || isLoading}
        variant="outline"
        className="px-4"
      >
        Anterior
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            disabled={isLoading}
            variant={page === currentPage ? "default" : "outline"}
            className={page === currentPage ? "bg-blue-600" : ""}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={!canGoNext || isLoading}
        variant="outline"
        className="px-4"
      >
        Siguiente
      </Button>

      <span className="text-sm text-slate-600 ml-4">
        Pagina {currentPage} de {totalPages}
      </span>
    </div>
  );
}
