import { Clock, Plus } from "lucide-react";
import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
      <img src={product.product_image} alt={product.product_name} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{product.product_name}</h3>
            <p className="line-clamp-2 text-sm text-slate-500">{product.product_description}</p>
          </div>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
            {product.is_available ? "Disponible" : "Agotado"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-orange-600">${product.product_price.toLocaleString("es-CO")}</p>
          <span className="flex items-center gap-1 text-sm text-slate-500"><Clock size={16} /> {product.prepTimeMinutes} min</span>
        </div>

        <button
          disabled={!product.is_available}
          onClick={() => addToCart(product)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Plus size={18} /> Agregar al carrito
        </button>
      </div>
    </article>
  );
}
