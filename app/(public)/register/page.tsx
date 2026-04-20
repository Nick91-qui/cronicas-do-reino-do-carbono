import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <>
      <AuthForm mode="register" />
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm text-slate-400">
        Ja possui marca de aprendiz?{" "}
        <Link href="/login" className="text-sky-300">
          Retorne a oficina
        </Link>
      </div>
    </>
  );
}
