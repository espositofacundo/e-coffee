import type { Address } from "@/interfaces/orders.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: Address;
  setAddress: (address: Address) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        phone: "",
        address: "",
        notes: "",
        paymentMethod: "efectivo",
      },
      setAddress: (address) => {
        set({ address });
      },
    }),
    {
      name: "timonypumba-address",
    }
  )
);
