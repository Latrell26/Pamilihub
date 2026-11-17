import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CartProvider } from "@/lib/cart/cart-context";

vi.mock("@/modules/accounts/actions", () => ({
  signoutAction: vi.fn(),
}));

import SiteHeader from "@/components/ui/site-header";

const customerUser = { role: "customer", full_name: "Ana" } as const;
const sellerUser = { role: "seller", full_name: "Maria" } as const;
const adminUser = { role: "admin", full_name: "Admin" } as const;

function renderHeader(user: { role: string; full_name?: string } | null) {
  return render(
    <CartProvider userId={null}>
      <SiteHeader user={user} />
    </CartProvider>
  );
}

describe("SiteHeader", () => {
  it("renders public links for a guest", () => {
    renderHeader(null);
    expect(screen.getByText(/Delicacies/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.queryByText(/My Orders/i)).not.toBeInTheDocument();
  });

  it("renders customer links and cart for a customer", () => {
    renderHeader(customerUser);
    expect(screen.getByText(/My Orders/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shopping Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Ana/i)).toBeInTheDocument();
  });

  it("renders seller links for a seller", () => {
    renderHeader(sellerUser);
    expect(screen.getByText(/Store Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Merchant/i)).toBeInTheDocument();
  });

  it("renders admin links for an admin", () => {
    renderHeader(adminUser);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Approvals/i)).toBeInTheDocument();
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Admin/i).length).toBeGreaterThanOrEqual(1);
  });
});
