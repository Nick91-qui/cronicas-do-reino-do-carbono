"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";

const items = [
  { href: "/game", label: "Jogo" },
  { href: "/collection", label: "Grimorio" },
  { href: "/profile", label: "Perfil" },
];

export function ProtectedHudNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/game" && pathname.startsWith(`${item.href}/`));

        return (
          <Link key={item.href} href={item.href} className="ritual-link" data-active={isActive}>
            {item.label}
          </Link>
        );
      })}
      <LogoutButton className="ritual-link min-w-[92px]" />
    </div>
  );
}
