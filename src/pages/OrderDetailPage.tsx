import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../services/order.service";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import type { Order, OrderStatus } from "../types/order";
import { ArrowLeft, CheckCircle, Circle, Clock } from "lucide-react";

const STEPS: OrderStatus[] = ["Received", "Preparing", "Ready", "Delivered"];

const stepLabels: Record<OrderStatus, string> = {
  Received: "Recibido",
  Preparing: "Preparando",
  Ready: "Listo para recoger",
  Delivered: "Entregado",
};

const stepDescriptions: Record<OrderStatus, string> = {
  Received: "Tu pedido fue recibido por la tienda.",
  Preparing: "La tienda está preparando tu pedido.",
  Ready: "¡Tu pedido está listo! Pasa a recogerlo.",
  Delivered: "Pedido entregado. ¡Buen provecho!",
};

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService.getAll()
      .then(orders => {
        const found = orders.find(o => o.id === orderId);
        if (!found) setError("No se encontró el pedido.");
        else setOrder(found);
      })
      .catch(() => setError("No se pudo cargar el pedido."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col items-center gap-3 text-slate-400 mt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
        <p>Cargando pedido...</p>
      </div>
    </main>
  );

  if (error || !order) return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-red-500 mt-20 text-center">{error}</p>
    </main>
  );

  const currentIndex = STEPS.indexOf(order.status);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">

      {/* Encabezado */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 mb-6"
      >
        <ArrowLeft size={16} /> Volver a pedidos
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-sm text-slate-500 mt-1">
        {order.isPaid ? `Pagado` : "Pendiente de pago"}
        {order.paymentConfirmedAt && ` · ${new Date(order.paymentConfirmedAt).toLocaleString("es-CO")}`}
      </p>

      {/* Timeline */}
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-semibold text-slate-700 mb-6">Seguimiento</h2>
        <ol className="relative flex flex-col gap-0">
          {STEPS.map((step, index) => {
            const isDone = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <li key={step} className="flex gap-4">
                {/* Icono + línea vertical */}
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full
                    ${isDone ? "bg-orange-600 text-white" : ""}
                    ${isCurrent ? "bg-orange-100 text-orange-600 ring-2 ring-orange-400" : ""}
                    ${isPending ? "bg-slate-100 text-slate-400" : ""}
                  `}>
                    {isDone
                      ? <CheckCircle size={18} />
                      : isCurrent
                        ? <Clock size={18} />
                        : <Circle size={18} />
                    }
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 min-h-[2rem] ${isDone ? "bg-orange-400" : "bg-slate-200"}`} />
                  )}
                </div>

                {/* Texto */}
                <div className="pb-6">
                  <p className={`font-semibold ${isPending ? "text-slate-400" : "text-slate-800"}`}>
                    {stepLabels[step]}
                  </p>
                  {(isDone || isCurrent) && (
                    <p className="text-sm text-slate-500">{stepDescriptions[step]}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Productos del pedido */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-semibold text-slate-700 mb-4">Productos</h2>
        <ul className="divide-y">
          {order.orderItems.map(item => (
            <li key={item.orderItem_id} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{item.product.product_name}</p>
                <p className="text-slate-500">x{item.quantity} · ${item.unitPrice.toLocaleString("es-CO")} c/u</p>
              </div>
              <span className="font-semibold">${item.subtotal.toLocaleString("es-CO")}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4 font-bold">
          <span>Total</span>
          <span>${order.total.toLocaleString("es-CO")}</span>
        </div>
      </section>

    </main>
  );
}