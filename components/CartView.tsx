"use client";

import Link from "next/link";
import { formatBRL } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { cartKey } from "@/lib/types";
import { useCart } from "./CartProvider";
import { ProductArt } from "./ProductArt";

export function CartView() {
  const { items, ready, setQty, remove } = useCart();
  const lines = items.flatMap((item) => {
    const product = getProduct(item.slug);
    if (!product) return [];
    return [{ item, product, key: cartKey(item), lineTotal: product.price * item.qty }];
  });
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  if (!ready) return <div className="mx-auto max-w-6xl px-5 py-16 text-muted">Carregando carrinho...</div>;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-serif text-5xl">Carrinho</h1>
        <p className="mt-4 text-muted">Seu carrinho está vazio.</p>
        <Link href="/produtos" className="mt-6 inline-block bg-ink px-4 py-3 text-cream">
          Ver a vitrine
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.4fr_0.6fr]">
      <div>
        <h1 className="font-serif text-5xl">Carrinho</h1>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {lines.map(({ item, product, key, lineTotal }) => (
            <li key={key} className="flex gap-4 py-5">
              <ProductArt product={product} className="h-24 w-20 shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg">{product.name}</h2>
                <p className="text-sm text-muted">
                  {[item.color, item.size].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" className="h-8 w-8 border border-line" onClick={() => setQty(key, item.qty - 1)} aria-label="Diminuir">
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button type="button" className="h-8 w-8 border border-line" onClick={() => setQty(key, item.qty + 1)} aria-label="Aumentar">
                    +
                  </button>
                  <button type="button" className="ml-3 text-sm text-muted underline" onClick={() => remove(key)}>
                    Remover
                  </button>
                </div>
              </div>
              <p className="text-sm">{formatBRL(lineTotal)}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit border border-line bg-cream p-5 lg:sticky lg:top-24">
        <p className="text-sm text-muted">Produtos</p>
        <p className="mt-1 font-serif text-4xl">{formatBRL(total)}</p>
        <p className="mt-3 text-sm text-muted">O frete é combinado no WhatsApp depois do pedido.</p>
        <Link href="/checkout" className="mt-6 block bg-ink px-4 py-3 text-center text-cream">
          Fechar pedido
        </Link>
      </aside>
    </div>
  );
}
