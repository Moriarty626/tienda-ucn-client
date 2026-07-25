"use client";

import { useQuery } from "@tanstack/react-query";
import { FileDown, Package } from "lucide-react";
import { orderService, Order } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

function downloadPdf(order: Order) {
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Comprobante de Pedido", 14, 20);
    doc.setFontSize(11);
    doc.text(`Pedido #${order.id}`, 14, 32);
    doc.text(
      `Fecha: ${new Date(order.createdAt).toLocaleDateString("es-CL")}`,
      14,
      40
    );
    doc.text(`Estado: ${order.estado}`, 14, 48);

    doc.setFontSize(12);
    doc.text("Detalle", 14, 60);
    doc.setFontSize(10);

    let y = 68;
    order.items.forEach((item) => {
      const subtotal = item.cantidad * item.precioUnitario;
      doc.text(
        `${item.nombre}  x${item.cantidad}  $${item.precioUnitario.toLocaleString("es-CL")}  =  $${subtotal.toLocaleString("es-CL")}`,
        14,
        y
      );
      y += 8;
    });

    y += 4;
    doc.setFontSize(12);
    doc.text(`Total: $${order.total.toLocaleString("es-CL")}`, 14, y);
    doc.save(`pedido-${order.id}.pdf`);
  });
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 bg-slate-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export default function PedidosPage() {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
  });

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Pedidos</h1>
        <OrderSkeleton />
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Mis Pedidos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al cargar los pedidos.
        </div>
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={64} className="mx-auto text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          No tienes pedidos aun
        </h1>
        <p className="text-slate-500">
          Tus pedidos apareceran aqui una vez que confirmes una compra.
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Pedidos</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-slate-900">Pedido #{order.id}</p>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">
                  {order.estado}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPdf(order)}
                  className="flex items-center gap-1"
                >
                  <FileDown size={14} />
                  PDF
                </Button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span>
                    {formatPrice(item.cantidad * item.precioUnitario)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
