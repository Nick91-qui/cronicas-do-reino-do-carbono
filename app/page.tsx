import Link from "next/link";

const highlights = [
  {
    title: "Provas Estruturais",
    description: "Enfrente desafios que exigem leitura atenta das ligacoes e dominio das formas do carbono.",
  },
  {
    title: "Forja de Moleculas",
    description: "Aprenda a reconhecer estruturas, escolher caminhos e agir como um aprendiz da materia.",
  },
  {
    title: "Ascensao no Reino",
    description: "Cada acerto fortalece seu nome no grimorio e abre passagem para novos dominios alquimicos.",
  },
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.14),transparent_22%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(56,189,248,0.08),transparent)] blur-3xl sm:h-64" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16">
        <section className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr] lg:items-center lg:gap-10">
          <div className="space-y-5 sm:space-y-6">
            <span className="inline-flex max-w-full rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200 sm:text-xs">
              Portao dos Iniciados
            </span>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                O Reino do Carbono aguarda um novo aprendiz.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Atravesse a forja inicial, domine as primeiras estruturas e prove que sua mente e digna da arte alquimica.
              </p>
            </div>

            <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/login"
                className="rounded-2xl bg-cyan-300 px-6 py-3.5 text-center text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200"
              >
                Adentrar a forja
              </Link>
              <Link
                href="/register"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/10"
              >
                Reivindicar nome no grimorio
              </Link>
            </section>
          </div>

          <aside className="rounded-[28px] border border-cyan-300/15 bg-white/5 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.48)] backdrop-blur sm:rounded-[32px] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/80 sm:text-xs">
              Chamado da Oficina Central
            </p>
            <p className="mt-4 text-xl font-black tracking-tight text-white sm:text-2xl">
              As ligacoes do reino nao obedecem ao acaso.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Cada prova revela uma lei da materia. Cada escolha aproxima o aprendiz do dominio das moleculas que sustentam pontes, ferramentas e caminhos do reino.
            </p>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] sm:rounded-[28px] sm:p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
