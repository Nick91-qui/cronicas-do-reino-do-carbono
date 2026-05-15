"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LibraryBookBlocks } from "@/components/library/library-book-blocks";

import type { LibraryBook, LibraryContentBlock } from "@/lib/content/types";

type LibraryBookReaderProps = {
  book: LibraryBook;
};

type ReaderPage =
  | {
      kind: "cover";
      id: string;
      title: string;
    }
  | {
      kind: "block";
      id: string;
      title: string;
      sectionTitle: string;
      sectionIndex: number;
      sectionCount: number;
      pageNumber: number;
      totalPages: number;
      summary?: string;
      block: LibraryContentBlock;
    };

function Chevron({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
    >
      <path
        d={
          direction === "left"
            ? "M14.5 5.5 8 12l6.5 6.5"
            : "M9.5 5.5 16 12l-6.5 6.5"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LibraryBookReader({ book }: LibraryBookReaderProps) {
  const router = useRouter();
  const pages = useMemo<ReaderPage[]>(() => {
    const totalContentPages = book.sections.reduce(
      (total, section) => total + section.blocks.length,
      0,
    );
    let pageNumber = 1;
    const contentPages = book.sections.flatMap((section, sectionIndex) =>
      section.blocks.map((block, blockIndex) => {
        const page = {
          kind: "block" as const,
          id: `${section.id}-${blockIndex}`,
          title:
            block.type === "callout" ||
            block.type === "example" ||
            block.type === "comparison"
              ? block.title
              : section.title,
          sectionTitle: section.title,
          sectionIndex,
          sectionCount: book.sections.length,
          pageNumber,
          totalPages: totalContentPages,
          summary: blockIndex === 0 ? section.summary : undefined,
          block,
        };

        pageNumber += 1;
        return page;
      }),
    );

    return [
      {
        kind: "cover",
        id: `${book.id}-cover`,
        title: book.title,
      },
      ...contentPages,
    ];
  }, [book]);

  const [currentPage, setCurrentPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activePage = pages[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  function goToPreviousPage() {
    setCurrentPage((value) => Math.max(0, value - 1));
  }

  function goToNextPage() {
    if (isLastPage) {
      router.push("/library");
      return;
    }

    setCurrentPage((value) => Math.min(pages.length - 1, value + 1));
  }

  function jumpToPage(index: number) {
    setCurrentPage(Math.max(0, Math.min(index, pages.length - 1)));
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        goToPreviousPage();
      }

      if (event.key === "ArrowRight") {
        goToNextPage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const endX = event.changedTouches[0]?.clientX ?? null;

    if (touchStartX === null || endX === null) {
      return;
    }

    const deltaX = endX - touchStartX;

    if (deltaX <= -42) {
      goToNextPage();
    } else if (deltaX >= 42) {
      goToPreviousPage();
    }

    setTouchStartX(null);
  }

  return (
    <main className="relative min-h-[calc(100svh-5.5rem)] overflow-hidden px-3 py-3 sm:px-5 sm:py-5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_20%)]" />
        <div className="absolute left-[-5rem] top-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-4rem] h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[rgba(5,8,18,0.72)] px-4 py-3 backdrop-blur-xl">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              Biblioteca pedagogica
            </p>
            <p className="truncate pt-1 text-sm text-slate-300">
              {book.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hud-chip">
              Pagina {currentPage + 1} de {pages.length}
            </span>
            <Link href="/library" className="ritual-link px-4 py-2 text-sm">
              Voltar ao catalogo
            </Link>
          </div>
        </div>

        <section
          className="relative min-h-[calc(100svh-10.5rem)] overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(4,8,18,0.98))] shadow-[0_30px_120px_rgba(2,6,23,0.5)]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_20%)]" />
            <div className="absolute inset-y-0 left-[6%] hidden w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.1),transparent)] lg:block" />
            <div className="absolute inset-y-0 right-[6%] hidden w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08),transparent)] lg:block" />
          </div>

          <div className="relative flex h-full min-h-[calc(100svh-10.5rem)] items-stretch">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={isFirstPage}
              className={`hidden w-20 shrink-0 items-center justify-center border-r border-white/6 transition lg:flex ${
                isFirstPage
                  ? "cursor-not-allowed text-slate-700"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
              aria-label="Pagina anterior"
            >
              <div className="flex flex-col items-center gap-3">
                <Chevron direction="left" className="h-7 w-7" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                  Voltar
                </span>
              </div>
            </button>

            <div className="flex min-h-[calc(100svh-10.5rem)] flex-1 flex-col">
              <div className="flex flex-1 items-stretch p-3 sm:p-5 lg:p-7">
                <article className="relative flex w-full flex-1 flex-col overflow-hidden rounded-[28px] border border-amber-100/12 bg-[linear-gradient(180deg,rgba(27,18,10,0.18),rgba(17,11,6,0.24))] p-[2px] shadow-[0_18px_80px_rgba(0,0,0,0.36)]">
                  <div className="flex h-full flex-1 flex-col rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(247,241,226,0.98),rgba(231,223,205,0.96))] px-4 py-4 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:px-6 sm:py-5 lg:px-10 lg:py-8">
                    {activePage.kind === "cover" ? (
                      <div className="flex h-full flex-col justify-between gap-6">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900/70">
                            Tomo de estudo
                          </p>
                          <h1 className="mt-4 max-w-4xl font-display text-3xl tracking-[0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                            {book.title}
                          </h1>
                          {book.subtitle ? (
                            <p className="mt-4 max-w-3xl text-sm font-semibold uppercase tracking-[0.18em] text-amber-900/70 sm:text-[13px]">
                              {book.subtitle}
                            </p>
                          ) : null}
                          <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-700 sm:text-[15px]">
                            {book.shortDescription}
                          </p>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[0.8fr,1.2fr]">
                          <section className="rounded-[24px] border border-slate-950/8 bg-white/50 px-4 py-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Topicos centrais
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {book.coreTopics.map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-full border border-amber-900/10 bg-amber-100/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-950"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </section>

                          <section className="rounded-[24px] border border-slate-950/8 bg-white/50 px-4 py-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Mapa das secoes
                            </p>
                            <div className="mt-4 grid gap-2">
                              {book.sections.map((section, sectionIndex) => {
                                const firstPageIndex =
                                  1 +
                                  book.sections
                                    .slice(0, sectionIndex)
                                    .reduce((total, currentSection) => total + currentSection.blocks.length, 0);

                                return (
                                  <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => jumpToPage(firstPageIndex)}
                                    className="rounded-[18px] border border-slate-950/8 bg-slate-950/5 px-4 py-3 text-left transition hover:border-sky-300/35 hover:bg-sky-50"
                                  >
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                      Secao {String(sectionIndex + 1).padStart(2, "0")}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-950">
                                      {section.title}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </section>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-950/8 pb-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Secao {String(activePage.sectionIndex + 1).padStart(2, "0")} de{" "}
                              {String(activePage.sectionCount).padStart(2, "0")}
                            </p>
                            <h2 className="mt-2 text-2xl tracking-[0.03em] text-slate-950 sm:text-3xl">
                              {activePage.sectionTitle}
                            </h2>
                          </div>
                          <div className="rounded-full border border-slate-950/8 bg-slate-950/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                            {activePage.title}
                          </div>
                        </div>

                        {activePage.summary ? (
                          <p className="max-w-3xl text-sm leading-7 text-slate-700 sm:text-[15px]">
                            {activePage.summary}
                          </p>
                        ) : null}

                        <div className="flex flex-1 items-start">
                          <div className="w-full">
                            <LibraryBookBlocks blocks={[activePage.block]} tone="reader" />
                          </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-4">
                          <span className="text-xs font-semibold tracking-[0.16em] text-amber-900/70">
                            {activePage.pageNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/6 px-4 py-3 sm:px-5 lg:hidden">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={isFirstPage}
                  className={`ritual-link px-4 py-2 text-sm ${isFirstPage ? "pointer-events-none opacity-40" : ""}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Chevron direction="left" />
                    Voltar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={goToNextPage}
                  className="ritual-link px-4 py-2 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    {isLastPage ? "Fechar livro" : "Proximo"}
                    <Chevron direction="right" />
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={goToNextPage}
              className={`hidden w-20 shrink-0 items-center justify-center border-l border-white/6 transition lg:flex ${
                isLastPage
                  ? "text-amber-200 hover:bg-amber-200/10 hover:text-amber-50"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
              aria-label={isLastPage ? "Fechar livro" : "Proxima pagina"}
            >
              <div className="flex flex-col items-center gap-3">
                <Chevron direction="right" className="h-7 w-7" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                  {isLastPage ? "Fechar" : "Avancar"}
                </span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
