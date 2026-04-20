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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <section className="grid overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[0.95fr,1.05fr]">
        <div className="hidden border-r border-white/10 p-8 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Cronicas do Reino do Carbono
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
            {copyByMode[mode].sideTitle}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            {copyByMode[mode].sideDescription}
          </p>

          <div className="mt-8 grid gap-3">
            {copyByMode[mode].sideHighlights.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {copyByMode[mode].eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">{copyByMode[mode].title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">{copyByMode[mode].description}</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <>
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">Codigo da oficina</span>
                    <input
                      name="classroomCode"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">Nome no grimorio</span>
                    <input
                      name="displayName"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                    />
                  </label>
                </>
              ) : null}

              <label className="block text-sm">
                <span className="mb-2 block text-slate-200">Nome de oficio</span>
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
                {isPending ? "Selando acesso..." : copyByMode[mode].submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
