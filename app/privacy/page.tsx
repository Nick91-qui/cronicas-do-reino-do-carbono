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
            <span className="hud-chip border-gold/20 text-gold/90">
              Piloto interno
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl tracking-[0.05em] text-white sm:text-5xl">
            Como o reino trata seus dados
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Esta pagina apresenta a versao publica oficial da politica de
            privacidade do piloto interno de Cronicas do Reino do Carbono, hoje
            aplicado nas turmas do proprio controlador.
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
              <p>Salvar progresso, retomar sessao e registrar eventos operacionais minimos de funcionamento e melhoria controlada do piloto.</p>
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
              <p>Contato de privacidade e canal para direitos do titular: nicholascm@gmail.com.</p>
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
              <p>Infraestrutura atualmente usada: Vercel para hospedagem da aplicacao e Neon para banco de dados gerenciado.</p>
            </div>
          </article>
        </section>

        <article className="game-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Estado atual
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
            <p>
              Esta politica vale para o piloto interno conduzido pelo
              controlador em suas proprias turmas. O MVP ainda nao esta aberto
              a outras escolas ou a operacao externa ampliada.
            </p>
            <p>
              O repositiorio tambem possui implementacoes autenticadas para
              correcao de dados, exportacao de conta e exclusao da conta do
              proprio jogador.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
