import { notFound, redirect } from "next/navigation";

import { getChapterById } from "@/lib/content/loaders";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  let chapter;

  try {
    chapter = getChapterById(chapterId as never);
  } catch {
    notFound();
  }

  redirect(`/hall?chapterId=${chapter.id}`);
}
