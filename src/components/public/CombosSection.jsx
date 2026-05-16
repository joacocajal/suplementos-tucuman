import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, MessageCircle } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
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
  const BANNER_MAP = {
    "Combo Star": "/productos/banner1.1.png",
    "Combo Creatina x2": "/productos/banner2.1.png",
    "Combo Geles Mervick x12 + Regalo": "/productos/banner3.1.png",
    "Combo Star Premium": "/productos/banner4.1.png",
    "Combo Carrera": "/productos/banner5.1.png",
  };
  const bannerSrc = combo ? (BANNER_MAP[combo.nombre] ?? "/productos/banner1.1.png") : "/productos/banner1.1.png";

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

  if (loading) {
    return <div className="w-full animate-pulse bg-[#F26522]/20" style={{ height: "clamp(280px, 45vw, 560px)" }} />;
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "clamp(280px, 45vw, 560px)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Fondo: banner full-width con overlay oscuro */}
      <div className="absolute inset-0">
        <img
          src={bannerSrc}
          alt=""
          className="w-full h-full object-cover object-right sm:object-center"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Contenido */}
      <div
        className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex items-center"
        style={{ minHeight: "clamp(280px, 45vw, 560px)" }}
      >
        <div className="w-full sm:w-1/2 py-10 text-white flex flex-col justify-center">
          <span className="inline-block text-xs font-bold bg-white/20 border border-white/30 px-3 py-1 rounded-full mb-3 tracking-wider w-fit">
            COMBO ESPECIAL
          </span>
          <h3 className="font-display text-3xl sm:text-4xl leading-tight mb-1">
            {combo?.nombre}
          </h3>
          <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-[300px]">
            {combo?.descripcion}
          </p>
          <p className="text-4xl font-bold mb-5">
            {combo ? formatCurrency(combo.precio * qty) : ""}
          </p>

          {/* Cantidad */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg bg-[#F26522] hover:bg-[#e05a1a] text-white font-bold flex items-center justify-center transition-colors text-lg"
            >−</button>
            <span className="text-xl font-bold w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(combo?.stock || 99, q + 1))}
              className="w-9 h-9 rounded-lg bg-[#F26522] hover:bg-[#e05a1a] text-white font-bold flex items-center justify-center transition-colors text-lg"
            >+</button>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-2 w-fit">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#F26522] font-bold px-6 py-3 rounded-xl transition-all text-sm shadow-lg"
            >
              <ShoppingCart size={16} />
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg"
            >
              <MessageCircle size={16} />
              Ir a WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Flechas de navegación */}
      {destacados.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {destacados.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {destacados.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir a combo ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
