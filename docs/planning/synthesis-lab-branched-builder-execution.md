# Arquitetura Executável da Mesa de Síntese Ramificada

## 1. Propósito

Este documento traduz o plano da mesa de síntese ramificada para decisões executáveis de código.

Seu papel é:

- conectar a arquitetura alvo aos arquivos reais do repositório;
- definir o contrato transitório entre builder antigo e builder novo;
- organizar a introdução da engine externa;
- quebrar a Fase 1 em patches objetivos;
- reduzir ambiguidade antes do primeiro ciclo de implementação.

Este documento complementa:

- `docs/planning/synthesis-lab-branched-builder-plan.md`
- `docs/tech/technical-spec.md`
- `docs/tech/builder-legacy-removal.md`

---

## 2. Leitura do estado atual

Hoje, o builder oficial do repositório está concentrado em:

- [lib/builder/types.ts](/var/home/nmoreira/Projetos/cronicas-do-reino-do-carbono/lib/builder/types.ts:1)
- [lib/builder/schema.ts](/var/home/nmoreira/Projetos/cronicas-do-reino-do-carbono/lib/builder/schema.ts:1)
- [lib/builder/validate.ts](/var/home/nmoreira/Projetos/cronicas-do-reino-do-carbono/lib/builder/validate.ts:1)
- [components/phase/synthesis-lab.tsx](/var/home/nmoreira/Projetos/cronicas-do-reino-do-carbono/components/phase/synthesis-lab.tsx:1)
- [components/phase/synthesis-lab-visual.tsx](/var/home/nmoreira/Projetos/cronicas-do-reino-do-carbono/components/phase/synthesis-lab-visual.tsx:150)
- [components/phase/phase-experience.tsx](/var/home/nmoreira/Projetos/cronicas-do-reino-do-carbono/components/phase/phase-experience.tsx:166)

As limitações atuais observáveis são:

- `GraphBuilderState` representa apenas cadeia linear ou anel simples;
- `GraphBuilderBondOrder` aceita apenas `1 | 2`;
- não há noção de átomo selecionável para expansão livre;
- não há grafo arbitrário de conectividade carbônica;
- hidrogênios existem apenas como derivação numérica e fórmula textual;
- a validação reconhece um conjunto muito pequeno de assinaturas oficiais;
- a UI assume controles baseados em contagem global de carbonos e alternância de ligações por índice.

---

## 3. Dependência nova prevista

### 3.1 Candidata principal

A engine escolhida como primeira candidata de integração é:

- `openchemlib`

Motivos:

- licença compatível com o projeto;
- documentação pública estável;
- suporte a `Molecule`, `CanvasEditor`, `inventCoordinates`, `toSVG` e helpers químicos;
- melhor encaixe atual para apoiar depiction/layout e canonização estrutural;
- menos incerteza de manutenção imediata que `RDKit.js`.

### 3.2 Papel da dependência

`openchemlib` não entra para substituir a UI do jogo.

Ela entra para:

- normalizar o grafo carbônico;
- gerar ou recalcular coordenadas 2D;
- apoiar canonização estrutural;
- servir como base futura de exportação/depiction;
- reduzir o custo de manter layout químico manual frágil.

### 3.3 Regra de encapsulamento

Nenhum componente React deve falar diretamente com a API da biblioteca.

Toda integração com `openchemlib` deve ficar atrás de módulos próprios em:

- `lib/builder/chemistry/engine-interop.ts`
- `lib/builder/layout/branched-layout.ts`

---

## 4. Contrato transitório recomendado

### 4.1 Objetivo

Introduzir a nova arquitetura sem quebrar de imediato:

- a rota `/builder/validate`;
- o `submit`;
- o fluxo de `construction`;
- o fluxo de `construction_choice`;
- a mesa atual já em produção de desenvolvimento.

### 4.2 Estratégia

Durante a transição, o projeto deve conviver com dois contratos:

```ts
type BuilderState =
  | GraphBuilderState
  | BranchedBuilderState;
```

Com discriminação explícita por versão ou por `kind`.

Formato recomendado:

```ts
type GraphBuilderState = {
  kind: "graph_v1";
  layout: BuilderLayout;
  carbonCount: number;
  bonds: GraphBuilderBond[];
};

type BranchedBuilderState = {
  kind: "branched_v2";
  atoms: BranchedEditableAtom[];
  bonds: BranchedEditableBond[];
  rootAtomId: BranchedAtomId;
  selectedAtomId: BranchedAtomId | null;
  selectedBondId: BranchedBondId | null;
};
```

### 4.3 Regra de convivência

