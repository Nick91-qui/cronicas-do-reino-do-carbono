"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoutButton } from "@/components/auth/logout-button";

const items = [
  { href: "/game", label: "Salao" },
  { href: "/collection", label: "Grimorio" },
  { href: "/profile", label: "Aposentos" },
];

export function ProtectedHudNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Abrir menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-12 items-center gap-3 rounded-full border border-white/10 bg-slate-950/55 px-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 shadow-[0_12px_32px_rgba(2,6,23,0.34)] backdrop-blur-md transition hover:border-cyan-200/35"
      >
        <span className="hidden sm:inline">Mapa</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-14 z-40 min-w-[250px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,28,0.98),rgba(4,8,18,0.98))] p-3 shadow-[0_24px_60px_rgba(2,6,23,0.44)] backdrop-blur-xl">
          <div className="mb-3 rounded-[18px] border border-cyan-300/10 bg-cyan-400/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">Mapa do castelo</p>
            <p className="mt-1 text-sm text-slate-300">Escolha a ala que deseja visitar sem sair da campanha.</p>
          </div>
          <div className="grid gap-2">
            {items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/game" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="ritual-link w-full justify-start px-4 py-3 text-sm"
                  data-active={isActive}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <LogoutButton className="ritual-link w-full justify-start px-4 py-3 text-sm" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
