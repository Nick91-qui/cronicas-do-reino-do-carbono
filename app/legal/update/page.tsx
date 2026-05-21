import { redirect } from "next/navigation";

import { LegalReacceptanceCard } from "@/components/legal/legal-reacceptance-card";
import { prisma } from "@/lib/db/prisma";
import {
  PRIVACY_POLICY_VERSION,
  TERMS_OF_USE_VERSION,
} from "@/lib/legal/versions";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";

export default async function LegalUpdatePage() {
  const player = await requireAuthenticatedPlayer(prisma, {
    allowOutdatedLegalAcceptance: true,
  });

  if (!player.needsLegalAcceptance) {
    redirect("/hall");
  }

  return (
    <main className="min-h-screen bg-[#060913] px-4 py-8 text-white sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <LegalReacceptanceCard
          displayName={player.displayName}
          privacyPolicyVersion={PRIVACY_POLICY_VERSION}
          termsOfUseVersion={TERMS_OF_USE_VERSION}
        />
      </section>
    </main>
  );
}
