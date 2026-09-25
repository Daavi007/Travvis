import { handleCatalog } from "../lib/catalog-store.mjs";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/products") {
      return handleCatalog(request, kvStore(env.PRODUCTS), {
        user: env.ADMIN_USER || "",
        password: env.ADMIN_PASSWORD || "",
      });
    }
    return env.ASSETS.fetch(request);
  },
};

function kvStore(kv) {
  return {
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
}
