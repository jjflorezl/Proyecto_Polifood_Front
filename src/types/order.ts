import type { Product } from "./product";

export type OrderStatus = "Received" | "Preparing" | "Ready" | "Delivered";

export type OrderItem = {
  orderItem_id: string;
  orderId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product_id: string;
  product: Product;
  is_active: number;
};

export type Order = {
  id: string;
  cartId: string;
  orderItems: OrderItem[];
  is_active: number;
  status: OrderStatus;
  total: number;
  isPaid: boolean;
  paymentConfirmedAt?: string | null;
};
