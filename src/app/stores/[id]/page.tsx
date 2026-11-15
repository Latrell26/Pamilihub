import { notFound } from "next/navigation";
import { getStoreMenu } from "@/modules/catalog/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { StoreMenuView } from "@/components/catalog/store-menu-view";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function StoreMenuPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const storeId = params?.id;

  // R5: /stores/[id] with a non-UUID id, unknown id, or non-approved store shows a real 404 via notFound().
  // No DB query when the id is not a UUID.
  if (!storeId || !UUID_REGEX.test(storeId)) {
    notFound();
  }

  // R10: Invalid or unknown query params never crash a page. Ignore them.
  const rawSearch =
    typeof searchParams.search === "string" ? searchParams.search.trim().slice(0, 80) : undefined;
  const search = rawSearch && rawSearch.length > 0 ? rawSearch : undefined;

  const rawCategory =
    typeof searchParams.category === "string" ? searchParams.category.trim() : undefined;
  const categoryId = rawCategory && rawCategory.length > 0 ? rawCategory : undefined;

  const [store, user] = await Promise.all([
    getStoreMenu(storeId),
    getHeaderUser(),
  ]);

  if (!store || store.status !== "approved") {
    notFound();
  }

  return (
    <StoreMenuView
      store={store}
      userRole={user?.role}
      initialSearch={search}
      initialCategory={categoryId}
    />
  );
}
