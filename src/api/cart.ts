import { CoCartResponse } from "@/types/cocart";

// This should be the base URL of your Node.js backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ NEW: Helper function to get cart_key from cookies
const getCartKeyFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'cart_key') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// ✅ NEW: Helper function to set cart_key cookie
const setCartKeyCookie = (cartKey: string): void => {
  if (typeof document === 'undefined') return;
  
  const maxAge = 2 * 24 * 60 * 60; // 2 days in seconds
  document.cookie = `cart_key=${encodeURIComponent(cartKey)}; max-age=${maxAge}; path=/; SameSite=None; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
};

// NEW: Function to get the cart from your backend
export const getCart = async (): Promise<CoCartResponse> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL (NEXT_PUBLIC_API_URL) is not defined in environment variables.");
  }
  
  const apiUrl = `${API_BASE_URL}/cart`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: sends cookies with the request
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch cart');
    }

    return data as CoCartResponse;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// ✅ NEW: Function to check if cart exists before making requests
export const hasCartInCookies = (): boolean => {
  return getCartKeyFromCookie() !== null;
};

export const addToCart = async (productId: string | number): Promise<CoCartResponse> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL (NEXT_PUBLIC_API_URL) is not defined in environment variables.");
  }

  const apiUrl = `${API_BASE_URL}/cart/add-item`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: String(productId),
        quantity: "1", // You can make this dynamic if needed
      }),
      // This tells the browser to send cookies (like the cart_key) with this API request.
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add item to cart');
    }

    // ✅ ADDED: Store cart_key in cookie if returned
    if (data.cart_key) {
      setCartKeyCookie(data.cart_key);
    }

    return data as CoCartResponse;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};