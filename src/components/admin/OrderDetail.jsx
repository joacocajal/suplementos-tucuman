import { X, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ESTADOS_PEDIDO } from "../../lib/constants";

export default function OrderDetail({ order, onClose, onConfirm, onCancel }) {
  if (!order) return null;
  const est = ESTADOS_PEDIDO[order.estado] || ESTADOS_PEDIDO.pendiente;
  const items = order.productos_json || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#262626] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#161616] flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <div>
            <h3 className="font-semibold text-[#FAFAFA] text-sm">Pedido #{order.id.slice(0, 8).toUpperCase()}</h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${est.color}`}>
              {est.label}
            </span>
            <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#FAFAFA]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Cliente */}
          {(order.cliente_nombre || order.cliente_whatsapp) && (
            <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-4">
              <p className="text-xs text-[#A1A1AA] mb-2 font-semibold">CLIENTE</p>
              {order.cliente_nombre && <p className="text-sm text-[#FAFAFA]">{order.cliente_nombre}</p>}
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

          {/* Productos */}
          <div>
            <p className="text-xs text-[#A1A1AA] mb-3 font-semibold">PRODUCTOS</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-[#0A0A0A] rounded-xl border border-[#262626] px-4 py-3">
                  <div>
                    <p className="text-sm text-[#FAFAFA] font-medium">{item.nombre}</p>
                    <p className="text-xs text-[#A1A1AA]">{formatCurrency(item.precio)} x {item.cantidad}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#FF6B1A]">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-[#262626] pt-4">
            <span className="font-semibold text-[#FAFAFA]">Total</span>
            <span className="text-xl font-bold text-[#FF6B1A]">{formatCurrency(order.total)}</span>
          </div>

          {/* Notas */}
          {order.notas && (
            <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-4">
              <p className="text-xs text-[#A1A1AA] mb-1 font-semibold">NOTAS</p>
              <p className="text-sm text-[#FAFAFA]">{order.notas}</p>
            </div>
          )}

          {/* Acciones */}
          {order.estado === "pendiente" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onCancel(order.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <XCircle size={16} />
                Cancelar
              </button>
              <button
                onClick={() => onConfirm(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 font-semibold py-2.5 rounded-xl transition-colors text-sm"
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
              className="flex items-center justify-center gap-2 w-full bg-[#161616] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#22C55E] text-[#FAFAFA] text-sm font-medium py-2.5 rounded-xl transition-colors"
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
