import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    firstName: string;
    address: string;
    phone: string;
    
  };

  setAddress: (address:State['address'])=> void;
}

export const useAddressStore = create<State>()(
  persist(
    (set, get) => ({
      address: {
        firstName: "",
        address: "",
        phone: "",
        
      },
      setAddress:(address) => {
        set({address})
      },
    }),
    {
      name: "address-storage",
    }
  )
);
