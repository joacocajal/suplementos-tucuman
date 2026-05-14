import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import OrderDetail from "../../components/admin/OrderDetail";
import { useAdminStore } from "../../store/adminStore";
import { supabase } from "../../lib/supabase";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ESTADOS_PEDIDO } from "../../lib/constants";

const TABS = ["pendiente", "confirmado", "cancelado", "todos"];
const TAB_LABELS = { pendiente: "Pendientes", confirmado: "Confirmados", cancelado: "Cancelados", todos: "Todos" };

export default function Orders() {
  const orders = useAdminStore((s) => s.orders);
  const ordersLoaded = useAdminStore((s) => s.ordersLoaded);
  const loadOrders = useAdminStore((s) => s.loadOrders);
  const patchOrder = useAdminStore((s) => s.patchOrder);
  const patchProduct = useAdminStore((s) => s.patchProduct);
  const storeProducts = useAdminStore((s) => s.products);

  const [loading, setLoading] = useState(!ordersLoaded);
  const [tab, setTab] = useState("pendiente");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadOrders().then(() => setLoading(false)); }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleConfirm(order) {
    await supabase.from("pedidos").update({ estado: "confirmado" }).eq("id", order.id);
    const movimientos = (order.productos_json || []).map(async (item) => {
      const storeProd = storeProducts.find((p) => p.id === item.producto_id);
      const stockAnterior = storeProd?.stock ?? 0;
      const stockNuevo = Math.max(0, stockAnterior - item.cantidad);
      await Promise.all([
        supabase.from("productos").update({ stock: stockNuevo, updated_at: new Date().toISOString() }).eq("id", item.producto_id),
        supabase.from("movimientos_stock").insert({ producto_id: item.producto_id, tipo: "salida", cantidad: item.cantidad, stock_anterior: stockAnterior, stock_nuevo: stockNuevo, motivo: `Pedido confirmado #${order.id.slice(0, 8)}` }),
      ]);
      patchProduct(item.producto_id, { stock: stockNuevo });
    });
    await Promise.all(movimientos);
    patchOrder(order.id, { estado: "confirmado" });
    setSelected(null);
    showToast("Pedido confirmado y stock descontado");
  }

  async function handleCancel(id) {
    await supabase.from("pedidos").update({ estado: "cancelado" }).eq("id", id);
    patchOrder(id, { estado: "cancelado" });
    setSelected(null);
    showToast("Pedido cancelado");
  }

  const filtered = tab === "todos" ? orders : orders.filter((o) => o.estado === tab);
  const counts = {
    pendiente: orders.filter((o) => o.estado === "pendiente").length,
    confirmado: orders.filter((o) => o.estado === "confirmado").length,
    cancelado: orders.filter((o) => o.estado === "cancelado").length,
    todos: orders.length,
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="font-display text-3xl text-[#111111]">PEDIDOS</h1>

        <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit overflow-x-auto scrollbar-none shadow-sm">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t ? "bg-[#FF6B1A] text-white" : "text-[#6B7280] hover:text-[#111111]"
              }`}>
              {TAB_LABELS[t]}
              {counts[t] > 0 && (
                <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${tab === t ? "bg-white/20" : "bg-[#F0F0F0]"}`}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["Fecha", "Cliente", "Productos", "Total", "Estado", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E5E7EB]/50">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-[#F0F0F0] rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6B7280]">No hay pedidos en esta categoría</td></tr>
                ) : (
                  filtered.map((o) => {
                    const est = ESTADOS_PEDIDO[o.estado] || ESTADOS_PEDIDO.pendiente;
                    const items = o.productos_json || [];
                    return (
                      <tr key={o.id} className="border-b border-[#E5E7EB]/50 hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                        <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{formatDate(o.created_at)}</td>
                        <td className="px-4 py-3">
                          <p className="text-[#111111] text-sm">{o.cliente_nombre || "—"}</p>
                          {o.cliente_whatsapp && <p className="text-xs text-[#6B7280]">{o.cliente_whatsapp}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6B7280] max-w-[180px]">
                          <p className="truncate">{items.map((i) => `${i.nombre} x${i.cantidad}`).join(", ")}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#FF6B1A]">{formatCurrency(o.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${est.color}`}>{est.label}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6B7280]">Ver →</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} onConfirm={handleConfirm} onCancel={handleCancel} />}

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in shadow-xl ${
          toast.type === "error" ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"
        }`}>{toast.msg}</div>
      )}
    </AdminLayout>
  );
}
