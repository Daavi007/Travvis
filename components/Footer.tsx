import Link from "next/link";
import { storeConfig } from "@/lib/config";
import { categories } from "@/lib/products";
import { whatsappHref } from "@/lib/whatsapp";

export function Footer() {
  const href = whatsappHref("Olá! Vim pelo site da Travvis Multimarcas.");
  return (
    <footer className="mt-24 bg-[#011C2F] text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <img src="/logo.png" alt="Travvis Multimarcas" className="h-24 w-auto" />
          <p className="mt-4 text-sm text-cream/70">Roupas, relógios e bonés em um só lugar.</p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-[0.18em] text-cream/50">Vitrine</p>
          <div className="mt-3 flex flex-col gap-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/produtos?categoria=${category.id}`} className="hover:text-white">
                {category.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-[0.18em] text-cream/50">Pedido</p>
          <p className="mt-3 text-cream/70">WhatsApp, Pix ou cartão. O frete é combinado na confirmação.</p>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-block border border-cream/40 px-3 py-2">
              Falar com a loja
            </a>
          ) : null}
        </div>
      </div>
      <p className="border-t border-white/10 px-5 py-4 text-center text-xs text-cream/50">{storeConfig.name}</p>
    </footer>
  );
}
