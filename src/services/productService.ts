import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import { Producto } from "@/domain/Producto";
import { BackendResponse } from "@/clients/types";
import {
  PaginatedProducts,
  FilterOptions,
  PaginationParams,
} from "@/domain/types";

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  stockIndicator: string;
  mainImagesURL?: string;
  mainImagesUrl?: string;
  categoryName: string;
  brandName: string;
}

interface BackendPaginatedProducts {
  totalCount: number;
  totalPages: number;
  pagesSize: number;
  productPage: number;
  currentPage: number;
  products: BackendProduct[];
}

const mapCategory = (rawCategory: string): Producto["categoria"] => {
  const normalized = rawCategory.toLowerCase();
  if (normalized.includes("electron")) return "Electronica";
  if (normalized.includes("ropa")) return "Ropa";
  if (normalized.includes("jugu")) return "Juguetes";
  if (normalized.includes("libro")) return "Libros";
  return "Hogar";
};

const parsePrice = (rawPrice: string): number => {
  const clean = rawPrice
      .replace(/[^\d,.-]/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "");
  const normalized = clean.replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
};

const mapBackendProduct = (product: BackendProduct): Producto => {
  if (!product) {
    return {
      id: 0,
      nombre: "Producto no encontrado",
      categoria: "Hogar",
      precio: 0,
      precioFormateado: "$0",
    };
  }
  const priceNum = parsePrice(product.price || "0");
  return {
    id: product.id || 0,
    nombre: product.name || "Sin nombre",
    categoria: mapCategory(product.categoryName || ""),
    precio: priceNum,
    precioFormateado: `$${priceNum.toLocaleString("es-CL")}`,
    imagenUrl: product.mainImagesURL ?? product.mainImagesUrl,
  };
};

const toBackendParams = (params?: PaginationParams & FilterOptions) => ({
  PageNumber: params?.page ?? 1,
  PageSize: params?.limit ?? 12,
  SearchTerm: params?.search?.trim() || undefined,
  Category: params?.categoria?.trim() || undefined,
  MinPrice:
      params?.precioMin !== undefined && !isNaN(params.precioMin)
          ? params.precioMin
          : undefined,
  MaxPrice:
      params?.precioMax !== undefined && !isNaN(params.precioMax)
          ? params.precioMax
          : undefined,
});

const toPaginatedProducts = (
    payload: BackendPaginatedProducts
): PaginatedProducts => ({
  data: (payload?.products || []).map(mapBackendProduct),
  total: payload?.totalCount || 0,
  page: payload?.currentPage || payload?.productPage || 1,
  limit: payload?.pagesSize || 12,
  totalPages: payload?.totalPages || 1,
});

export const productService = {
  getProducts: async (): Promise<Producto[]> => {
    const response = await axiosClient.get<
        BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.list);
    return (response.data?.data?.products || []).map(mapBackendProduct);
  },

  getProductsPaginated: async (
      params?: PaginationParams & FilterOptions
  ): Promise<PaginatedProducts> => {
    const response = await axiosClient.get<
        BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.paginated, {
      params: toBackendParams(params),
    });

    return toPaginatedProducts(response.data.data);
  },

  getProductById: async (id: number): Promise<Producto> => {
    const response = await axiosClient.get<BackendResponse<BackendProduct>>(
        API_ROUTES.products.byId(id)
    );
    return mapBackendProduct(response.data?.data);
  },

  getProductsByCategory: async (category: string): Promise<Producto[]> => {
    const response = await axiosClient.get<
        BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.list, {
      // Se integran los parámetros tipados de tu compañera
      params: toBackendParams({ page: 1, limit: 50, categoria: category as any }),
    });

    // Se mapea la respuesta del backend al arreglo de Producto que espera TypeScript
    return (response.data?.data?.products || []).map(mapBackendProduct);
  },

  searchProducts: async (query: string): Promise<Producto[]> => {
    const response = await axiosClient.get<
        BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.paginated, {
      params: toBackendParams({ search: query, page: 1, limit: 20 }),
    });
    return (response.data?.data?.products || []).map(mapBackendProduct);
  },
};
