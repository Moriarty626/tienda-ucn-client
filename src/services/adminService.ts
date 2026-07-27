import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import { Producto } from "@/domain/Producto";
import { BackendResponse } from "@/clients/types";

export interface ProductoPayload {
  nombre: string;
  descripcion: string;
  categoria: "Electronica" | "Ropa" | "Hogar" | "Juguetes" | "Libros";
  marca: string;
  precio: number;
  stock: number;
  imagen?: File;
}

export const adminService = {
  createProducto: async (data: ProductoPayload): Promise<Producto> => {
    const form = new FormData();
    form.append("Name", data.nombre);
    form.append("Description", data.descripcion);
    form.append("CategoryName", data.categoria);
    form.append("BrandName", data.marca);
    form.append("Price", String(data.precio));
    form.append("Stock", String(data.stock));
    if (data.imagen) form.append("ImagesFiles", data.imagen);
    const response = await axiosClient.post<BackendResponse<Producto>>(
      API_ROUTES.products.list,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data?.data ?? (response.data as any);
  },

  updateProducto: async (
    id: number,
    data: ProductoPayload
  ): Promise<Producto> => {
    const form = new FormData();
    form.append("Name", data.nombre);
    form.append("Description", data.descripcion);
    form.append("CategoryName", data.categoria);
    form.append("BrandName", data.marca);
    form.append("Price", String(data.precio));
    form.append("Stock", String(data.stock));
    if (data.imagen) form.append("ImagesFiles", data.imagen);
    const response = await axiosClient.put<BackendResponse<Producto>>(
      API_ROUTES.products.byId(id),
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data?.data ?? (response.data as any);
  },

  deleteProducto: async (id: number): Promise<void> => {
    await axiosClient.delete(API_ROUTES.products.byId(id));
  },
};
