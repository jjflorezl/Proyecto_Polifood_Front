import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { productService } from "../services/product.service";
import type { Product } from "../types/product";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  const filtered = products.filter(product =>
    product.product_name.toLowerCase().includes(search.toLowerCase()) ||
    product.product_description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold">Comida rápida para estudiantes</h1>
        <p className="mt-3 max-w-2xl text-orange-50">Explora el menú, agrega productos al carrito y confirma tu pedido.</p>
      </section>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Menú disponible</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar comida..."
          className="w-full max-w-xs rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(product => <ProductCard key={product.product_id} product={product} />)}
      </div>
    </main>
  );
}
