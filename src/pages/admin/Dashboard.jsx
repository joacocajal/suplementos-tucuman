import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, AlertTriangle, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAdminStore } from "../../store/adminStore";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ESTADOS_PEDIDO } from "../../lib/constants";

function StatCard({ icon: Icon, label, value, sub, color = "text-[#FF6B1A]" }) {
  return (
    <div className="bg-[#161616] border border-[#262626] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-[#A1A1AA]">{label}</p>
        <div className={`w-9 h-9 rounded-xl bg-[#262626] flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#FAFAFA]">{value}</p>
      {sub && <p className="text-xs text-[#A1A1AA] mt-1">{sub}</p>}
    </div>
  );
}

function StatSkeleton() {
  return <div className="bg-[#161616] border border-[#262626] rounded-2xl p-5 h-28 animate-pulse" />;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs">
        <p className="text-[#A1A1AA] mb-1">{label}</p>
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

  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const label = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
    const total = confirmados
      .filter((p) => p.created_at >= dayStart && p.created_at < dayEnd)
      .reduce((s, p) => s + Number(p.total), 0);
    dias.push({ label, total });
  }

  const counts = {};
  confirmados.forEach((p) => {
    (p.productos_json || []).forEach((item) => {
      counts[item.nombre] = (counts[item.nombre] || 0) + item.cantidad;
    });
  });
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));
  const maxQty = top[0]?.cantidad || 1;
  const topProducts = top.map((t) => ({ ...t, pct: Math.round((t.cantidad / maxQty) * 100) }));

  return {
    stats: { ventasDia, ventasSemana, ventasMes, pendientes, sinStock },
    chartData: dias,
    topProducts,
    lastOrders: pedidos.slice(0, 5),
  };
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

  useEffect(() => {
    Promise.all([loadOrders(), loadProducts()]);
  }, []);

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
        <h1 className="font-display text-3xl text-[#FAFAFA]">DASHBOARD</h1>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard icon={DollarSign} label="Ventas hoy" value={formatCurrency(stats.ventasDia)} />
              <StatCard icon={TrendingUp} label="Esta semana" value={formatCurrency(stats.ventasSemana)} />
              <StatCard icon={TrendingUp} label="Este mes" value={formatCurrency(stats.ventasMes)} color="text-[#22C55E]" />
              <StatCard icon={ShoppingBag} label="Pendientes" value={stats.pendientes} color="text-yellow-400" />
              <StatCard icon={AlertTriangle} label="Sin stock" value={stats.sinStock} color={stats.sinStock > 0 ? "text-[#EF4444]" : "text-[#22C55E]"} />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161616] border border-[#262626] rounded-2xl p-5">
            <h3 className="font-semibold text-[#FAFAFA] mb-5">Ventas últimos 7 días</h3>
            {loading ? (
              <div className="h-48 bg-[#0A0A0A] rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="label" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="total" stroke="#FF6B1A" strokeWidth={2} dot={{ fill: "#FF6B1A", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-[#161616] border border-[#262626] rounded-2xl p-5">
            <h3 className="font-semibold text-[#FAFAFA] mb-5">Top productos</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-[#0A0A0A] rounded animate-pulse" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-sm text-[#A1A1AA]">Sin datos aún</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.nombre}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#FAFAFA] truncate mr-2">{p.nombre}</span>
                      <span className="text-[#A1A1AA] flex-shrink-0">{p.cantidad} uds</span>
                    </div>
                    <div className="h-1.5 bg-[#262626] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6B1A] rounded-full transition-all" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#262626]">
            <h3 className="font-semibold text-[#FAFAFA]">Últimos pedidos</h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0A0A0A] rounded animate-pulse" />
              ))}
            </div>
          ) : lastOrders.length === 0 ? (
            <div className="p-10 text-center text-[#A1A1AA] text-sm">Sin pedidos aún</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#262626]">
                    {["Fecha", "Cliente", "Total", "Estado"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#A1A1AA]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lastOrders.map((o) => {
                    const est = ESTADOS_PEDIDO[o.estado] || ESTADOS_PEDIDO.pendiente;
                    return (
                      <tr key={o.id} className="border-b border-[#262626]/50 hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-5 py-3 text-[#A1A1AA]">{formatDate(o.created_at)}</td>
                        <td className="px-5 py-3 text-[#FAFAFA]">{o.cliente_nombre || "—"}</td>
                        <td className="px-5 py-3 font-semibold text-[#FF6B1A]">{formatCurrency(o.total)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${est.color}`}>
                            {est.label}
                          </span>
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
