"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <nav className="container mx-auto flex items-center justify-between p-4 border-b">
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          7Rings Store
        </Link>
      </nav>
    </header>
  );
}
