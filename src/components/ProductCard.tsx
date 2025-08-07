'use client';

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]?.src;

  return (
    <div className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-lg flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="truncate text-lg font-semibold">{product.name}</h3>
          <p
            className="text-foreground/80"
            dangerouslySetInnerHTML={{
              __html: product.price_html || `${product.price} USD`,
            }}
          />
        </div>
      </Link>

      <div className="mt-auto p-4 pt-0">
        {/* UPDATED LOGIC: Changed from '===' to '!==' to handle null status */}
        {product.stock_status !== 'outofstock' ? (
          <AddToCartButton productId={product.id} />
        ) : (
          <button
            disabled
            className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}