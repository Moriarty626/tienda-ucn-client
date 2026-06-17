import { axiosClient } from "@/clients";
import { API_ROUTES } from "@/clients/apiRoutes";

export interface OrderItem {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Order {
  id: number;
  createdAt: string;
  total: number;
  estado: string;
  items: OrderItem[];
}

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get(API_ROUTES.orders.myOrders);
    return response.data;
  },
};
