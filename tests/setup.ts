import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";
import { vi } from "vitest";

// jsdom does not expose these globally; Next.js/Supabase code may reference them.
Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
});

// Mock next/navigation so client components that use useRouter/usePathname render.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
}));
