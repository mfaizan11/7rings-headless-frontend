'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CoCartResponse } from '@/types/cocart';
// We are not using getCart, so the import can be removed or left for later.
// import { getCart } from '@/api/cart'; 

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
  // Set loading to false initially since we are not fetching.
  const [loading, setLoading] = useState<boolean>(false); 
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  // By commenting out this useEffect block, the app will no longer
  // try to fetch the cart when it first loads.
  
  const fetchInitialCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch initial cart:", error);
      setCart({ items: [], item_count: 0, totals: { subtotal: '0', subtotal_tax: '0', fee_total: '0', fee_tax: '0', discount_total: '0', discount_tax: '0', shipping_total: '0', shipping_tax: '0', total: '0' } });
    } finally {
      setLoading(false);
    }
  }, []);

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