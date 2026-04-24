"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Destination = "/login" | "/register";

const menuOptions: Array<{
  href: Destination;
  label: string;
  description: string;
  tone: "primary" | "secondary";
}> = [
  {
    href: "/login",
    label: "Entrar",
    description: "Abra o portao principal e retorne ao castelo.",
    tone: "primary",
  },
  {
    href: "/register",
    label: "Registrar",
    description: "Atravesse o portao e reclame um nome no grimorio.",
    tone: "secondary",
  },
];

export function CastleLanding() {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleTransition(nextDestination: Destination) {
    if (destination) {
      return;
    }

    setDestination(nextDestination);
    timerRef.current = window.setTimeout(() => {
      router.push(nextDestination);
    }, 1350);
  }

  const isTransitioning = destination !== null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#090d16] text-white">
      <div className="absolute inset-0">
        <div
          className={[
            "absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.9,0.2,1)]",
            isTransitioning ? "scale-[1.16]" : "scale-100",
          ].join(" ")}
        >
          <Image
            src="/visual/landing/castelo-inicial.png"
            alt="Castelo central do Reino do Carbono."
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,143,0.18),transparent_24%),linear-gradient(180deg,rgba(5,8,16,0.12),rgba(5,8,16,0.48)_45%,rgba(5,8,16,0.92)_100%)]" />
        <div
          className={[
            "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_16%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.16),transparent_18%)] transition-opacity duration-700",
            isTransitioning ? "opacity-100" : "opacity-40",
          ].join(" ")}
        />
      </div>

      <div className="absolute left-1/2 top-[22%] h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl sm:top-[18%] sm:h-56 sm:w-56" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[17%] left-1/2 z-10 h-[40vh] w-[min(42vw,24rem)] -translate-x-1/2"
      >
        <div className="absolute inset-x-[14%] top-[8%] bottom-[6%] rounded-t-[42%] rounded-b-[12%] border border-cyan-300/25 bg-black/15 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-[2px]" />
        <div
          className={[
            "absolute left-1/2 top-[16%] h-[74%] w-[42%] origin-right rounded-l-[44%] rounded-br-[10%] border border-amber-200/20 bg-[linear-gradient(180deg,rgba(56,34,20,0.96),rgba(23,13,7,0.98))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_20px_50px_rgba(0,0,0,0.35)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.2,0.9,0.2,1)]",
            isTransitioning ? "-translate-x-[102%] -rotate-[8deg]" : "-translate-x-full",
          ].join(" ")}
        />
        <div
          className={[
            "absolute left-1/2 top-[16%] h-[74%] w-[42%] origin-left rounded-r-[44%] rounded-bl-[10%] border border-amber-200/20 bg-[linear-gradient(180deg,rgba(56,34,20,0.96),rgba(23,13,7,0.98))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_20px_50px_rgba(0,0,0,0.35)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.2,0.9,0.2,1)]",
            isTransitioning ? "translate-x-[2%] rotate-[8deg]" : "translate-x-0",
          ].join(" ")}
        />
        <div
          className={[
            "absolute left-1/2 top-[18%] h-[70%] w-[20%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.88),rgba(125,211,252,0.4)_38%,rgba(125,211,252,0.05)_72%,transparent_100%)] blur-md transition-all duration-[1200ms]",
            isTransitioning ? "opacity-100 scale-[2.6]" : "opacity-0 scale-75",
          ].join(" ")}
        />
      </div>

      <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pb-12 pt-10 text-center sm:px-6">
        <div className="max-w-4xl">
          <p className="mx-auto inline-flex rounded-full border border-cyan-300/25 bg-slate-950/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100 shadow-[0_8px_30px_rgba(2,6,23,0.34)] backdrop-blur-md">
            Menu Principal do Castelo
          </p>
          <h1 className="mt-6 font-display text-5xl tracking-[0.08em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl">
            Cronicas do Reino do Carbono
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Uma entrada mais proxima de menu de jogo: castelo ao centro, acoes concentradas e passagem
            direta para o interior do reino quando o portao se abre.
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          {menuOptions.map((option) => (
            <button
              key={option.href}
              type="button"
              disabled={isTransitioning}
              onClick={() => handleTransition(option.href)}
              className={[
                "group rounded-[28px] border px-5 py-5 text-center shadow-[0_20px_80px_rgba(2,6,23,0.4)] backdrop-blur-md transition duration-300",
                option.tone === "primary"
                  ? "border-amber-200/35 bg-[linear-gradient(180deg,rgba(250,204,21,0.92),rgba(217,119,6,0.88))] text-slate-950 hover:scale-[1.02]"
                  : "border-white/15 bg-slate-950/55 text-white hover:border-cyan-200/45 hover:bg-slate-900/65 hover:scale-[1.02]",
                isTransitioning ? "cursor-wait opacity-80" : "",
              ].join(" ")}
            >
              <span className="block text-xl font-black uppercase tracking-[0.16em]">{option.label}</span>
              <span
                className={[
                  "mt-2 block text-sm leading-6",
                  option.tone === "primary" ? "text-slate-900/80" : "text-slate-300",
                ].join(" ")}
              >
                {option.description}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-full border border-white/10 bg-slate-950/50 px-5 py-2 text-xs uppercase tracking-[0.24em] text-slate-300 backdrop-blur-md">
          {destination === "/login"
            ? "Abrindo o portao para a biblioteca central..."
            : destination === "/register"
              ? "Abrindo o portao para o laboratorio de iniciacao..."
              : "Escolha como deseja entrar no castelo."}
        </div>
      </section>
    </main>
  );
}
