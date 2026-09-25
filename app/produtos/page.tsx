"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/components/CatalogProvider";
import { categories, categoryLabel, sameCategory, type CategoryId } from "@/lib/products";

function ProductsPage() {
  const { products } = useCatalog();
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria") ?? undefined;
  const selected = categories.some((category) => category.id === categoria)
    ? (categoria as CategoryId)
    : null;
  const list = selected ? products.filter((product) => sameCategory(product.category, selected)) : products;
  const current = categories.find((category) => category.id === selected);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-serif text-5xl">{selected ? categoryLabel(selected) : "A vitrine"}</h1>
      <p className="mt-3 max-w-lg text-muted">{current?.text ?? "Roupas, relógios e bonés."}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/produtos" className={`border px-3 py-2 text-sm ${selected ? "border-line" : "border-ink bg-ink text-cream"}`}>
          Tudo
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/produtos?categoria=${category.id}`}
            className={`border px-3 py-2 text-sm ${selected === category.id ? "border-ink bg-ink text-cream" : "border-line"}`}
          >
            {category.label}
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">{list.length} peças</p>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
