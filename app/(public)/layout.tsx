import { prisma } from "@/lib/db/prisma";
import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const player = await getAuthenticatedPlayer(prisma);

  if (player) {
    redirect("/game");
  }

  return children;
}
