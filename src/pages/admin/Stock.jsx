import { useState, useEffect } from "react";
import { AlertTriangle, ArrowUpCircle, SlidersHorizontal } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StockMovementModal from "../../components/admin/StockMovementModal";
import { useAdminStore } from "../../store/adminStore";
import { formatDate } from "../../lib/utils";
import { CATEGORIAS } from "../../lib/constants";

const TIPO_LABELS = {
  entrada: { label: "Entrada", color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20" },
  salida: { label: "Salida", color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20" },
  ajuste: { label: "Ajuste", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
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

  useEffect(() => {
    Promise.all([loadProducts(), loadMovimientos()]).then(() => setLoading(false));
  }, []);

  function showToast(msg) {
    setToast({ msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSaved() {
    await Promise.all([loadProducts(true), loadMovimientos(true)]);
    showToast("Stock actualizado");
  }

  const products = [...storeProducts]
    .filter((p) => p.activo)
    .sort((a, b) => a.stock - b.stock);

  const sinStock = products.filter((p) => p.stock === 0).length;
  const movFiltered = movFilter === "all" ? movimientos : movimientos.filter((m) => m.tipo === movFilter);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="font-display text-3xl text-[#FAFAFA]">STOCK</h1>

        {sinStock > 0 && (
          <div className="flex items-center gap-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl px-4 py-3">
            <AlertTriangle size={18} className="flex-shrink-0" />
            <p className="text-sm font-medium">
              {sinStock} producto{sinStock !== 1 ? "s" : ""} sin stock
            </p>
          </div>
        )}

        <div className="flex gap-1 bg-[#161616] border border-[#262626] rounded-xl p-1 w-fit">
          {[["stock", "Productos"], ["historial", "Historial"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveTab(val)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === val ? "bg-[#FF6B1A] text-white" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "stock" ? (
          <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#262626]">
                    {["Producto", "Categoría", "Stock actual", "Acciones"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#A1A1AA]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-[#262626]/50">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-4 bg-[#262626] rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-[#A1A1AA]">No hay productos activos</td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const cat = CATEGORIAS.find((c) => c.value === p.categoria);
                      return (
                        <tr key={p.id} className="border-b border-[#262626]/50 hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-4 py-3 font-medium text-[#FAFAFA] max-w-[220px]">
                            <p className="truncate">{p.nombre}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                              {cat?.label || p.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-bold ${p.stock === 0 ? "text-[#EF4444]" : p.stock <= 5 ? "text-yellow-400" : "text-[#22C55E]"}`}>
                              {p.stock}
                            </span>
                            {p.stock === 0 && <span className="text-xs text-[#EF4444] ml-2">SIN STOCK</span>}
                            {p.stock > 0 && p.stock <= 5 && <span className="text-xs text-yellow-400 ml-2">BAJO</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setModal({ product: p, tipo: "entrada" })}
                                className="flex items-center gap-1 text-xs bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <ArrowUpCircle size={13} />
                                Entrada
                              </button>
                              <button
                                onClick={() => setModal({ product: p, tipo: "ajuste" })}
                                className="flex items-center gap-1 text-xs bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <SlidersHorizontal size={13} />
                                Ajuste
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {[["all", "Todos"], ["entrada", "Entradas"], ["salida", "Salidas"], ["ajuste", "Ajustes"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMovFilter(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                    movFilter === val ? "bg-[#FF6B1A] border-[#FF6B1A] text-white" : "border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#262626]">
                      {["Fecha", "Producto", "Tipo", "Cantidad", "Stock ant.", "Stock nuevo", "Motivo"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#A1A1AA]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-[#262626]/50">
                          {Array.from({ length: 7 }).map((_, j) => (
                            <td key={j} className="px-4 py-3"><div className="h-3 bg-[#262626] rounded animate-pulse" /></td>
                          ))}
                        </tr>
                      ))
                    ) : movFiltered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-[#A1A1AA]">Sin movimientos registrados</td>
                      </tr>
                    ) : (
                      movFiltered.map((m) => {
                        const t = TIPO_LABELS[m.tipo] || TIPO_LABELS.ajuste;
                        return (
                          <tr key={m.id} className="border-b border-[#262626]/50 hover:bg-[#1a1a1a] transition-colors">
                            <td className="px-4 py-3 text-xs text-[#A1A1AA] whitespace-nowrap">{formatDate(m.created_at)}</td>
                            <td className="px-4 py-3 text-[#FAFAFA] text-xs max-w-[160px]">
                              <p className="truncate">{m.productos?.nombre || "—"}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>{t.label}</span>
                            </td>
                            <td className="px-4 py-3 text-[#FAFAFA] font-mono text-xs">{m.tipo === "salida" ? "-" : "+"}{m.cantidad}</td>
                            <td className="px-4 py-3 text-[#A1A1AA] text-xs">{m.stock_anterior}</td>
                            <td className="px-4 py-3 text-[#FAFAFA] text-xs font-semibold">{m.stock_nuevo}</td>
                            <td className="px-4 py-3 text-xs text-[#A1A1AA]">{m.motivo || "—"}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <StockMovementModal
          product={modal.product}
          tipo={modal.tipo}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in shadow-xl bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]">
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}
