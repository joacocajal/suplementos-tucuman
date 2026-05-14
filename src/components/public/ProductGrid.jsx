import { Search } from "lucide-react";
import { useState } from "react";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import { useProducts } from "../../hooks/useProducts";
import { useRealtimeProducts } from "../../hooks/useRealtimeProducts";

function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-[#262626] bg-[#161616] overflow-hidden animate-pulse aspect-[3/4]">
      <div className="h-3/4 bg-[#222]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#222] rounded w-3/4" />
        <div className="h-3 bg-[#222] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ProductGrid({ onAddToast, onOpenCheckout }) {
  const [categoria, setCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [flippedId, setFlippedId] = useState(null);

  const { products, loading, refetch } = useProducts({ categoria, search });
  useRealtimeProducts(() => refetch());

  function handleFlip(id) {
    setFlippedId((prev) => (prev === id ? null : id));
  }

  return (
    <section id="productos" className="py-12">
      <h2 className="font-display text-3xl md:text-4xl text-[#FAFAFA] mb-8">
        NUESTROS PRODUCTOS
      </h2>

      {/* Buscador */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={18} />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#161616] border border-[#262626] rounded-xl pl-10 pr-4 py-3 text-sm text-[#FAFAFA] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF6B1A] transition-colors"
        />
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <CategoryFilter selected={categoria} onChange={setCategoria} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📦</span>
          <p className="text-[#A1A1AA] text-lg">No hay productos disponibles</p>
          {search && (
            <button onClick={() => setSearch("")} className="mt-3 text-[#FF6B1A] text-sm hover:underline">
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              flipped={flippedId === p.id}
              onFlip={handleFlip}
              onOpenCheckout={onOpenCheckout}
            />
          ))}
        </div>
      )}
    </section>
  );
}
