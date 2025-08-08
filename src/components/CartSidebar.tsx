"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

// ✅ IMPROVED: Helper function to format currency with proper decimal handling
const formatPrice = (priceString: string | number) => {
  // Handle if price is already formatted HTML
  if (typeof priceString === 'string' && priceString.includes('<')) {
    return { __html: String(priceString) };
  }
  
  const price = Number(priceString);
  if (isNaN(price)) {
    return { __html: String(priceString) };
  }

  // ✅ IMPROVED: Better currency formatting with proper decimal places
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Change this to your currency (PKR, USD, etc.)
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return { __html: formattedPrice };
};

// ✅ NEW: Alternative function for different currency formats
const formatPricePKR = (priceString: string | number) => {
  if (typeof priceString === 'string' && priceString.includes('<')) {
    return { __html: String(priceString) };
  }
  
  const price = Number(priceString);
  if (isNaN(price)) {
    return { __html: String(priceString) };
  }

  // Format for PKR or custom format
  const formattedPrice = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return { __html: formattedPrice };
};

export function CartSidebar() {
  const { cart, isCartSidebarOpen, closeCartSidebar } = useCart();
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL;

  if (!isCartSidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-20"
        onClick={closeCartSidebar}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-background z-30 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            onClick={closeCartSidebar}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            &times;
          </button>
        </div>

        {cart && cart.items.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="divide-y">
              {cart.items.map((item) => (
                <li
                  key={item.item_key}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                    <Image
                      src={item.featured_image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-foreground/70">
                      Quantity: {item.quantity.value}
                    </p>
                    {/* ✅ ADDED: Show individual item total */}
                    <p className="text-sm text-foreground/70">
                      Total: <span dangerouslySetInnerHTML={formatPrice(item.totals.total)} />
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-medium"
                      dangerouslySetInnerHTML={formatPrice(item.price)}
                    />
                    <p className="text-xs text-foreground/60">per item</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Your cart is empty.</p>
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* ✅ IMPROVED: Show more cart totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span dangerouslySetInnerHTML={formatPrice(cart.totals.subtotal)} />
              </div>
              {cart.totals.discount_total !== '0' && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span dangerouslySetInnerHTML={formatPrice(cart.totals.discount_total)} />
                </div>
              )}
              {cart.totals.shipping_total !== '0' && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span dangerouslySetInnerHTML={formatPrice(cart.totals.shipping_total)} />
                </div>
              )}
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span dangerouslySetInnerHTML={formatPrice(cart.totals.total)} />
            </div>
            
            <a
              href={checkoutUrl}
              className="block w-full text-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-green-700"
            >
              Proceed to Checkout
            </a>
          </div>
        )}
      </aside>
    </>
  );
}