import { redirect } from "next/navigation";

export default async function GamePage({
  searchParams,
}: {
  searchParams?: Promise<{ chapter?: string; chapterId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const chapterId = resolvedSearchParams?.chapterId ?? resolvedSearchParams?.chapter;

  if (chapterId) {
    redirect(`/hall?chapterId=${chapterId}`);
  }

  redirect("/hall");
}
