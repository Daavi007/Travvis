import { getProduct } from "./products";

export type IncomingItem = {
  slug?: string;
  size?: string;
  color?: string;
  qty?: number;
};

export type PricedLine = {
  name: string;
  size: string;
  color: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export function priceItems(raw: unknown): PricedLine[] {
  if (!Array.isArray(raw)) return [];
  const lines: PricedLine[] = [];

  for (const entry of raw as IncomingItem[]) {
    if (!entry || typeof entry !== "object") continue;
    const product = getProduct(String(entry.slug || ""));
    const qty = Number(entry.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 10) continue;

    const size = String(entry.size || "");
    const color = String(entry.color || "");
    if (product.sizes.length > 0 && !product.sizes.includes(size)) continue;
    if (!product.colors.some((item) => item.name === color)) continue;

    lines.push({
      name: product.name,
      size,
      color,
      qty,
      unitPrice: product.price,
      lineTotal: product.price * qty,
    });
  }

  return lines;
}
