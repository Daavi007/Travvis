import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20">
      <h1 className="font-serif text-5xl">Peça não encontrada</h1>
      <p className="mt-4 text-muted">Esse produto saiu da vitrine.</p>
      <Link href="/produtos" className="mt-6 inline-block bg-ink px-4 py-3 text-cream">
        Ver a vitrine
      </Link>
    </div>
  );
}
