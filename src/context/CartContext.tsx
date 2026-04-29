import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/cart.service";
import type { Cart } from "../types/cart";
import type { Product } from "../types/product";

type CartContextValue = {
  cart: Cart | null;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);

  async function refreshCart() {
    setCart(await cartService.getCurrent());
  }

  useEffect(() => {
    refreshCart();
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    cart,
    totalItems: cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    totalPrice: cart?.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) ?? 0,
    refreshCart,
    async addToCart(product, quantity = 1) {
      const currentCart = cart ?? await cartService.getCurrent();
      setCart(await cartService.addItem(currentCart.id, product, quantity));
    },
    async updateQuantity(productId, quantity) {
      if (!cart) return;
      if (quantity < 1) return;
      setCart(await cartService.updateQuantity(cart.id, productId, quantity));
    },
    async removeItem(productId) {
      if (!cart) return;
      setCart(await cartService.removeItem(cart.id, productId));
    },
    async clearCart() {
      setCart(await cartService.clear());
    }
  }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
