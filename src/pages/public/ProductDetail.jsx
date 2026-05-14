import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import ProductCard from "../../components/public/ProductCard";
import CheckoutModal from "../../components/public/CheckoutModal";
import { useProduct } from "../../hooks/useProducts";
import { formatCurrency } from "../../lib/utils";
import { getProductImage } from "../../lib/productImageMap";
import { CATEGORIAS } from "../../lib/constants";
import useCartStore from "../../store/cartStore";

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="aspect-square bg-[#161616] rounded-2xl" />
        <div className="space-y-4 py-4">
          <div className="h-4 bg-[#161616] rounded w-1/4" />
          <div className="h-8 bg-[#161616] rounded w-3/4" />
          <div className="h-6 bg-[#161616] rounded w-1/3" />
          <div className="h-20 bg-[#161616] rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { product, related, loading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const [cantidad, setCantidad] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [toast, setToast] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [flippedId, setFlippedId] = useState(null);

  const cat = CATEGORIAS.find((c) => c.value === product?.categoria);
  const sinStock = product?.stock === 0;
  const imgSrc = product ? getProductImage(product) : null;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd() {
    const result = addItem(product, cantidad);
    if (result?.error) showToast(result.error, "error");
    else showToast(`${product.nombre} agregado al carrito`);
  }

  function handleReservar() {
    addItem(product, cantidad);
    setCheckoutOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        {loading ? (
          <Skeleton />
        ) : !product ? (
          <div className="text-center py-20">
            <p className="text-[#A1A1AA]">Producto no encontrado</p>
            <Link to="/" className="text-[#FF6B1A] mt-3 inline-block hover:underline">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              {/* Imagen */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#161616] border border-[#262626] flex items-center justify-center">
                {imgSrc && !imgError ? (
                  <img
                    src={imgSrc}
                    alt={product.nombre}
                    className="w-full h-full object-contain p-6"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-8xl text-[#333]">{cat?.icon || "📦"}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col py-4">
                {cat && (
                  <span className="inline-flex items-center gap-1.5 w-fit text-xs font-semibold bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/30 px-3 py-1 rounded-full mb-4">
                    {cat.icon} {cat.label}
                  </span>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] mb-3 leading-snug">
                  {product.nombre}
                </h1>

                <p className="text-3xl font-bold text-[#FF6B1A] mb-4">
                  {formatCurrency(product.precio)}
                </p>

                {product.descripcion && (
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
                    {product.descripcion}
                  </p>
                )}

                {sinStock ? (
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-semibold px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <span>●</span> Sin stock disponible
                  </div>
                ) : (
                  <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-sm font-semibold px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <span>●</span> En stock ({product.stock} disponibles)
                  </div>
                )}

                {!sinStock && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm text-[#A1A1AA]">Cantidad:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCantidad((q) => Math.max(1, q - 1))}
                          className="w-9 h-9 rounded-xl bg-[#161616] border border-[#262626] hover:border-[#FF6B1A] text-[#FAFAFA] flex items-center justify-center transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold text-[#FAFAFA]">{cantidad}</span>
                        <button
                          onClick={() => setCantidad((q) => Math.min(product.stock, q + 1))}
                          className="w-9 h-9 rounded-xl bg-[#161616] border border-[#262626] hover:border-[#FF6B1A] text-[#FAFAFA] flex items-center justify-center transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#FF6B1A]">
                        {formatCurrency(product.precio * cantidad)}
                      </span>
                    </div>

                    <button
                      onClick={handleReservar}
                      className="flex items-center justify-center gap-2 bg-[#FF6B1A] hover:bg-[#FF8540] text-white font-bold py-4 rounded-xl transition-colors text-base mb-3"
                    >
                      <MessageCircle size={20} />
                      Reservar por WhatsApp
                    </button>

                    <button
                      onClick={handleAdd}
                      className="flex items-center justify-center gap-2 bg-transparent border border-[#262626] hover:border-[#FF6B1A] text-[#A1A1AA] hover:text-[#FAFAFA] font-semibold py-3 rounded-xl transition-colors text-sm"
                    >
                      <ShoppingCart size={16} />
                      Agregar al carrito y seguir comprando
                    </button>
                  </>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-[#FAFAFA] mb-6">
                  TAMBIÉN TE PUEDE INTERESAR
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {related.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      flipped={flippedId === p.id}
                      onFlip={(id) => setFlippedId((prev) => (prev === id ? null : id))}
                      onOpenCheckout={() => setCheckoutOpen(true)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => showToast("¡Pedido enviado! Tomás te va a contactar.")}
        />
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in shadow-xl ${
          toast.type === "error"
            ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
            : "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
