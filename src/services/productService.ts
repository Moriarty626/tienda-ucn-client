import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import { Producto } from "@/domain/Producto";
import {
  PaginatedProducts,
  FilterOptions,
  PaginationParams,
} from "@/domain/types";

export const productService = {
  getProducts: async (): Promise<Producto[]> => {
    const response = await axiosClient.get(API_ROUTES.products.list);
    return response.data;
  },

  getProductsPaginated: async (
    params?: PaginationParams & FilterOptions
  ): Promise<PaginatedProducts> => {
    const response = await axiosClient.get(API_ROUTES.products.paginated, {
      params,
    });
    return response.data;
  },

  getProductById: async (id: number): Promise<Producto> => {
    const response = await axiosClient.get(API_ROUTES.products.byId(id));
    return response.data;
  },

  getProductsByCategory: async (category: string): Promise<Producto[]> => {
    const response = await axiosClient.get(API_ROUTES.products.list, {
      params: { category },
    });
    return response.data;
  },

  searchProducts: async (query: string): Promise<Producto[]> => {
    const response = await axiosClient.get(API_ROUTES.products.paginated, {
      params: { q: query },
    });
    return response.data;
  },
};
