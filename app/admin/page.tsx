"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { categories, type CategoryId, type Product } from "@/lib/products";
import { useAdminAuth } from "@/components/AdminAuth";
import { useCatalog } from "@/components/CatalogProvider";
import { formatBRL } from "@/lib/format";

const inputClass = "mt-2 w-full border border-line bg-cream px-3 py-3 outline-none";
const publicCategories = categories.filter((category) => category.id !== "roupas");

export default function AdminPage() {
  const { products, reload } = useCatalog();
  const { session, ready: loginReady, login, logout, authHeaders } = useAdminAuth();
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [entering, setEntering] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("bermudas");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("P, M, G, GG");
  const [colorName, setColorName] = useState("Preto");
  const [colorHex, setColorHex] = useState("#161616");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const registered = products.filter((product) => !isBuiltIn(product));

  async function onLogin(event: React.FormEvent) {
    event.preventDefault();
    setEntering(true);
    setLoginError("");
    const ok = await login(loginUser, loginPassword);
    setEntering(false);
    if (!ok) setLoginError("Usuário ou senha incorretos.");
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      setImage(await compressImage(file));
    } catch {
      setError("Não consegui ler essa foto.");
    }
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    const response = await fetch(apiUrl("/api/products"), {
      method: editing ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        slug: editing,
        name,
        category,
        price: Number(price.replace(",", ".")),
        stock: Number(stock),
        description,
        sizes: sizes.split(",").map((item) => item.trim()).filter(Boolean),
        colors: [{ name: colorName, hex: colorHex }],
        details: description ? [description] : [],
        image,
      }),
    });
    const data = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Não foi possível salvar.");
      return;
    }
    setSaved(true);
    clearForm();
    await reload();
  }

  function startEdit(product: Product) {
    setEditing(product.slug);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price).replace(".", ","));
    setStock(typeof product.stock === "number" ? String(product.stock) : "");
    setDescription(product.description === product.name ? "" : product.description);
    setSizes(product.sizes.join(", "));
    setColorName(product.colors[0]?.name ?? "Preto");
    setColorHex(product.colors[0]?.hex ?? "#161616");
    setImage(product.image ?? "");
    setSaved(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearForm() {
    setEditing(null);
    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setSizes("P, M, G, GG");
    setColorName("Preto");
    setColorHex("#161616");
    setImage("");
  }

  async function onDelete(product: Product) {
    if (!window.confirm(`Remover ${product.name} da vitrine?`)) return;
    const response = await fetch(apiUrl(`/api/products?slug=${encodeURIComponent(product.slug)}`), {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Não foi possível remover. Confira a senha da loja.");
      return;
    }
    if (editing === product.slug) clearForm();
    await reload();
  }

  if (!loginReady) return <div className="mx-auto max-w-3xl px-5 py-16 text-muted">Carregando...</div>;

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <h1 className="font-serif text-5xl">Entrar</h1>
        <p className="mt-3 text-muted">Área do dono da loja. O cliente não vê esta página.</p>
        <form onSubmit={onLogin} className="mt-8 grid gap-4 border border-line bg-cream p-5">
          <label className="text-sm">
            Usuário
            <input className={inputClass} value={loginUser} onChange={(event) => setLoginUser(event.target.value)} required />
          </label>
          <label className="text-sm">
            Senha
            <input className={inputClass} type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required />
          </label>
          {loginError ? <p className="text-sm text-brand">{loginError}</p> : null}
          <button type="submit" disabled={entering} className="bg-ink px-4 py-3 text-cream">
            {entering ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl">{editing ? "Editar produto" : "Cadastro de produtos"}</h1>
        <button type="button" className="text-sm underline" onClick={logout}>
          Sair
        </button>
      </div>
      <p className="mt-3 text-muted">O que você salvar aqui aparece na vitrine para o cliente.</p>

      <form onSubmit={onSave} className="mt-8 grid gap-4 border border-line bg-cream p-5">
        <label className="text-sm">
          Categoria
          <select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value as CategoryId)}>
            {publicCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Nome
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="text-sm">
          Preço
          <input className={inputClass} inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="149,90" required />
        </label>
        <label className="text-sm">
          Quantidade disponível
          <input className={inputClass} type="number" min={0} step={1} value={stock} onChange={(event) => setStock(event.target.value)} required />
        </label>
        <label className="text-sm">
          Descrição
          <textarea className={inputClass} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="text-sm">
          Tamanhos, separados por vírgula
          <input className={inputClass} value={sizes} onChange={(event) => setSizes(event.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <label className="text-sm">
            Cor
            <input className={inputClass} value={colorName} onChange={(event) => setColorName(event.target.value)} required />
          </label>
          <label className="text-sm">
            Tom
            <input className={`${inputClass} h-12`} type="color" value={colorHex} onChange={(event) => setColorHex(event.target.value)} />
          </label>
        </div>
        <label className="text-sm">
          Foto
          <input className={inputClass} type="file" accept="image/*" onChange={(event) => void onPhoto(event.target.files?.[0])} />
        </label>
        {image ? <img src={image} alt="" className="h-40 w-32 object-cover" /> : null}
        {error ? <p className="text-sm text-brand">{error}</p> : null}
        {saved ? <p className="text-sm text-muted">Produto salvo. Ele já está na vitrine.</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="bg-ink px-4 py-3 text-cream">
            {saving ? "Salvando..." : editing ? "Salvar alterações" : "Salvar produto"}
          </button>
          {editing ? (
            <button type="button" className="border border-ink px-4 py-3" onClick={clearForm}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <h2 className="mt-12 font-serif text-3xl">Cadastrados</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {registered.map((product) => (
          <li key={product.slug} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p>{product.name}</p>
              <p className="text-sm text-muted">
                {formatBRL(product.price)}
                {typeof product.stock === "number" ? ` · ${product.stock} disponíveis` : ""}
              </p>
            </div>
            <div className="flex gap-4">
              <button type="button" className="text-sm underline" onClick={() => startEdit(product)}>
                Editar
              </button>
              <button type="button" className="text-sm underline" onClick={() => void onDelete(product)}>
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function isBuiltIn(product: Product) {
  return ["TV-01", "TV-02", "TV-03", "TV-04", "TV-05", "TV-06", "TV-07", "TV-08", "TV-09"].includes(product.sku);
}

function compressImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 900 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => reject(new Error("image"));
    image.src = url;
  });
}
