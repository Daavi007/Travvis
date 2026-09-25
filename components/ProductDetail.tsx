"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatBRL } from "@/lib/format";
import { useCart } from "./CartProvider";
import { ProductArt } from "./ProductArt";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const available = typeof product.stock === "number" ? product.stock : 10;
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  function onAdd() {
    if (available < 1) {
      setError("Esta peça está esgotada.");
      return;
    }
    if (product.sizes.length > 0 && !size) {
      setError("Escolha um tamanho.");
      return;
    }
    if (qty > available) {
      setError(`Há ${available} disponíveis.`);
      return;
    }
    setError("");
    add({ slug: product.slug, size, color, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductArt product={product} className="aspect-[4/5]" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{product.sku}</p>
        <h1 className="mt-2 font-serif text-5xl leading-none">{product.name}</h1>
        <p className="mt-4 text-xl">{formatBRL(product.price)}</p>
        {typeof product.stock === "number" ? (
          <p className="mt-2 text-sm text-muted">{product.stock === 0 ? "Esgotado" : `${product.stock} disponíveis`}</p>
        ) : null}
        <p className="mt-4 max-w-md text-muted">{product.description}</p>

        <fieldset className="mt-8">
          <legend className="text-sm">Cor: {color}</legend>
          <div className="mt-3 flex gap-2">
            {product.colors.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                aria-pressed={color === item.name}
                onClick={() => setColor(item.name)}
                className={`h-8 w-8 border ${color === item.name ? "border-ink" : "border-line"}`}
                style={{ background: item.hex }}
              />
            ))}
          </div>
        </fieldset>

        {product.sizes.length > 0 ? (
          <fieldset className="mt-6">
            <legend className="text-sm">Tamanho</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={size === item}
                  onClick={() => {
                    setSize(item);
                    setError("");
                  }}
                  className={`min-w-12 border px-3 py-2 text-sm ${size === item ? "border-ink bg-ink text-cream" : "border-line"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm" htmlFor="qty">
            Quantidade
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={available}
            value={qty}
            onChange={(event) => setQty(Math.min(available, Math.max(1, Number(event.target.value) || 1)))}
            className="w-20 border border-line bg-cream px-3 py-2"
          />
        </div>

        {error ? <p className="mt-3 text-sm text-brand">{error}</p> : null}

        <button type="button" onClick={onAdd} disabled={available < 1} className="mt-6 w-full bg-ink px-4 py-3 text-cream hover:bg-brand disabled:opacity-40 sm:w-auto">
          {added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
        </button>

        <ul className="mt-8 space-y-2 text-sm text-muted">
          {product.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
