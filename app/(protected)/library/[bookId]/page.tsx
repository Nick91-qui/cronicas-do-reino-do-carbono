import { notFound } from "next/navigation";

import { LibraryBookReader } from "@/components/library/library-book-reader";
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

  return <LibraryBookReader book={book} />;
}
