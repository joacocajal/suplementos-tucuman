import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useCartStore, { selectCount } from "../../store/cartStore";
import CartSheet from "./CartSheet";

export default function Navbar({ onCartSuccess }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const count = useCartStore(selectCount);

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/#productos", label: "Productos" },
    { to: "/#contacto", label: "Contacto" },
  ];

  function handleNavClick(to) {
    setMenuOpen(false);
    if (to.startsWith("/#")) {
      const id = to.replace("/#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/logosuplementostucuman.jpeg"
                alt="Suplementos Tucumán"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <span
                className="font-display text-xl text-[#FAFAFA] hidden"
                style={{ display: "none" }}
              >
                SUPLEMENTOS TUC
              </span>
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <button
                  key={l.to}
                  onClick={() => handleNavClick(l.to)}
                  className="text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Cart + hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] hover:border-[#FF6B1A] transition-colors"
              >
                <ShoppingCart size={18} className="text-[#FAFAFA]" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B1A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-[#FAFAFA] hover:border-[#FF6B1A] transition-colors"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#262626] bg-[#0A0A0A] px-4 py-3 space-y-1">
            {links.map((l) => (
              <button
                key={l.to}
                onClick={() => handleNavClick(l.to)}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#161616] rounded-lg transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onSuccess={onCartSuccess}
      />
    </>
  );
}
