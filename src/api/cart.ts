import { CoCartResponse } from "@/types/cocart";

const cartBaseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL_CART;
if (!cartBaseUrl) {
  throw new Error("WooCommerce Cart Base URL (NEXT_PUBLIC_WOOCOMMERCE_URL_CART) is not defined in environment variables.");
}

/**
 * Fetches the current user's cart from CoCart.
 * Returns an empty cart structure if the cart is empty on the server.
 */
export const getCart = async (): Promise<CoCartResponse> => {
  try {
    const response = await fetch(cartBaseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // This is crucial for retrieving the cart associated with the user's session.
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // CoCart might return a specific code for an empty cart, which is not a critical error.
      if (data.code === 'cocart_cart_is_empty') {
        return { items: [], item_count: 0, totals: { subtotal: '0', subtotal_tax: '0', fee_total: '0', fee_tax: '0', discount_total: '0', discount_tax: '0', shipping_total: '0', shipping_tax: '0', total: '0' } };
      }
      throw new Error(data.message || 'Failed to fetch cart');
    }
    return data as CoCartResponse;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Adds a new item to the cart.
 */
export const addToCart = async (productId: string | number, quantity: number = 1): Promise<CoCartResponse> => {
  const cartEndpoint = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL_CART_ENDPOINT_TO_SEND_BACK_PRODUCT_ID;
  if (!cartEndpoint) {
    throw new Error("WooCommerce add to cart endpoint is not defined in environment variables.");
  }

  const apiUrl = `${cartBaseUrl}${cartEndpoint}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: String(productId),
        quantity: String(quantity),
      }),
      // This tells the browser to send cookies with this API request to maintain the session.
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add item to cart');
    }

    return data as CoCartResponse;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Updates the quantity of an existing item in the cart.
 * @param itemKey - The unique key for the cart item.
 * @param quantity - The new quantity for the item.
 */
export const updateCartItem = async (itemKey: string, quantity: number): Promise<CoCartResponse> => {
  const apiUrl = `${cartBaseUrl}/item/${itemKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: String(quantity),
      }),
      // Credentials must be included to update the correct session cart.
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update item in cart');
    }

    return data as CoCartResponse;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};