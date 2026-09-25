import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";

export default function HomePage() {
  const featured = products[0];
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Travvis Multimarcas</p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[0.92] sm:text-7xl">
            Roupas, relógios e bonés.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Uma vitrine só, com peças para usar no dia a dia. Monte o pedido e pague com Pix, cartão ou fale com a loja no WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/produtos" className="bg-ink px-5 py-3 text-cream">
              Ver a vitrine
            </Link>
            <Link href="/produtos?categoria=roupas" className="border border-ink px-5 py-3">
              Começar pelas roupas
            </Link>
          </div>
        </div>
        <Link href={`/produto/${featured.slug}`} className="block">
          <ProductArt product={featured} className="aspect-[4/5]" />
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/produtos?categoria=${category.id}`} className="border border-line bg-cream p-6 hover:border-ink">
            <h2 className="font-serif text-4xl">{category.label}</h2>
            <p className="mt-3 text-sm text-muted">{category.text}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl">Peças da casa</h2>
          <Link href="/produtos" className="text-sm underline">
            Ver tudo
          </Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
          {[
            ["01", "Escolha", "Separe roupas, relógios e bonés no carrinho."],
            ["02", "Pague", "Pix na hora ou cartão pelo Mercado Pago."],
            ["03", "Confirme", "A loja combina a entrega com você no WhatsApp."],
          ].map(([step, title, text]) => (
            <div key={step}>
              <p className="text-[11px] tracking-[0.18em] text-muted">{step}</p>
              <h2 className="mt-2 font-serif text-3xl">{title}</h2>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
