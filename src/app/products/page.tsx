import { getCategories, getProducts } from "@/modules/catalog/queries";
import Link from "next/link";

export default async function CatalogPage({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categoryId, search }),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Catalog</h1>
          <p className="text-muted-foreground">
            Browse local food products from San Pablo City
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md" method="GET">
          <label className="sr-only">Search products</label>
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search products..."
            className="flex-1 rounded-md border input bg-background text-foreground"
          />
          <label className="sr-only">Category</label>
          <select
            name="category"
            defaultValue={categoryId ?? ""}
            className="rounded-md border input bg-background text-foreground"
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(products ?? []).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block"
          >
            <div className="rounded-lg border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No image</span>
                </div>
              )}
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-sm font-medium text-primary">
                    ₱{Number(product.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.description ?? "No description available."}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                  </span>
                  {product.stock === 0 && (
                    <span className="text-xs text-destructive">Unavailable</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {product.sellers?.store_name ?? "Unknown seller"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(products ?? []).length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}
