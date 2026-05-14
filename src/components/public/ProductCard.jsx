import { useState } from "react";
import { MessageCircle, Package, ArrowLeft, ShoppingCart } from "lucide-react";
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
  const isCombo = !!product.es_combo;

  function handleCardClick() {
    if (sinStock) return;
    onFlip(product.id);
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    addItem(product, cantidad);
    onOpenCheckout?.();
    onFlip(null);
    setCantidad(1);
  }

  function handleWhatsApp(e) {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hola! Me interesa *${product.nombre}* x${cantidad} — ${formatCurrency(product.precio * cantidad)}`
    );
    window.open(`https://wa.me/5493815100725?text=${msg}`, "_blank", "noreferrer");
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
          sinStock
            ? "border-[#E5E7EB] opacity-60"
            : isCombo
            ? flipped ? "border-[#FF6B1A]" : "border-[#FF6B1A]/40 hover:border-[#FF6B1A]"
            : flipped ? "border-[#FF6B1A]/40" : "border-[#E5E7EB] hover:border-[#FF6B1A]"
        )}>
          {/* Imagen */}
          <div className="relative flex-1 bg-[#F8F8F8] flex items-center justify-center overflow-hidden">
            {imgSrc && !imgError ? (
              <img
                src={imgSrc}
                alt={product.nombre}
                className={cn("w-full h-full", isCombo ? "object-contain" : "object-contain p-3")}
                onError={() => setImgError(true)}
              />
            ) : isCombo ? (
              <div className="flex flex-col items-center gap-2">
                <Package size={40} className="text-[#D1D5DB]" />
                <span className="text-xs text-[#9CA3AF]">Combo sin imagen</span>
              </div>
            ) : (
              <span className="text-5xl text-[#D1D5DB]">{cat?.icon || "📦"}</span>
            )}

            {/* Badge COMBO o categoría */}
            {isCombo ? (
              <span className="absolute top-2 left-2 text-xs bg-[#FF6B1A] text-white font-bold px-2 py-0.5 rounded-full">
                COMBO
              </span>
            ) : cat ? (
              <span className="absolute top-2 left-2 text-xs bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                {cat.label}
              </span>
            ) : null}

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
          {/* Flechita volver */}
          <button
            onClick={handleVolver}
            className="self-start flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#FF6B1A] transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Volver
          </button>

          {/* Nombre */}
          <p className="font-bebas text-base text-[#111111] leading-tight mb-1 line-clamp-2">
            {product.nombre}
          </p>
          {product.descripcion && (
            <p className="text-xs text-[#6B7280] mb-1 line-clamp-2 leading-snug">
              {product.descripcion}
            </p>
          )}
          {isShaker && !product.descripcion && (
            <p className="text-xs text-[#6B7280] mb-1">Consultar colores disponibles</p>
          )}

          {/* Selector cantidad */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={decrement}
                className="w-8 h-8 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] flex items-center justify-center transition-colors text-lg font-bold"
              >
                −
              </button>
              <span className="w-8 text-center text-xl font-bold text-[#111111]">
                {cantidad}
              </span>
              <button
                onClick={increment}
                className="w-8 h-8 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] flex items-center justify-center transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>
            <p className="text-base font-bold text-[#FF6B1A]">
              {formatCurrency(product.precio * cantidad)}
            </p>
          </div>

          {/* 3 acciones */}
          <div className="space-y-2 mt-2">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              <MessageCircle size={15} />
              Ir a WhatsApp
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B1A] hover:bg-[#FF8540] text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              <ShoppingCart size={15} />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
