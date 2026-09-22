import { CartProduct } from "@/interfaces/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalitems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    total: number;
    itemsInCart: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;

  clearCart: () => void;
}

// Un mismo producto puede estar varias veces en el carrito si cambia la
// presentación (½ kg / 1 kg) o la variedad.
const isSameItem = (a: CartProduct, b: CartProduct) =>
  a.id === b.id &&
  a.presentation === b.presentation &&
  (a.variant ?? "") === (b.variant ?? "");

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      getTotalitems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (subtotal, product) => subtotal + product.quantity * product.price,
          0
        );
        const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

        // El envío es gratis: el total es el subtotal.
        return { subTotal, total: subTotal, itemsInCart };
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        if (!cart.some((item) => isSameItem(item, product))) {
          set({ cart: [...cart, product] });
          return;
        }

        set({
          cart: cart.map((item) =>
            isSameItem(item, product)
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          ),
        });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        set({
          cart: cart.map((item) =>
            isSameItem(item, product) ? { ...item, quantity } : item
          ),
        });
      },

      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => !isSameItem(item, product)) });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),

    {
      name: "timonypumba-cart",
    }
  )
);
