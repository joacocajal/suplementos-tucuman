import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";

function ComboSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden animate-pulse aspect-[3/4] shadow-sm flex-shrink-0 w-44 sm:w-52">
      <div className="h-3/4 bg-[#F5F5F5]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#F0F0F0] rounded w-3/4" />
        <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function CombosSection({ onOpenCheckout }) {
  const [flippedId, setFlippedId] = useState(null);
  const { products: combos, loading } = useProducts({ categoria: "combos" });

  const destacados = combos.filter((c) => c.destacado);

  if (!loading && destacados.length === 0) return null;

  function handleFlip(id) {
    setFlippedId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="font-display text-3xl md:text-4xl text-[#111111]">
          COMBOS Y <span className="text-[#FF6B1A]">PROMOS</span>
        </h2>
        <p className="text-[#6B7280] text-sm mt-1">Packs a precio especial. Ahorrá comprando combinado.</p>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {Array.from({ length: 4 }).map((_, i) => <ComboSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {destacados.map((p) => (
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
