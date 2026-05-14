# Suplementos Tucumán

Tienda online para venta de suplementos deportivos. El flujo de compra redirige a WhatsApp para cierre manual. Incluye panel de administración para gestión de productos, pedidos y stock.

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Completar `.env.local` con los valores de tu proyecto Supabase:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_WHATSAPP_NUMBER=5493815100725
```

Los valores de Supabase están en: **Project Settings → API**.

### 3. Schema de base de datos

El SQL del schema lo provee Tomás por separado. Ejecutarlo en **Supabase → SQL Editor** antes de levantar la app.

Tablas requeridas: `productos`, `pedidos`, `movimientos_stock`. Bucket de Storage requerido: `productos` (público).

### 4. Crear usuario admin

Desde **Supabase Dashboard → Authentication → Users**, usar "Add user" con el email y contraseña de Tomás.

### 5. Correr en desarrollo

```bash
npm run dev
```

- Sitio público: `http://localhost:5173/`
- Panel admin: `http://localhost:5173/admin`

### 6. Build para producción

```bash
npm run build
```

Los archivos se generan en `/dist`. Subir a Vercel, Netlify o Cloudflare Pages.

---

## Estructura del proyecto

El proyecto está dividido en dos partes dentro de la misma app React. La carpeta `src/pages/public/` contiene el catálogo de productos y la página de detalle, con carrito persistente en localStorage via Zustand. La carpeta `src/pages/admin/` contiene el panel protegido por autenticación Supabase, con dashboard de ventas, gestión de productos con edición inline de precio/stock, módulo de pedidos con confirmación que descuenta stock automáticamente, y módulo de stock con historial completo de movimientos.

La integración en tiempo real via Supabase Realtime mantiene el catálogo público sincronizado cuando Tomás actualiza precios o stock desde el dashboard, sin necesidad de recargar la página.

## Stack

React 18 + Vite · Tailwind CSS · Supabase (DB + Auth + Storage + Realtime) · Zustand · React Router v6 · Recharts · Lucide React
