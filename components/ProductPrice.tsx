import { formatBRL, installment, pixPrice } from "@/lib/format";

export function ProductPrice({ price, size = "card" }: { price: number; size?: "card" | "detail" }) {
  const title = size === "detail" ? "mt-4 text-3xl font-medium" : "mt-2 text-xl font-medium";
  return (
    <div>
      <p className={title}>{formatBRL(price)}</p>
      <p className="mt-1 text-sm text-muted">5x de {formatBRL(installment(price))} sem juros</p>
      <p className="mt-1 text-sm text-brand">{formatBRL(pixPrice(price))} no Pix</p>
    </div>
  );
}
