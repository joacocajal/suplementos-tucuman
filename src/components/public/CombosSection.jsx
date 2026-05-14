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
          className="relative w-full rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[400px]"
          style={{ background: "#F07020" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Imagen — absoluta, ocupa toda la mitad derecha */}
          {combo && getProductImage(combo) && (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-end justify-center pointer-events-none">
              <img
                src={getProductImage(combo)}
                alt={combo.nombre}
                className="h-full w-auto object-contain"
                style={{ maxHeight: "420px" }}
              />
            </div>
          )}

          {/* Info — lado izquierdo */}
          <div className="relative z-10 w-full sm:w-1/2 px-7 py-8 text-white flex flex-col justify-center min-h-[340px] sm:min-h-[400px]">
              <span className="inline-block text-xs font-bold bg-white/20 border border-white/30 px-3 py-1 rounded-full mb-3 tracking-wider w-fit">
                COMBO ESPECIAL
              </span>
              <h3 className="font-display text-3xl sm:text-4xl leading-tight mb-1">
                {combo?.nombre}
              </h3>
              <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-[240px]">
                {combo?.descripcion}
              </p>
              <p className="text-4xl font-bold mb-5">
                {combo ? formatCurrency(combo.precio * qty) : ""}
              </p>

              {/* Cantidad */}
              <div className="flex items-center gap-3 mb-5">
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
              <div className="flex flex-col gap-2 w-fit">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#F07020] font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
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
