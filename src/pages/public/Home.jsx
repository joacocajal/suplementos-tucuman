import { useState, useCallback } from "react";
import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import ProductGrid from "../../components/public/ProductGrid";
import Footer from "../../components/public/Footer";
import CheckoutModal from "../../components/public/CheckoutModal";

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in shadow-xl ${
            t.type === "error"
              ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
              : "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [toasts, setToasts] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const showToast = useCallback(({ type, message }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar
        onCartSuccess={() => showToast({ type: "success", message: "¡Pedido enviado! Tomás te va a contactar." })}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <ProductGrid
          onAddToast={showToast}
          onOpenCheckout={() => setCheckoutOpen(true)}
        />
      </main>
      <Footer />
      <Toast toasts={toasts} />

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => showToast({ type: "success", message: "¡Pedido enviado! Tomás te va a contactar." })}
        />
      )}
    </div>
  );
}
