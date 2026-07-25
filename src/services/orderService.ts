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
  orderCode?: string;
  createdAt: string;
  total: number;
  estado: string;
  items: OrderItem[];
}

interface BackendOrderDetail {
  productId?: number;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  subtotal?: number;
  productoId?: number;
  nombre?: string;
  cantidad?: number;
  precioUnitario?: number;
}

interface BackendOrder {
  id: number;
  orderCode?: string;
  total: number;
  createdAt: string;
  details?: BackendOrderDetail[];
  items?: BackendOrderDetail[];
  estado?: string;
}

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<BackendOrder[]>(
      API_ROUTES.orders.myOrders
    );
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((o) => ({
      id: o.id,
      orderCode: o.orderCode || `ORD-${o.id}`,
      createdAt: o.createdAt,
      total: o.total,
      estado: o.estado || "Completado",
      items: (o.details || o.items || []).map((d) => ({
        productoId: d.productId ?? d.productoId ?? 0,
        nombre: d.productName ?? d.nombre ?? "Producto",
        cantidad: d.quantity ?? d.cantidad ?? 1,
        precioUnitario: d.unitPrice ?? d.precioUnitario ?? 0,
      })),
    }));
  },
};
