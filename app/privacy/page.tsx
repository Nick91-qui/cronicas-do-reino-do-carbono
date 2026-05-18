import Link from "next/link";

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
          </div>
        </div>

        <article className="game-panel">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hud-chip">Politica de Privacidade</span>
            <span className="hud-chip border-gold/20 text-gold/90">MVP</span>
          </div>
          <h1 className="mt-5 font-display text-4xl tracking-[0.05em] text-white sm:text-5xl">
            Como o reino trata seus dados
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Esta pagina resume o tratamento minimo de dados pessoais no MVP de
            Cronicas do Reino do Carbono. Ela deve ser lida junto da
            documentacao completa em <code>docs/legal/privacy-policy.md</code>.
          </p>
        </article>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Dados coletados
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Codigo da turma, nome de exibicao, username e senha protegida por hash.</p>
              <p>Sessao autenticada, progresso por fase, inventario, recompensas e eventos operacionais minimos.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Finalidade principal
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Autenticar o jogador, vincular a turma correta e manter a jornada pedagogica.</p>
              <p>Salvar progresso, retomar sessao e registrar eventos operacionais minimos de funcionamento.</p>
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
              Direitos e contato
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>O titular deve poder solicitar acesso, correcao, exportacao e exclusao ou anonimizacao conforme a operacao aplicavel.</p>
              <p>Os contatos operacionais ainda precisam ser preenchidos antes da publicacao externa do MVP.</p>
            </div>
          </article>
        </section>

        <article className="game-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Estado atual
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
            <p>
              Esta pagina e um resumo publico inicial. A politica operacional
              completa do repositorio ainda depende do preenchimento do
              responsavel/controlador, do canal de privacidade e da regra final
              de retencao antes do uso ampliado com jogadores reais.
            </p>
            <p>
              Referencias internas: <code>docs/legal/privacy-policy.md</code> e{" "}
              <code>docs/planning/data-subject-rights-runbook.md</code>.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
