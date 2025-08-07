// A single item in the cart
export interface CoCartItem {
  item_key: string;
  id: number;
  name: string;
  title: string;
  price: string;
  featured_image?: string; // NEW: Add optional featured_image
  quantity: {
    value: number;
    min_purchase: number;
    max_purchase: number;
  };
  totals: {
    subtotal: number;
    subtotal_tax: number;
    total: number;
    tax: number;
  };
  slug: string;
}

// The entire cart response from CoCart
export interface CoCartResponse {
  items: CoCartItem[];
  item_count: number;
  totals: {
    subtotal: string;
    subtotal_tax: string;
    fee_total: string;
    fee_tax: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    total: string;
  };
}