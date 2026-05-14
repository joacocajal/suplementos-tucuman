import { X, Trash2, Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import useCartStore, { selectTotal } from "../../store/cartStore";
import { formatCurrency, buildWhatsAppMessage } from "../../lib/utils";

export default function CartSheet({ open, onClose, onSuccess }) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!whatsapp.trim()) e.whatsapp = "Ingresá tu WhatsApp";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleWhatsApp() {
    if (!validate()) return;
    setLoading(true);
    try {
      const productosJson = items.map((i) => ({
        producto_id: i.id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad,
        subtotal: i.precio * i.cantidad,
      }));

      await supabase.from("pedidos").insert({
        productos_json: productosJson,
        total,
        cliente_nombre: nombre.trim(),
        cliente_whatsapp: whatsapp.trim(),
        estado: "pendiente",
      });

      const url = buildWhatsAppMessage(items, total, nombre.trim(), whatsapp.trim());
      window.open(url, "_blank");
      clearCart();
      setNombre("");
      setWhatsapp("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-[#E5E7EB] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#FF6B1A]" />
            <span className="font-semibold text-[#111111]">Carrito</span>
            {items.length > 0 && (
              <span className="bg-[#FF6B1A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.reduce((s, i) => s + i.cantidad, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111111] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <ShoppingCart size={48} className="text-[#D1D5DB]" />
              <p className="text-[#6B7280]">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-[#F8F8F8] rounded-xl p-3 border border-[#E5E7EB]">
                <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                  {item.imagen_url ? (
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] line-clamp-1 mb-1">{item.nombre}</p>
                  <p className="text-xs text-[#6B7280] mb-2">{formatCurrency(item.precio)} c/u</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.id, item.cantidad - 1, item.stock)}
                        className="w-6 h-6 rounded-md bg-white border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm text-[#111111]">{item.cantidad}</span>
                      <button
                        onClick={() => updateQty(item.id, item.cantidad + 1, item.stock)}
                        className="w-6 h-6 rounded-md bg-white border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] flex items-center justify-center transition-colors"
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
                        className="text-[#6B7280] hover:text-red-500 transition-colors"
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

        {/* Footer con form + CTA */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E5E7EB] space-y-3 bg-[#FAFAFA]">
            <p className="text-xs text-[#6B7280] font-medium">Tus datos para confirmar el pedido</p>

            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  placeholder="Tu nombre *"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setErrors((p) => ({ ...p, nombre: null })); }}
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none transition-colors ${errors.nombre ? "border-red-400 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#FF6B1A]"}`}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Tu WhatsApp *"
                  value={whatsapp}
                  onChange={(e) => { setWhatsapp(e.target.value); setErrors((p) => ({ ...p, whatsapp: null })); }}
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none transition-colors ${errors.whatsapp ? "border-red-400 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#FF6B1A]"}`}
                />
                {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-[#6B7280]">Total</span>
              <span className="text-xl font-bold text-[#111111]">{formatCurrency(total)}</span>
            </div>

            <button
              onClick={handleWhatsApp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors text-base"
            >
              <MessageCircle size={20} />
              {loading ? "Enviando..." : "Ir a WhatsApp"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
