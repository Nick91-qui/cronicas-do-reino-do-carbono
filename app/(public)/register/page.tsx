import Link from "next/link";

import { AuthScene } from "@/components/auth/auth-scene";
import { AuthForm } from "@/components/auth/auth-form";
import { blobAssets } from "@/lib/assets/blob";

export default function RegisterPage() {
  return (
    <AuthScene
      mode="register"
      title="O laboratorio de iniciacao prepara um novo nome."
      description="Quem entra no reino pela primeira vez atravessa este portao para comecar os estudos e receber sua marca de aprendiz."
      backLabel="Voltar ao portao"
      ambientLabel="Laboratorio de iniciacao"
      imageSrc={blobAssets.authSynthesisLab}
      imageAlt="Laboratorio de sintese no interior do castelo."
    >
      <div className="space-y-6">
        <AuthForm mode="register" />
        <div className="space-y-3 pb-2 text-center text-sm text-slate-300">
          <div>
            Ja possui marca de aprendiz?{" "}
            <Link href="/login" className="font-semibold text-amber-200 transition hover:text-amber-100">
              Entrar no reino
            </Link>
          </div>
          <div className="text-xs text-slate-400">
            Antes do cadastro, consulte a{" "}
            <Link
              href="/privacy"
              className="font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              Politica de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </AuthScene>
  );
}
