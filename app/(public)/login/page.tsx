import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthForm mode="login" />
      <div className="pb-8 text-center text-sm text-slate-400">
        Ainda nao recebeu sua marca?{" "}
        <Link href="/register" className="font-semibold text-gold">
          Inicie sua provacao
        </Link>
      </div>
    </div>
  );
}
