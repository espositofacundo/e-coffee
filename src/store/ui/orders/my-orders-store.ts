import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  // Pedidos hechos desde este navegador, para poder verlos sin tener cuenta.
  orderIds: string[];
  addOrder: (id: string) => void;
}

const MAX_ORDERS = 20;

export const useMyOrdersStore = create<State>()(
  persist(
    (set, get) => ({
      orderIds: [],
      addOrder: (id) => {
        const { orderIds } = get();
        if (orderIds.includes(id)) return;
        set({ orderIds: [id, ...orderIds].slice(0, MAX_ORDERS) });
      },
    }),
    {
      name: "timonypumba-orders",
    }
  )
);
