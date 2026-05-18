import Link from "next/link";
import { notFound } from "next/navigation";

import { ProtectedScene } from "@/components/scene/protected-scene";
import { requireOperator } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { blobAssets } from "@/lib/assets/blob";

function formatDate(value: Date | null) {
  return value ? value.toLocaleString("pt-BR") : "Sem registro";
}

function maskUsername(username: string) {
  if (username.length <= 3) {
    return `${username[0] ?? ""}***`;
  }

  return `${username.slice(0, 3)}***`;
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
      phaseSummaries: {
        orderBy: [{ phaseId: "asc" }],
        take: 12,
      },
      analyticsEvents: {
        orderBy: { createdAt: "desc" },
        take: 8,
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

  return (
    <ProtectedScene
      eyebrow="Observatorio interno"
      ambientLabel="Leitura detalhada"
      imageSrc={blobAssets.protectedApprenticeRoom}
      imageAlt="Sala de leitura detalhada do observatorio."
      title={player.displayName}
      description={`Visao detalhada do jogador para ${operator.displayName}. Esta leitura exibe identidade minimizada, progresso resumido e sinais recentes suficientes para suporte operacional sem abrir uma superficie administrativa ampla.`}
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
              Turmas com progresso
            </p>
            <p className="pt-2 text-sm text-slate-100">
              {player.chapterProgress.length}
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
              <dd className="mt-1 text-slate-100">@{maskUsername(player.username)}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Turma</dt>
              <dd className="mt-1 text-slate-100">
                {player.classroom.code}
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Conta criada em</dt>
              <dd className="mt-1 text-slate-100">
                {formatDate(player.createdAt)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
            Limite desta leitura
          </h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Identidade minimizada</dt>
              <dd className="mt-1 text-slate-100">
                O observatorio evita exibir username completo e detalhes
                granulares de inventario por padrao.
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Uso recomendado</dt>
              <dd className="mt-1 text-slate-100">
                Esta visao deve servir para suporte operacional e validacao de
                progresso, nao para inspecao ampla de dados pessoais.
              </dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Dados omitidos</dt>
              <dd className="mt-1 text-slate-100">
                Inventario detalhado, recompensas historicas e sessoes completas
                nao aparecem nesta primeira leitura minimizada.
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

      <section className="grid gap-4">
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
