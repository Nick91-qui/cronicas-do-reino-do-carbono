import { notFound } from "next/navigation";

import { phaseIdSchema } from "@/lib/content/schema";
import { getPhaseById } from "@/lib/content/loaders";

export default async function PhasePage({
  params,
}: {
  params: Promise<{ phaseId: string }>;
}) {
  const { phaseId } = await params;
  const parsedPhaseId = phaseIdSchema.safeParse(phaseId);

  if (!parsedPhaseId.success) {
    notFound();
  }

  const phase = getPhaseById(parsedPhaseId.data);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-sky-300">Fase {phase.number}</p>
        <h1 className="mt-2 text-3xl font-semibold">{phase.title}</h1>
        <p className="mt-4 text-sm text-slate-300">{phase.objective}</p>
      </section>
    </main>
  );
}
