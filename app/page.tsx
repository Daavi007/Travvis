import { CategoryShelves } from "@/components/CategoryShelves";
import { HomeHero } from "@/components/HomeHero";

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <CategoryShelves />

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
          {[
            ["01", "Escolha", "Separe as peças no carrinho."],
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
