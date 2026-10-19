import { describe, expect, it } from "vitest";
import { formatBRL, installment, pixPrice } from "../lib/format";
import { buildOrderMessage } from "../lib/order";

describe("formatação de preços", () => {
  it("formata em reais", () => {
    expect(formatBRL(1234.5).replace(/\s/g, " ")).toBe("R$ 1.234,50");
  });

  it("divide em parcelas arredondando para centavos", () => {
    expect(installment(100)).toBe(20);
    expect(installment(99.9, 3)).toBe(33.3);
    expect(installment(10, 3)).toBe(3.33);
  });

  it("aplica R$ 10 de desconto no PIX sem ficar negativo", () => {
    expect(pixPrice(149.9)).toBe(139.9);
    expect(pixPrice(5)).toBe(0);
  });
});

describe("buildOrderMessage", () => {
  const input = {
    orderId: "A1",
    name: "Maria",
    phone: "(11) 91234-5678",
    address: "Rua X, 10",
    city: "Goiânia",
    lines: [
      { name: "Camisa Polo", color: "Preta", size: "M", qty: 2, lineTotal: 200 },
      { name: "Relógio", color: "Prata", size: "", qty: 1, lineTotal: 300 },
    ],
    total: 500,
    paymentLabel: "PIX",
  };

  it("monta o pedido com itens, total e pagamento", () => {
    const text = buildOrderMessage(input);
    expect(text).toContain("Pedido #A1");
    expect(text).toContain("# Camisa Polo | Preta | *M*");
    expect(text).toContain("# Relógio | Prata");
    expect(text).toContain("Quantidade: 2");
    expect(text).toContain("Pagamento: PIX");
    expect(text).toContain("Frete: a combinar");
  });

  it("omite e-mail e observação quando não informados", () => {
    const text = buildOrderMessage(input);
    expect(text).not.toContain("E-mail:");
    expect(text).not.toContain("Obs.:");
    expect(buildOrderMessage({ ...input, email: "a@b.com", note: "Portão azul" })).toContain("Obs.: Portão azul");
  });
});
