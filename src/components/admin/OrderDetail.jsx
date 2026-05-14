import { X, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ESTADOS_PEDIDO } from "../../lib/constants";

export default function OrderDetail({ order, onClose, onConfirm, onCancel }) {
  if (!order) return null;
  const est = ESTADOS_PEDIDO[order.estado] || ESTADOS_PEDIDO.pendiente;
  const items = order.productos_json || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in shadow-xl">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-semibold text-[#111111] text-sm">Pedido #{order.id.slice(0, 8).toUpperCase()}</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${est.color}`}>
              {est.label}
            </span>
            <button onClick={onClose} className="text-[#6B7280] hover:text-[#111111]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-5">
          {(order.cliente_nombre || order.cliente_whatsapp) && (
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-xs text-[#6B7280] mb-2 font-semibold">CLIENTE</p>
              {order.cliente_nombre && <p className="text-sm text-[#111111]">{order.cliente_nombre}</p>}
              {order.cliente_whatsapp && (
                <a
                  href={`https://wa.me/${order.cliente_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#22C55E] hover:opacity-80 mt-1"
                >
                  <MessageCircle size={14} />
                  {order.cliente_whatsapp}
                </a>
              )}
            </div>
          )}

          <div>
            <p className="text-xs text-[#6B7280] mb-3 font-semibold">PRODUCTOS</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] px-4 py-3">
                  <div>
                    <p className="text-sm text-[#111111] font-medium">{item.nombre}</p>
                    <p className="text-xs text-[#6B7280]">{formatCurrency(item.precio)} x {item.cantidad}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#FF6B1A]">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-4">
            <span className="font-semibold text-[#111111]">Total</span>
            <span className="text-xl font-bold text-[#FF6B1A]">{formatCurrency(order.total)}</span>
          </div>

          {order.notas && (
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-xs text-[#6B7280] mb-1 font-semibold">NOTAS</p>
              <p className="text-sm text-[#111111]">{order.notas}</p>
            </div>
          )}

          {order.estado === "pendiente" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onCancel(order.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <XCircle size={16} />
                Cancelar
              </button>
              <button
                onClick={() => onConfirm(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <CheckCircle size={16} />
                Confirmar venta
              </button>
            </div>
          )}

          {order.cliente_whatsapp && (
            <a
              href={`https://wa.me/${order.cliente_whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white hover:bg-[#F5F5F5] border border-[#E5E7EB] hover:border-[#22C55E] text-[#111111] text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={16} />
              Abrir chat con cliente
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
