/**
 * Centralized Design System & UI Theme Tokens for (SP) Pamilihub
 * 
 * Single source of truth for colors, typography, border radius, shadows,
 * role styling, status badges, and brand constants across mobile & desktop.
 */

// ─── 1. Brand Identity ────────────────────────────────────────────────────────

export const THEME_BRAND = {
  name: "Pamilihub",
  fullName: "(SP) Pamilihub — San Pablo Delicacies",
  tagline: "Authentic Local Delicacies",
  subTagline: "Direct from Local Food Producers",
  location: "San Pablo City, Laguna",
  currency: "₱",
  currencyCode: "PHP",
  flatDeliveryFee: 50,
  deliveryFeeLabel: "Flat ₱50 Local Delivery Fee",
  primaryHex: "#2373F4", // Brand Blue
} as const;

// ─── 2. Colors ────────────────────────────────────────────────────────────────

export const THEME_COLORS = {
  // Primary brand palette (#2373F4)
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
    hex: "#2373F4",
    shades: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2373F4",
      700: "#1d5ec9",
      800: "#174aa0",
      900: "#133d83",
    },
  },

  // Surfaces & Base
  surface: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    card: "hsl(var(--card))",
    cardForeground: "hsl(var(--card-foreground))",
    popover: "hsl(var(--popover))",
    popoverForeground: "hsl(var(--popover-foreground))",
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
  },

  // Semantic Feedback & Statuses
  feedback: {
    success: {
      hex: "#059669",
      bgClass: "bg-emerald-500/10",
      textClass: "text-emerald-700",
      borderClass: "border-emerald-500/20",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    warning: {
      hex: "#d97706",
      bgClass: "bg-amber-500/10",
      textClass: "text-amber-700",
      borderClass: "border-amber-500/20",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    },
    info: {
      hex: "#0284c7",
      bgClass: "bg-sky-500/10",
      textClass: "text-sky-700",
      borderClass: "border-sky-500/20",
      badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    },
    destructive: {
      hex: "#dc2626",
      bgClass: "bg-rose-500/10",
      textClass: "text-rose-700",
      borderClass: "border-rose-500/20",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    },
    neutral: {
      hex: "#4b5563",
      bgClass: "bg-gray-500/10",
      textClass: "text-gray-700",
      borderClass: "border-gray-500/20",
      badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
    },
  },

  // Role Theme Accents
  roles: {
    customer: {
      label: "Customer",
      icon: "🛍️",
      colorHex: "#2373F4",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      accentBgClass: "bg-blue-500/10",
      textClass: "text-primary",
    },
    seller: {
      label: "Seller",
      icon: "🏪",
      colorHex: "#ea580c", // Orange 600
      badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
      accentBgClass: "bg-orange-500/10",
      textClass: "text-orange-600",
    },
    admin: {
      label: "Administrator",
      icon: "🛡️",
      colorHex: "#6366f1", // Indigo 500
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      accentBgClass: "bg-indigo-500/10",
      textClass: "text-indigo-600",
    },
  },
} as const;

// ─── 3. Typography & Fonts ───────────────────────────────────────────────────

export const THEME_FONTS = {
  // Font Families
  family: {
    sans: [
      '"Avenir Next"',
      "Avenir",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ],
    mono: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      '"Liberation Mono"',
      '"Courier New"',
      "monospace",
    ],
  },

  // Type Scale
  scale: {
    "2xs": { size: "0.625rem", lineHeight: "0.875rem" }, // 10px (badges, labels)
    xs:    { size: "0.75rem",  lineHeight: "1rem" },     // 12px (captions, subtexts)
    sm:    { size: "0.875rem", lineHeight: "1.25rem" },  // 14px (body compact, UI buttons)
    base:  { size: "1rem",      lineHeight: "1.5rem" },   // 16px (standard body)
    lg:    { size: "1.125rem", lineHeight: "1.75rem" },  // 18px (subheadings)
    xl:    { size: "1.25rem",  lineHeight: "1.75rem" },  // 20px (card headers)
    "2xl": { size: "1.5rem",   lineHeight: "2rem" },     // 24px (section titles)
    "3xl": { size: "1.875rem", lineHeight: "2.25rem" },  // 30px (page titles)
    "4xl": { size: "2.25rem",  lineHeight: "2.5rem" },   // 36px (hero display)
  },

  // Font Weights
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
} as const;

// ─── 4. Border Radius ─────────────────────────────────────────────────────────

export const THEME_RADIUS = {
  none: "0px",
  sm: "0.5rem",     // 8px
  md: "0.75rem",    // 12px
  lg: "0.875rem",   // 14px (Standard Card & Container Radius, matches --radius)
  xl: "1rem",       // 16px (Buttons, Search Inputs)
  "2xl": "1.25rem", // 20px (Mobile Bottom Nav, Cards)
  "3xl": "1.5rem",  // 24px (Hero Promo Cards)
  full: "9999px",   // Badges, Pills, Avatars
} as const;

// ─── 5. Elevation & Shadows ──────────────────────────────────────────────────

export const THEME_SHADOWS = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  primaryGlow: "0 10px 25px -5px rgba(225, 29, 72, 0.25)",
} as const;

// ─── 6. Layout & Spacing Dimensions ──────────────────────────────────────────

export const THEME_LAYOUT = {
  headerHeight: "3.5rem",            // 56px (h-14)
  headerHeightLg: "4rem",            // 64px (h-16)
  mobileBottomNavHeight: "3.5rem",   // 56px (h-14)
  mainContentBottomPadding: "pb-20 lg:pb-8", // Clears fixed mobile bar
  maxContainerWidth: "max-w-7xl",     // 1280px
  maxCardWidth: "max-w-md",          // 448px (auth / forms)
  sidebarWidth: "16rem",             // 256px
} as const;

// ─── 7. Helper Utilities ─────────────────────────────────────────────────────

export type UserRole = "customer" | "seller" | "admin";

/**
 * Returns centralized styling, label, and emoji icon for a user role.
 */
export function getRoleTheme(role: UserRole | string | undefined | null) {
  if (role === "admin") return THEME_COLORS.roles.admin;
  if (role === "seller") return THEME_COLORS.roles.seller;
  return THEME_COLORS.roles.customer;
}

/**
 * Returns formatted local currency string for prices and subtotals.
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${THEME_BRAND.currency}${num.toFixed(2)}`;
}

const Theme = {
  brand: THEME_BRAND,
  colors: THEME_COLORS,
  fonts: THEME_FONTS,
  radius: THEME_RADIUS,
  shadows: THEME_SHADOWS,
  layout: THEME_LAYOUT,
  getRoleTheme,
  formatCurrency,
};

export default Theme;
