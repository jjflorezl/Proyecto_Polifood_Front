import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types/cart";
import { useCart } from "../context/CartContext";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const subtotal = item.quantity * item.unitPrice;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <img src={item.product.product_image} alt={item.product.product_name} className="h-20 w-20 rounded-xl object-cover" />
      <div className="flex-1">
        <h3 className="font-bold">{item.product.product_name}</h3>
        <p className="text-sm text-slate-500">${item.unitPrice.toLocaleString("es-CO")} c/u</p>
        <p className="font-semibold text-orange-600">Subtotal: ${subtotal.toLocaleString("es-CO")}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"><Minus size={16} /></button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"><Plus size={16} /></button>
      </div>
      <button onClick={() => removeItem(item.productId)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 size={18} /></button>
    </div>
  );
}
