import { MessageCircle, Instagram, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-white border-t border-[#E5E7EB] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo y descripción */}
          <div>
            <div className="mb-4">
              <img
                src="/logosuplementostucuman.jpeg"
                alt="Suplementos Tucumán"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <span className="font-display text-2xl text-[#111111]" style={{ display: "none" }}>
                SUPLEMENTOS TUCUMÁN
              </span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Tu tienda de suplementos deportivos en Tucumán. Calidad garantizada y atención personalizada.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-[#111111] mb-4">Contacto</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/5493815100725"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#FF6B1A] transition-colors"
              >
                <MessageCircle size={16} className="text-[#22C55E]" />
                +54 9 381 510-0725
              </a>
              <div className="flex items-start gap-2 text-sm text-[#6B7280]">
                <Clock size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>Lun-Vie 9:00 a 20:00hs</p>
                  <p>Sáb 9:00 a 14:00hs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redes */}
          <div>
            <h4 className="font-semibold text-[#111111] mb-4">Seguinos</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/suplementostucuman_/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} Suplementos Tucumán. Todos los derechos reservados.
          </p>
          <Link to="/admin" className="text-xs text-[#D1D5DB] hover:text-[#6B7280] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
