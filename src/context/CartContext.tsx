"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Cart, CartItem } from "@/lib/types";
import { getCart, addToCart as apiAddToCart } from "@/api/products";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  isCartSidebarOpen: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchInitialCart() {
      try {
        setLoading(true);
        const initialCart = await getCart();
        setCart(initialCart);
      } catch (error) {
        console.error("Failed to fetch initial cart:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialCart();
  }, []);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const updatedCart = await apiAddToCart(productId, quantity);
      setCart(updatedCart);
      setIsCartSidebarOpen(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Error: Could not add item to cart.");
    }
  };

  const openCartSidebar = () => setIsCartSidebarOpen(true);
  const closeCartSidebar = () => setIsCartSidebarOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        isCartSidebarOpen,
        openCartSidebar,
        closeCartSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
