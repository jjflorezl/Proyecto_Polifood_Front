import { useEffect, useState } from "react";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order";

export function VendorDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch {
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
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

      {/* Estado de carga */}
      {loading && (
        <div className="mt-12 flex flex-col items-center gap-3 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p>Cargando pedidos...</p>
        </div>
      )}

      {/* Estado de error */}
      {!loading && error && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadOrders}
            className="rounded-xl bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Sin pedidos */}
      {!loading && !error && orders.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-6 text-slate-500 shadow-sm ring-1 ring-slate-200">
          No hay pedidos todavía.
        </p>
      )}

      {/* Tabla — desktop */}
      {!loading && !error && orders.length > 0 && (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
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
                      {order.status !== "Delivered" ? (
                        <button
                          onClick={() => advanceStatus(order.id)}
                          className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                        >
                          Avanzar estado
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">Completado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — móvil */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {orders.map(order => (
              <article key={order.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold">#{order.id.slice(0, 8)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>{order.isPaid ? "Pago confirmado" : "Pago pendiente"}</span>
                  <span className="font-semibold">${order.total.toLocaleString("es-CO")}</span>
                </div>
                {order.status !== "Delivered" ? (
                  <button
                    onClick={() => advanceStatus(order.id)}
                    className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                  >
                    Avanzar estado
                  </button>
                ) : (
                  <p className="mt-4 text-center text-sm text-slate-400">Completado</p>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
