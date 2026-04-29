import type { Cart } from "../types/cart";
import type { Order, OrderStatus } from "../types/order";
import { apiConfig, apiRequest } from "./api";
import { cartService } from "./cart.service";

const ORDERS_KEY = "polifood_orders";

function readOrders(): Order[] {
  const saved = localStorage.getItem(ORDERS_KEY);
  return saved ? JSON.parse(saved) as Order[] : [];
}

function saveOrders(orders: Order[]): Order[] {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orders;
}

function makeOrderFromCart(cart: Cart): Order {
  const id = crypto.randomUUID();
  const orderItems = cart.items.map(item => ({
    orderItem_id: crypto.randomUUID(),
    orderId: id,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
    product_id: item.productId,
    product: item.product,
    is_active: 1
  }));

  return {
    id,
    cartId: cart.id,
    orderItems,
    is_active: 1,
    status: "Received",
    total: orderItems.reduce((sum, item) => sum + item.subtotal, 0),
    isPaid: false,
    paymentConfirmedAt: null
  };
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    if (apiConfig.useMocks) return readOrders();
    return apiRequest<Order[]>("/Order");
  },

  async checkout(cart: Cart): Promise<Order> {
    if (apiConfig.useMocks) {
      const order = makeOrderFromCart(cart);
      saveOrders([order, ...readOrders()]);
      await cartService.clear();
      return order;
    }

    return apiRequest<Order>(`/Cart/${cart.id}/checkout`, { method: "POST" });
  },

  async confirmPayment(orderId: string): Promise<Order | null> {
    if (apiConfig.useMocks) {
      const orders = readOrders();
      const updated = orders.map(order => order.id === orderId
        ? { ...order, isPaid: true, paymentConfirmedAt: new Date().toISOString() }
        : order
      );
      saveOrders(updated);
      return updated.find(order => order.id === orderId) ?? null;
    }

    await apiRequest(`/Order/${orderId}/confirm-payment`, { method: "POST" });
    return null;
  },

  async changeStatus(orderId: string, nextStatus?: OrderStatus): Promise<Order | null> {
    if (apiConfig.useMocks) {
      const sequence: OrderStatus[] = ["Received", "Preparing", "Ready", "Delivered"];
      const orders = readOrders();
      const updated = orders.map(order => {
        if (order.id !== orderId) return order;
        const currentIndex = sequence.indexOf(order.status);
        return { ...order, status: nextStatus ?? sequence[Math.min(currentIndex + 1, sequence.length - 1)] };
      });
      saveOrders(updated);
      return updated.find(order => order.id === orderId) ?? null;
    }

    await apiRequest(`/Order/${orderId}/change-status`, { method: "PATCH" });
    return null;
  }
};
