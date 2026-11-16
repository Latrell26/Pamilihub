import Link from "next/link";
import { getProductDetail } from "@/modules/catalog/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { ProductPurchaseBar } from "@/components/ui/product-purchase-bar";
import { ArrowLeft, Store, MapPin, Bike, Search, X, BadgeCheck, LogIn } from "lucide-react";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Full-screen layer: covers the layout's nav bar and holds the single
 * floating X button (links back to the store menu).
 */
function Screen({
  children,
  closeHref = "/products",
  closeLabel = "Back to all stores",
  replace = false,
}: Readonly<{
  children: React.ReactNode;
  closeHref?: string;
  closeLabel?: string;
  replace?: boolean;
}>) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background">
      <div className="pointer-events-none fixed left-0 right-0 top-[max(0.75rem,env(safe-area-inset-top))] z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href={closeHref}
            replace={replace}
            aria-label={closeLabel}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-white/95 text-foreground shadow-md backdrop-blur-sm transition hover:bg-white active:scale-90"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}

function NotFound() {
  return (
    <Screen>
      <div className="mx-auto max-w-md space-y-4 p-12 pt-28 text-center">
        <div className="text-4xl">🥧</div>
        <h1 className="text-lg font-bold text-foreground">Delicacy not found</h1>
        <p className="text-xs text-muted-foreground">
          The product you&#39;re looking for does not exist or may have been
          unlisted by the merchant.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse Stores
        </Link>
      </div>
    </Screen>
  );
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams?: { from?: string; store?: string; q?: string };
}>) {
  const { id } = params;

  if (!id || !UUID_REGEX.test(id)) return <NotFound />;

  const [product, user] = await Promise.all([
    getProductDetail(id),
    getHeaderUser(),
  ]);

  if (!product) return <NotFound />;

  const isCustomer = user?.role === "customer";
  const storeName = product.sellers?.store_name ?? "Local Seller";
  const storeHref = product.seller_id
    ? `/stores/${product.seller_id}`
    : "/products";

  const fromCart = searchParams?.from === "cart";
  const fromSearch = searchParams?.from === "search";
  const searchQ = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const searchStore = typeof searchParams?.store === "string" ? searchParams.store : undefined;

  const searchParamsList: string[] = [];
  if (searchStore) searchParamsList.push(`storeId=${encodeURIComponent(searchStore)}`);
  if (searchQ) searchParamsList.push(`q=${encodeURIComponent(searchQ)}`);
  const searchHref = searchParamsList.length > 0 ? `/search?${searchParamsList.join("&")}` : "/search";

  const closeHref = fromCart
    ? searchParams?.store
      ? `/cart?store=${searchParams.store}`
      : "/cart"
    : fromSearch
    ? searchHref
    : storeHref;
  const closeLabel = fromCart
    ? "Back to cart"
    : fromSearch
    ? "Back to search"
    : `Back to ${storeName}`;

  return (
    <Screen
      closeHref={closeHref}
      closeLabel={closeLabel}
      replace={fromCart || fromSearch}
    >
      <div className={`mx-auto max-w-3xl ${isCustomer ? "pb-32" : "pb-10"}`}>
        {/* Hero image */}
        <div className="relative overflow-hidden rounded-b-[2rem] bg-muted/40">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-6xl">🥥</span>
              <span className="text-xs">No image provided</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5 px-5 pt-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="text-lg font-bold text-foreground">
              ₱{Number(product.price).toFixed(2)}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                + ₱50 delivery
              </span>
            </p>
            <p className="whitespace-pre-line text-base leading-relaxed text-foreground/80">
              {product.description ||
                "Authentic freshly prepared local delicacy from San Pablo City."}
            </p>
          </div>

          {/* Non-customer states (customers get the fixed bottom bar) */}
          {!user && (
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90"
            >
              Sign in to Order
            </Link>
          )}
          {user?.role === "seller" && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs font-medium text-amber-700 dark:text-amber-400">
              🏪 Signed in as Food Merchant — shopping cart is reserved for
              customers.
            </div>
          )}
          {user?.role === "admin" && (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs font-medium text-blue-700 dark:text-blue-400">
              🛡️ Signed in as Administrator — catalog inspection mode.
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom bar: [ - 1 + ] [ Add to cart ] */}
      {isCustomer && (
        <ProductPurchaseBar
          productId={product.id}
          name={product.name}
          price={Number(product.price)}
          stock={product.stock}
          sellerId={product.seller_id}
          sellerName={storeName}
          imageUrl={product.image_url}
        />
      )}
    </Screen>
  );
}