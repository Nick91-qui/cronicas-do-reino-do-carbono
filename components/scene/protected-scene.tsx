import Image from "next/image";
import type { ReactNode } from "react";

type ProtectedSceneProps = {
  eyebrow: string;
  title: string;
  description: string;
  ambientLabel: string;
  imageSrc: string;
  imageAlt: string;
  actions?: ReactNode;
  stats?: ReactNode;
  children: ReactNode;
};

export function ProtectedScene({
  eyebrow,
  title,
  description,
  ambientLabel,
  imageSrc,
  imageAlt,
  actions,
  stats,
  children,
}: ProtectedSceneProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
      <section className="relative isolate overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/55 shadow-[0_30px_120px_rgba(2,6,23,0.46)]">
        <div className="absolute inset-0">
          <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,15,0.92)_0%,rgba(4,7,15,0.74)_52%,rgba(4,7,15,0.84)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_20%)]" />
        </div>

        <div className="relative grid gap-6 px-5 py-6 sm:px-8 sm:py-8 xl:grid-cols-[1.15fr,0.85fr] xl:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip">{eyebrow}</span>
              <span className="hud-chip border-gold/20 text-gold/90">{ambientLabel}</span>
            </div>
            <h1 className="pt-5 text-4xl tracking-[0.06em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)] sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl pt-4 text-sm leading-7 text-slate-200 sm:text-base">{description}</p>
            {actions ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          </div>

          {stats ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{stats}</div> : null}
        </div>
      </section>

      {children}
    </main>
  );
}
