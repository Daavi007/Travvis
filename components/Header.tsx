"use client";

import Link from "next/link";
import { useState } from "react";
import { storeConfig } from "@/lib/config";
import { whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

const links = [
  { href: "/produtos?categoria=roupas", label: "Roupas" },
  { href: "/produtos?categoria=relogios", label: "Relógios" },
  { href: "/produtos?categoria=bones", label: "Bonés" },
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#011C2F] text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Travvis Multimarcas" className="h-14 w-auto sm:h-16" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-cream/80 hover:text-cream">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/carrinho" className="border border-cream/40 px-3 py-2 text-sm">
            Carrinho ({count})
          </Link>
          <button type="button" className="border border-cream/40 px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-white/10 px-5 py-4 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
      {storeConfig.whatsapp ? (
        <a
          href={whatsappHref("Olá! Vim pelo site da Travvis Multimarcas.")}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-40 bg-ink px-4 py-3 text-sm text-cream"
        >
          WhatsApp
        </a>
      ) : null}
    </header>
  );
}
