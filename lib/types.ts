export type CartItem = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

export function cartKey(item: Pick<CartItem, "slug" | "size" | "color">) {
  return `${item.slug}__${item.size}__${item.color}`;
}

export function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;
  return (
    typeof item.slug === "string" &&
    typeof item.size === "string" &&
    typeof item.color === "string" &&
    Number.isInteger(item.qty) &&
    item.qty >= 1 &&
    item.qty <= 10
  );
}
