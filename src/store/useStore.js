import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Optional: Keeps data after refresh

const useStore = create(
  persist(
    (set) => ({
      // --- Favorites State ---
      favorites: [], // Stores IDs like ['dish-1', 'dish-2']
      
      toggleFavorite: (id) => set((state) => {
        const isAlreadyFav = state.favorites.includes(id);
        return {
          favorites: isAlreadyFav
            ? state.favorites.filter((favId) => favId !== id) // Remove
            : [...state.favorites, id] // Add
        };
      }),

      // --- Cart State ---
      cart: [], // Stores objects like [{ id: '1', quantity: 2 }]
      
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          // If item exists, increase quantity
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        // If new, add it with quantity 1
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      toggleCart: (product) => set((state) => {
        const exists = state.cart.some((item) => item.id === product.id);
        if (exists) {
          return { cart: state.cart.filter((item) => item.id !== product.id) };
        } else {
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }
      }),

      // Clear the entire cart (used after placing an order)
      clearCart: () => set(() => ({ cart: [] })),

      // --- Orders ---
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

      // Helper to get total count for the UI badge
      getCartCount: () => {
         // This logic is usually done inside components using selectors, 
         // but simple usage can just check state.cart.length
      }
    }),
    {
      name: 'food-app-storage', // Key for localStorage
    }
  )
);

export default useStore;
