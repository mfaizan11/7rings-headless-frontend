import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]?.src;

  return (
    // CHANGE: The link now uses product.id instead of product.slug
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
    >
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
  );
}
