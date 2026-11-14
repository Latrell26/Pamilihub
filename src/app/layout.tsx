import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/ui/site-header";
import MobileBottomNav from "@/components/ui/mobile-bottom-nav";
import FloatingCartBar from "@/components/ui/floating-cart-bar";
import { CartProvider } from "@/lib/cart/cart-context";
import { getHeaderUser } from "@/lib/auth/header-user";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#e11d48",
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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <CartProvider>
          <SiteHeader user={user} />
          {/* Main Content with bottom padding on mobile so it doesn't get covered by the bottom nav */}
          <div className="flex-1 pb-20 md:pb-8">
            {children}
          </div>
          <FloatingCartBar />
          <MobileBottomNav user={user} />
        </CartProvider>
      </body>
    </html>
  );
}
