import { useState } from "react";
import { Minus, Plus, MessageCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatCurrency } from "../../lib/utils";
import { getProductImage } from "../../lib/productImageMap";
import { CATEGORIAS } from "../../lib/constants";
import useCartStore from "../../store/cartStore";

export default function ProductCard({ product, flipped, onFlip, onOpenCheckout }) {
  const [cantidad, setCantidad] = useState(1);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const sinStock = product.stock === 0;
  const cat = CATEGORIAS.find((c) => c.value === product.categoria);
  const imgSrc = getProductImage(product);
  const isShaker = product.nombre === "Shake Everlast";

  function handleCardClick() {
    if (sinStock) return;
    onFlip(product.id);
  }

  function handleReservar(e) {
    e.stopPropagation();
    addItem(product, cantidad);
    onOpenCheckout?.();
    onFlip(null);
    setCantidad(1);
  }

  function handleVolver(e) {
    e.stopPropagation();
    onFlip(null);
    setCantidad(1);
  }

  function decrement(e) {
    e.stopPropagation();
    setCantidad((q) => Math.max(1, q - 1));
  }

  function increment(e) {
    e.stopPropagation();
    setCantidad((q) => Math.min(product.stock, q + 1));
  }

  return (
    <div
      className={cn(
        "[perspective:1000px] transition-transform duration-200",
        !sinStock && !flipped && "hover:scale-[1.02]",
        sinStock ? "cursor-not-allowed" : "cursor-pointer"
      )}
      onClick={handleCardClick}
    >
      <div
        className={cn(
          "relative w-full aspect-[3/4] [transform-style:preserve-3d] transition-transform duration-700",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* ── FRONT ── */}
        <div className={cn(
          "absolute inset-0 [backface-visibility:hidden] rounded-2xl border bg-white overflow-hidden flex flex-col transition-colors duration-200 shadow-sm",
          sinStock ? "border-[#E5E7EB] opacity-60" : flipped ? "border-[#FF6B1A]/40" : "border-[#E5E7EB] hover:border-[#FF6B1A]"
        )}>
          {/* Imagen */}
          <div className="relative flex-1 bg-[#F8F8F8] flex items-center justify-center overflow-hidden">
            {imgSrc && !imgError ? (
              <img
                src={imgSrc}
                alt={product.nombre}
                className="w-full h-full object-contain p-3"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-5xl text-[#D1D5DB]">{cat?.icon || "📦"}</span>
            )}

            {/* Badge categoría */}
            {cat && (
              <span className="absolute top-2 left-2 text-xs bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                {cat.label}
              </span>
            )}

            {/* Sin stock overlay */}
            {sinStock && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <span className="text-sm font-semibold text-[#6B7280] border border-[#D1D5DB] px-3 py-1 rounded-full">
                  SIN STOCK
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-3 py-3 space-y-1">
            <h3 className="text-sm font-medium text-[#111111] line-clamp-2 leading-snug">
              {product.nombre}
            </h3>
            <p className="text-base font-bold text-[#FF6B1A]">
              {formatCurrency(product.precio)}
            </p>
            {isShaker && (
              <p className="text-xs text-[#6B7280]">Consultar colores</p>
            )}
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl border border-[#FF6B1A]/30 bg-white overflow-hidden flex flex-col p-4 shadow-sm">
          {/* Nombre */}
          <p className="font-bebas text-base text-[#111111] leading-tight mb-3 line-clamp-2">
            {product.nombre}
          </p>
          {isShaker && (
            <p className="text-xs text-[#6B7280] mb-2">Consultar colores disponibles</p>
          )}

          {/* Selector cantidad */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-[#6B7280] uppercase tracking-wide">Cantidad</p>
            <div className="flex items-center gap-4">
              <button
                onClick={decrement}
                className="w-9 h-9 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] flex items-center justify-center transition-colors text-lg font-bold"
              >
                −
              </button>
              <span className="w-10 text-center text-2xl font-bold text-[#111111]">
                {cantidad}
              </span>
              <button
                onClick={increment}
                className="w-9 h-9 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] flex items-center justify-center transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>
            <p className="text-lg font-bold text-[#FF6B1A]">
              {formatCurrency(product.precio * cantidad)}
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-2 mt-2">
            <button
              onClick={handleReservar}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B1A] hover:bg-[#FF8540] text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              <MessageCircle size={16} />
              Reservar por WhatsApp
            </button>
            <button
              onClick={handleVolver}
              className="w-full text-xs text-[#6B7280] hover:text-[#111111] transition-colors py-1"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
