import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WHATSAPP_NUMBER } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPrecio(amount) {
  return "$" + new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppMessage(items, total, clienteNombre, clienteWhatsapp) {
  const lineas = items
    .map((item) => `• ${item.nombre} — x${item.cantidad} — ${formatPrecio(item.precio * item.cantidad)}`)
    .join("\n");

  let mensaje = `¡Hola! 💪 Quiero reservar en *Suplementos Tucumán*:\n\n🛒 *Mi pedido:*\n${lineas}\n\n💰 *Total: ${formatPrecio(total)}*`;

  if (clienteNombre) mensaje += `\n\n👤 *Nombre:* ${clienteNombre}`;
  if (clienteWhatsapp) mensaje += `\n📱 *Mi WhatsApp:* ${clienteWhatsapp}`;

  mensaje += "\n\n¿Está disponible? ¡Gracias!";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export function getInitials(name) {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
