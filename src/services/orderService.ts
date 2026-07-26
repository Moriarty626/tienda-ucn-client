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
<<<<<<< Updated upstream
    const response = await axiosClient.get(API_ROUTES.orders.myOrders);
    return response.data;
=======
    try {
      const response = await axiosClient.get<BackendOrder[]>(
        API_ROUTES.orders.myOrders
      );
      if (!response || !response.data) {
        return [];
      }
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
    } catch {
      // Si la API retorna un error (por ejemplo 404/400 cuando el usuario no tiene historial), retornamos lista vacia
      return [];
    }
>>>>>>> Stashed changes
  },
};
