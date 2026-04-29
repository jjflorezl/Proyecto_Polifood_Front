import { useEffect, useState } from "react";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getAll().then(setOrders);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Pedidos</h1>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm ring-1 ring-slate-200">No hay pedidos todavía.</p>}
        {orders.map(order => (
          <article key={order.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
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
        ))}
      </div>
    </main>
  );
}
