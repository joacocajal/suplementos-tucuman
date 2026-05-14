import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, AlertTriangle, DollarSign, Gift } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAdminStore } from "../../store/adminStore";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ESTADOS_PEDIDO } from "../../lib/constants";

function StatCard({ icon: Icon, label, value, sub, color = "text-[#FF6B1A]", bg = "bg-[#FF6B1A]/10" }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-[#6B7280]">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#111111]">{value}</p>
      {sub && <p className="text-xs text-[#6B7280] mt-1">{sub}</p>}
    </div>
  );
}

function StatSkeleton() {
  return <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 h-28 animate-pulse shadow-sm" />;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs shadow-lg">
        <p className="text-[#6B7280] mb-1">{label}</p>
        <p className="font-semibold text-[#FF6B1A]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

function computeDashboard(pedidos, productos) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now - 7 * 86400000).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const confirmados = pedidos.filter((p) => p.estado === "confirmado");
  const ventasDia = confirmados.filter((p) => p.created_at >= startOfDay).reduce((s, p) => s + Number(p.total), 0);
  const ventasSemana = confirmados.filter((p) => p.created_at >= startOfWeek).reduce((s, p) => s + Number(p.total), 0);
  const ventasMes = confirmados.filter((p) => p.created_at >= startOfMonth).reduce((s, p) => s + Number(p.total), 0);
  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const sinStock = productos.filter((p) => p.activo && p.stock === 0).length;

  const ventasCombos = confirmados
    .filter((p) => p.created_at >= startOfMonth)
    .reduce((s, p) => {
      const ct = (p.productos_json || [])
        .filter((item) => productos.find((pr) => pr.id === item.producto_id)?.es_combo)
        .reduce((acc, item) => acc + Number(item.subtotal), 0);
      return s + ct;
    }, 0);

  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const label = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
    const total = confirmados.filter((p) => p.created_at >= dayStart && p.created_at < dayEnd).reduce((s, p) => s + Number(p.total), 0);
    dias.push({ label, total });
  }

  const counts = {};
  confirmados.forEach((p) => {
    (p.productos_json || []).forEach((item) => {
      counts[item.nombre] = (counts[item.nombre] || 0) + item.cantidad;
    });
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([nombre, cantidad]) => ({ nombre, cantidad }));
  const maxQty = top[0]?.cantidad || 1;
  const topProducts = top.map((t) => ({ ...t, pct: Math.round((t.cantidad / maxQty) * 100) }));

  return { stats: { ventasDia, ventasSemana, ventasMes, pendientes, sinStock, ventasCombos }, chartData: dias, topProducts, lastOrders: pedidos.slice(0, 5) };
}

export default function Dashboard() {
  const storeOrders = useAdminStore((s) => s.orders);
  const storeProducts = useAdminStore((s) => s.products);
  const ordersLoaded = useAdminStore((s) => s.ordersLoaded);
  const productsLoaded = useAdminStore((s) => s.productsLoaded);
  const loadOrders = useAdminStore((s) => s.loadOrders);
  const loadProducts = useAdminStore((s) => s.loadProducts);

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lastOrders, setLastOrders] = useState([]);

  useEffect(() => { Promise.all([loadOrders(), loadProducts()]); }, []);

  useEffect(() => {
    if (!ordersLoaded || !productsLoaded) return;
    const result = computeDashboard(storeOrders, storeProducts);
    setStats(result.stats);
    setChartData(result.chartData);
    setTopProducts(result.topProducts);
    setLastOrders(result.lastOrders);
  }, [storeOrders, storeProducts, ordersLoaded, productsLoaded]);

  const loading = stats === null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-3xl text-[#111111]">DASHBOARD</h1>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />) : (
            <>
              <StatCard icon={DollarSign} label="Ventas hoy" value={formatCurrency(stats.ventasDia)} />
              <StatCard icon={TrendingUp} label="Esta semana" value={formatCurrency(stats.ventasSemana)} />
              <StatCard icon={TrendingUp} label="Este mes" value={formatCurrency(stats.ventasMes)} color="text-[#16A34A]" bg="bg-green-50" />
              <StatCard icon={Gift} label="Combos mes" value={formatCurrency(stats.ventasCombos)} />
              <StatCard icon={ShoppingBag} label="Pendientes" value={stats.pendientes} color="text-yellow-600" bg="bg-yellow-50" />
              <StatCard icon={AlertTriangle} label="Sin stock" value={stats.sinStock} color={stats.sinStock > 0 ? "text-red-600" : "text-[#16A34A]"} bg={stats.sinStock > 0 ? "bg-red-50" : "bg-green-50"} />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-[#111111] mb-5">Ventas últimos 7 días</h3>
            {loading ? <div className="h-48 bg-[#F9FAFB] rounded-xl animate-pulse" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="total" stroke="#FF6B1A" strokeWidth={2} dot={{ fill: "#FF6B1A", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-[#111111] mb-5">Top productos</h3>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-8 bg-[#F9FAFB] rounded animate-pulse" />)}</div>
            ) : topProducts.length === 0 ? <p className="text-sm text-[#6B7280]">Sin datos aún</p> : (
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.nombre}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#111111] truncate mr-2">{p.nombre}</span>
                      <span className="text-[#6B7280] flex-shrink-0">{p.cantidad} uds</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h3 className="font-semibold text-[#111111]">Últimos pedidos</h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-[#F9FAFB] rounded animate-pulse" />)}</div>
          ) : lastOrders.length === 0 ? (
            <div className="p-10 text-center text-[#6B7280] text-sm">Sin pedidos aún</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {["Fecha", "Cliente", "Total", "Estado"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lastOrders.map((o) => {
                    const est = ESTADOS_PEDIDO[o.estado] || ESTADOS_PEDIDO.pendiente;
                    return (
                      <tr key={o.id} className="border-b border-[#E5E7EB]/50 hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-5 py-3 text-[#6B7280]">{formatDate(o.created_at)}</td>
                        <td className="px-5 py-3 text-[#111111]">{o.cliente_nombre || "—"}</td>
                        <td className="px-5 py-3 font-semibold text-[#FF6B1A]">{formatCurrency(o.total)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${est.color}`}>{est.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
