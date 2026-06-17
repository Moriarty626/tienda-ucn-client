import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";
import { Producto } from "@/domain/Producto";

export interface ProductoPayload {
  nombre: string;
  categoria: "Electronica" | "Ropa" | "Hogar" | "Juguetes" | "Libros";
  precio: number;
  imagen?: File;
}

export const adminService = {
  createProducto: async (data: ProductoPayload): Promise<Producto> => {
    const form = new FormData();
    form.append("nombre", data.nombre);
    form.append("categoria", data.categoria);
    form.append("precio", String(data.precio));
    if (data.imagen) form.append("imagen", data.imagen);
    const response = await axiosClient.post(API_ROUTES.products.list, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProducto: async (
    id: number,
    data: ProductoPayload
  ): Promise<Producto> => {
    const form = new FormData();
    form.append("nombre", data.nombre);
    form.append("categoria", data.categoria);
    form.append("precio", String(data.precio));
    if (data.imagen) form.append("imagen", data.imagen);
    const response = await axiosClient.put(API_ROUTES.products.byId(id), form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteProducto: async (id: number): Promise<void> => {
    await axiosClient.delete(API_ROUTES.products.byId(id));
  },
};
