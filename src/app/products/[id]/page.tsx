import Link from "next/link";
import { getProductDetail } from "@/modules/catalog/queries";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { getHeaderUser } from "@/lib/auth/header-user";

export default async function ProductDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const [product, user] = await Promise.all([
    getProductDetail(id),
    getHeaderUser(),
  ]);

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <div className="text-4xl">🥧</div>
        <h1 className="text-lg font-bold text-foreground">Delicacy not found</h1>
        <p className="text-xs text-muted-foreground">
          The product you&#39;re looking for does not exist or may have been unlisted by the merchant.
        </p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Mobile Bar with Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors active:scale-95"
        >
          <span>← Back</span>
        </Link>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          San Pablo Delicacy
        </span>
      </div>

      {/* Main Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left: Product Image */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full aspect-square sm:aspect-4/3 object-cover"
            />
          ) : (
            <div className="w-full aspect-square sm:aspect-4/3 bg-muted/40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-6xl">🥥</span>
              <span className="text-xs">No image provided</span>
            </div>
          )}

          {/* Stock tag */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black shadow-sm backdrop-blur-md ${
                inStock
                  ? "bg-emerald-600/90 text-white"
                  : "bg-red-600/90 text-white"
              }`}
            >
              {inStock ? `${product.stock} In Stock` : "Sold Out"}
            </span>
          </div>
        </div>

        {/* Right: Info and Action */}
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                ₱{Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">+ ₱50 delivery</span>
            </div>
          </div>

          {/* Merchant Card */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-3.5 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg shrink-0">
              🏪
            </div>
            <div className="space-y-0.5 text-xs flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-primary block tracking-wider">
                Local Food Merchant
              </span>
              <p className="font-extrabold text-foreground text-sm truncate">
                {product.sellers?.store_name ?? "San Pablo Merchant"}
              </p>
              {product.sellers?.location && (
                <p className="text-muted-foreground truncate">
                  📍 {product.sellers.location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Description & Highlights
            </h2>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {product.description || "Authentic freshly prepared local delicacy from San Pablo City."}
            </p>
          </div>

          {/* Action button */}
          <div className="space-y-2 pt-2">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={Number(product.price)}
              stock={product.stock}
              sellerId={product.seller_id}
              sellerName={product.sellers?.store_name ?? "Local Seller"}
              imageUrl={product.image_url}
              size="md"
              userRole={user?.role}
            />
            {user?.role !== "seller" && user?.role !== "admin" && (
              <p className="text-[11px] text-muted-foreground text-center">
                Flat ₱50 delivery fee applied per local merchant
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
