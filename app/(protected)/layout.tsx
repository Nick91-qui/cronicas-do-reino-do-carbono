import Link from "next/link";

import { ProtectedHudNav } from "@/components/navigation/protected-hud-nav";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const player = await requireAuthenticatedPlayer(prisma);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_58%)]" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.14),transparent_62%)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,8,18,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-200/80">
                <span className="hud-chip">Sala de vigilia</span>
                <span className="hud-chip border-gold/20 text-gold/90">Turma {player.classroomCode}</span>
              </div>
              <div className="min-w-0">
                <Link href="/game" className="font-display text-2xl tracking-[0.08em] text-white sm:text-3xl">
                  Cronicas do Reino do Carbono
                </Link>
                <p className="truncate pt-1 text-sm text-slate-300">
                  {player.displayName} segue pelas provas do dominio alquimico-cosmico.
                </p>
              </div>
            </div>

            <ProtectedHudNav />
          </div>

          <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Estado do aprendiz</p>
              <p className="pt-2 font-display text-xl text-white">{player.displayName}</p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Juramento ativo</p>
              <p className="pt-2 text-sm text-slate-100">Leitura estrutural, forja guiada e progresso persistente.</p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Saida de emergencia</p>
              <p className="pt-2 text-sm text-slate-100">Sessao segura pronta para retomada entre fases.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">{children}</div>
    </div>
  );
}
