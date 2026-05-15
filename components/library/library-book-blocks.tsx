import type { LibraryContentBlock } from "@/lib/content/types";

type LibraryBookBlocksProps = {
  blocks: LibraryContentBlock[];
  tone?: "dark" | "reader";
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

function getReaderCalloutClass(tone: "info" | "warning" | "success") {
  if (tone === "warning") {
    return "border-amber-900/12 bg-amber-100/70 text-amber-950";
  }

  if (tone === "success") {
    return "border-emerald-900/12 bg-emerald-100/70 text-emerald-950";
  }

  return "border-sky-900/12 bg-sky-100/70 text-sky-950";
}

export function LibraryBookBlocks({
  blocks,
  tone = "dark",
}: LibraryBookBlocksProps) {
  const isReaderTone = tone === "reader";

  return (
    <div className="grid gap-4">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`paragraph-${index}`}
              className={`text-sm leading-7 sm:text-[15px] ${
                isReaderTone ? "text-slate-700" : "text-slate-200"
              }`}
            >
              {block.content}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <article
              key={`bullets-${index}`}
              className={
                isReaderTone
                  ? "rounded-[24px] border border-slate-950/8 bg-white/55 px-4 py-4"
                  : "game-panel-muted"
              }
            >
              {block.title ? (
                <h4
                  className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                    isReaderTone ? "text-slate-700" : "text-sky-100"
                  }`}
                >
                  {block.title}
                </h4>
              ) : null}
              <ul
                className={`grid gap-2 text-sm leading-6 ${
                  isReaderTone ? "text-slate-700" : "text-slate-100"
                } ${block.title ? "mt-3" : ""}`}
              >
                {block.items.map((item) => (
                  <li
                    key={item}
                    className={
                      isReaderTone
                        ? "rounded-2xl border border-slate-950/8 bg-amber-50/80 px-4 py-3"
                        : "rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3"
                    }
                  >
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
              className={`rounded-[24px] border px-4 py-4 sm:px-5 ${
                isReaderTone
                  ? getReaderCalloutClass(block.tone)
                  : getCalloutClass(block.tone)
              }`}
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
            <article
              key={`example-${index}`}
              className={
                isReaderTone
                  ? "rounded-[24px] border border-slate-950/8 bg-white/55 px-4 py-4"
                  : "game-panel-muted"
              }
            >
              <h4
                className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                  isReaderTone ? "text-slate-700" : "text-sky-100"
                }`}
              >
                {block.title}
              </h4>
              {block.prompt ? (
                <p
                  className={`mt-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isReaderTone
                      ? "border border-amber-900/10 bg-amber-50/80 text-slate-900"
                      : "border border-white/10 bg-slate-950/25 text-white"
                  }`}
                >
                  {block.prompt}
                </p>
              ) : null}
              <p
                className={`mt-3 text-sm leading-7 ${
                  isReaderTone ? "text-slate-700" : "text-slate-100"
                }`}
              >
                {block.explanation}
              </p>
            </article>
          );
        }

        return (
          <article key={`comparison-${index}`} className="grid gap-3">
            <h4
              className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                isReaderTone ? "text-slate-700" : "text-sky-100"
              }`}
            >
              {block.title}
            </h4>
            <div className="grid gap-3">
              {block.items.map((item) => (
                <div
                  key={item.label}
                  className={
                    isReaderTone
                      ? "rounded-[24px] border border-slate-950/8 bg-white/55 px-4 py-4"
                      : "game-panel-muted"
                  }
                >
                  <p
                    className={`text-sm font-semibold ${
                      isReaderTone ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      isReaderTone ? "text-slate-700" : "text-slate-200"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
