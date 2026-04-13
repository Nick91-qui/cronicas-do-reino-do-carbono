import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crônicas do Reino do Carbono",
  description: "MVP web de jogo educacional de química orgânica introdutória.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
