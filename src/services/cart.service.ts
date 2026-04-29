import type { Cart } from "../types/cart";
import type { Product } from "../types/product";
import { apiConfig, apiRequest } from "./api";

const CART_KEY = "polifood_cart";

const emptyCart = (): Cart => ({ id: crypto.randomUUID(), items: [], is_active: 1 });

function readCart(): Cart {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) as Cart : emptyCart();
}

function saveCart(cart: Cart): Cart {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

export const cartService = {
  async getCurrent(): Promise<Cart> {
    if (apiConfig.useMocks) return readCart();
    const carts = await apiRequest<Cart[]>("/Cart");
    return carts[0];
  },

  async addItem(cartId: string, product: Product, quantity: number): Promise<Cart> {
    if (apiConfig.useMocks) {
      const cart = readCart();
      const existing = cart.items.find(item => item.productId === product.product_id);

      if (existing) existing.quantity += quantity;
      else cart.items.push({
        id: crypto.randomUUID(),
        productId: product.product_id,
        product,
        quantity,
        unitPrice: product.product_price
      });

      return saveCart(cart);
    }

    await apiRequest(`/Cart/${cartId}/add-item`, {
      method: "POST",
      body: JSON.stringify({ productId: product.product_id, quantity })
    });
    return this.getCurrent();
  },

  async updateQuantity(cartId: string, productId: string, quantity: number): Promise<Cart> {
    if (apiConfig.useMocks) {
      const cart = readCart();
      cart.items = cart.items.map(item => item.productId === productId ? { ...item, quantity } : item);
      return saveCart(cart);
    }

    await apiRequest(`/Cart/${cartId}/update-quantity`, {
      method: "PATCH",
      body: JSON.stringify({ productId, quantity })
    });
    return this.getCurrent();
  },

  async removeItem(cartId: string, productId: string): Promise<Cart> {
    if (apiConfig.useMocks) {
      const cart = readCart();
      cart.items = cart.items.filter(item => item.productId !== productId);
      return saveCart(cart);
    }

    await apiRequest(`/Cart/${cartId}/remove-item/${productId}`, { method: "DELETE" });
    return this.getCurrent();
  },

  async clear(): Promise<Cart> {
    const cart = emptyCart();
    return saveCart(cart);
  }
};
