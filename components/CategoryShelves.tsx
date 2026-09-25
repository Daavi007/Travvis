"use client";

import Link from "next/link";
import { categories, sameCategory } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { useCatalog } from "./CatalogProvider";

export function CategoryShelves() {
  const { products } = useCatalog();
  const shelves = categories.filter((category) => category.id !== "roupas");

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-5">
      {shelves.map((category) => {
        const items = products.filter((product) => sameCategory(product.category, category.id)).slice(0, 3);
        return (
          <section key={category.id}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-4xl">{category.label}</h2>
                <p className="mt-2 text-sm text-muted">{category.text}</p>
              </div>
              <Link href={`/produtos?categoria=${category.id}`} className="shrink-0 text-sm underline">
                Ver tudo
              </Link>
            </div>
            {items.length > 0 ? (
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">Nenhuma peça cadastrada ainda.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
