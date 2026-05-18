"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DELETE_ACCOUNT_CONFIRMATION } from "@/lib/privacy/schema";

type DeleteState = "idle" | "confirming";

type AccountPrivacyControlsProps = {
  displayName: string;
  username: string;
};

export function AccountPrivacyControls({
  displayName: initialDisplayName,
  username: initialUsername,
}: AccountPrivacyControlsProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [username, setUsername] = useState(initialUsername);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>("idle");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleProfileSave() {
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          username,
        }),
      });

      const json = (await response.json().catch(() => null)) as {
        error?: string;
        player?: {
          displayName: string;
          username: string;
        };
      } | null;

      if (!response.ok) {
        setProfileError(json?.error ?? "Falha ao atualizar seus dados.");
        return;
      }

      if (json?.player) {
        setDisplayName(json.player.displayName);
        setUsername(json.player.username);
      }

      setProfileSuccess("Seus dados de conta foram atualizados.");
      router.refresh();
    } catch {
      setProfileError("Nao foi possivel atualizar seus dados agora.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleExport() {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch("/api/account/export", {
        method: "GET",
      });

      const json = (await response.json().catch(() => null)) as
        | Record<string, unknown>
        | { error?: string }
        | null;

      if (!response.ok) {
        setExportError(
          (json && "error" in json && typeof json.error === "string" && json.error) ||
            "Falha ao exportar os dados da conta.",
        );
        return;
      }

      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cronicas-reino-carbono-conta.json";
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError("Nao foi possivel exportar seus dados agora.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmation,
        }),
      });

      const json = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setDeleteError(json?.error ?? "Falha ao excluir a conta.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setDeleteError("Nao foi possivel excluir sua conta agora.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[0.92fr,1.08fr]">
      <article className="game-panel">
        <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
          Dados da conta
        </h2>
        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          <label className="block text-sm">
            <span className="mb-2 block text-slate-200">
              Nome no livro dos aprendizes
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="state-field"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-slate-200">Nome de oficio</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="state-field"
            />
          </label>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Correcao autenticada
            </p>
            <p className="mt-2 leading-6 text-slate-100">
              Atualize seu nome no livro dos aprendizes e seu nome de oficio sem
              sair do reino. As regras de unicidade do cadastro continuam
              valendo aqui.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={isSavingProfile}
              className="state-action px-5"
              data-tone="primary"
            >
              {isSavingProfile ? "Salvando..." : "Salvar meus dados"}
            </button>
          </div>

          {profileError ? (
            <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {profileError}
            </p>
          ) : null}

          {profileSuccess ? (
            <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {profileSuccess}
            </p>
          ) : null}

          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Exportacao
            </p>
            <p className="mt-2 leading-6 text-slate-100">
              Baixe um JSON com seus dados de conta, progresso, inventario,
              recompensas e eventos operacionais vinculados ao seu jogador.
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Exclusao
            </p>
            <p className="mt-2 leading-6 text-slate-100">
              A exclusao apaga sua conta autenticada e invalida suas sessoes.
              Use este fluxo apenas se realmente quiser encerrar sua jornada
              atual no reino.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="state-action px-5"
              data-tone="secondary"
            >
              {isExporting ? "Exportando..." : "Exportar meus dados"}
            </button>
            <button
              type="button"
              onClick={() =>
                setDeleteState((current) =>
                  current === "idle" ? "confirming" : "idle",
                )
              }
              disabled={isDeleting}
              className="state-action border border-rose-500/30 px-5 text-rose-100"
              data-tone="secondary"
            >
              {deleteState === "idle"
                ? "Excluir minha conta"
                : "Fechar exclusao"}
            </button>
          </div>

          {exportError ? (
            <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {exportError}
            </p>
          ) : null}
        </div>
      </article>

      <article className="game-panel">
        <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">
          Confirmacao forte
        </h2>
        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Frase obrigatoria
            </p>
            <p className="mt-2 leading-6 text-slate-100">
              Para excluir a conta, digite exatamente:
            </p>
            <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 font-semibold tracking-[0.08em] text-amber-200">
              {DELETE_ACCOUNT_CONFIRMATION}
            </p>
          </div>

          {deleteState === "confirming" ? (
            <div className="grid gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Senha atual</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="state-field"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">
                  Digite a frase de confirmacao
                </span>
                <input
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="state-field"
                />
              </label>

              {deleteError ? (
                <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {deleteError}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={
                    isDeleting ||
                    password.trim().length === 0 ||
                    confirmation !== DELETE_ACCOUNT_CONFIRMATION
                  }
                  className="state-action px-5"
                  data-tone="primary"
                >
                  {isDeleting ? "Excluindo..." : "Confirmar exclusao"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteState("idle");
                    setPassword("");
                    setConfirmation("");
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  className="state-action px-5"
                  data-tone="secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="game-panel-muted">
              <p className="leading-6 text-slate-100">
                A exclusao so fica disponivel quando voce abrir este painel de
                confirmacao. Isso reduz remocoes acidentais e separa o fluxo de
                risco alto do restante do perfil.
              </p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
