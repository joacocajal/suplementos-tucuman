import { X, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import useCartStore, { selectTotal } from "../../store/cartStore";
import { formatCurrency } from "../../lib/utils";
import CheckoutModal from "./CheckoutModal";

export default function CartSheet({ open, onClose, onSuccess }) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#161616] border-l border-[#262626] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#FF6B1A]" />
            <span className="font-semibold text-[#FAFAFA]">Carrito</span>
            {items.length > 0 && (
              <span className="bg-[#FF6B1A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.reduce((s, i) => s + i.cantidad, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <ShoppingCart size={48} className="text-[#333]" />
              <p className="text-[#A1A1AA]">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-[#0A0A0A] rounded-xl p-3 border border-[#262626]">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-[#161616] overflow-hidden flex-shrink-0">
                  {item.imagen_url ? (
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#FAFAFA] line-clamp-1 mb-1">{item.nombre}</p>
                  <p className="text-xs text-[#A1A1AA] mb-2">{formatCurrency(item.precio)} c/u</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.id, item.cantidad - 1, item.stock)}
                        className="w-6 h-6 rounded-md bg-[#262626] hover:bg-[#333] text-[#FAFAFA] flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm text-[#FAFAFA]">{item.cantidad}</span>
                      <button
                        onClick={() => updateQty(item.id, item.cantidad + 1, item.stock)}
                        className="w-6 h-6 rounded-md bg-[#262626] hover:bg-[#333] text-[#FAFAFA] flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#FF6B1A]">
                        {formatCurrency(item.precio * item.cantidad)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-[#262626] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#A1A1AA]">Total</span>
              <span className="text-xl font-bold text-[#FAFAFA]">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-[#FF6B1A] hover:bg-[#FF8540] text-white font-bold py-4 rounded-xl transition-colors text-base"
            >
              Finalizar compra por WhatsApp 💬
            </button>
          </div>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
        />
      )}
    </>
  );
}