- `graph_v1` continua suportado no caminho atual;
- `branched_v2` entra em paralelo;
- a validação passa a despachar por discriminante;
- a UI nova só usa `branched_v2`;
- a UI antiga continua usando `graph_v1` até o rollout controlado.

---

## 5. Modelo executável do novo builder

### 5.1 Estado editável

O estado editável do jogador deve conter apenas os átomos e ligações que ele realmente controla.

Na primeira implementação:

- o jogador edita apenas carbonos;
- hidrogênios são derivados;
- a renderização materializa `H` como nós visuais;
- o estado autoritativo não persiste `H` como input do usuário.

Formato recomendado:

```ts
type BranchedAtomId = string;
type BranchedBondId = string;

type BranchedEditableAtom = {
  id: BranchedAtomId;
  element: "C";
};

type BranchedEditableBond = {
  id: BranchedBondId;
  atomA: BranchedAtomId;
  atomB: BranchedAtomId;
  order: 1 | 2 | 3;
};

type BranchedBuilderState = {
  kind: "branched_v2";
  atoms: BranchedEditableAtom[];
  bonds: BranchedEditableBond[];
  rootAtomId: BranchedAtomId;
  selectedAtomId: BranchedAtomId | null;
  selectedBondId: BranchedBondId | null;
};
```

### 5.2 Projeção de render

A renderização deve trabalhar com uma estrutura derivada enriquecida:

```ts
type RenderAtom = {
  id: string;
  element: "C" | "H";
  sourceAtomId: BranchedAtomId;
  x: number;
  y: number;
  isDerivedHydrogen: boolean;
};

type RenderBond = {
  id: string;
  atomA: string;
  atomB: string;
  order: 1 | 2 | 3;
  isDerivedHydrogenBond: boolean;
};

type BranchedRenderModel = {
  atoms: RenderAtom[];
  bonds: RenderBond[];
};
```

Regra:

- `RenderAtom` e `RenderBond` nunca são payload oficial da API;
- servem apenas para interação e desenho em `SVG`.

---

## 6. Organização real de arquivos

### 6.1 Arquivos novos recomendados

```text
lib/builder/
  state/
    branched-types.ts
    branched-schema.ts
    branched-operations.ts
    branched-selectors.ts
  chemistry/
    branched-hydrogens.ts
    branched-valence.ts
    branched-signature.ts
    engine-interop.ts
  layout/
    branched-layout.ts
    branched-render-model.ts
    hydrogen-layout.ts
  validation/
    branched-validate.ts
    branched-resolve-official-molecule.ts
  compatibility/
    builder-union.ts
components/phase/
  synthesis-lab-v2.tsx
  synthesis-lab-svg.tsx
  synthesis-atom-node.tsx
  synthesis-bond-edge.tsx
  synthesis-builder-toolbar-v2.tsx
```

### 6.2 Arquivos atuais que viram fachada temporária

- `lib/builder/types.ts`
- `lib/builder/schema.ts`
- `lib/builder/validate.ts`

Esses arquivos devem:

- continuar exportando o contrato atual;
- começar a reexportar o contrato novo;
- funcionar como ponto de transição até a limpeza final.

### 6.3 Arquivos atuais que não devem ser mexidos cedo demais

- `lib/gameplay/evaluate-phase.ts`
- `app/api/phases/[phaseId]/submit/route.ts`
- `components/phase/phase-experience.tsx`

Regra:

- primeiro estabilizar `branched_v2`;
- depois plugar na fase;
- só depois alterar submit/progresso.

---

## 7. Fronteiras de responsabilidade

### 7.1 `state/`

Responsável por:

- tipos;
- schema;
- mutações puras;
- undo stack local;
- selectors de conveniência.

Não deve:

- conhecer `openchemlib`;
- renderizar;
- reconhecer moléculas oficiais.

### 7.2 `chemistry/`

Responsável por:

- valência;
- contagem de hidrogênios;
- identificação de carbonos terminais;
- cálculo de assinatura estrutural;
- conversão para a representação aceita pela engine externa.

Não deve:

- conhecer React;
- tomar decisões de UX.

### 7.3 `layout/`

Responsável por:

- pedir ou normalizar coordenadas da engine;
- pós-processar o layout recebido;
- posicionar hidrogênios explícitos;
- gerar o `BranchedRenderModel`.

Não deve:

- validar fase;
- decidir progressão;
- reconhecer molécula oficial.

### 7.4 `validation/`

Responsável por:

- validar restrições estruturais do builder novo;
- cruzar com recursos da fase;
- resolver a molécula oficial;
- devolver `BuilderValidationResult`.

### 7.5 `components/phase/`

Responsável por:

