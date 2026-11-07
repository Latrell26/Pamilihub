import { requireAdmin } from "@/lib/auth/roles";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side role guard: only admins can reach these pages
  await requireAdmin();
  return <>{children}</>;
}
