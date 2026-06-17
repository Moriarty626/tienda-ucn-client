import { Producto } from "./Producto";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedProducts = PaginatedResponse<Producto>;

export interface FilterOptions {
  categoria?: "Electronica" | "Ropa" | "Hogar" | "Juguetes" | "Libros" | "";
  precioMin?: number;
  precioMax?: number;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
