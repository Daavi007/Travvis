"use client";

import Link from "next/link";
import { productHref } from "./ProductCard";
import { ProductArt } from "./ProductArt";
import { useCatalog } from "./CatalogProvider";

export function HomeHero() {
  const { products, ready } = useCatalog();
  const featured = products[0];

  return (
    <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Travvis Multimarcas</p>
        <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[0.92] sm:text-7xl">
          Roupas, relógios e bonés.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Uma vitrine só, com peças para usar no dia a dia. Monte o pedido e pague com Pix, cartão ou fale com a loja no WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/produtos" className="bg-ink px-5 py-3 text-cream">
            Ver a vitrine
          </Link>
          <Link href="/produtos?categoria=camisas-oversized" className="border border-ink px-5 py-3">
            Camisas oversized
          </Link>
        </div>
      </div>
      {ready && featured ? (
        <Link href={productHref(featured)} className="block">
          <ProductArt product={featured} className="aspect-[4/5]" />
        </Link>
      ) : (
        <div className="hidden aspect-[4/5] bg-cream lg:block" />
      )}
    </section>
  );
}
