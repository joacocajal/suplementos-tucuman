import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, MessageCircle } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { getProductImage } from "../../lib/productImageMap";
import { formatCurrency } from "../../lib/utils";
import useCartStore from "../../store/cartStore";

export default function CombosSection({ onOpenCheckout }) {
  const [current, setCurrent] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const touchStart = useRef(0);
  const addItem = useCartStore((s) => s.addItem);

  const { products: combos, loading } = useProducts({ categoria: "combos" });
  const destacados = combos.filter((c) => c.destacado);

  if (!loading && destacados.length === 0) return null;

  const combo = destacados[current];

  function goTo(i) {
    setCurrent(i);
    setQty(1);
    setAdded(false);
  }
  const prev = () => goTo((current - 1 + destacados.length) % destacados.length);
  const next = () => goTo((current + 1) % destacados.length);

  function onTouchStart(e) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }

  function handleAddToCart() {
    if (!combo) return;
    addItem(combo, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWhatsApp() {
    if (!combo) return;
    const msg = encodeURIComponent(
      `Hola! Me interesa *${combo.nombre}* x${qty} — ${formatCurrency(combo.precio * qty)}`
    );
    window.open(`https://wa.me/5493815100725?text=${msg}`, "_blank", "noreferrer");
  }

  return (
    <section className="py-10">
      <div className="mb-6 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-[#111111]">
          COMBOS Y <span className="text-[#FF6B1A]">PROMOS</span>
        </h2>
        <p className="text-[#6B7280] text-sm mt-1">Packs a precio especial. Ahorrá comprando combinado.</p>
      </div>

      {loading ? (
        <div className="w-full h-72 rounded-2xl bg-[#FF6B1A]/20 animate-pulse" />
      ) : (
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FF6B1A 0%, #e85a0a 100%)" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Decoración fondo */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 80% 50%, #ffffff 0%, transparent 60%)",
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-center gap-6 px-8 py-8 sm:py-10 min-h-[280px]">
            {/* Info */}
            <div className="flex-1 text-white order-2 sm:order-1 text-center sm:text-left">
              <span className="inline-block text-xs font-bold bg-white/20 border border-white/30 px-3 py-1 rounded-full mb-3 tracking-wider">
                COMBO ESPECIAL
              </span>
              <h3 className="font-display text-3xl sm:text-4xl leading-tight mb-1">
                {combo?.nombre}
              </h3>
              <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-xs">
                {combo?.descripcion}
              </p>
              <p className="text-4xl font-bold mb-5">
                {combo ? formatCurrency(combo.precio * qty) : ""}
              </p>

              {/* Cantidad */}
              <div className="flex items-center gap-3 mb-5 justify-center sm:justify-start">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-colors"
                >−</button>
                <span className="text-xl font-bold w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(combo?.stock || 99, q + 1))}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-colors"
                >+</button>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#FF6B1A] font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
                >
                  <ShoppingCart size={16} />
                  {added ? "¡Agregado!" : "Agregar al carrito"}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <MessageCircle size={16} />
                  Ir a WhatsApp
                </button>
              </div>
            </div>

            {/* Imagen */}
            <div className="order-1 sm:order-2 flex-shrink-0 w-48 sm:w-64 flex items-center justify-center">
              {combo && getProductImage(combo) ? (
                <img
                  src={getProductImage(combo)}
                  alt={combo.nombre}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  style={{ maxHeight: "240px" }}
                />
              ) : (
                <div className="w-full h-40 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="text-5xl">🎁</span>
                </div>
              )}
            </div>
          </div>

          {/* Flechas */}
          {destacados.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Dots */}
      {!loading && destacados.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {destacados.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-[#FF6B1A]" : "w-2 h-2 bg-[#D1D5DB] hover:bg-[#FF6B1A]/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
