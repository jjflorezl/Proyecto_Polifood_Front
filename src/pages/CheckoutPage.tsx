import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order";

export function CheckoutPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    orderService.getAll().then(orders => setOrder(orders.find(item => item.id === orderId) ?? null));
  }, [orderId]);

  async function handlePay() {
    if (!order) return;
    await orderService.confirmPayment(order.id);
    const orders = await orderService.getAll();
    setOrder(orders.find(item => item.id === order.id) ?? null);
  }

  if (!order) return <main className="mx-auto max-w-4xl px-4 py-8">Pedido no encontrado.</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pedido creado</h1>
            <p className="mt-2 text-sm text-slate-500">ID: {order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-6 space-y-3">
          {order.orderItems.map(item => (
            <div key={item.orderItem_id} className="flex justify-between border-b pb-3">
              <span>{item.quantity} x {item.product.product_name}</span>
              <strong>${item.subtotal.toLocaleString("es-CO")}</strong>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xl font-bold">Total</span>
          <strong className="text-3xl text-orange-600">${order.total.toLocaleString("es-CO")}</strong>
        </div>

        <button onClick={handlePay} disabled={order.isPaid} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-700 disabled:bg-green-600">
          {order.isPaid ? "Pago confirmado" : "Confirmar pago simulado"}
        </button>

        <Link to="/orders" className="mt-4 block text-center font-semibold text-orange-600">Ver mis pedidos</Link>
      </div>
    </main>
  );
}
