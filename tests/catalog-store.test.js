import { beforeEach, describe, expect, it } from "vitest";
import { handleCatalog, normalizeProduct, slugify } from "../lib/catalog-store.mjs";

const auth = { user: "admin", password: "segredo" };
const headers = { "x-admin-user": "admin", "x-admin-password": "segredo", "content-type": "application/json" };
const validProduct = {
  name: "Camisa Polo Preta",
  category: "camisas-polo",
  price: 129.9,
  stock: 3,
  sizes: ["P", "M"],
  colors: [{ name: "Preta", hex: "#000000" }],
};

function memoryStore() {
  let data = [];
  return {
    async list() {
      return data;
    },
    async save(products) {
      data = products;
    },
  };
}

function call(store, method, path = "/api/products", { body, headers: extra = {} } = {}) {
  const request = new Request(`http://localhost${path}`, {
    method,
    headers: extra,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleCatalog(request, store, auth);
}

describe("slugify", () => {
  it("remove acentos e símbolos", () => {
    expect(slugify("Camisa Polo  Açaí!")).toBe("camisa-polo-acai");
  });
});

describe("normalizeProduct", () => {
  it("rejeita dados inválidos", () => {
    expect(normalizeProduct({ ...validProduct, name: "" }, new Set()).ok).toBe(false);
    expect(normalizeProduct({ ...validProduct, category: "x" }, new Set()).ok).toBe(false);
    expect(normalizeProduct({ ...validProduct, price: -1 }, new Set()).ok).toBe(false);
    expect(normalizeProduct({ ...validProduct, colors: [{ name: "Preta", hex: "preto" }] }, new Set()).ok).toBe(false);
  });

  it("gera slug único quando já existe outro igual", () => {
    const result = normalizeProduct(validProduct, new Set(["camisa-polo-preta"]));
    expect(result.ok && result.product.slug).toBe("camisa-polo-preta-2");
  });
});

describe("API do catálogo", () => {
  let store;
  beforeEach(() => {
    store = memoryStore();
  });

  it("lista produtos sem exigir login", async () => {
    const response = await call(store, "GET");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ products: [] });
  });

  it("bloqueia alterações sem senha ou com senha errada", async () => {
    expect((await call(store, "POST", "/api/products", { body: validProduct })).status).toBe(401);
    const wrong = await call(store, "POST", "/api/products", {
      body: validProduct,
      headers: { ...headers, "x-admin-password": "errada" },
    });
    expect(wrong.status).toBe(401);
    expect(await store.list()).toEqual([]);
  });

  it("não autentica quando a senha do servidor não está configurada", async () => {
    const request = new Request("http://localhost/api/products", {
      method: "POST",
      headers: { "x-admin-password": "" },
      body: "{}",
    });
    const response = await handleCatalog(request, store, { user: "", password: "" });
    expect(response.status).toBe(401);
  });

  it("cria, edita e remove produto com credenciais corretas", async () => {
    const created = await call(store, "POST", "/api/products", { body: validProduct, headers });
    expect(created.status).toBe(201);
    const { product } = await created.json();
    expect(product.slug).toBe("camisa-polo-preta");

    const edited = await call(store, "PUT", "/api/products", {
      body: { ...validProduct, slug: product.slug, price: 99 },
      headers,
    });
    expect(edited.status).toBe(200);
    expect((await store.list())[0].price).toBe(99);

    const removed = await call(store, "DELETE", `/api/products?slug=${product.slug}`, { headers });
    expect(removed.status).toBe(200);
    expect(await store.list()).toEqual([]);
  });
});
