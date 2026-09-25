"use client";

import { useState } from "react";
import { displaySizes, productImages, type Product } from "@/lib/products";
import { useCart } from "./CartProvider";
import { ProductArt } from "./ProductArt";
import { ProductPrice } from "./ProductPrice";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const photos = productImages(product);
  const sizes = displaySizes(product);
  const [photo, setPhoto] = useState(photos[0] ?? "");
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
      <div>
        <ProductArt product={product} src={photo || undefined} className="aspect-[4/5]" />
        {photos.length > 1 ? (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {photos.map((item) => (
              <button
                key={item.slice(0, 40)}
                type="button"
                onClick={() => setPhoto(item)}
                className={`overflow-hidden border ${photo === item ? "border-ink" : "border-line"}`}
              >
                <img src={item} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <h1 className="font-serif text-5xl leading-none">{product.name}</h1>
        <ProductPrice price={product.price} size="detail" />
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
              {sizes.map((item) => {
                const inStock = product.sizes.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={!inStock}
                    aria-pressed={size === item}
                    aria-label={inStock ? item : `${item} indisponível`}
                    onClick={() => {
                      if (!inStock) return;
                      setSize(item);
                      setError("");
                    }}
                    className={`relative min-w-12 border px-3 py-2 text-sm ${
                      !inStock
                        ? "cursor-not-allowed border-line text-muted"
                        : size === item
                          ? "border-ink bg-ink text-cream"
                          : "border-line"
                    }`}
                  >
                    {item}
                    {!inStock ? (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg leading-none text-brand" aria-hidden="true">
                        ×
                      </span>
                    ) : null}
                  </button>
                );
              })}
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
