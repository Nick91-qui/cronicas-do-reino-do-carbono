import type { LibraryContentBlock } from "@/lib/content/types";

type LibraryBookBlocksProps = {
  blocks: LibraryContentBlock[];
};

function getCalloutClass(tone: "info" | "warning" | "success") {
  if (tone === "warning") {
    return "border-amber-300/25 bg-amber-400/10 text-amber-50";
  }

  if (tone === "success") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-50";
  }

  return "border-sky-300/25 bg-sky-400/10 text-sky-50";
}

export function LibraryBookBlocks({ blocks }: LibraryBookBlocksProps) {
  return (
    <div className="grid gap-4">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={`paragraph-${index}`} className="text-sm leading-7 text-slate-200 sm:text-[15px]">
              {block.content}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <article key={`bullets-${index}`} className="game-panel-muted">
              {block.title ? (
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">
                  {block.title}
                </h4>
              ) : null}
              <ul className={`grid gap-2 text-sm leading-6 text-slate-100 ${block.title ? "mt-3" : ""}`}>
                {block.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        }

        if (block.type === "callout") {
          return (
            <article
              key={`callout-${index}`}
              className={`rounded-[24px] border px-4 py-4 sm:px-5 ${getCalloutClass(block.tone)}`}
            >
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em]">
                {block.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-inherit">{block.content}</p>
            </article>
          );
        }

        if (block.type === "example") {
          return (
            <article key={`example-${index}`} className="game-panel-muted">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">
                {block.title}
              </h4>
              {block.prompt ? (
                <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm font-semibold text-white">
                  {block.prompt}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-7 text-slate-100">
                {block.explanation}
              </p>
            </article>
          );
        }

        return (
          <article key={`comparison-${index}`} className="grid gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">
              {block.title}
            </h4>
            <div className="grid gap-3">
              {block.items.map((item) => (
                <div key={item.label} className="game-panel-muted">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
