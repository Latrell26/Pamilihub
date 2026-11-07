import { requireRole } from "@/lib/auth/roles";

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side role guard: only approved sellers can reach these pages
  await requireRole("seller");
  return <>{children}</>;
}
