"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Producto } from "@/domain/Producto";
import {
  PaginatedProducts,
  FilterOptions,
  PaginationParams,
} from "@/domain/types";
import { productService } from "@/services/productService";

export const useProducts = (): UseQueryResult<Producto[], Error> => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
  });
};

export const useProductsPaginated = (
  params?: PaginationParams & FilterOptions
): UseQueryResult<PaginatedProducts, Error> => {
  return useQuery({
    queryKey: ["products", "paginated", params],
    queryFn: () => productService.getProductsPaginated(params),
  });
};

export const useProductById = (id: number): UseQueryResult<Producto, Error> => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });
};

export const useProductsByCategory = (
  category: string
): UseQueryResult<Producto[], Error> => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => productService.getProductsByCategory(category),
    enabled: !!category,
  });
};

export const useSearchProducts = (
  query: string
): UseQueryResult<Producto[], Error> => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productService.searchProducts(query),
    enabled: !!query,
  });
};
