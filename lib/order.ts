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
    const variant = [line.color, line.size].filter(Boolean).join(", ");
    const label = variant ? `${line.name} (${variant})` : line.name;
    return `• ${line.qty}× ${label} — ${formatBRL(line.lineTotal)}`;
  });

  return [
    "Olá! Quero fazer um pedido na Travvis Multimarcas.",
    `Código: ${input.orderId}`,
    "",
    `Nome: ${input.name}`,
    `WhatsApp: ${input.phone}`,
    input.email ? `E-mail: ${input.email}` : "",
    `Entrega: ${input.address}, ${input.city}`,
    "",
    "Itens:",
    ...items,
    "",
    `Total dos produtos: ${formatBRL(input.total)}`,
    "Frete: a combinar na confirmação",
    `Pagamento: ${input.paymentLabel}`,
    input.note ? `Obs.: ${input.note}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}
