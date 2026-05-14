export const CATEGORIAS = [
  { value: "proteinas", label: "Proteínas", icon: "🥛" },
  { value: "creatinas", label: "Creatinas", icon: "💪" },
  { value: "vitaminas", label: "Vitaminas", icon: "💊" },
  { value: "geles", label: "Geles", icon: "⚡" },
  { value: "hidratacion", label: "Hidratación", icon: "💧" },
  { value: "recovery", label: "Recovery", icon: "🔄" },
  { value: "shakes", label: "Shakes", icon: "🥤" },
];

export const ESTADOS_PEDIDO = {
  pendiente: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmado: { label: "Confirmado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelado: { label: "Cancelado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5493815100725";
