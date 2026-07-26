"use client";

import { useQuery } from "@tanstack/react-query";
import { FileDown, Package, AlertCircle, RefreshCw, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { orderService, Order } from "@/services/orderService";
import { Button } from "@/components/ui/button";
<<<<<<< Updated upstream
=======
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
>>>>>>> Stashed changes

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
    <div className="space-y-4 max-w-4xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-slate-200/70 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export default function PedidosPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: orders,
    isLoading: ordersLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
    enabled: isAuthenticated,
  });

  const isLoading = authLoading || (isAuthenticated && ordersLoading);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Pedidos</h1>
        <OrderSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Inicia sesión para ver tus pedidos
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            Debes acceder a tu cuenta de TiendaUCN para consultar el historial de tus compras.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => signIn()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Button>
            <Link href="/" passHref>
              <Button variant="outline" className="w-full border-slate-300">
                Volver al catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Error al cargar los pedidos
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            No se pudo obtener el historial de pedidos en este momento. Comprueba tu conexión o reintenta.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Reintentar
            </Button>
            <Link href="/" passHref>
              <Button variant="outline" className="border-slate-300 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            No tienes pedidos aún
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Tus compras confirmadas y comprobantes aparecerán listados aquí.
          </p>
          <Link href="/" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              Explorar productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Pedidos</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-4">
              <div>
                <p className="font-bold text-slate-900 text-lg">
                  Pedido #{order.id}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full capitalize">
                  {order.estado}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPdf(order)}
                  className="flex items-center gap-1.5 border-slate-300 hover:bg-slate-50 text-slate-700"
                >
                  <FileDown className="w-4 h-4 text-blue-600" />
                  Descargar PDF
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium">
                    {item.nombre}{" "}
                    <span className="text-slate-400 font-normal">x{item.cantidad}</span>
                  </span>
<<<<<<< Updated upstream
                  <span>
                    $
                    {(item.cantidad * item.precioUnitario).toLocaleString(
                      "es-CL"
                    )}
=======
                  <span className="font-semibold text-slate-800">
                    {formatPrice(item.cantidad * item.precioUnitario)}
>>>>>>> Stashed changes
                  </span>
                </div>
              ))}
            </div>
<<<<<<< Updated upstream
            <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span>${order.total.toLocaleString("es-CL")}</span>
=======
            <div className="border-t border-slate-200 mt-4 pt-3 flex justify-between items-center text-slate-900">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(order.total)}
              </span>
>>>>>>> Stashed changes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
