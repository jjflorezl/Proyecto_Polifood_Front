import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService.getAll().then(setOrders).catch(() => setError("No se pudieron cargar los pedidos.")).finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Pedidos</h1>

      {loading && (
        <div className="mt-12 flex flex-col items-center gap-3 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p>Cargando pedidos...</p>
        </div>
      )}

      {!loading && error && (
        <p className="mt-6 text-red-500">{error}</p>
      )}

      <div className="mt-6 space-y-4">
        {!loading && !error && orders.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm ring-1 ring-slate-200">
            No hay pedidos todavía.
          </p>
        )}
        {orders.map(order => (
          <Link to={`/orders/${order.id}`} key={order.id}> {/* 👈 envuelve el article */}
            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:ring-orange-300 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">Pedido #{order.id.slice(0, 8)}</h2>
                  <p className="text-sm text-slate-500">{order.orderItems.length} productos</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-4 flex justify-between border-t pt-4">
                <span>{order.isPaid ? "Pagado" : "Pendiente de pago"}</span>
                <strong>${order.total.toLocaleString("es-CO")}</strong>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
