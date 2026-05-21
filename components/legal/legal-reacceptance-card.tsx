"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LegalReacceptanceCardProps = {
  displayName: string;
  privacyPolicyVersion: string;
  termsOfUseVersion: string;
};

export function LegalReacceptanceCard({
  displayName,
  privacyPolicyVersion,
  termsOfUseVersion,
}: LegalReacceptanceCardProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/account/legal-acceptance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privacyPolicyAcknowledged: true,
          termsOfUseAccepted: true,
        }),
      });

      const json = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setError(json?.error ?? "Falha ao registrar o novo aceite legal.");
        return;
      }

      router.push("/hall");
      router.refresh();
    } catch {
      setError(
        "Nao foi possivel atualizar o aceite agora. Verifique sua conexao e tente novamente.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article className="game-panel max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="hud-chip">Aceite obrigatorio</span>
        <span className="hud-chip border-gold/20 text-gold/90">
          Documentos legais atualizados
        </span>
      </div>

      <h1 className="mt-5 text-3xl tracking-[0.05em] text-white sm:text-4xl">
        {displayName}, antes de voltar ao reino voce precisa revisar os documentos atualizados.
      </h1>

      <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
        <p>
          Houve mudanca material na documentacao legal do servico. Para seguir
          usando as areas autenticadas, e necessario registrar nova ciencia da
          Politica de Privacidade e novo aceite dos Termos de Uso vigentes.
        </p>
        <p>
          Versoes atuais: politica <strong>v{privacyPolicyVersion}</strong> e
          termos <strong>v{termsOfUseVersion}</strong>.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/privacy" className="ritual-link px-4 py-3 text-center text-sm">
          Ler Politica de Privacidade
        </Link>
        <Link href="/terms" className="ritual-link px-4 py-3 text-center text-sm">
          Ler Termos de Uso
        </Link>
      </div>

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-6 text-slate-200">
        Ao continuar, voce declara ciencia da Politica de Privacidade vigente e
        aceita os Termos de Uso vigentes do servico.
      </div>

      <button
        type="button"
        onClick={handleAccept}
        disabled={isPending}
        className="state-action mt-6 w-full py-3.5 sm:py-4"
        data-tone="primary"
      >
        {isPending ? "Registrando aceite..." : "Aceitar documentos atualizados e continuar"}
      </button>
    </article>
  );
}
