# Contexto do Projeto

## Identidade

- **Nome:** Crônicas do Reino do Carbono
- **Público-alvo principal:** alunos da 3ª série do Ensino Médio
- **Público secundário:** professores que usam o jogo como apoio didático
- **Core loop pedagógico:** narrativa curta → desafio → construção molecular simplificada → análise de cartas → escolha da molécula → justificativa por propriedades → feedback imediato → progressão

## Diretrizes de Ouro

- Toda validação química e de gameplay é autoritativa no servidor.
- O cliente nunca decide progressão, pontuação oficial ou validade final da resposta.
- Não existe texto livre nas respostas do jogador.
- Fases que exigem justificativa devem receber de 1 a 3 tags de propriedades.
- As propriedades devem pertencer estritamente ao enum oficial `SelectableProperty`.
- A justificativa qualifica a resposta, mas não corrige uma molécula errada.
- O conteúdo do jogo é estático e versionado em arquivos locais.
- O banco de dados não é fonte de verdade para fases, moléculas ou regras de conteúdo.
- Toda escrita deve ser validada com schemas tipados no servidor.

## Stack e Infra

- **Frontend:** Next.js + React + TypeScript + Tailwind CSS
- **Backend:** Next.js Route Handlers e módulos server-side em TypeScript
- **Banco de dados:** PostgreSQL hospedado na Neon
- **ORM:** Prisma
- **Deploy:** Vercel
- **Validação:** Zod recomendado para payloads e contratos internos

### Papel dos arquivos locais

Arquivos locais são a fonte oficial para:

- capítulos;
- fases;
- moléculas;
- enums;
- propriedades selecionáveis;
- recompensas definidas por conteúdo.

### Papel do banco de dados

O banco existe apenas para dados operacionais do jogador:

- autenticação;
- sessão;
- tentativas;
- progresso por fase e capítulo;
- inventário;
- eventos de recompensa;
- analytics leves.

## Modelagem de Dados

### Enums críticos

```ts
type PhaseType = "construction" | "choice" | "construction_choice";
type QualitativeResult = "excellent" | "adequate" | "inadequate";
type ValidationResult = "correct" | "incorrect";
type ChemicalClass = "alcano" | "alceno" | "aromatico";
type BondType = "single" | "double" | "aromatic";
```

### Mapeamento oficial de resultado

```ts
excellent -> correct -> 3
adequate -> correct -> 2
inadequate -> incorrect -> 0
```

### IDs oficiais de moléculas

- `metano`
- `etano`
- `propano`
- `eteno`
- `propeno`
- `buteno`
- `benzeno`

### IDs oficiais de fragmentos

- `ligacao_simples`
- `ligacao_dupla`
- `estrutura_aromatica`

### IDs oficiais de fases

- `chapter-1-phase-1`
- `chapter-1-phase-2`
- `chapter-1-phase-3`
- `chapter-1-phase-4`
- `chapter-1-phase-5`
- `chapter-1-phase-6`
- `chapter-1-phase-7`
- `chapter-1-phase-8`

### ID oficial de capítulo

- `chapter-1`

### Propriedades clicáveis oficiais

- `saturada`
- `insaturada`
- `aromatica`
- `aberta`
- `fechada`
- `homogenea`
- `normal`
- `baixa_polaridade`
- `alta_volatilidade`
- `alto_potencial_energetico`
- `alta_reatividade`
- `util_como_combustivel`
- `util_como_precursor_de_transformacao`
- `util_para_polimeros`
- `estabilidade_especial`
- `adequada_para_meio_apolar`
- `cadeia_curta`

## Status da Missão

- **Estado atual:** MVP em implementação avançada com fundação, conteúdo estático, builder, autenticação, loop de fase, progresso e inventário já materializados no repositório
- **Fonte única da verdade:** `README.md` e pasta `docs/`
- **Legado removido:** `archive/` excluído para evitar ambiguidade
- **Próximo passo imediato:** consolidar o **Milestone 8 — Integração completa do Capítulo I** e avançar no **Milestone 9 — QA, segurança e deploy**

## Estrutura documental visual

Para cobrir a camada visual do produto, a documentação oficial também inclui uma trilha dedicada em `docs/visual/`:

- `visual-direction.md`
- `ui-system.md`
- `screen-map.md`
- `asset-pipeline.md`
- `card-spec.md`

Essa trilha existe para separar claramente:

- regras de gameplay;
- conteúdo pedagógico;
- direção visual;
- organização de interface e assets.

Ela também define o vínculo entre conteúdo estático e apresentação por meio de campos visuais orientados a assets, especialmente para cartas de molécula.

## Próximo passo operacional

Executar a fase atual do projeto com foco em:

- validar ponta a ponta as 8 fases oficiais já integradas em conteúdo local;
- revisar coerência entre `content/` e `docs/design/phases.md`;
- ampliar QA dos fluxos críticos de builder, submissão, progresso e recompensas;
- preparar critérios mínimos de smoke test e aceite para produção;
- atualizar continuamente a documentação de status quando a implementação avançar.

## Restrições para futuras sessões

- Não inventar regras fora da documentação oficial.
- Não mover conteúdo estático para o banco por conveniência.
- Não aceitar submissões sem justificativa quando a fase exigir propriedades.
- Não criar lógica química relevante apenas no cliente.
- Em caso de conflito, priorizar `docs/tech/technical-spec.md`, `docs/design/content-model.md` e `docs/design/phases.md`.
