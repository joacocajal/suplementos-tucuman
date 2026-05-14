import { create } from "zustand";
import { supabase } from "../lib/supabase";

const TTL = 30_000;
const fresh = (at) => at > 0 && Date.now() - at < TTL;

export const useAdminStore = create((set, get) => ({
  products: [],
  orders: [],
  movimientos: [],
  productsLoaded: false,
  ordersLoaded: false,
  movimientosLoaded: false,
  _productsAt: 0,
  _ordersAt: 0,
  _movimientosAt: 0,

  async loadProducts(force = false) {
    const { productsLoaded, _productsAt } = get();
    if (!force && productsLoaded && fresh(_productsAt)) return;
    const { data } = await supabase.from("productos").select("*").order("created_at", { ascending: false });
    set({ products: data || [], productsLoaded: true, _productsAt: Date.now() });
  },

  async loadOrders(force = false) {
    const { ordersLoaded, _ordersAt } = get();
    if (!force && ordersLoaded && fresh(_ordersAt)) return;
    const { data } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    set({ orders: data || [], ordersLoaded: true, _ordersAt: Date.now() });
  },

  async loadMovimientos(force = false) {
    const { movimientosLoaded, _movimientosAt } = get();
    if (!force && movimientosLoaded && fresh(_movimientosAt)) return;
    const { data } = await supabase
      .from("movimientos_stock")
      .select("*, productos(nombre)")
      .order("created_at", { ascending: false })
      .limit(200);
    set({ movimientos: data || [], movimientosLoaded: true, _movimientosAt: Date.now() });
  },

  patchProduct(id, changes) {
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...changes } : p)) }));
  },

  dropProduct(id) {
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
  },

  patchOrder(id, changes) {
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...changes } : o)) }));
  },
}));
