"use client";

import { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
import { Stack } from "@/lib/data-structures/stack";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  undoRemove: () => void;
  dismissUndo: () => void;
  canUndo: boolean;
  lastRemovedName: string | null;
  itemCount: number;
  subtotal: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY_PREFIX = "pamilihub_cart";

/** Build the per-user localStorage key. Guests share a single anonymous key. */
function storageKey(userId: string | null): string {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
}

function loadCart(userId: string | null): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(userId: string | null, items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(items));
}

export function CartProvider({
  userId,
  children,
}: {
  /** auth user id – null for guests */
  userId: string | null;
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── DSA: Stack for undo — when a customer removes an item, it's pushed onto
  // the stack so they can undo the removal (LIFO: last removed = first restored). ──
  const undoStackRef = useRef(new Stack<CartItem>());
  const itemsRef = useRef<CartItem[]>(items);
  const [canUndo, setCanUndo] = useState(false);
  const [lastRemovedName, setLastRemovedName] = useState<string | null>(null);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Reload cart whenever the signed-in user changes
  useEffect(() => {
    setItems(loadCart(userId));
    setIsLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (isLoaded) saveCart(userId, items);
  }, [items, isLoaded, userId]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        const maxStock = Math.max(0, item.stock);
        if (maxStock <= 0) return prev;

        if (existing) {
          const desired = existing.quantity + (item.quantity ?? 1);
          const newQty = Math.min(maxStock, desired);
          return prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: newQty, stock: item.stock }
              : i
          );
        }
        const initialQty = Math.min(maxStock, item.quantity ?? 1);
        if (initialQty <= 0) return prev;
        return [
          ...prev,
          { ...item, quantity: initialQty },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    // Find item from ref outside the setState updater to prevent double-push in React StrictMode
    const removed = itemsRef.current.find((i) => i.productId === productId);
    if (removed) {
      undoStackRef.current.push({ ...removed });
      setLastRemovedName(removed.name);
      setCanUndo(true);
    }
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  /** DSA: Stack — pop the last removed item and restore it to the cart. */
  const undoRemove = useCallback(() => {
    if (undoStackRef.current.isEmpty) return;
    const restored = undoStackRef.current.pop();
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === restored.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === restored.productId
            ? { ...i, quantity: i.quantity + restored.quantity }
            : i
        );
      }
      return [...prev, restored];
    });

    const stillHasItems = !undoStackRef.current.isEmpty;
    setCanUndo(stillHasItems);
    setLastRemovedName(stillHasItems ? undoStackRef.current.peek().name : null);
  }, []);

  const dismissUndo = useCallback(() => {
    undoStackRef.current.clear();
    setCanUndo(false);
    setLastRemovedName(null);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId) {
          const maxStock = Math.max(0, i.stock);
          const clamped = Math.min(maxStock, Math.max(0, quantity));
          return { ...i, quantity: clamped };
        }
        return i;
      })
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    undoStackRef.current.clear();
    setCanUndo(false);
    setLastRemovedName(null);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!CartContext) {
    throw new Error("CartContext is not initialized");
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, undoRemove, dismissUndo, canUndo, lastRemovedName, itemCount, subtotal, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
