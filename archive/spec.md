Specs tecnológicas recomendadas para lançar o MVP
Vou focar em algo rápido, barato, simples de manter e suficiente para o MVP de Crônicas do Reino do Carbono.

1. Objetivo tecnológico do MVP
   O MVP precisa permitir:

login simples ou identificação de jogador
progressão por fases
inventário de átomos e fragmentos
construção molecular simplificada
seleção de moléculas
seleção de propriedades
correção automática
pontuação
desbloqueio de cartas e fases
painel simples para editar fases no futuro
Para isso, você não precisa de uma stack complexa no começo.

2. Melhor abordagem para MVP
   Recomendação principal
   Fazer um web app responsivo.

Por quê?
roda no navegador
funciona em notebook, tablet e celular
não precisa publicar app em loja
iteração mais rápida
mais fácil para uso escolar 3. Stack recomendada
Opção mais indicada para MVP
Front-end
Next.js
React
TypeScript
Tailwind CSS
Back-end
usar o próprio Next.js API Routes ou Server Actions
Banco de dados
PostgreSQL
ORM
Prisma
Autenticação
NextAuth ou autenticação simples por nome/código de sessão
Hospedagem
Vercel para front/back
Neon Postgres para banco
Essa é a opção que eu mais recomendo.

4. Por que essa stack faz sentido
   Next.js
   Bom porque:

junta front e back no mesmo projeto
facilita deploy
ótimo para MVP
escalável depois
React
Bom para:

interface de cartas
fases
inventário
seleção de propriedades
feedback dinâmico
TypeScript
Ajuda a:

evitar bugs
organizar bem moléculas, fases, recompensas, inventário
Tailwind
Bom para:

montar interface rápido
estilizar cartas e fases sem perder tempo
PostgreSQL
Bom porque:

estrutura bem fases, usuários, cartas, progresso
confiável
fácil de expandir
Prisma
Bom porque:

simplifica o acesso ao banco
ajuda muito no desenvolvimento rápido 5. Arquitetura sugerida
Estrutura geral
text
Frontend (Next.js + React)
│
├── páginas do jogo
├── componentes de cartas
├── oficina molecular
├── desafios
└── interface de progresso
│
Backend (Next.js API / Server Actions)
│
├── lógica de desbloqueio
├── correção das respostas
├── cálculo de pontuação
├── persistência de progresso
└── inventário do jogador
│
Banco de dados (PostgreSQL)
│
├── usuários
├── fases
├── cartas
├── progresso
├── recompensas
└── respostas do jogador 6. Entidades principais do banco
Tabelas recomendadas
users
id
nome
email opcional
created_at
player_progress
id
user_id
fase_atual
pontuacao_total
titulo_atual
fases_concluidas
inventory
id
user_id
carbono
hidrogenio
fragmento_ligacao_dupla
fragmento_ligacao_tripla
fragmento_aromatico
unlocked_molecules
id
user_id
molecule_id
unlocked_at
molecules
id
nome_quimico
nome_epico
formula_molecular
formula_estrutural
classe
polaridade
potencial_energetico
reatividade
estabilidade
carater_acido_basico
interacao_biologica
volatilidade
phases
id
titulo
narrativa
objetivo
tipo_interacao
resposta_excelente
propriedades_esperadas
recompensa_json
player_phase_attempts
id
user_id
phase_id
molecule_selected
propriedades_selecionadas
pontuacao
resultado
created_at 7. Funcionalidades mínimas do MVP
Obrigatórias
entrar no jogo com nome
ver fase atual
montar molécula simples
escolher molécula em desafios
selecionar propriedades
receber feedback automático
ganhar recompensas
desbloquear próxima fase
salvar progresso
Desejáveis
tela de cartas desbloqueadas
barra de progresso
títulos
resumo final da campanha
Pode ficar para depois
ranking
multiplayer
editor completo de moléculas
animações complexas
dashboard pedagógico robusto
IA de feedback textual 8. Construção molecular no MVP
Recomendação
Não fazer editor químico livre no começo.

Faça assim:
O jogador escolhe:

número de carbonos
tipo de estrutura:
alcano
alceno
aromático
em alguns casos, forma especial
O sistema gera:

fórmula molecular
nome correspondente
valida se aquilo é permitido na fase
Exemplo
Entrada:

2 carbonos
ligação dupla
Saída:

C2H4
eteno
Isso é muito mais rápido de desenvolver.

9. Lógica de correção
   Pode ser toda determinística
   Você não precisa de IA no MVP.

