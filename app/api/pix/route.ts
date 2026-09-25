import QRCode from "qrcode";
import { storeConfig } from "@/lib/config";
import { priceItems } from "@/lib/checkout-items";
import { buildPixPayload } from "@/lib/pix";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const pixKey = process.env.PIX_KEY || storeConfig.pixKey;
  if (!pixKey) {
    return Response.json({ configured: false, error: "Chave Pix não configurada." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const lines = priceItems(body?.items);
  if (lines.length === 0) {
    return Response.json({ error: "Pedido vazio ou inválido." }, { status: 400 });
  }

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const orderId = String(body?.orderId || "TRAVVIS").slice(0, 40);
  const payload = buildPixPayload({
    key: pixKey,
    name: storeConfig.pixMerchantName,
    city: storeConfig.pixCity,
    amount: total,
    txid: orderId,
  });
  const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 320, errorCorrectionLevel: "M" });

  return Response.json({ payload, qrDataUrl, total, orderId });
}
