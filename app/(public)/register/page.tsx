import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthForm mode="register" />
      <div className="pb-8 text-center text-sm text-slate-400">
        Ja possui marca de aprendiz?{" "}
        <Link href="/login" className="font-semibold text-gold">
          Retorne ao laboratorio
        </Link>
      </div>
    </div>
  );
}
