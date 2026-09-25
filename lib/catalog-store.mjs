const categories = ["camisas-oversized", "camisa-long", "camisas-polo", "short", "calcados", "relogios", "bones"];

const artFor = {
  "camisas-oversized": "tee",
  "camisa-long": "tee",
  "camisas-polo": "tee",
  short: "pants",
  calcados: "pants",
  relogios: "watch",
  bones: "cap",
};

export function slugify(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function cleanList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 12);
}

export function normalizeProduct(input, taken, previous) {
  const name = String(input?.name || "").trim();
  const category = String(input?.category || "");
  const price = Number(input?.price);
  const description = String(input?.description || "").trim();
  const sizes = cleanList(input?.sizes);
  const details = cleanList(input?.details);
  const colors = Array.isArray(input?.colors)
    ? input.colors
        .map((color) => ({
          name: String(color?.name || "").trim(),
          hex: String(color?.hex || "").trim(),
        }))
        .filter((color) => color.name && /^#[0-9a-fA-F]{6}$/.test(color.hex))
        .slice(0, 8)
    : [];

  if (name.length < 2) return { ok: false, error: "Informe o nome do produto." };
  if (!categories.includes(category)) return { ok: false, error: "Escolha uma categoria." };
  if (!Number.isFinite(price) || price <= 0 || price > 100000) return { ok: false, error: "Informe um preço válido." };
  const stock = Number(input?.stock);
  if (!Number.isInteger(stock) || stock < 0 || stock > 9999) return { ok: false, error: "Informe a quantidade disponível." };
  if (colors.length === 0) return { ok: false, error: "Informe ao menos uma cor." };

  const incoming = Array.isArray(input?.images) ? input.images : input?.image ? [input.image] : [];
  const images = incoming
    .map((item) => String(item || "").trim())
    .filter((item) => /^data:image\/(jpeg|png|webp);base64,/.test(item) && item.length <= 1_500_000)
    .slice(0, 6);
  if (incoming.length > 0 && images.length === 0) {
    return { ok: false, error: "As fotos precisam ser JPG, PNG ou WebP de até 1 MB." };
  }
  const saved = images.length > 0 ? images : previous?.images?.length ? previous.images : previous?.image ? [previous.image] : [];

  let slug = previous?.slug || slugify(name) || "produto";
  if (!previous) {
    let n = 2;
    while (taken.has(slug)) {
      slug = `${slugify(name) || "produto"}-${n}`;
      n += 1;
    }
  }

  return {
    ok: true,
    product: {
      slug,
      sku: previous?.sku || `TV-${Date.now().toString(36).toUpperCase()}`,
      name,
      category,
      price: Math.round(price * 100) / 100,
      description: description || name,
      details: details.length > 0 ? details : [name],
      sizes,
      colors,
      accent: "#1c1c1c",
      ink: "#f3efe6",
      art: artFor[category],
      image: saved[0],
      images: saved,
      stock,
    },
  };
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type, x-admin-user, x-admin-password",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  });
}

function allowed(request, auth) {
  const user = request.headers.get("x-admin-user") || "";
  const password = request.headers.get("x-admin-password") || "";
  if (!auth?.password || password !== auth.password) return false;
  if (auth.user && user !== auth.user) return false;
  return true;
}

async function persist(store, products) {
  try {
    await store.save(products);
    return null;
  } catch {
    return json({ error: "O armazenamento do site não está ligado. Associe PRODUCTS ao travvis-produtos na Cloudflare." }, 503);
  }
}

export async function handleCatalog(request, store, auth) {
  const password = typeof auth === "string" ? { password: auth } : auth || {};
  if (request.method === "OPTIONS") return json({ ok: true });

  const url = new URL(request.url);
  const products = await store.list();

  if (request.method === "GET") return json({ products });

  if (!allowed(request, password)) {
    return json({ error: "Usuário ou senha incorretos." }, 401);
  }

  if (request.method === "POST" && url.searchParams.get("login") === "1") {
    return json({ ok: true });
  }

  if (request.method === "DELETE") {
    const slug = url.searchParams.get("slug") || "";
    const failed = await persist(store, products.filter((product) => product.slug !== slug));
    if (failed) return failed;
    return json({ ok: true });
  }

  if (request.method === "PUT") {
    let body = {};
    try {
      body = await request.json();
    } catch {
      return json({ error: "Dados inválidos." }, 400);
    }
    const current = products.find((product) => product.slug === body.slug);
    if (!current) return json({ error: "Produto não encontrado." }, 404);
    const taken = new Set(products.filter((product) => product.slug !== current.slug).map((product) => product.slug));
    const result = normalizeProduct(body, taken, current);
    if (!result.ok) return json({ error: result.error }, 400);
    const failed = await persist(
      store,
      products.map((product) => (product.slug === current.slug ? result.product : product)),
    );
    if (failed) return failed;
    return json({ product: result.product });
  }

  if (request.method === "POST") {
    let body = {};
    try {
      body = await request.json();
    } catch {
      return json({ error: "Dados inválidos." }, 400);
    }
    const taken = new Set(products.map((product) => product.slug));
    const result = normalizeProduct(body, taken);
    if (!result.ok) return json({ error: result.error }, 400);
    const failed = await persist(store, [...products, result.product]);
    if (failed) return failed;
    return json({ product: result.product }, 201);
  }

  return json({ error: "Método não permitido." }, 405);
}
