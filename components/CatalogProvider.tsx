"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { products as staticProducts, type Product } from "@/lib/products";

type CatalogValue = {
  products: Product[];
  ready: boolean;
  getProduct: (slug: string) => Product | undefined;
  reload: () => Promise<void>;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [extra, setExtra] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  async function reload() {
    try {
      const response = await fetch(apiUrl("/api/products"));
      const data = (await response.json()) as { products?: Product[] };
      setExtra(Array.isArray(data.products) ? data.products : []);
    } catch {
      setExtra([]);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  const value = useMemo<CatalogValue>(() => {
    const slugs = new Set(staticProducts.map((product) => product.slug));
    const products = [...staticProducts, ...extra.filter((product) => !slugs.has(product.slug))];
    return {
      products,
      ready,
      getProduct: (slug) => products.find((product) => product.slug === slug),
      reload,
    };
  }, [extra, ready]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog fora do provider");
  return value;
}
