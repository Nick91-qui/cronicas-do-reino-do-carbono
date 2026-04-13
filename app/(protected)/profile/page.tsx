import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";

export default async function ProfilePage() {
  const player = await requireAuthenticatedPlayer(prisma);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Perfil do jogador</h1>
        <dl className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Nome</dt>
            <dd className="mt-1 text-slate-100">{player.displayName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Username</dt>
            <dd className="mt-1 text-slate-100">{player.username}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Turma</dt>
            <dd className="mt-1 text-slate-100">{player.classroomCode}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Sessão expira em</dt>
            <dd className="mt-1 text-slate-100">{player.sessionExpiresAt.toLocaleString("pt-BR")}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
