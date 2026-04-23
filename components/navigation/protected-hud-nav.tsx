"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoutButton } from "@/components/auth/logout-button";

const items = [
  { href: "/game", label: "Jogo" },
  { href: "/collection", label: "Grimorio" },
  { href: "/profile", label: "Perfil" },
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
        className="ritual-link h-12 w-12 p-0"
      >
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
        <div className="absolute right-0 top-14 z-40 min-w-[220px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,28,0.98),rgba(4,8,18,0.98))] p-3 shadow-[0_24px_60px_rgba(2,6,23,0.44)] backdrop-blur-xl">
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