Exemplo
Se fase = 6:

moléculas excelentes: eteno, propeno
propriedades corretas: insaturada, alta reatividade, útil como precursor de transformação, baixa polaridade
O sistema compara e devolve:

excelente
adequada
parcial
inadequada
Isso é suficiente para o MVP.

10. CMS ou conteúdo hardcoded?
    Recomendação para MVP
    Começar com conteúdo hardcoded em JSON ou seed no banco.

Por quê?
mais rápido
menos custo
menos complexidade
você já tem o texto das fases bem definido
Estrutura possível
/data/phases.ts
/data/molecules.ts
Depois migra para painel admin se necessário.

11. UI/UX recomendada
    Framework visual
    Tailwind CSS
    opcional: shadcn/ui
    Componentes principais
    Card de molécula
    Barra de atributos
    Tela de fase
    Inventário
    Caixa de seleção de propriedades
    Modal de recompensa
    Cores sugeridas
    alcanos: laranja/bronze
    alcenos: verde/azul elétrico
    aromáticos: roxo/dourado
12. Hospedagem recomendada
    Front + backend
    Vercel
    Banco
    Neon

    Armazenamento de imagens
    Vercel Blob
    ou
    Cloudinary
    ou
    imagens locais no próprio projeto para o MVP

13. Analytics e monitoramento
    Para MVP, usar algo simples:

Vercel Analytics
PostHog se quiser medir funil
Sentry para erro
Isso ajuda a ver:

onde alunos travam
quais fases erram mais
tempo médio por fase 14. Autenticação
Se for teste rápido em sala
Pode ser super simples:

aluno digita nome
sistema cria sessão local
salva progresso por browser/localStorage ou banco
Se quiser algo mais sólido
login por email mágico
Google login
código de turma
Recomendação MVP
Começar com:

nome do jogador + código de turma opcional 15. Persistência local vs banco
Opção A: localStorage
Bom para protótipo muito rápido

sem backend complexo
progresso salvo no navegador
Limitação
perde dado se trocar de dispositivo
ruim para análise pedagógica
Opção B: banco de dados
Melhor para MVP de verdade

salva progresso
permite análise
permite professor acompanhar depois
Recomendação
Use banco desde o começo se possível.

16. Estrutura de projeto sugerida
    text
    /crônicas-reino-carbono
    /src
    /app
    /inicio
    /capitulo-1
    /fase/[id]
    /cartas
    /inventario
    /resultado
    /components
    MoleculeCard.tsx
    PhaseNarrative.tsx
    PropertySelector.tsx
    RewardModal.tsx
    ProgressBar.tsx
    MoleculeBuilder.tsx
    /lib
    prisma.ts
    scoring.ts
    progression.ts
    auth.ts
    /data
    molecules.ts
    phases.ts
    /types
    molecule.ts
    phase.ts
    player.ts
    /prisma
    schema.prisma
17. Tipos de dados recomendados
    Molecule
    ts
    type Molecule = {
    id: string
    nomeQuimico: string
    nomeEpico: string
    formulaMolecular: string
    formulaEstrutural: string
    classe: "alcano" | "alceno" | "aromatico"
    atributos: {
    polaridade: number
    potencialEnergetico: number
    reatividade: number
    estabilidade: number
    caraterAcidoBasico: number
    interacaoBiologica: number
    volatilidade: number
    }
    tags: string[]
    }
    Phase
    ts
    type Phase = {
    id: string
    titulo: string
    narrativa: string
    objetivo: string
    tipoInteracao: "construcao" | "escolha" | "construcao_escolha"
    moleculasDisponiveis: string[]
    respostaExcelente: string[]
    respostasAdequadas?: string[]
    respostasParciais?: string[]
    respostasInadequadas?: string[]
    propriedadesEsperadas: string[]
    recompensas: {
    atomos?: { C?: number; H?: number }
    fragmentos?: string[]
    carta?: string
    titulo?: string
    }
    }
18. Roadmap técnico em 4 etapas
    Etapa 1 — Protótipo jogável
    telas básicas
    fases hardcoded
    sem login real
    progresso local
    sem banco
    Etapa 2 — MVP real
    banco PostgreSQL
    progresso persistente
    moléculas e fases estruturadas
    pontuação
    inventário
    Etapa 3 — Lançamento piloto
    dashboard simples
    analytics
    correções de UX
    responsividade
    Etapa 4 — Expansão
    Capítulo 2
    novas funções orgânicas
    admin panel
    métricas pedagógicas
