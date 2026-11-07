import { requireAdmin } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side role guard: only admins can reach these pages
  requireAdmin();
  return <>{children}</>;
}
