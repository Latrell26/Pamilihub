import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/ui/site-header";
import MobileBottomNav from "@/components/ui/mobile-bottom-nav";
import FloatingCartBar from "@/components/ui/floating-cart-bar";
import { CartProvider } from "@/lib/cart/cart-context";
import { getHeaderUser } from "@/lib/auth/header-user";

export const viewport: Viewport = {
  themeColor: "#2373F4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Pamilihub — San Pablo Delicacies",
  description: "Web-based e-commerce platform for authentic food delicacies of San Pablo City, Laguna",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pamilihub",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getHeaderUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <CartProvider userId={user?.id ?? null}>
          <SiteHeader user={user} />
          {/* Main Content with bottom padding on mobile/tablet so it doesn't get covered by the bottom nav */}
          <div className="flex-1 pb-20 lg:pb-8">
            {children}
          </div>
          {user?.role === "customer" && <FloatingCartBar />}
          <MobileBottomNav user={user} />
        </CartProvider>
      </body>
    </html>
  );
}
