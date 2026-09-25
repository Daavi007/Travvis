import { priceItems } from "@/lib/checkout-items";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ cartao: Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN) });
}

export async function POST(request: Request) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    return Response.json({ configured: false, error: "Cartão online ainda não está ativo." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const lines = priceItems(body?.items);
  if (lines.length === 0) {
    return Response.json({ error: "Pedido vazio ou inválido." }, { status: 400 });
  }

  const name = String(body?.payer?.name || "").trim();
  const email = String(body?.payer?.email || "").trim();
  if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Nome e e-mail são obrigatórios para o cartão." }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const orderId = String(body?.orderId || "TRAVVIS").replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);
  const preference = {
    items: lines.map((line) => ({
      title: `${line.name} (${[line.color, line.size].filter(Boolean).join(", ")})`.slice(0, 120),
      quantity: line.qty,
      unit_price: line.unitPrice,
      currency_id: "BRL",
    })),
    payer: { name, email },
    external_reference: orderId,
    statement_descriptor: "TRAVVIS",
    back_urls: {
      success: `${origin}/checkout/retorno?status=approved`,
      failure: `${origin}/checkout/retorno?status=failure`,
      pending: `${origin}/checkout/retorno?status=pending`,
    },
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preference),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return Response.json({ error: "O Mercado Pago recusou a cobrança." }, { status: 502 });
  }

  const url = token.startsWith("TEST-") ? data.sandbox_init_point : data.init_point;
  if (!url) return Response.json({ error: "Link de pagamento indisponível." }, { status: 502 });
  return Response.json({ url });
}
