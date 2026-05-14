import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { buildWhatsAppMessage, formatCurrency } from "../../lib/utils";
import useCartStore, { selectTotal } from "../../store/cartStore";

export default function CheckoutModal({ onClose, onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  async function handleConfirm() {
    if (items.length === 0) return;
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
        cliente_nombre: nombre || null,
        cliente_whatsapp: whatsapp || null,
        estado: "pendiente",
      });

      const url = buildWhatsAppMessage(items, total, nombre, whatsapp);
      window.open(url, "_blank");
      clearCart();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#262626] rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-[#FAFAFA]">CONFIRMAR PEDIDO</h3>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm text-[#A1A1AA]">
            Datos opcionales para que Tomás pueda contactarte:
          </p>
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Tu nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan García"
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Tu WhatsApp</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej: 3815100000"
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-[#262626] pt-4 mb-6">
          <div className="flex justify-between text-sm text-[#A1A1AA] mb-1">
            <span>{items.length} {items.length === 1 ? "producto" : "productos"}</span>
          </div>
          <div className="flex justify-between font-semibold text-[#FAFAFA]">
            <span>Total</span>
            <span className="text-[#FF6B1A]">{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-[#FF6B1A] hover:bg-[#FF8540] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Procesando..." : "Confirmar y abrir WhatsApp 💬"}
        </button>
      </div>
    </div>
  );
}
