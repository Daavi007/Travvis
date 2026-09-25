"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { storeConfig } from "@/lib/config";
import { formatBRL } from "@/lib/format";
import { buildOrderMessage } from "@/lib/order";
import { useCatalog } from "./CatalogProvider";
import { whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "address" | "city", string>>;

const inputClass = "mt-2 w-full border border-line bg-cream px-3 py-3 outline-none";

export function CheckoutForm() {
  const { items, ready, clear } = useCart();
  const { getProduct, products } = useCatalog();
  const orderId = useRef(`TV-${Date.now().toString(36).toUpperCase()}`);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"pix" | "cartao">("pix");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [cardReady, setCardReady] = useState(false);
  const [loading, setLoading] = useState<"pix" | "cartao" | null>(null);
  const [pix, setPix] = useState<{ payload: string; qrDataUrl: string; total: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const lines = useMemo(
    () =>
      items.flatMap((item) => {
        const product = getProduct(item.slug);
        if (!product) return [];
        return [{ item, product, lineTotal: product.price * item.qty }];
      }),
    [items, products],
  );
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  useEffect(() => {
    fetch("/api/pagamento")
      .then((response) => response.json())
      .then((data: { cartao?: boolean }) => setCardReady(Boolean(data.cartao)))
      .catch(() => setCardReady(false));
  }, []);

  function payloadItems() {
    return lines.map(({ item }) => ({
      slug: item.slug,
      size: item.size,
      color: item.color,
      qty: item.qty,
    }));
  }

  function validate(requireEmail: boolean) {
    const next: FieldErrors = {};
    if (name.trim().length < 3) next.name = "Informe seu nome.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) next.phone = "Informe um telefone com DDD.";
    if (requireEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Informe um e-mail para o pagamento.";
    if (address.trim().length < 5) next.address = "Informe a rua e o número.";
    if (city.trim().length < 2) next.city = "Informe a cidade.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function message(paymentLabel: string) {
    return buildOrderMessage({
      orderId: orderId.current,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      note: note.trim(),
      total,
      paymentLabel,
      lines: lines.map(({ item, product, lineTotal }) => ({
        name: product.name,
        color: item.color,
        size: item.size,
        qty: item.qty,
        lineTotal,
      })),
    });
  }

  function openWhatsapp(paymentLabel: string) {
    const href = whatsappHref(message(paymentLabel));
    if (!href) {
      setFormError("O WhatsApp da loja ainda não foi configurado.");
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
    clear();
  }

  async function payPix() {
    setFormError("");
    setPix(null);
    if (!validate(false)) return;
    if (lines.length === 0) {
      setFormError("Seu carrinho está vazio.");
      return;
    }
    setLoading("pix");
    try {
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems(), orderId: orderId.current }),
      });
      const data = await response.json();
      if (!response.ok || !data.payload) {
        openWhatsapp("Pix — pedir a chave para a loja");
        return;
      }
      setPix({ payload: data.payload, qrDataUrl: data.qrDataUrl, total: data.total });
    } catch {
      openWhatsapp("Pix — pedir a chave para a loja");
    } finally {
      setLoading(null);
    }
  }

  async function payCard() {
    setFormError("");
    if (!validate(cardReady)) return;
    if (lines.length === 0) {
      setFormError("Seu carrinho está vazio.");
      return;
    }
    if (!cardReady) {
      openWhatsapp("Cartão — pedir o link de pagamento");
      return;
    }
    setLoading("cartao");
    try {
      sessionStorage.setItem(
        "travvis-order",
        JSON.stringify({ message: message("Cartão online"), orderId: orderId.current }),
      );
      const response = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payloadItems(),
          orderId: orderId.current,
          payer: { name: name.trim(), email: email.trim() },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        setFormError(data.error || "Não foi possível abrir o pagamento.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setFormError("Não foi possível abrir o pagamento.");
    } finally {
      setLoading(null);
    }
  }

  async function copyPix() {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.payload);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (!ready) {
    return <div className="mx-auto max-w-6xl px-5 py-16 text-muted">Carregando pedido...</div>;
  }

  if (lines.length === 0 && !pix) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-serif text-5xl">Checkout</h1>
        <p className="mt-4 text-muted">Adicione uma peça antes de fechar o pedido.</p>
      </div>
    );
  }

  const whatsappAfterPix = pix ? whatsappHref(message("Pix — código gerado no site")) : "";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        className="order-2 lg:order-1"
        onSubmit={(event) => {
          event.preventDefault();
          if (payment === "pix") void payPix();
          else void payCard();
        }}
      >
        <h1 className="font-serif text-5xl">Checkout</h1>
        <p className="mt-3 text-muted">Pague com Pix ou cartão. A loja confirma a entrega no WhatsApp.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            Nome completo
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            {errors.name ? <span className="mt-1 block text-brand">{errors.name}</span> : null}
          </label>
          <label className="block text-sm">
            WhatsApp
            <input className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" />
            {errors.phone ? <span className="mt-1 block text-brand">{errors.phone}</span> : null}
          </label>
          <label className="block text-sm">
            E-mail
            <input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" />
            {errors.email ? <span className="mt-1 block text-brand">{errors.email}</span> : null}
          </label>
          <label className="block text-sm sm:col-span-2">
            Endereço
            <input className={inputClass} value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" />
            {errors.address ? <span className="mt-1 block text-brand">{errors.address}</span> : null}
          </label>
          <label className="block text-sm sm:col-span-2">
            Cidade
            <input className={inputClass} value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" />
            {errors.city ? <span className="mt-1 block text-brand">{errors.city}</span> : null}
          </label>
          <label className="block text-sm sm:col-span-2">
            Observação
            <textarea className={inputClass} rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm">Pagamento</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className={`border px-4 py-3 ${payment === "pix" ? "border-ink bg-cream" : "border-line"}`}>
              <input type="radio" name="pagamento" className="mr-2" checked={payment === "pix"} onChange={() => setPayment("pix")} />
              Pix
            </label>
            <label className={`border px-4 py-3 ${payment === "cartao" ? "border-ink bg-cream" : "border-line"}`}>
              <input type="radio" name="pagamento" className="mr-2" checked={payment === "cartao"} onChange={() => setPayment("cartao")} />
              Cartão
            </label>
          </div>
          <p className="mt-3 text-sm text-muted">
            {payment === "pix"
              ? storeConfig.pixKey
                ? "O QR Code sai com o valor do pedido."
                : "Sem a chave Pix no site, o pedido segue no WhatsApp para a loja enviar a cobrança."
              : cardReady
                ? "Você será levado ao Mercado Pago para concluir."
                : "Sem o Mercado Pago, o pedido segue no WhatsApp para a loja enviar o link."}
          </p>
        </fieldset>

        {formError ? <p className="mt-4 text-sm text-brand">{formError}</p> : null}

        <button type="submit" disabled={loading !== null} className="mt-6 w-full bg-ink px-4 py-3 text-cream disabled:opacity-40">
          {loading ? "Abrindo pagamento..." : payment === "pix" ? "Pagar com Pix" : "Pagar com cartão"}
        </button>
        <button
          type="button"
          className="mt-3 w-full border border-ink px-4 py-3"
          onClick={() => {
            if (!validate(false)) return;
            openWhatsapp(payment === "pix" ? "Pix" : "Cartão");
          }}
        >
          Enviar pedido no WhatsApp
        </button>

        {pix ? (
          <div className="mt-8 border border-line bg-cream p-5">
            <p className="text-sm text-muted">Pix de {formatBRL(pix.total)}</p>
            <img src={pix.qrDataUrl} alt="QR Code do Pix" className="mt-4 h-56 w-56 bg-white p-2" />
            <textarea readOnly value={pix.payload} className="mt-4 w-full border border-line bg-paper p-3 text-xs" rows={4} />
            <button type="button" onClick={() => void copyPix()} className="mt-3 border border-ink px-3 py-2 text-sm">
              {copied ? "Código copiado" : "Copiar código Pix"}
            </button>
            {whatsappAfterPix ? (
              <a href={whatsappAfterPix} target="_blank" rel="noreferrer" onClick={() => clear()} className="mt-3 block bg-ink px-4 py-3 text-center text-cream">
                Avisar a loja no WhatsApp
              </a>
            ) : null}
          </div>
        ) : null}
      </form>

      <aside className="order-1 h-fit border border-line bg-cream p-5 lg:order-2 lg:sticky lg:top-24">
        <p className="text-sm uppercase tracking-[0.16em] text-muted">Pedido {orderId.current}</p>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map(({ item, product, lineTotal }) => (
            <li key={`${item.slug}-${item.size}-${item.color}`} className="flex justify-between gap-4">
              <span>
                {item.qty}× {product.name}
                <span className="block text-muted">{[item.color, item.size].filter(Boolean).join(" · ")}</span>
              </span>
              <span>{formatBRL(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex justify-between border-t border-line pt-4">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </p>
      </aside>
    </div>
  );
}
