import { Product } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        errorBody.message || "An error occurred while fetching data."
      );
    }
    return response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

export async function getProducts(): Promise<Product[]> {
  return fetcher<Product[]>(`${API_URL}/get-products`);
}

// NEW FUNCTION: To find a single product by its ID
export async function getProductById(id: number): Promise<Product | null> {
    try {
        console.log(`[API] Fetching all products to find ID: ${id}`);
        const products = await getProducts();
        const product = products.find((p) => p.id === id);

        if (!product) {
          console.warn(`[API] Product with ID ${id} not found.`);
          return null;
        }

        console.log(`[API] Found product:`, product);
        return product;
    } catch (error) {
        console.error(`[API] Error fetching product by ID ${id}:`, error);
        return null;
    }
}