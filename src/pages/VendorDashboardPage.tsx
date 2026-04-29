import { useEffect, useState } from "react";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order";

export function VendorDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    setOrders(await orderService.getAll());
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function advanceStatus(orderId: string) {
    await orderService.changeStatus(orderId);
    await loadOrders();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard vendedor/admin</h1>
      <p className="mt-2 text-slate-500">Vista básica para cambiar el estado de los pedidos.</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Pedido</th>
              <th className="p-4">Total</th>
              <th className="p-4">Pago</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-semibold">#{order.id.slice(0, 8)}</td>
                <td className="p-4">${order.total.toLocaleString("es-CO")}</td>
                <td className="p-4">{order.isPaid ? "Confirmado" : "Pendiente"}</td>
                <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                <td className="p-4">
                  <button onClick={() => advanceStatus(order.id)} className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700">
                    Avanzar estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
