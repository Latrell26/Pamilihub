import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "@/lib/cart/cart-context";

function CartTest() {
  const { items, addItem, removeItem, updateQuantity, itemCount, subtotal } = useCart();
  return (
    <div>
      <button onClick={() => addItem({ productId: "p1", name: "Buko Pie", price: 200, stock: 10, sellerId: "s1", sellerName: "Seller" })}>
        Add
      </button>
      <button onClick={() => removeItem("p1")}>Remove</button>
      <button onClick={() => updateQuantity("p1", 3)}>Qty 3</button>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="subtotal">{subtotal}</span>
      {items.map((i) => (
        <span key={i.productId} data-testid={`item-${i.productId}`}>
          {i.quantity}
        </span>
      ))}
    </div>
  );
}

function renderCart() {
  return render(
    <CartProvider userId={null}>
      <CartTest />
    </CartProvider>
  );
}

describe("cart controls", () => {
  it("adds, updates quantity, and removes items", () => {
    renderCart();
    expect(screen.getByTestId("count").textContent).toBe("0");

    fireEvent.click(screen.getByText(/Add/));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("item-p1").textContent).toBe("1");
    expect(screen.getByTestId("subtotal").textContent).toBe("200");

    fireEvent.click(screen.getByText(/Qty 3/));
    expect(screen.getByTestId("count").textContent).toBe("3");
    expect(screen.getByTestId("subtotal").textContent).toBe("600");

    fireEvent.click(screen.getByText(/Remove/));
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.queryByTestId("item-p1")).not.toBeInTheDocument();
  });
});
