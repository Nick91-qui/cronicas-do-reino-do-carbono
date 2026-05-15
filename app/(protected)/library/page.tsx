import Link from "next/link";

import { ProtectedScene } from "@/components/scene/protected-scene";
import { blobAssets } from "@/lib/assets/blob";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getAllLibraryBooks } from "@/lib/content/loaders";
import { prisma } from "@/lib/db/prisma";

export default async function LibraryPage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const books = getAllLibraryBooks();

  return (
    <ProtectedScene
      eyebrow="Biblioteca pedagógica"
      ambientLabel="Arquivo de estudo"
      imageSrc={blobAssets.authLibrary}
      imageAlt="Biblioteca ritual do castelo."
      title={`Livros abertos para ${player.displayName}`}
      description="Esta ala reúne leituras curtas para apoiar a jornada do Capítulo I. Os livros ficam disponíveis desde o início e podem ser consultados a qualquer momento, sem alterar a progressão do jogo."
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Livros disponíveis
            </p>
            <p className="pt-2 font-display text-3xl text-white">{books.length}</p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Regra de acesso
            </p>
            <p className="pt-2 text-sm text-slate-100">
              Consulta livre desde o primeiro login.
            </p>
          </div>
        </>
      }
    >
      <section className="grid gap-4 xl:grid-cols-[0.82fr,1.18fr]">
        <aside className="game-panel h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
            Como usar esta ala
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Papel da biblioteca
              </p>
              <p className="pt-2 text-slate-100">
                Os livros reforçam conceitos básicos de orgânica sem substituir cartas,
                fases ou feedbacks da campanha.
              </p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Leitura pensada para mobile
              </p>
              <p className="pt-2 text-slate-100">
                O formato prioriza rolagem vertical, seções curtas e blocos simples de consulta.
              </p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Quando consultar
              </p>
              <p className="pt-2 text-slate-100">
                Antes de uma prova, depois de um erro ou como revisão independente do capítulo.
              </p>
            </div>
          </div>
        </aside>

        <section className="grid gap-4">
          {books.map((book) => (
            <article key={book.id} className="game-panel">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="hud-chip">Livro aberto</span>
                    <span className="hud-chip border-gold/20 text-gold/90">
                      {book.sections.length} secoes
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl tracking-[0.04em] text-white sm:text-3xl">
                    {book.title}
                  </h2>
                  {book.subtitle ? (
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-sky-200">
                      {book.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {book.shortDescription}
                  </p>
                </div>

                <Link href={`/library/${book.id}`} className="state-action shrink-0" data-tone="primary">
                  Abrir livro
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {book.coreTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </ProtectedScene>
  );
}
