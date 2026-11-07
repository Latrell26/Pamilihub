import Link from "next/link";
import { getProductDetail } from "@/modules/catalog/queries";

export default async function ProductDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4 text-muted-foreground">
          The product you&#39;re looking for does not exist or is not available.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 gap-8 md:flex">
      <div className="md:w-1/2 space-y-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="rounded-lg border overflow-hidden w-full object-cover"
            style={{ aspectRatio: "1 / 1" }}
          />
        ) : (
          <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          Stock:{product.stock > 0 ? ` ${product.stock} available` : " Out of stock"}
        </div>
        <Link
          href="/products"
          className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 inline-block"
        >
          Back to catalog
        </Link>
      </div>

      <div className="md:w-1/2 space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-lg text-muted-foreground">
          ₱{Number(product.price).toFixed(2)}
        </p>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-muted-foreground">
            {product.description ?? "No description available."}
          </p>

          <h2 className="text-lg font-semibold">Seller</h2>
          <p className="text-muted-foreground">
            {product.sellers?.store_name ?? "Unknown seller"}
          </p>
          {product.sellers?.location && (
            <p className="text-muted-foreground text-sm">
              {product.sellers.location}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Status:{product.sellers?.status ? " " + product.sellers.status : "—"}
          </p>
        </div>

        {product.stock > 0 ? (
          <div className="rounded-lg border bg-success/50 p-4">
            <p className="text-sm text-success/foreground">
              This product is available for purchase.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border bg-destructive/50 p-4">
            <p className="text-sm text-destructive/foreground">
              This product is currently out of stock.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
