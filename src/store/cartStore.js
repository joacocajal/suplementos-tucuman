import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (producto, cantidad = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === producto.id);
        if (existing) {
          const newQty = existing.cantidad + cantidad;
          if (newQty > producto.stock) return { error: "Stock insuficiente" };
          set({
            items: items.map((i) =>
              i.id === producto.id ? { ...i, cantidad: newQty } : i
            ),
          });
        } else {
          if (cantidad > producto.stock) return { error: "Stock insuficiente" };
          set({ items: [...items, { ...producto, cantidad }] });
        }
        return { success: true };
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, cantidad, stock) => {
        if (cantidad < 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        if (cantidad > stock) return { error: "Stock insuficiente" };
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "suplementos-cart",
    }
  )
);

// Selectors computados
export const selectTotal = (state) =>
  state.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

export const selectCount = (state) =>
  state.items.reduce((sum, i) => sum + i.cantidad, 0);

export default useCartStore;
