import type { Product } from "@/lib/products";

function Tee() {
  return (
    <path d="M150 128 112 148 78 214 126 236 152 188v204h96V188l26 48 48-22-34-66-38-20q-50 46-100 0Z" />
  );
}

function Hoodie() {
  return (
    <path d="M200 78c-28 8-46 32-50 52l-36 18-28 62 42 20 24-40v186h152V190l24 40 42-20-28-62-36-18c-4-20-22-44-50-52-12 22-28 32-56 32s-44-10-56-32Z" />
  );
}

function Pants() {
  return (
    <path d="M138 112h124l-8 78 34 232h-52l-22-188h-8l-22 188h-52l34-232-8-78Z" />
  );
}

function Watch() {
  return (
    <>
      <rect x="168" y="78" width="64" height="108" rx="10" />
      <rect x="168" y="314" width="64" height="108" rx="10" />
      <circle cx="200" cy="250" r="78" />
      <circle cx="200" cy="250" r="62" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.35" />
      <path d="M200 210v42l28 18" fill="none" stroke="#9f1d1d" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function Cap() {
  return (
    <path d="M118 236c2-62 36-104 82-104s80 42 82 104c28 6 58 18 70 28-18 26-86 48-152 36-62 10-126-8-146-32 14-12 40-24 64-32Z" />
  );
}

const arts = { tee: Tee, hoodie: Hoodie, pants: Pants, watch: Watch, cap: Cap };

export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  if (product.image) {
    return (
      <div className={`relative overflow-hidden bg-cream ${className}`}>
        <img src={product.image} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[10px] tracking-[0.22em] text-cream">{product.sku}</span>
      </div>
    );
  }
  const Art = arts[product.art];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: product.accent, color: product.ink }}>
      <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden="true">
        <ellipse cx="200" cy="438" rx="96" ry="12" opacity="0.15" />
        <Art />
      </svg>
      <span className="absolute left-3 top-3 text-[10px] tracking-[0.22em]">{product.sku}</span>
    </div>
  );
}
