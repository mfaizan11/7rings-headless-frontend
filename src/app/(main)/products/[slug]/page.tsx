import { getProductById } from "@/api/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.slug, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.[0]?.src || "/placeholder.svg";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Image */}
      <div className="relative aspect-square w-full">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover rounded-lg border"
          priority
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
        <p
          className="text-2xl font-semibold text-foreground"
          dangerouslySetInnerHTML={{
            __html: product.price_html || `Rs ${product.price}`,
          }}
        />
        <div
          className="prose dark:prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        
        {/* UPDATED LOGIC: Changed from '===' to '!==' to handle null status */}
        {product.stock_status !== "outofstock" ? (
          <AddToCartButton productId={product.id} />
        ) : (
          <p className="mt-4 text-lg font-bold text-red-500">Out of Stock</p>
        )}
      </div>
    </div>
  );
}