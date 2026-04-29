import { Link, useNavigate } from "react-router-dom";
import { CartItemRow } from "../components/CartItemRow";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/order.service";

export function CartPage() {
  const { cart, totalPrice, refreshCart } = useCart();
  const navigate = useNavigate();

  async function handleCheckout() {
    if (!cart || cart.items.length === 0) return;
    const order = await orderService.checkout(cart);
    await refreshCart();
    navigate(`/checkout/${order.id}`);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Tu carrito</h1>

      {!cart || cart.items.length === 0 ? (
        <section className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">Todavía no tienes productos en el carrito.</p>
          <Link to="/" className="mt-4 inline-block rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white">Ver menú</Link>
        </section>
      ) : (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cart.items.map(item => <CartItemRow key={item.id} item={item} />)}
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Resumen</h2>
            <div className="mt-4 flex justify-between text-slate-600">
              <span>Total</span>
              <strong className="text-2xl text-orange-600">${totalPrice.toLocaleString("es-CO")}</strong>
            </div>
            <button onClick={handleCheckout} className="mt-6 w-full rounded-xl bg-orange-600 px-4 py-3 font-bold text-white hover:bg-orange-700">
              Confirmar pedido
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}
