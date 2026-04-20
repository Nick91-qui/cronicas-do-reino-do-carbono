import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <>
      <AuthForm mode="login" />
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm text-slate-400">
        Ainda nao recebeu sua marca?{" "}
        <Link href="/register" className="text-sky-300">
          Inicie sua provacao
        </Link>
      </div>
    </>
  );
}
