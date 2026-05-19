import Link from "next/link";

export default function TermsPage() {
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
            <Link href="/privacy" className="ritual-link px-4 py-2 text-sm">
              Politica de Privacidade
            </Link>
          </div>
        </div>

        <article className="game-panel">
          <div className="flex flex-wrap items-center gap-2">
            <span className="hud-chip">Termos de Uso</span>
            <span className="hud-chip border-gold/20 text-gold/90">
              Piloto interno
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl tracking-[0.05em] text-white sm:text-5xl">
            Regras oficiais de uso do reino
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Esta pagina apresenta a versao publica oficial dos Termos de Uso do
            piloto interno de Cronicas do Reino do Carbono.
          </p>
        </article>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Operacao atual
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Responsavel identificado: Nicholas Contijo Moreira, Vila Velha - ES - Brasil.</p>
              <p>Contato operacional e de privacidade: nicholascm@gmail.com.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Escopo autorizado
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>O MVP esta autorizado apenas para piloto interno nas turmas do proprio controlador.</p>
              <p>O sistema ainda nao esta aberto a outras escolas nem a adesao publica ampla.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Cadastro e acesso
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>O cadastro exige codigo de turma valido, credenciais proprias e aceite destes termos.</p>
              <p>O jogador tambem deve declarar ciencia da Politica de Privacidade antes da criacao da conta.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Uso aceitavel
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Nao e permitido compartilhar conta, tentar acessar conta alheia ou manipular mecanismos do jogo.</p>
              <p>O ambiente deve permanecer compativel com uso pedagogico interno e supervisionado.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Conta e encerramento
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>Contas podem ser restringidas ou encerradas por abuso, fraude, uso fora do escopo ou necessidade operacional.</p>
              <p>O proprio jogador autenticado pode corrigir dados, exportar a conta e solicitar exclusao pelo fluxo disponivel.</p>
            </div>
          </article>

          <article className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Relacao com privacidade
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              <p>O uso do MVP depende do tratamento minimo de dados para autenticacao, sessao e progresso pedagogico.</p>
              <p>A politica oficial aplicavel esta publicada na pagina de privacidade e no documento legal do repositorio.</p>
            </div>
          </article>
        </section>

        <article className="game-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Estado atual
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
            <p>
              Estes termos valem para o piloto interno conduzido pelo
              controlador em suas proprias turmas e acompanham a politica de
              privacidade oficial do repositorio.
            </p>
            <p>
              O texto completo tambem esta mantido em
              `docs/legal/terms-of-use.md` para governanca normativa e futura
              revisao institucional.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
