"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartKey, isCartItem, type CartItem } from "@/lib/types";

const STORAGE = "travvis-cart";

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  add: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter(isCartItem));
      }
    } catch {
      /* carrinho vazio se o armazenamento estiver inválido */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      ready: hydrated,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      add: (item) => {
        setItems((current) => {
          const key = cartKey(item);
          const existing = current.find((entry) => cartKey(entry) === key);
          if (!existing) return [...current, item];
          return current.map((entry) =>
            cartKey(entry) === key ? { ...entry, qty: Math.min(10, entry.qty + item.qty) } : entry,
          );
        });
      },
      setQty: (key, qty) => {
        setItems((current) =>
          current.flatMap((entry) => {
            if (cartKey(entry) !== key) return [entry];
            if (qty < 1) return [];
            return [{ ...entry, qty: Math.min(10, qty) }];
          }),
        );
      },
      remove: (key) => setItems((current) => current.filter((entry) => cartKey(entry) !== key)),
      clear: () => setItems([]),
    };
  }, [items, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart precisa do CartProvider");
  return context;
}
