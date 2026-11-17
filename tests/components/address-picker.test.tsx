import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddressPicker } from "@/components/ui/address-picker";

const barangayPayload = {
  data: [
    { code: "0403424001", name: "Bagong Bayan II-A" },
    { code: "0403424002", name: "Bagong Pook VI-C" },
    { code: "0403424003", name: "Barangay I-A" },
    { code: "0403424004", name: "San Francisco" },
    { code: "0403424005", name: "San Rafael" },
  ],
};

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => barangayPayload,
    })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = originalFetch;
});

describe("AddressPicker", () => {
  it("shows loading state while barangays load", () => {
    render(<AddressPicker value="" onChange={vi.fn()} />);
    expect(screen.getByText(/Loading barangays…/)).toBeInTheDocument();
  });

  it("renders barangay options once loaded", async () => {
    render(<AddressPicker value="" onChange={vi.fn()} />);
    await waitFor(() =>
      expect(screen.getByText("Brgy. Bagong Bayan II-A")).toBeInTheDocument()
    );
    const select = screen.getByLabelText(/Barangay/);
    expect(select).toBeInTheDocument();
  });

  it("emits composed address when street + barangay chosen", async () => {
    // Controlled parent mirrors how checkout/profile/apply use the picker.
    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return (
        <div>
          <AddressPicker value={value} onChange={setValue} />
          <span data-testid="emitted">{value}</span>
        </div>
      );
    };
    render(<Controlled />);
    await waitFor(() =>
      expect(screen.getByText("Brgy. San Rafael")).toBeInTheDocument()
    );

    const input = screen.getByLabelText(/Street \/ Purok/);
    const user = userEvent.setup();
    await user.type(input, "Purok 3");

    const select = screen.getByLabelText(/Barangay/);
    await user.selectOptions(select, "0403424005");

    await new Promise((r) => setTimeout(r, 200));
    const actual = screen.getByTestId("emitted").textContent;
    expect(actual).toBe(
      "Purok 3, Brgy. San Rafael, City of San Pablo, Laguna, CALABARZON"
    );
  });

  it("falls back to manual entry when API fails", async () => {
    // Override before mount so the effect's fetch rejects.
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("down"));
    const onChange = vi.fn();
    render(<AddressPicker value="" onChange={onChange} />);
    await waitFor(() => {
      expect(screen.getByText(/Couldn/)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /Enter address manually/ })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Enter address manually/ }));
    expect(
      screen.getByPlaceholderText(/City of San Pablo, Laguna/)
    ).toBeInTheDocument();
  });

  it("displays fixed city/province/region tail", () => {
    render(<AddressPicker value="" onChange={vi.fn()} />);
    expect(screen.getByText(/City of San Pablo/)).toBeInTheDocument();
    expect(screen.getByText(/Laguna/)).toBeInTheDocument();
    expect(screen.getByText(/CALABARZON/)).toBeInTheDocument();
  });
});