- renderizar;
- capturar clique em átomo, clique em ligação e ações de toolbar;
- chamar operações puras;
- exibir feedback.

Não deve:

- conter regra de valência central;
- conversar direto com `openchemlib`.

---

## 8. Integração com `openchemlib`

### 8.1 Regra geral

A integração deve ser encapsulada em uma camada estreita.

Entrada:

- `BranchedBuilderState`

Saída:

- coordenadas 2D normalizadas;
- assinatura canônica auxiliar;
- erros de interoperabilidade.

### 8.2 Funções iniciais recomendadas

```ts
type EngineLayoutResult = {
  atomCoords: Array<{ atomId: BranchedAtomId; x: number; y: number }>;
};

export function toOpenChemLibMolecule(
  state: BranchedBuilderState,
): unknown;

export function layoutBranchedStateWithEngine(
  state: BranchedBuilderState,
): EngineLayoutResult;

export function getCanonicalSignatureFromEngine(
  state: BranchedBuilderState,
): string;
```

### 8.3 Falha da engine

Se a engine falhar:

- a UI não deve travar;
- o builder deve manter o último layout estável conhecido;
- a validação deve continuar podendo falhar com mensagem interna controlada;
- a falha deve ser capturável em teste.

---

## 9. Resultado esperado da Fase 1

Ao final da Fase 1, ainda sem substituir a mesa visível da fase, o repositório deve ter:

- `BranchedBuilderState` definido e testado;
- schema `branched_v2`;
- operações puras para:
  - adicionar carbono;
  - remover carbono terminal;
  - alternar ordem de ligação;
  - selecionar átomo;
  - selecionar ligação;
  - desfazer;
- cálculo de hidrogênios separado;
- ponte inicial com `openchemlib`;
- geração de coordenadas para cadeia e anel;
- geração do render model com `H` explícito.

Critério:

- ainda não precisa existir substituição total da UI de fase;
- já precisa existir núcleo implementável e testável.

---

## 10. Sequência concreta de patches da Fase 1

### Patch 1 — Dependência e tipos base

Arquivos:

- `package.json`
- `lib/builder/state/branched-types.ts`
- `lib/builder/compatibility/builder-union.ts`
- `lib/builder/types.ts`

Saída:

- dependência `openchemlib` adicionada;
- tipos base do builder novo;
- união transitória de contratos.

### Patch 2 — Schema e mutações puras

Arquivos:

- `lib/builder/state/branched-schema.ts`
- `lib/builder/state/branched-operations.ts`
- `lib/builder/state/branched-selectors.ts`
- `lib/builder/schema.ts`

Saída:

- schema `branched_v2`;
- operações puras sem engine;
- shape pronto para testes.

### Patch 3 — Valência e hidrogênios

Arquivos:

- `lib/builder/chemistry/branched-valence.ts`
- `lib/builder/chemistry/branched-hydrogens.ts`
- `lib/builder/chemistry/branched-signature.ts`

Saída:

- valência por átomo;
- contagem de H;
- identificação de carbonos terminais;
- base para render e validação.

### Patch 4 — Ponte com `openchemlib`

Arquivos:

- `lib/builder/chemistry/engine-interop.ts`
- `lib/builder/layout/branched-layout.ts`

Saída:

- conversão do estado para a engine;
- obtenção de coordenadas 2D de carbonos;
- fallback controlado.

### Patch 5 — Render model

Arquivos:

- `lib/builder/layout/hydrogen-layout.ts`
- `lib/builder/layout/branched-render-model.ts`

Saída:

- render model final com H explícito;
- ligações C-H derivadas;
- geometria consumível por `SVG`.

### Patch 6 — Testes do núcleo

Arquivos:

- `tests/unit/builder/branched-operations.test.ts`
- `tests/unit/builder/branched-hydrogens.test.ts`
- `tests/unit/builder/branched-layout.test.ts`
- `tests/unit/builder/branched-signature.test.ts`

Saída:

- cobertura do núcleo antes da UI.

---

## 11. O que ainda não entra na Fase 1

- troca da UI principal da fase;
- alteração do submit real;
- persistência de `branched_v2` em tentativas oficiais;
- remoção da mesa antiga;
- mudança do tutorial;
- mudança da progressão do capítulo.

---

## 12. Risco de implementação observado

O maior risco técnico imediato não é a renderização SVG.

É este trio:

- definir um estado editável pequeno o bastante para o jogo;
- integrar a engine sem espalhar dependência pelo código inteiro;
- distinguir claramente o que é grafo editável e o que é projeção de render com hidrogênios explícitos.

Se essas fronteiras forem respeitadas, a implementação tende a permanecer controlável.
