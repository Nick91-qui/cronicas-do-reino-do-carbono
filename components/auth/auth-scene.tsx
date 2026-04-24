import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthSceneProps = {
  mode: "login" | "register";
  title: string;
  description: string;
  backLabel: string;
  ambientLabel: string;
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
};

export function AuthScene({
  mode,
  title,
  description,
  backLabel,
  ambientLabel,
  imageSrc,
  imageAlt,
  children,
}: AuthSceneProps) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#060913] text-white">
      <div className="absolute inset-0">
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,12,0.18),rgba(4,6,12,0.58)_42%,rgba(4,6,12,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),transparent_24%),radial-gradient(circle_at_bottom,rgba(251,191,36,0.12),transparent_20%)]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/12 bg-slate-950/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 backdrop-blur-md transition hover:border-cyan-200/35 hover:text-white"
          >
            {backLabel}
          </Link>
          <span className="rounded-full border border-cyan-300/20 bg-slate-950/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur-md">
            {ambientLabel}
          </span>
        </div>

        <div className="grid gap-8 pb-8 pt-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-end">
          <div className="max-w-xl rounded-[32px] border border-white/10 bg-slate-950/45 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-lg sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">Interior do castelo</p>
            <h1 className="mt-4 font-display text-4xl tracking-[0.06em] text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">{description}</p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-300/40 via-white/15 to-transparent" />
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-slate-400">
              {mode === "login" ? "Sala de retorno dos aprendizes" : "Sala de recepcao dos novos nomes"}
            </p>
          </div>

          <div>{children}</div>
        </div>
      </section>
    </main>
  );
}
