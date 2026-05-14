import { useState, useEffect } from "react";
import { AlertTriangle, ArrowUpCircle, SlidersHorizontal } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StockMovementModal from "../../components/admin/StockMovementModal";
import { useAdminStore } from "../../store/adminStore";
import { formatDate } from "../../lib/utils";
import { CATEGORIAS } from "../../lib/constants";

const TIPO_LABELS = {
  entrada: { label: "Entrada", color: "text-[#16A34A] bg-green-50 border-green-200" },
  salida: { label: "Salida", color: "text-red-600 bg-red-50 border-red-200" },
  ajuste: { label: "Ajuste", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
};

export default function Stock() {
  const storeProducts = useAdminStore((s) => s.products);
  const movimientos = useAdminStore((s) => s.movimientos);
  const productsLoaded = useAdminStore((s) => s.productsLoaded);
  const movimientosLoaded = useAdminStore((s) => s.movimientosLoaded);
  const loadProducts = useAdminStore((s) => s.loadProducts);
  const loadMovimientos = useAdminStore((s) => s.loadMovimientos);

  const [loading, setLoading] = useState(!productsLoaded || !movimientosLoaded);
  const [activeTab, setActiveTab] = useState("stock");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [movFilter, setMovFilter] = useState("all");

  useEffect(() => { Promise.all([loadProducts(), loadMovimientos()]).then(() => setLoading(false)); }, []);

  function showToast(msg) { setToast({ msg }); setTimeout(() => setToast(null), 3000); }
  async function handleSaved() { await Promise.all([loadProducts(true), loadMovimientos(true)]); showToast("Stock actualizado"); }

  const products = [...storeProducts].filter((p) => p.activo).sort((a, b) => a.stock - b.stock);
  const sinStock = products.filter((p) => p.stock === 0).length;
  const movFiltered = movFilter === "all" ? movimientos : movimientos.filter((m) => m.tipo === movFilter);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="font-display text-3xl text-[#111111]">STOCK</h1>

        {sinStock > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            <AlertTriangle size={18} className="flex-shrink-0" />
            <p className="text-sm font-medium">{sinStock} producto{sinStock !== 1 ? "s" : ""} sin stock</p>
          </div>
        )}

        <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit shadow-sm">
          {[["stock", "Productos"], ["historial", "Historial"]].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === val ? "bg-[#FF6B1A] text-white" : "text-[#6B7280] hover:text-[#111111]"}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "stock" ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {["Producto", "Categoría", "Stock actual", "Acciones"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E5E7EB]/50">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-[#F0F0F0] rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  )) : products.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-[#6B7280]">No hay productos activos</td></tr>
                  ) : products.map((p) => {
                    const cat = CATEGORIAS.find((c) => c.value === p.categoria);
                    return (
                      <tr key={p.id} className="border-b border-[#E5E7EB]/50 hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#111111] max-w-[220px]"><p className="truncate">{p.nombre}</p></td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                            {cat?.label || p.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold ${p.stock === 0 ? "text-red-600" : p.stock <= 5 ? "text-yellow-600" : "text-[#16A34A]"}`}>{p.stock}</span>
                          {p.stock === 0 && <span className="text-xs text-red-500 ml-2">SIN STOCK</span>}
                          {p.stock > 0 && p.stock <= 5 && <span className="text-xs text-yellow-600 ml-2">BAJO</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setModal({ product: p, tipo: "entrada" })}
                              className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-[#16A34A] border border-green-200 px-3 py-1.5 rounded-lg transition-colors">
                              <ArrowUpCircle size={13} /> Entrada
                            </button>
                            <button onClick={() => setModal({ product: p, tipo: "ajuste" })}
                              className="flex items-center gap-1 text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg transition-colors">
                              <SlidersHorizontal size={13} /> Ajuste
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {[["all", "Todos"], ["entrada", "Entradas"], ["salida", "Salidas"], ["ajuste", "Ajustes"]].map(([val, label]) => (
                <button key={val} onClick={() => setMovFilter(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                    movFilter === val ? "bg-[#FF6B1A] border-[#FF6B1A] text-white" : "border-[#E5E7EB] text-[#6B7280] hover:text-[#111111]"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      {["Fecha", "Producto", "Tipo", "Cantidad", "Stock ant.", "Stock nuevo", "Motivo"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-[#E5E7EB]/50">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-3 bg-[#F0F0F0] rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    )) : movFiltered.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-12 text-center text-[#6B7280]">Sin movimientos registrados</td></tr>
                    ) : movFiltered.map((m) => {
                      const t = TIPO_LABELS[m.tipo] || TIPO_LABELS.ajuste;
                      return (
                        <tr key={m.id} className="border-b border-[#E5E7EB]/50 hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{formatDate(m.created_at)}</td>
                          <td className="px-4 py-3 text-[#111111] text-xs max-w-[160px]"><p className="truncate">{m.productos?.nombre || "—"}</p></td>
                          <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>{t.label}</span></td>
                          <td className="px-4 py-3 text-[#111111] font-mono text-xs">{m.tipo === "salida" ? "-" : "+"}{m.cantidad}</td>
                          <td className="px-4 py-3 text-[#6B7280] text-xs">{m.stock_anterior}</td>
                          <td className="px-4 py-3 text-[#111111] text-xs font-semibold">{m.stock_nuevo}</td>
                          <td className="px-4 py-3 text-xs text-[#6B7280]">{m.motivo || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {modal && <StockMovementModal product={modal.product} tipo={modal.tipo} onClose={() => setModal(null)} onSaved={handleSaved} />}
      {toast && <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in shadow-xl bg-green-50 border-green-200 text-green-700">{toast.msg}</div>}
    </AdminLayout>
  );
}
