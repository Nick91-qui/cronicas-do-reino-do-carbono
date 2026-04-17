"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

const copyByMode: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submitLabel: string;
    endpoint: string;
  }
> = {
  login: {
    title: "Entrar",
    description: "Use seu username e senha para continuar a jornada.",
    submitLabel: "Entrar",
    endpoint: "/api/auth/login",
  },
  register: {
    title: "Criar conta",
    description: "Informe a turma, seus dados e gere a sessão inicial do jogador.",
    submitLabel: "Cadastrar",
    endpoint: "/api/auth/register",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload =
      mode === "register"
        ? {
            classroomCode: String(formData.get("classroomCode") ?? ""),
            displayName: String(formData.get("displayName") ?? ""),
            username: String(formData.get("username") ?? ""),
            password: String(formData.get("password") ?? ""),
          }
        : {
            username: String(formData.get("username") ?? ""),
            password: String(formData.get("password") ?? ""),
          };

    const response = await fetch(copyByMode[mode].endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(json?.error ?? "Falha na autenticação.");
      setIsPending(false);
      return;
    }

    router.push("/game");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <section className="grid overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[0.95fr,1.05fr]">
        <div className="hidden border-r border-white/10 p-8 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Cronicas do Reino do Carbono
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
            {mode === "login" ? "Retorne a oficina" : "Inicie a jornada"}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Entre na campanha pedagogica, acompanhe suas fases e desbloqueie as moleculas oficiais do capitulo.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Fluxo guiado
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Historia, forja, escolha e justificativa em uma progressao clara.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Progresso persistente
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Pontuacao, fases e cartas ficam vinculadas ao seu jogador.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {mode === "login" ? "Sessao autenticada" : "Cadastro inicial"}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">{copyByMode[mode].title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">{copyByMode[mode].description}</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <>
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">Codigo da turma</span>
                    <input
                      name="classroomCode"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">Nome de exibicao</span>
                    <input
                      name="displayName"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                    />
                  </label>
                </>
              ) : null}

              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Username</span>
                <input
                  name="username"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Senha</span>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl bg-cyan-300 px-4 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Processando..." : copyByMode[mode].submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
