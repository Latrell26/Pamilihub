import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/ui/site-header";
import { getHeaderUser } from "@/lib/auth/header-user";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pamilihub",
  description: "Local food products of San Pablo City, Laguna",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getHeaderUser();

  return (
    <html lang="en" className={inter.className}>
      <body>
        <SiteHeader user={user} />
        {children}
      </body>
    </html>
  );
}
