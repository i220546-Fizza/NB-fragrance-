import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '../types';

const CART_KEY = 'nb_cart';
// Flat delivery charge applied to every order — never free, never
// discounted, regardless of subtotal, quantity, or promotions. This is
// a display estimate only; the backend recalculates and enforces the
// same fixed Rs. 200 charge independently for every order it creates.
const DELIVERY_CHARGE = 200;

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, qty?: number, size?: string) => void;
  increment: (product: string, size: string) => void;
  decrement: (product: string, size: string) => void;
  removeItem: (product: string, size: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, qty = 1, size?: string) => {
    const chosenSize = size ?? product.size;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product === product._id && i.size === chosenSize);
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.min(next[idx].qty + qty, Math.max(product.stock, 1));
        next[idx] = { ...next[idx], qty: newQty };
        return next;
      }
      return [
        ...prev,
        {
          product: product._id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] ?? '/images/product-placeholder.svg',
          price: product.price,
          qty: Math.min(qty, Math.max(product.stock, 1)),
          size: chosenSize,
          stock: product.stock,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const increment = useCallback((product: string, size: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product === product && i.size === size ? { ...i, qty: Math.min(i.qty + 1, Math.max(i.stock, 1)) } : i
      )
    );
  }, []);

  const decrement = useCallback((product: string, size: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.product === product && i.size === size ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((product: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.product === product && i.size === size)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  // Flat Rs. 200 delivery charge on every order — no threshold, no
  // promotion, no free-delivery condition of any kind.
  const deliveryCharge = DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
      subtotal,
      deliveryCharge,
      total,
      itemCount,
    }),
    [items, isDrawerOpen, addItem, increment, decrement, removeItem, clearCart, subtotal, deliveryCharge, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { DELIVERY_CHARGE };
