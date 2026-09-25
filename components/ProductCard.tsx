import Link from "next/link";
import { formatBRL } from "@/lib/format";
import { categoryLabel, type Product } from "@/lib/products";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="overflow-hidden">
        <ProductArt product={product} className="aspect-[4/5] transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted">{categoryLabel(product.category)}</p>
      <h2 className="mt-1 text-lg leading-tight">{product.name}</h2>
      <p className="mt-1 text-sm">{formatBRL(product.price)}</p>
    </Link>
  );
}
