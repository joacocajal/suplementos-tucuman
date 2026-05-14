import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function StockMovementModal({ product, tipo, onClose, onSaved }) {
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);

  const labels = {
    entrada: { title: "Cargar entrada de stock", btn: "Confirmar entrada", color: "text-[#16A34A]" },
    ajuste: { title: "Ajuste de stock", btn: "Confirmar ajuste", color: "text-yellow-600" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-sm animate-fade-in shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111111] text-sm">{l.title}</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111111]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-3">
            <p className="text-xs text-[#6B7280] mb-0.5">Producto</p>
            <p className="text-sm font-medium text-[#111111]">{product.nombre}</p>
            <p className="text-xs text-[#6B7280] mt-1">Stock actual: <span className={l.color}>{product.stock}</span></p>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block">
              {tipo === "ajuste" ? "Nuevo stock total" : "Cantidad a agregar"} *
            </label>
            <input
              type="number"
              min="1"
              required
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder={tipo === "ajuste" ? "Stock nuevo" : "Unidades"}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
            {cantidad && tipo !== "ajuste" && (
              <p className="text-xs text-[#6B7280] mt-1">
                Stock resultante: <span className="text-[#16A34A] font-semibold">{product.stock + parseInt(cantidad, 10)}</span>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block">Motivo (opcional)</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Pedido proveedor, corrección..."
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-[#F5F5F5] hover:bg-[#E5E7EB] text-[#111111] font-medium py-2.5 rounded-xl transition-colors text-sm">
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
