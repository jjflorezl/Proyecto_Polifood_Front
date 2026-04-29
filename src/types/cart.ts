import type { Product } from "./product";

export type CartItemDto = {
  productId: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  is_active: number;
};
