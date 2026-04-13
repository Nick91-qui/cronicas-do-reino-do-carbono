import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const player = await requireAuthenticatedPlayer(prisma);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-sky-300">Crônicas do Reino do Carbono</p>
            <p className="text-xs text-slate-400">
              {player.displayName} · turma {player.classroomCode}
            </p>
          </div>

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/game">Jogo</Link>
            <Link href="/collection">Coleção</Link>
            <Link href="/profile">Perfil</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
