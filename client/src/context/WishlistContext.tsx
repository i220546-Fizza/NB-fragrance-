import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import type { Product } from '../types';

const WISHLIST_KEY = 'nb_wishlist';

interface WishlistContextValue {
  products: Product[];
  ids: Set<string>;
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function readLocal(): Product[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(products: Product[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(products));
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => readLocal());
  const [loading, setLoading] = useState(false);
  const [hasMerged, setHasMerged] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts(readLocal());
      return;
    }
    setLoading(true);
    try {
      const list = await userService.getWishlist();
      setProducts(list);
    } catch {
      // keep previous state on failure
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Merge any guest wishlist into the account once, right after login.
  useEffect(() => {
    if (!isAuthenticated || hasMerged) return;
    const local = readLocal();
    setHasMerged(true);
    (async () => {
      setLoading(true);
      try {
        for (const p of local) {
          try {
            await userService.addToWishlist(p._id);
          } catch {
            /* ignore individual merge failures */
          }
        }
        writeLocal([]);
        const list = await userService.getWishlist();
        setProducts(list);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, hasMerged]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProducts(readLocal());
      setHasMerged(false);
    }
  }, [isAuthenticated]);

  const ids = useMemo(() => new Set(products.map((p) => p._id)), [products]);

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);

  const toggle = useCallback(
    async (product: Product) => {
      const already = ids.has(product._id);
      if (isAuthenticated) {
        setLoading(true);
        try {
          if (already) {
            await userService.removeFromWishlist(product._id);
            setProducts((prev) => prev.filter((p) => p._id !== product._id));
          } else {
            await userService.addToWishlist(product._id);
            setProducts((prev) => [...prev, product]);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setProducts((prev) => {
          const next = already ? prev.filter((p) => p._id !== product._id) : [...prev, product];
          writeLocal(next);
          return next;
        });
      }
    },
    [ids, isAuthenticated]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ products, ids, loading, isWishlisted, toggle, refresh }),
    [products, ids, loading, isWishlisted, toggle, refresh]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
