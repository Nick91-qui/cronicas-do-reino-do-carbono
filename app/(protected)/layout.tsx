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
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-sky-300">Crônicas do Reino do Carbono</p>
            <p className="truncate text-xs text-slate-400">
              {player.displayName} · turma {player.classroomCode}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
            <Link href="/game" className="rounded-full border border-white/10 px-3 py-1.5 hover:border-sky-300/35 hover:text-white">Jogo</Link>
            <Link href="/collection" className="rounded-full border border-white/10 px-3 py-1.5 hover:border-sky-300/35 hover:text-white">Coleção</Link>
            <Link href="/profile" className="rounded-full border border-white/10 px-3 py-1.5 hover:border-sky-300/35 hover:text-white">Perfil</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
