import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function CombosSection({ onOpenCheckout }) {
  const [flippedId, setFlippedId] = useState(null);
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const { products: combos, loading } = useProducts({ categoria: "combos" });

  const destacados = combos.filter((c) => c.destacado);

  if (!loading && destacados.length === 0) return null;

  function handleFlip(id) {
    setFlippedId((prev) => (prev === id ? null : id));
  }

  const prev = () => {
    setFlippedId(null);
    setCurrent((c) => (c - 1 + destacados.length) % destacados.length);
  };
  const next = () => {
    setFlippedId(null);
    setCurrent((c) => (c + 1) % destacados.length);
  };

  function onTouchStart(e) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }

  return (
    <section className="py-10">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-[#111111]">
          COMBOS Y <span className="text-[#FF6B1A]">PROMOS</span>
        </h2>
        <p className="text-[#6B7280] text-sm mt-1">Packs a precio especial. Ahorrá comprando combinado.</p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="w-64 aspect-[3/4] rounded-2xl border border-[#E5E7EB] bg-white animate-pulse shadow-sm" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center gap-4">
          {/* Flecha izquierda */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#E5E7EB] shadow-sm hover:border-[#FF6B1A] hover:shadow-md flex items-center justify-center transition-all"
          >
            <ChevronLeft size={20} className="text-[#111111]" />
          </button>

          {/* Card único */}
          <div
            className="w-64 sm:w-72"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {destacados[current] && (
              <ProductCard
                key={destacados[current].id}
                product={destacados[current]}
                flipped={flippedId === destacados[current].id}
                onFlip={handleFlip}
                onOpenCheckout={onOpenCheckout}
              />
            )}
          </div>

          {/* Flecha derecha */}
          <button
            onClick={next}
            aria-label="Siguiente"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#E5E7EB] shadow-sm hover:border-[#FF6B1A] hover:shadow-md flex items-center justify-center transition-all"
          >
            <ChevronRight size={20} className="text-[#111111]" />
          </button>
        </div>
      )}

      {/* Dots */}
      {!loading && destacados.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {destacados.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFlippedId(null); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-[#FF6B1A]"
                  : "w-2 h-2 bg-[#D1D5DB] hover:bg-[#FF6B1A]/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
