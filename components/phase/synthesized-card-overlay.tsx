import { MoleculeCard } from "@/components/cards/molecule-card";

import type { Molecule } from "@/lib/content/types";

type SynthesizedCardOverlayProps = {
  isMinimized: boolean;
  isVisible: boolean;
  molecule: Molecule;
  onExpand: () => void;
  onMinimize: () => void;
};

export function SynthesizedCardOverlay({
  isMinimized,
  isVisible,
  molecule,
  onExpand,
  onMinimize,
}: SynthesizedCardOverlayProps) {
  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition duration-300 ${
          isVisible && !isMinimized ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,15,30,0.12),rgba(8,15,30,0.46)_58%,rgba(8,15,30,0.06)_100%)]" />
      </div>

      <div
        className={`pointer-events-none absolute inset-x-3 bottom-8 z-30 flex justify-center transition-all duration-500 sm:inset-x-6 ${
          isVisible && !isMinimized
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-16 scale-90 opacity-0"
        }`}
      >
        <div className="pointer-events-auto w-full max-w-sm">
          <div className="mb-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={onMinimize}
              className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md transition hover:border-cyan-200/35"
            >
              Minimizar
            </button>
          </div>
          <div className="rounded-[28px] border border-emerald-300/24 bg-[linear-gradient(180deg,rgba(16,185,129,0.1),rgba(15,23,42,0.18))] p-3 shadow-[0_24px_80px_rgba(2,6,23,0.48)]">
            <MoleculeCard molecule={molecule} isCreated selectable={false} variant="compact" />
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-4 right-4 z-30 transition-all duration-300 sm:bottom-5 sm:right-5 ${
          isVisible && isMinimized ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={onExpand}
          className="rounded-full border border-emerald-300/24 bg-[linear-gradient(180deg,rgba(16,185,129,0.16),rgba(15,23,42,0.9))] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100 shadow-[0_12px_30px_rgba(2,6,23,0.34)] backdrop-blur-md transition hover:border-emerald-200/40"
        >
          Reabrir carta
        </button>
      </div>
    </>
  );
}
