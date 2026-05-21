import Link from "next/link";

import {
  PRIVACY_POLICY_EFFECTIVE_DATE,
  PRIVACY_POLICY_VERSION,
} from "@/lib/legal/versions";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#060913] px-4 py-8 text-white sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="ritual-link px-4 py-2 text-sm">
            Voltar ao portao
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="ritual-link px-4 py-2 text-sm">
              Login
            </Link>
            <Link href="/register" className="ritual-link px-4 py-2 text-sm">
              Cadastro
            </Link>
            <Link href="/terms" className="ritual-link px-4 py-2 text-sm">
              Termos de Uso
            </Link>
          </div>
        </div>

        <article className="game-panel">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hud-chip">Politica de Privacidade</span>
            <span className="hud-chip border-gold/20 text-gold/90">
              Uso educacional
            </span>
            <span className="hud-chip border-white/10 text-slate-200">
              v{PRIVACY_POLICY_VERSION}
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl tracking-[0.05em] text-white sm:text-5xl">
            Como o reino trata seus dados
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Esta pagina apresenta a versao publica oficial da politica de
            privacidade de Cronicas do Reino do Carbono para uso educacional.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Vigencia: {PRIVACY_POLICY_EFFECTIVE_DATE}
          </p>
        </article>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Dados coletados
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Codigo da turma, nome de exibicao, username e senha protegida por hash.</p>
              <p>Sessao autenticada, progresso por fase, inventario, recompensas, eventos operacionais minimos e registro versionado do aceite legal.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Finalidade principal
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Autenticar o jogador, vincular a turma correta e manter a jornada pedagogica.</p>
              <p>Salvar progresso, retomar sessao, apoiar acompanhamento pedagogico e registrar eventos operacionais minimos de funcionamento.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Cookie essencial
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>O MVP usa cookie de sessao para manter login e proteger as areas autenticadas.</p>
              <p>Esse cookie nao tem finalidade publicitaria e e necessario para o funcionamento da area protegida.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Direitos, contato e mediação
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>O titular deve poder solicitar acesso, correcao, exportacao e exclusao ou anonimizacao conforme a operacao aplicavel.</p>
              <p>Contato de privacidade e canal para direitos do titular: nicholascm@gmail.com. Quando houver menores, o uso deve ocorrer com mediação educacional aplicavel.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Retencao oficial
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Sessao: ate 7 dias ou ate logout. Analytics operacionais: ate 6 meses.</p>
              <p>Conta inativa e historico pedagogico: ate 12 meses sem acesso ou ate pedido de exclusao.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Controlador e provedores
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Controlador identificado: Nicholas Contijo Moreira, Vila Velha - ES - Brasil.</p>
              <p>Infraestrutura atualmente usada: Vercel para hospedagem da aplicacao e Neon para banco de dados gerenciado. Em contexto escolar, a instituicao pode participar da operacao conforme o arranjo adotado.</p>
            </div>
          </article>
        </section>

        <article className="game-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Condicoes gerais
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
            <p>
              Esta politica cobre o uso educacional atual do servico, ainda em
              operacao gratuita de piloto e vinculada ao contexto autorizado
              pelo responsavel.
            </p>
            <p>
              O cadastro de novas contas exige ciencia desta politica e aceite
              explicito dos Termos de Uso oficiais do servico.
            </p>
            <p>
              Para novas contas, o sistema registra a versao e o momento dessa
              ciencia para fins de rastreabilidade operacional minima.
            </p>
            <p>
              O repositorio tambem possui implementacoes autenticadas para
              correcao de dados, exportacao de conta e exclusao da conta do
              proprio jogador.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
