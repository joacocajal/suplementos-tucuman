import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function StockMovementModal({ product, tipo, onClose, onSaved }) {
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);

  const labels = {
    entrada: { title: "Cargar entrada de stock", btn: "Confirmar entrada", color: "text-[#22C55E]" },
    ajuste: { title: "Ajuste de stock", btn: "Confirmar ajuste", color: "text-yellow-400" },
  };
  const l = labels[tipo] || labels.entrada;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cantidad || parseInt(cantidad, 10) <= 0) return;
    setSaving(true);

    const qty = parseInt(cantidad, 10);
    const stockAnterior = product.stock;
    const stockNuevo = tipo === "ajuste" ? qty : stockAnterior + qty;

    await Promise.all([
      supabase.from("productos").update({ stock: stockNuevo, updated_at: new Date().toISOString() }).eq("id", product.id),
      supabase.from("movimientos_stock").insert({
        producto_id: product.id,
        tipo,
        cantidad: qty,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        motivo: motivo || null,
      }),
    ]);

    setSaving(false);
    onSaved?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#262626] rounded-2xl w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <h3 className="font-semibold text-[#FAFAFA] text-sm">{l.title}</h3>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#FAFAFA]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-3">
            <p className="text-xs text-[#A1A1AA] mb-0.5">Producto</p>
            <p className="text-sm font-medium text-[#FAFAFA]">{product.nombre}</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Stock actual: <span className={l.color}>{product.stock}</span></p>
          </div>

          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">
              {tipo === "ajuste" ? "Nuevo stock total" : "Cantidad a agregar"} *
            </label>
            <input
              type="number"
              min="1"
              required
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder={tipo === "ajuste" ? "Stock nuevo" : "Unidades"}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
            {cantidad && tipo !== "ajuste" && (
              <p className="text-xs text-[#A1A1AA] mt-1">
                Stock resultante: <span className="text-[#22C55E]">{product.stock + parseInt(cantidad, 10)}</span>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Motivo (opcional)</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Pedido proveedor, corrección..."
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-[#262626] hover:bg-[#333] text-[#FAFAFA] font-medium py-2.5 rounded-xl transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#FF6B1A] hover:bg-[#FF8540] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              {saving ? "Guardando..." : l.btn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
