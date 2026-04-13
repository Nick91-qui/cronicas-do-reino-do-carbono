import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";

export default async function GamePage() {
  const player = await requireAuthenticatedPlayer(prisma);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-sky-300">Sessão autenticada</p>
        <h1 className="mt-2 text-3xl font-semibold">Bem-vindo, {player.displayName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          A fundação do MVP agora reconhece o jogador autenticado e está pronta para ligar progresso,
          inventário e submissão persistida ao backend protegido.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/chapter/chapter-1" className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Capítulo I</h2>
          <p className="mt-2 text-sm text-slate-300">Entrar no capítulo oficial do MVP.</p>
        </Link>
        <Link href="/collection" className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Coleção</h2>
          <p className="mt-2 text-sm text-slate-300">Ver moléculas e desbloqueios persistidos.</p>
        </Link>
        <Link href="/profile" className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Perfil</h2>
          <p className="mt-2 text-sm text-slate-300">Inspecionar a conta autenticada.</p>
        </Link>
      </section>
    </main>
  );
}
