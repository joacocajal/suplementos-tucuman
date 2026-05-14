export const CATEGORIAS = [
  { value: "proteinas", label: "Proteínas", icon: "🥛" },
  { value: "creatinas", label: "Creatinas", icon: "💪" },
  { value: "vitaminas", label: "Vitaminas", icon: "💊" },
  { value: "geles", label: "Geles", icon: "⚡" },
  { value: "hidratacion", label: "Hidratación", icon: "💧" },
  { value: "recovery", label: "Recovery", icon: "🔄" },
  { value: "shakes", label: "Shakes", icon: "🥤" },
  { value: "combos", label: "Combos", icon: "🎁" },
];

export const ESTADOS_PEDIDO = {
  pendiente: { label: "Pendiente", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmado: { label: "Confirmado", color: "bg-green-50 text-green-700 border-green-200" },
  cancelado: { label: "Cancelado", color: "bg-red-50 text-red-700 border-red-200" },
};

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5493815100725";
