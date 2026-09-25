import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { categories, categoryLabel, products, type CategoryId } from "@/lib/products";

export const metadata: Metadata = { title: "Vitrine" };

export default function ProductsPage({ searchParams }: { searchParams: { categoria?: string } }) {
  const selected = categories.some((category) => category.id === searchParams.categoria)
    ? (searchParams.categoria as CategoryId)
    : null;
  const list = selected ? products.filter((product) => product.category === selected) : products;
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
