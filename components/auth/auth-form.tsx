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
    eyebrow: string;
    sideTitle: string;
    sideDescription: string;
    sideHighlights: Array<{ title: string; description: string }>;
    title: string;
    description: string;
    submitLabel: string;
    endpoint: string;
  }
> = {
  login: {
    eyebrow: "Rito de Retorno",
    sideTitle: "Retorne a oficina e reassuma seu lugar diante da forja.",
    sideDescription:
      "Seu nome ja foi inscrito entre os aprendizes. Informe suas credenciais e volte ao ponto em que sua jornada alquimica foi interrompida.",
    sideHighlights: [
      {
        title: "Memoria da jornada",
        description: "Suas passagens, escolhas e descobertas permanecem vinculadas ao seu nome no grimorio.",
      },
      {
        title: "Retorno imediato",
        description: "Cruze o portal e volte direto as provas estruturais que aguardam sua proxima decisao.",
      },
    ],
    title: "Retornar a oficina",
    description: "Informe seu nome de oficio e sua chave sigilosa para retomar os estudos alquimicos.",
    submitLabel: "Cruzar o portal",
    endpoint: "/api/auth/login",
  },
  register: {
    eyebrow: "Rito de Ingresso",
    sideTitle: "Toda grande forja comeca quando um nome e aceito pelo reino.",
    sideDescription:
      "Apresente os sinais exigidos pela oficina, assuma seu nome no grimorio e receba a primeira marca de aprendiz.",
    sideHighlights: [
      {
        title: "Codigo da oficina",
        description: "Use o codigo da turma para ingressar no mesmo circulo de estudos conduzido pelo mestre.",
      },
      {
        title: "Nome no grimorio",
        description: "Escolha como o reino registrara sua passagem pelas provas e descobertas do carbono.",
      },
    ],
    title: "Iniciar a provacao",
    description: "Apresente seu codigo de turma, escolha seu nome no grimorio e receba sua marca de aprendiz.",
    submitLabel: "Receber marca de aprendiz",
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
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-4 py-6 sm:px-6 sm:py-10 lg:py-16">
      <section className="game-shell grid gap-4 lg:grid-cols-[1.02fr,0.98fr]">
        <div className="grid gap-4">
          <article className="game-panel border-cyan-300/15">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip">{copyByMode[mode].eyebrow}</span>
              <span className="hud-chip border-gold/20 text-gold/90">Acesso ao reino</span>
            </div>
            <p className="pt-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Cronicas do Reino do Carbono
            </p>
            <h1 className="pt-4 text-4xl tracking-[0.06em] text-white sm:text-5xl">
              {copyByMode[mode].sideTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {copyByMode[mode].sideDescription}
            </p>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {copyByMode[mode].sideHighlights.map((item) => (
              <article key={item.title} className="game-panel-muted">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
              </article>
            ))}
          </div>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Leitura de entrada</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              A autenticacao agora compartilha a mesma moldura do jogo: sala ritual, grimorio de acesso
              e contraste alto para leitura em desktop e mobile.
            </p>
          </article>
        </div>

        <div className="game-panel p-4 shadow-2xl shadow-black/20 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {copyByMode[mode].eyebrow}
          </p>
          <h1 className="mt-3 text-2xl tracking-[0.05em] text-white sm:text-3xl">{copyByMode[mode].title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">{copyByMode[mode].description}</p>

          <form className="mt-6 space-y-4 sm:mt-8" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {mode === "register" ? (
                <>
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">Codigo da oficina</span>
                    <input
                      name="classroomCode"
                      required
                      className="state-field"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">Nome no grimorio</span>
                    <input
                      name="displayName"
                      required
                      className="state-field"
                    />
                  </label>
                </>
              ) : null}

              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Nome de oficio</span>
                <input
                  name="username"
                  required
                  className="state-field"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Senha</span>
                <input
                  type="password"
                  name="password"
                  required
                  className="state-field"
                />
              </label>
            </div>

            {error ? (
              <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="state-action w-full py-3.5 sm:py-4"
              data-tone="primary"
            >
              {isPending ? "Selando acesso..." : copyByMode[mode].submitLabel}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
