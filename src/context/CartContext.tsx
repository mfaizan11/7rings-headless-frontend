'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CoCartResponse } from '@/types/cocart';
import { getCart, hasCartInCookies } from '@/api/cart'; 

interface ICartContext {
  cart: CoCartResponse | null;
  loading: boolean;
  isCartSidebarOpen: boolean;
  updateCart: (cartData: CoCartResponse) => void;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
}

const CartContext = createContext<ICartContext | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CoCartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  // ✅ UPDATED: Use the exported function instead of inline logic
  const checkHasCartKey = useCallback((): boolean => {
    return hasCartInCookies();
  }, []);

  // This function fetches the initial cart state from the backend
  const fetchInitialCart = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ UPDATED: Only fetch cart if cart_key exists
      if (checkHasCartKey()) {
        const cartData = await getCart();
        setCart(cartData);
      } else {
        // Set empty cart if no cart_key
        setCart({ 
          items: [], 
          item_count: 0, 
          totals: { 
            subtotal: '0', 
            subtotal_tax: '0', 
            fee_total: '0', 
            fee_tax: '0', 
            discount_total: '0', 
            discount_tax: '0', 
            shipping_total: '0', 
            shipping_tax: '0', 
            total: '0' 
          } 
        });
      }
    } catch (error) {
      console.error("Failed to fetch initial cart:", error);
      // Set a default empty cart structure on failure
      setCart({ 
        items: [], 
        item_count: 0, 
        totals: { 
          subtotal: '0', 
          subtotal_tax: '0', 
          fee_total: '0', 
          fee_tax: '0', 
          discount_total: '0', 
          discount_tax: '0', 
          shipping_total: '0', 
          shipping_tax: '0', 
          total: '0' 
        } 
      });
    } finally {
      setLoading(false);
    }
  }, [checkHasCartKey]);

  // UseEffect to run the fetch function once when the component mounts
  useEffect(() => {
    fetchInitialCart();
  }, [fetchInitialCart]);

  const updateCart = (cartData: CoCartResponse) => {
    setCart(cartData);
  };

  const openCartSidebar = () => setIsCartSidebarOpen(true);
  const closeCartSidebar = () => setIsCartSidebarOpen(false);

  return (
    <CartContext.Provider value={{ cart, loading, updateCart, isCartSidebarOpen, openCartSidebar, closeCartSidebar }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): ICartContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};