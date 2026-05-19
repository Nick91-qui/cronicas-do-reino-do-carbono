import Link from "next/link";

import { AuthScene } from "@/components/auth/auth-scene";
import { AuthForm } from "@/components/auth/auth-form";
import { blobAssets } from "@/lib/assets/blob";

export default function LoginPage() {
  return (
    <AuthScene
      mode="login"
      title="Retorne aos estudos."
      description="Identifique-se"
      backLabel="Voltar ao portao"
      ambientLabel="Biblioteca dos aprendizes"
      imageSrc={blobAssets.authLibrary}
      imageAlt="Biblioteca ritual do castelo."
    >
      <div className="space-y-6">
        <AuthForm mode="login" />
        <div className="space-y-3 pb-2 text-center text-sm text-slate-300">
          <div>
            Ainda nao recebeu sua marca?{" "}
            <Link
              href="/register"
              className="font-semibold text-amber-200 transition hover:text-amber-100"
            >
              Criar meu nome no reino
            </Link>
          </div>
          <div className="text-xs text-slate-400">
            Consulta publica:{" "}
            <Link
              href="/privacy"
              className="font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              Politica de Privacidade
            </Link>{" "}
            e{" "}
            <Link
              href="/terms"
              className="font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </AuthScene>
  );
}
