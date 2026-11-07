import { requireRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side role guard: only approved sellers can reach these pages
  requireRole("seller");
  return <>{children}</>;
}
