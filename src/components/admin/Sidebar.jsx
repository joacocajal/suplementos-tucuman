import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, LogOut, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/stock", label: "Stock", icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login");
  }

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB] w-64">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logosuplementostucuman.jpeg"
            alt="Logo"
            className="h-8 w-auto"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div>
            <p className="text-xs font-bold text-[#111111] leading-tight">SUPLEMENTOS</p>
            <p className="text-xs text-[#FF6B1A] font-bold leading-tight">TUCUMÁN</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[#6B7280] hover:text-[#111111]">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20"
                  : "text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex h-screen sticky top-0">{content}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden animate-slide-in-right">
            {content}
          </div>
        </>
      )}
    </>
  );
}
