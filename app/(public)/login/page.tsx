import Link from "next/link";

import { AuthScene } from "@/components/auth/auth-scene";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <AuthScene
      mode="login"
      title="A biblioteca central aguarda seu retorno."
      description="Quem escolhe entrar atravessa o portao principal e cai direto no salao de consulta do castelo, onde os registros da jornada permanecem guardados."
      backLabel="Voltar ao portao"
      ambientLabel="Biblioteca dos aprendizes"
      imageSrc="/visual/auth/biblioteca.png"
      imageAlt="Biblioteca ritual do castelo."
    >
      <div className="space-y-6">
        <AuthForm mode="login" />
        <div className="pb-2 text-center text-sm text-slate-300">
          Ainda nao recebeu sua marca?{" "}
          <Link href="/register" className="font-semibold text-amber-200 transition hover:text-amber-100">
            Inicie sua provacao
          </Link>
        </div>
      </div>
    </AuthScene>
  );
}
