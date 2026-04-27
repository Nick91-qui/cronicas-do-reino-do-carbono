import { ProtectedHudNav } from "@/components/navigation/protected-hud-nav";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { blobAssets } from "@/lib/assets/blob";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuthenticatedPlayer(prisma);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              `linear-gradient(180deg, rgba(4,7,15,0.74), rgba(4,7,15,0.96)), url('${blobAssets.protectedGrandHall}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_58%)]" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.14),transparent_62%)] blur-3xl" />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,8,18,0.78)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl justify-end px-4 py-4 sm:px-6">
            <ProtectedHudNav />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
