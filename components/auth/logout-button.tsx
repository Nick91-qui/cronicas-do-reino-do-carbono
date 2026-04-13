"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? "Saindo..." : "Sair"}
    </button>
  );
}
