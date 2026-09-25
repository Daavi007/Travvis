"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { useCatalog } from "@/components/CatalogProvider";

export default function RegisteredProductPage() {
  const { products, ready, getProduct } = useCatalog();
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("slug") || "");
  }, []);

  const product = slug ? getProduct(slug) : undefined;
  const related = product ? products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3) : [];

  if (!slug || !ready) return <div className="mx-auto max-w-6xl px-5 py-16 text-muted">Carregando produto...</div>;
  if (!product) return <div className="mx-auto max-w-6xl px-5 py-16">Esse produto não está na vitrine.</div>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <ProductDetail product={product} />
      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-serif text-4xl">Na mesma vitrine</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
