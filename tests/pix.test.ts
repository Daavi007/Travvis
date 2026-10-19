import { describe, expect, it } from "vitest";
import { buildPixPayload } from "../lib/pix";

function crc16(text: string) {
  let crc = 0xffff;
  for (const char of text) {
    crc ^= char.charCodeAt(0) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const base = { key: "loja@exemplo.com", name: "Travvis Multimarcas", city: "Brasil", amount: 149.9, txid: "PED123" };

describe("buildPixPayload", () => {
  it("termina com o CRC16 correto do restante do código", () => {
    const payload = buildPixPayload(base);
    expect(payload.slice(-4)).toBe(crc16(payload.slice(0, -4)));
  });

  it("inclui a chave, o valor com duas casas e o identificador do PIX", () => {
    const payload = buildPixPayload(base);
    expect(payload).toContain("BR.GOV.BCB.PIX");
    expect(payload).toContain("loja@exemplo.com");
    expect(payload).toContain("5406149.90");
    expect(payload.startsWith("000201")).toBe(true);
  });

  it("remove acentos e símbolos do nome e da cidade, em maiúsculas", () => {
    const payload = buildPixPayload({ ...base, name: "Açaí & Cia. Ltda", city: "São Paulo" });
    expect(payload).toContain("ACAI  CIA LTDA");
    expect(payload).toContain("SAO PAULO");
  });

  it("limita o nome a 25 caracteres e o txid a 25 caracteres alfanuméricos", () => {
    const payload = buildPixPayload({ ...base, name: "N".repeat(40), txid: "abc-123 def!".repeat(5) });
    expect(payload).toContain(`5925${"N".repeat(25)}`);
    expect(payload).toContain("0525abc123def");
  });

  it("usa valores padrão quando nome, cidade e txid ficam vazios", () => {
    const payload = buildPixPayload({ ...base, name: "", city: "", txid: "" });
    expect(payload).toContain("5907TRAVVIS");
    expect(payload).toContain("6006BRASIL");
    expect(payload).toContain("0507TRAVVIS");
  });
});
