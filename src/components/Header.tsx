"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext"; // NEW

export function Header() {
  const { cart, openCartSidebar, loading } = useCart(); // NEW

  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <nav className="container mx-auto flex items-center justify-between p-4 border-b">
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          7Rings Store
        </Link>

        {/* NEW: Cart button with item count */}
        <button
          onClick={openCartSidebar}
          className="relative rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Open cart"
        >
          {/* A simple shopping bag icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>

          {!loading && cart && cart.item_count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {cart.item_count}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}