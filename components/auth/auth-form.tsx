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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
        <h1 className="text-3xl font-semibold tracking-tight">{copyByMode[mode].title}</h1>
        <p className="mt-2 text-sm text-slate-300">{copyByMode[mode].description}</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Código da turma</span>
                <input
                  name="classroomCode"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Nome de exibição</span>
                <input
                  name="displayName"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
                />
              </label>
            </>
          ) : null}

          <label className="block text-sm">
            <span className="mb-2 block text-slate-200">Username</span>
            <input
              name="username"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-slate-200">Senha</span>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Processando..." : copyByMode[mode].submitLabel}
          </button>
        </form>
      </section>
    </main>
  );
}
