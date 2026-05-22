"use client";

type SynthesisBuilderToolbarV2Props = {
  selectedAtomLabel: string;
  canAddCarbon: boolean;
  canRemoveSelected: boolean;
  isRingMode: boolean;
  canUndo: boolean;
  onAddCarbonAction: () => void;
  onToggleRingModeAction: () => void;
  onRemoveTerminalAction: () => void;
  onUndoAction: () => void;
  onResetAction: () => void;
};

export function SynthesisBuilderToolbarV2({
  selectedAtomLabel,
  canAddCarbon,
  canRemoveSelected,
  isRingMode,
  canUndo,
  onAddCarbonAction,
  onToggleRingModeAction,
  onRemoveTerminalAction,
  onUndoAction,
  onResetAction,
}: SynthesisBuilderToolbarV2Props) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
          Selecionado: <span className="font-black text-white">{selectedAtomLabel}</span>
        </div>
        <div className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
          {isRingMode ? "Modo fechar anel" : "Modo expandir"}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAddCarbonAction}
          disabled={!canAddCarbon}
          className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-200/35 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Adicionar carbono
        </button>
        <button
          type="button"
          onClick={onToggleRingModeAction}
          className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
            isRingMode
              ? "border-amber-300/30 bg-amber-400/10 text-amber-100"
              : "border-white/10 bg-slate-950/70 text-slate-100 hover:bg-white/8"
          }`}
        >
          {isRingMode ? "Cancelar anel" : "Fechar anel"}
        </button>
        <button
          type="button"
          onClick={onRemoveTerminalAction}
          disabled={!canRemoveSelected}
          className="rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-100 transition hover:border-rose-200/35 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Remover terminal
        </button>
        <button
          type="button"
          onClick={onUndoAction}
          disabled={!canUndo}
          className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-100 transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Desfazer
        </button>
        <button
          type="button"
          onClick={onResetAction}
          className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-100 transition hover:bg-white/8"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
