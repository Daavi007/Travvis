import { handleCatalog } from "../../lib/catalog-store.mjs";

export async function onRequest(context) {
  const kv = context.env.PRODUCTS;
  const store = {
    async list() {
      if (!kv) return [];
      const raw = await kv.get("catalog");
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
    async save(products) {
      if (!kv) throw new Error("KV ausente");
      await kv.put("catalog", JSON.stringify(products));
    },
  };
  return handleCatalog(context.request, store, {
    user: context.env.ADMIN_USER || "",
    password: context.env.ADMIN_PASSWORD || "",
  });
}
