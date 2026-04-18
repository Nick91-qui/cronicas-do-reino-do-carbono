import Link from "next/link";

const highlights = [
  "Next.js + React + TypeScript + Tailwind CSS",
  "Prisma + PostgreSQL (Neon)",
  "Conteúdo estático em arquivos locais",
  "Validação de gameplay autoritativa no servidor",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="space-y-4">
        <span className="inline-flex rounded-full border border-sky-400/30 px-3 py-1 text-sm text-accent">
          Milestone 8 · Integração do Capítulo I
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Crônicas do Reino do Carbono
        </h1>
        <p className="max-w-3xl text-lg text-slate-300">
          MVP web com conteúdo estático oficial, autenticação customizada por sessão e backend
          autoritativo para builder, avaliação e persistência.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {highlights.map((item) => (
          <article key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-slate-100">{item}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-wrap gap-4">
        <Link href="/login" className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950">
          Entrar
        </Link>
        <Link href="/register" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100">
          Cadastrar jogador
        </Link>
      </section>
    </main>
  );
}
