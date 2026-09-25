"use client";

import Link from "next/link";
import { storeConfig } from "@/lib/config";
import { categories } from "@/lib/products";
import { whatsappHref } from "@/lib/whatsapp";
import { useAdminAuth } from "./AdminAuth";
import { useCart } from "./CartProvider";

export function Header() {
  const { count } = useCart();
  const { session, ready, logout } = useAdminAuth();
  const loggedIn = ready && Boolean(session);
  const chat = storeConfig.whatsapp ? whatsappHref("Olá! Vim pelo site da Travvis Multimarcas.") : "";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#011C2F] text-cream">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 sm:px-6">
        <div />
        <Link href="/" className="justify-self-center">
          <img src="/logo.png" alt="Travvis Multimarcas" className="h-14 w-auto sm:h-[4.5rem]" />
        </Link>
        <div className="flex items-center justify-end gap-4 justify-self-end text-sm">
          <Link key="cadastrar" href="/admin" className="text-[11px] uppercase tracking-[0.14em] text-cream/80 hover:text-cream">
            Cadastrar
          </Link>
          {loggedIn ? (
            <button key="sair" type="button" onClick={logout} className="text-[11px] uppercase tracking-[0.14em] text-cream/80 hover:text-cream">
              Sair
            </button>
          ) : (
            <Link key="entrar" href="/admin" className="text-[11px] uppercase tracking-[0.14em] text-cream/80 hover:text-cream">
              Entrar
            </Link>
          )}
          <Link href="/carrinho" aria-label={`Carrinho com ${count} itens`}>
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 7h12l-1 12H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span>{count}</span>
            </span>
          </Link>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-6 overflow-x-auto border-t border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-cream/80 sm:gap-8 sm:text-xs">
        {categories.map((category) => (
          <Link key={category.id} href={`/produtos?categoria=${category.id}`} className="shrink-0 hover:text-cream">
            {category.label}
          </Link>
        ))}
      </nav>
      {chat ? (
        <a href={chat} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-40 bg-ink px-4 py-3 text-sm text-cream">
          WhatsApp
        </a>
      ) : null}
    </header>
  );
}
