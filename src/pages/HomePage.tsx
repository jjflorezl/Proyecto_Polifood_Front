import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { productService } from "../services/product.service";
import type { Product } from "../types/product";
import stores from "../mocks/stores.json";

type Store = { store_id: string; store_name: string; categories: string; is_active: number };

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeStores: Store[] = (stores as Store[]).filter(s => s.is_active === 1);

  useEffect(() => {
    setLoading(true);
    setError("");
    productService.getAll()
      .then(setProducts)
      .catch(() => setError("No se pudieron cargar los productos."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(product => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(search.toLowerCase()) ||
      product.product_description.toLowerCase().includes(search.toLowerCase());

    // Cuando el backend soporte store_id en Product, cambiar esto:
    // const matchesStore = selectedStore === "all" || product.store_id === selectedStore;
    const matchesStore = true;

    return matchesSearch && matchesStore;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold">Comida rápida para estudiantes</h1>
        <p className="mt-3 max-w-2xl text-orange-50">
          Explora el menú, agrega productos al carrito y confirma tu pedido.
        </p>
      </section>

      {/* Filtro de tiendas */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStore("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedStore === "all"
              ? "bg-orange-600 text-white"
              : "bg-white border border-orange-200 text-slate-600 hover:border-orange-400"
          }`}
        >
          Todas las tiendas
        </button>
        {activeStores.map(store => (
          <button
            key={store.store_id}
            onClick={() => setSelectedStore(store.store_id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedStore === store.store_id
                ? "bg-orange-600 text-white"
                : "bg-white border border-orange-200 text-slate-600 hover:border-orange-400"
            }`}
          >
            {store.store_name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Menú disponible</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar comida..."
          className="w-full max-w-xs rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="mt-12 flex flex-col items-center gap-3 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p>Cargando productos...</p>
        </div>
      )}

      {/* Estado de error */}
      {!loading && error && (
        <div className="mt-12 flex flex-col items-center gap-3 text-slate-500">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError("");
              productService.getAll()
                .then(setProducts)
                .catch(() => setError("No se pudieron cargar los productos."))
                .finally(() => setLoading(false));
            }}
            className="rounded-xl bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Sin resultados en búsqueda */}
      {!loading && !error && filtered.length === 0 && (
        <div className="mt-12 text-center text-slate-400">
          <p className="text-lg font-semibold">Sin resultados</p>
          <p className="text-sm">No encontramos productos para "{search}".</p>
        </div>
      )}

      {/* Grid de productos */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(product => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
