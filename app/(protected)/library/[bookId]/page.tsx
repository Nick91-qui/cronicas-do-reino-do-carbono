import Link from "next/link";
import { notFound } from "next/navigation";

import { LibraryBookBlocks } from "@/components/library/library-book-blocks";
import { ProtectedScene } from "@/components/scene/protected-scene";
import { blobAssets } from "@/lib/assets/blob";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getLibraryBookById } from "@/lib/content/loaders";
import { prisma } from "@/lib/db/prisma";

export default async function LibraryBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const player = await requireAuthenticatedPlayer(prisma);
  const { bookId } = await params;
  const book = (() => {
    try {
      return getLibraryBookById(bookId as never);
    } catch {
      notFound();
    }
  })();

  return (
    <ProtectedScene
      eyebrow="Biblioteca pedagógica"
      ambientLabel="Leitura guiada"
      imageSrc={blobAssets.authLibrary}
      imageAlt="Biblioteca ritual do castelo."
      title={book.title}
      description={`${book.shortDescription} Este livro permanece aberto para ${player.displayName} durante toda a campanha.`}
      actions={
        <>
          <Link href="/library" className="ritual-link px-5 py-3 text-sm">
            Voltar ao catalogo
          </Link>
          <Link href="/game" className="ritual-link px-5 py-3 text-sm">
            Retornar ao salao
          </Link>
        </>
      }
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Topicos centrais
            </p>
            <p className="pt-2 text-sm text-slate-100">{book.coreTopics.length}</p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Secoes
            </p>
            <p className="pt-2 text-sm text-slate-100">{book.sections.length}</p>
          </div>
        </>
      }
    >
      <section className="grid gap-4 xl:grid-cols-[0.72fr,1.28fr]">
        <aside className="game-panel h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
            Sumario do livro
          </p>
          {book.subtitle ? (
            <p className="mt-4 text-sm leading-6 text-slate-200">{book.subtitle}</p>
          ) : null}

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

          <div className="mt-6 grid gap-3">
            {book.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="game-panel-muted block transition hover:border-cyan-300/20"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Secao {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{section.title}</p>
                {section.summary ? (
                  <p className="mt-2 text-sm leading-6 text-slate-300">{section.summary}</p>
                ) : null}
              </a>
            ))}
          </div>
        </aside>

        <div className="grid gap-4">
          {book.sections.map((section, index) => (
            <section id={section.id} key={section.id} className="game-panel scroll-mt-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                Secao {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-2xl tracking-[0.04em] text-white sm:text-3xl">
                {section.title}
              </h2>
              {section.summary ? (
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {section.summary}
                </p>
              ) : null}

              <div className="mt-5">
                <LibraryBookBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}
        </div>
      </section>
    </ProtectedScene>
  );
}
