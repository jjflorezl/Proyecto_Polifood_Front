import type { OrderStatus } from "../types/order";

const labels: Record<OrderStatus, string> = {
  Received: "Recibido",
  Preparing: "Preparando",
  Ready: "Listo",
  Delivered: "Entregado"
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{labels[status]}</span>;
}
