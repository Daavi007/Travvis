import { formatBRL } from "./format";

export type OrderLine = {
  name: string;
  color: string;
  size: string;
  qty: number;
  lineTotal: number;
};

export function buildOrderMessage(input: {
  orderId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  note?: string;
  lines: OrderLine[];
  total: number;
  paymentLabel: string;
}) {
  const items = input.lines.map((line) => {
    const size = line.size ? `*${line.size}*` : "";
    const variant = [line.color, size].filter(Boolean).join(" | ");
    const label = variant ? `# ${line.name} | ${variant}` : `# ${line.name}`;
    return `${label}\nQuantidade: ${line.qty} / Valor: ${formatBRL(line.lineTotal)}`;
  });

  return [
    `Pedido #${input.orderId}`,
    "-----------------------",
    `Cliente: Nome: ${input.name}`,
    `Celular: ${input.phone}`,
    input.email ? `E-mail: ${input.email}` : "",
    `Entrega: ${input.address}, ${input.city}`,
    "Produtos:",
    ...items,
    `Subtotal: ${formatBRL(input.total)}`,
    "Frete: a combinar",
    `Pagamento: ${input.paymentLabel}`,
    input.note ? `Obs.: ${input.note}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}
