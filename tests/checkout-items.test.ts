import { beforeEach, describe, expect, it } from "vitest";
import { priceItems } from "../lib/checkout-items";
import { products, type Product } from "../lib/products";

const camisa: Product = {
  slug: "camisa-teste",
  sku: "TV-1",
  name: "Camisa Teste",
  category: "camisas-polo",
  price: 100,
  description: "",
  details: [],
  sizes: ["P", "M"],
  colors: [{ name: "Preta", hex: "#000000" }],
  accent: "#000",
  ink: "#fff",
  art: "tee",
  stock: 5,
};

beforeEach(() => {
  products.length = 0;
  products.push(camisa);
});

describe("priceItems", () => {
  it("usa o preço do catálogo e ignora preço enviado pelo cliente", () => {
    const lines = priceItems([{ slug: "camisa-teste", size: "M", color: "Preta", qty: 2, price: 1 }]);
    expect(lines).toEqual([
      { name: "Camisa Teste", size: "M", color: "Preta", qty: 2, unitPrice: 100, lineTotal: 200 },
    ]);
  });

  it("descarta itens inválidos", () => {
    const lines = priceItems([
      { slug: "nao-existe", size: "M", color: "Preta", qty: 1 },
      { slug: "camisa-teste", size: "GG", color: "Preta", qty: 1 },
      { slug: "camisa-teste", size: "M", color: "Azul", qty: 1 },
      { slug: "camisa-teste", size: "M", color: "Preta", qty: 0 },
      { slug: "camisa-teste", size: "M", color: "Preta", qty: 1.5 },
      null,
      "texto",
    ]);
    expect(lines).toEqual([]);
  });

  it("recusa quantidade acima do estoque", () => {
    expect(priceItems([{ slug: "camisa-teste", size: "M", color: "Preta", qty: 6 }])).toEqual([]);
    expect(priceItems([{ slug: "camisa-teste", size: "M", color: "Preta", qty: 5 }])).toHaveLength(1);
  });

  it("retorna lista vazia quando a entrada não é uma lista", () => {
    expect(priceItems(undefined)).toEqual([]);
    expect(priceItems({})).toEqual([]);
  });
});
