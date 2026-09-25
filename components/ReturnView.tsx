"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

const titles: Record<string, string> = {
  approved: "Pagamento aprovado",
  pending: "Pagamento em análise",
  failure: "Pagamento não concluído",
};

export function ReturnView({ status }: { status: string }) {
  const { clear } = useCart();
  const [href, setHref] = useState("");

  useEffect(() => {
    if (status === "approved") clear();
    try {
      const raw = sessionStorage.getItem("travvis-order");
      if (!raw) return;
      const saved = JSON.parse(raw) as { message?: string };
      if (saved.message) setHref(whatsappHref(`${saved.message}\nStatus do pagamento: ${status || "retorno"}`));
    } catch {
      setHref("");
    }
  }, [status, clear]);

  return (
    <div className="mx-auto max-w-xl px-5 py-20">
      <h1 className="font-serif text-5xl">{titles[status] || "Retorno do pagamento"}</h1>
      <p className="mt-4 text-muted">
        {status === "approved"
          ? "Avise a loja no WhatsApp para separarmos a entrega."
          : "Se o pagamento não entrou, você pode tentar de novo ou falar com a loja."}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="bg-ink px-4 py-3 text-center text-cream">
            Avisar no WhatsApp
          </a>
        ) : null}
        <Link href="/produtos" className="border border-ink px-4 py-3 text-center">
          Voltar à vitrine
        </Link>
      </div>
    </div>
  );
}
