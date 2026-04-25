import Link from "next/link";

import { AuthScene } from "@/components/auth/auth-scene";
import { AuthForm } from "@/components/auth/auth-form";
import { blobAssets } from "@/lib/assets/blob";

export default function RegisterPage() {
  return (
    <AuthScene
      mode="register"
      title="O laboratorio de iniciacao prepara um novo nome."
      description="Quem escolhe registrar atravessa o portao para a ala de sintese, onde o castelo apresenta os instrumentos, regras e marcas do primeiro rito."
      backLabel="Voltar ao portao"
      ambientLabel="Laboratorio de iniciacao"
      imageSrc={blobAssets.authSynthesisLab}
      imageAlt="Laboratorio de sintese no interior do castelo."
    >
      <div className="space-y-6">
        <AuthForm mode="register" />
        <div className="pb-2 text-center text-sm text-slate-300">
          Ja possui marca de aprendiz?{" "}
          <Link href="/login" className="font-semibold text-amber-200 transition hover:text-amber-100">
            Retorne ao laboratorio
          </Link>
        </div>
      </div>
    </AuthScene>
  );
}
