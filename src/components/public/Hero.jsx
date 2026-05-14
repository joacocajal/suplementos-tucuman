import { ArrowDown, MessageCircle } from "lucide-react";
import { CATEGORIAS } from "../../lib/constants";

export default function Hero() {
  function scrollToProducts() {
    const el = document.getElementById("productos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,26,0.10) 0%, transparent 60%), #ffffff",
        }}
      />

      {/* Grid pattern sutil */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(#F0F0F0 1px, transparent 1px), linear-gradient(90deg, #F0F0F0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-[#FF6B1A] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A] animate-pulse" />
          Envíos y retiros en Tucumán
        </div>

        {/* Título */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#111111] leading-none tracking-wide mb-6">
          TU MEJOR{" "}
          <span className="text-[#FF6B1A]">VERSIÓN</span>
          <br />
          EMPIEZA ACÁ
        </h1>

        {/* Subtítulo */}
        <p className="text-[#6B7280] text-lg sm:text-xl max-w-xl mx-auto mb-10">
          Suplementos deportivos en Tucumán. Proteínas, creatinas, vitaminas y más. Pedí por WhatsApp.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToProducts}
            className="flex items-center gap-2 bg-[#FF6B1A] hover:bg-[#FF8540] text-white font-bold px-8 py-4 rounded-xl text-base transition-colors w-full sm:w-auto"
          >
            Ver productos
            <ArrowDown size={18} />
          </button>
          <a
            href="https://wa.me/5493815100725"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white hover:bg-[#F5F5F5] border border-[#E5E7EB] hover:border-[#FF6B1A] text-[#111111] font-bold px-8 py-4 rounded-xl text-base transition-colors w-full sm:w-auto"
          >
            <MessageCircle size={18} />
            Consultar
          </a>
        </div>

        {/* Categorías decorativas */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {CATEGORIAS.map((cat) => (
            <span
              key={cat.value}
              className="text-xs text-[#6B7280] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full"
            >
              {cat.icon} {cat.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
