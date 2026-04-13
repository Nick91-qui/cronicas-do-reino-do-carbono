import { notFound } from "next/navigation";

import { getChapterById } from "@/lib/content/loaders";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  if (chapterId !== "chapter-1") {
    notFound();
  }

  const chapter = getChapterById("chapter-1");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-sky-300">{chapter.id}</p>
        <h1 className="mt-2 text-3xl font-semibold">{chapter.title}</h1>
        <p className="mt-2 text-sm text-slate-300">
          Este capítulo possui {chapter.totalPhases} fases oficiais e serve como base para integrar
          o progresso autenticado do jogador.
        </p>
      </section>
    </main>
  );
}
