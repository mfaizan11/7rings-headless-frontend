export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: ProductImage[];
  stock_status: "instock" | "outofstock";
  price_html?: string; // Optional price_html for consistency
}