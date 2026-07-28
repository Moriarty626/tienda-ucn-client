import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import { formatPrice } from "@/lib/utils";
import { Producto } from "@/domain/Producto";
import {
  PaginatedProducts,
  FilterOptions,
  PaginationParams,
} from "@/domain/types";

interface BackendResponse<T> {
  message: string;
  data: T;
}

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  stockIndicator: string;
  stock?: number;
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
  const priceNum = parsePrice(product.price);
  const stockVal =
    typeof product.stock === "number"
      ? product.stock
      : product.stockIndicator === "Sin stock"
      ? 0
      : 10;
  return {
    id: product.id,
    nombre: product.name,
    descripcion: product.description ?? "",
    marca: product.brandName ?? "",
    categoria: mapCategory(product.categoryName),
    precio: priceNum,
    precioFormateado: formatPrice(product.price),
    stock: stockVal,
    imagenUrl: product.mainImagesURL ?? product.mainImagesUrl,
  };
};

const toBackendParams = (params?: PaginationParams & FilterOptions) => {
  const search = params?.search?.trim();
  return {
    PageNumber: params?.page ?? 1,
    PageSize: params?.limit ?? 12,
    SearchTerm: search && search.length >= 2 ? search : undefined,
    CategoryName: params?.categoria || undefined,
    PriceMin: params?.precioMin ?? undefined,
    PriceMax: params?.precioMax ?? undefined,
  };
};

const toPaginatedProducts = (
  payload: BackendPaginatedProducts
): PaginatedProducts => ({
  data: payload.products.map(mapBackendProduct),
  total: payload.totalCount,
  page: payload.currentPage || payload.productPage || 1,
  limit: payload.pagesSize,
  totalPages: payload.totalPages,
});

export const productService = {
  getProducts: async (): Promise<Producto[]> => {
    const response = await axiosClient.get<
      BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.list, {
      params: toBackendParams({ page: 1, limit: 50 }),
    });
    return toPaginatedProducts(response.data.data).data;
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
    return mapBackendProduct(response.data.data);
  },

  getProductsByCategory: async (category: string): Promise<Producto[]> => {
    const response = await axiosClient.get<
      BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.list, {
      params: toBackendParams({ page: 1, limit: 50 }),
    });
    return toPaginatedProducts(response.data.data).data.filter(
      (product) => product.categoria.toLowerCase() === category.toLowerCase()
    );
  },

  searchProducts: async (query: string): Promise<Producto[]> => {
    const response = await axiosClient.get<
      BackendResponse<BackendPaginatedProducts>
    >(API_ROUTES.products.paginated, {
      params: toBackendParams({ page: 1, limit: 50, search: query }),
    });
    return toPaginatedProducts(response.data.data).data;
  },
};
