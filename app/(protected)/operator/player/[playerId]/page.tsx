import Link from "next/link";
import { notFound } from "next/navigation";

import { ProtectedScene } from "@/components/scene/protected-scene";
import { requireOperator } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { blobAssets } from "@/lib/assets/blob";

function formatDate(value: Date | null) {
  return value ? value.toLocaleString("pt-BR") : "Sem registro";
}

export default async function OperatorPlayerDetailPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const operator = await requireOperator(prisma);
  const { playerId } = await params;

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      classroom: true,
      chapterProgress: {
        orderBy: { chapterId: "asc" },
      },
      inventory: true,
      phaseSummaries: {
        orderBy: [{ phaseId: "asc" }],
        take: 12,
      },
      rewardEvents: {
        orderBy: { grantedAt: "desc" },
        take: 8,
      },
      analyticsEvents: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
      sessions: {
        orderBy: { expiresAt: "desc" },
        take: 1,
      },
    },
  });

  if (!player) {
    notFound();
  }

  const totalScore = player.chapterProgress.reduce(
    (sum, chapter) => sum + chapter.chapterScore,
    0,
  );
  const totalCompletedPhases = player.chapterProgress.reduce(
    (sum, chapter) => sum + chapter.completedPhaseCount,
    0,
  );
  const latestSession = player.sessions[0] ?? null;

  return (
    <ProtectedScene
      eyebrow="Observatorio interno"
      ambientLabel="Leitura detalhada"
      imageSrc={blobAssets.protectedApprenticeRoom}
      imageAlt="Sala de leitura detalhada do observatorio."
      title={player.displayName}
      description={`Visao detalhada do jogador para ${operator.displayName}. Esta leitura exibe identidade, progresso, inventario, recompensas e atividade recente sem permitir mutacao direta.`}
      actions={
        <Link href="/operator" className="ritual-link px-5 py-3 text-sm">
          Voltar ao observatorio
        </Link>
      }
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Papel
            </p>
            <p className="pt-2 font-display text-2xl text-white">
              {player.role}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pontuacao total
            </p>
            <p className="pt-2 font-display text-3xl text-white">
              {totalScore}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Fases concluidas
            </p>
            <p className="pt-2 font-display text-3xl text-white">
              {totalCompletedPhases}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Sessao mais recente
            </p>
            <p className="pt-2 text-sm text-slate-100">
              {formatDate(latestSession?.expiresAt ?? null)}
            </p>
          </div>
        </>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1fr,1fr]">
        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Identidade
          </h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Nome no livro dos aprendizes</dt>
              <dd className="mt-1 text-slate-100">{player.displayName}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Username</dt>
              <dd className="mt-1 text-slate-100">@{player.username}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Turma</dt>
              <dd className="mt-1 text-slate-100">
                {player.classroom.name} · {player.classroom.code}
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Criado em</dt>
              <dd className="mt-1 text-slate-100">
                {formatDate(player.createdAt)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Snapshot de inventario
          </h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Carbonos disponiveis</dt>
              <dd className="mt-1 text-slate-100">
                {player.inventory?.carbonAvailable ?? 0}
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Modo de hidrogenio</dt>
              <dd className="mt-1 text-slate-100">
                {player.inventory?.hydrogenMode ?? "Sem snapshot"}
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Fragmentos</dt>
              <dd className="mt-1 text-slate-100">
                {(Array.isArray(player.inventory?.unlockedFragmentsJson)
                  ? player.inventory?.unlockedFragmentsJson
                  : []
                ).join(", ") || "Nenhum"}
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Titulos</dt>
              <dd className="mt-1 text-slate-100">
                {(Array.isArray(player.inventory?.unlockedTitlesJson)
                  ? player.inventory?.unlockedTitlesJson
                  : []
                ).join(", ") || "Nenhum"}
              </dd>
            </div>
          </dl>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Progresso por capitulo
          </h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            {player.chapterProgress.length > 0 ? (
              player.chapterProgress.map((chapter) => (
                <article key={chapter.id} className="game-panel-muted">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {chapter.chapterId}
                  </p>
                  <p className="mt-2 text-slate-100">
                    Fase mais alta: {chapter.highestUnlockedPhaseNumber}
                  </p>
                  <p className="mt-1 text-slate-100">
                    Fases concluidas: {chapter.completedPhaseCount}
                  </p>
                  <p className="mt-1 text-slate-100">
                    Pontuacao: {chapter.chapterScore}
                  </p>
                </article>
              ))
            ) : (
              <article className="game-panel-muted text-slate-100">
                Nenhum progresso persistido ainda.
              </article>
            )}
          </div>
        </section>

        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Fases resumidas
          </h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            {player.phaseSummaries.length > 0 ? (
              player.phaseSummaries.map((summary) => (
                <article key={summary.id} className="game-panel-muted">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {summary.phaseId}
                  </p>
                  <p className="mt-2 text-slate-100">
                    Concluida: {summary.isCompleted ? "sim" : "nao"}
                  </p>
                  <p className="mt-1 text-slate-100">
                    Melhor score: {summary.bestScore}
                  </p>
                  <p className="mt-1 text-slate-100">
                    Tentativas: {summary.attemptCount}
                  </p>
                </article>
              ))
            ) : (
              <article className="game-panel-muted text-slate-100">
                Nenhum resumo de fase persistido ainda.
              </article>
            )}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Recompensas recentes
          </h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            {player.rewardEvents.length > 0 ? (
              player.rewardEvents.map((reward) => (
                <article key={reward.id} className="game-panel-muted">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {reward.rewardType}
                  </p>
                  <p className="mt-2 text-slate-100">{reward.rewardValue}</p>
                  <p className="mt-1 text-slate-400">
                    {formatDate(reward.grantedAt)}
                  </p>
                </article>
              ))
            ) : (
              <article className="game-panel-muted text-slate-100">
                Nenhuma recompensa registrada ainda.
              </article>
            )}
          </div>
        </section>

        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Atividade recente
          </h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            {player.analyticsEvents.length > 0 ? (
              player.analyticsEvents.map((event) => (
                <article key={event.id} className="game-panel-muted">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {event.eventType}
                  </p>
                  <p className="mt-2 text-slate-100">
                    {event.phaseId ?? "Sem fase associada"}
                  </p>
                  <p className="mt-1 text-slate-400">
                    {formatDate(event.createdAt)}
                  </p>
                </article>
              ))
            ) : (
              <article className="game-panel-muted text-slate-100">
                Nenhum evento recente registrado.
              </article>
            )}
          </div>
        </section>
      </section>
    </ProtectedScene>
  );
}
