# Modelo de Conteúdo

## Objetivo deste documento

Este documento define o modelo oficial de conteúdo do MVP de **Crônicas do Reino do Carbono**. Seu objetivo é padronizar as estruturas de dados que representam conteúdo jogável, reduzindo ambiguidades entre design, pedagogia e implementação.

Ele deve funcionar como referência para:

- ids oficiais
- enums e classificações
- propriedades clicáveis
- atributos das cartas
- estrutura de moléculas
- estrutura de fases
- estrutura de recompensas
- estrutura lógica do inventário
- estrutura de submissão e resultado

## Convenções gerais

### Idioma técnico

Os campos técnicos do modelo usam **inglês**, para facilitar integração com o código e manter consistência com a implementação.

### Idioma de exibição

Os textos visíveis ao jogador permanecem em português.

### Fonte oficial de conteúdo

No MVP, o conteúdo estático do jogo será mantido em arquivos locais do projeto, e não no banco de dados.

## IDs oficiais

### IDs de moléculas

Os ids oficiais de moléculas do Capítulo I são:

- `metano`
- `etano`
- `propano`
- `eteno`
- `propeno`
- `buteno`
- `benzeno`

### IDs de fragmentos

Os ids oficiais de fragmentos estruturais são:

- `ligacao_simples`
- `ligacao_dupla`
- `estrutura_aromatica`

### IDs de fases

O padrão oficial para ids de fase é:

- `chapter-1-phase-1`
- `chapter-1-phase-2`
- `chapter-1-phase-3`
- `chapter-1-phase-4`
- `chapter-1-phase-5`
- `chapter-1-phase-6`
- `chapter-1-phase-7`
- `chapter-1-phase-8`

### IDs de capítulos

```ts
type ChapterId = "chapter-1";
```

## Enums oficiais

### PhaseType

```ts
type PhaseType =
  | "construction"
  | "choice"
  | "construction_choice";
```

### QualitativeResult

```ts
type QualitativeResult =
  | "excellent"
  | "adequate"
  | "inadequate";
```

### ValidationResult

```ts
type ValidationResult =
  | "correct"
  | "incorrect";
```

### ChemicalClass

```ts
type ChemicalClass =
  | "alcano"
  | "alceno"
  | "aromatico";
```

### BondType

```ts
type BondType =
  | "single"
  | "double"
  | "aromatic";
```

## Relação entre qualitativo e validação interna

O sistema opera com duas camadas de resultado:

### Resultado qualitativo visível

- `excellent`
- `adequate`
- `inadequate`

### Resultado interno para progressão

- `correct`
- `incorrect`

### Mapeamento oficial

```ts
type QualitativeToValidationMap = {
  excellent: "correct";
  adequate: "correct";
  inadequate: "incorrect";
};
```

## Pontuação oficial

Cada fase corresponde a um desafio principal e segue esta escala:

```ts
type ScoreByResult = {
  excellent: 3;
  adequate: 2;
  inadequate: 0;
};
```

### Regras

- apenas respostas corretas avançam
- respostas incorretas não pontuam
- a pontuação total do capítulo é a soma da pontuação das fases concluídas

## Propriedades clicáveis oficiais

As propriedades clicáveis são as opções selecionáveis pelo jogador ao justificar sua escolha.

```ts
type SelectableProperty =
  | "saturada"
  | "insaturada"
  | "aromatica"
  | "aberta"
  | "fechada"
  | "homogenea"
  | "normal"
  | "baixa_polaridade"
  | "alta_volatilidade"
  | "alto_potencial_energetico"
  | "alta_reatividade"
  | "util_como_combustivel"
  | "util_como_precursor_de_transformacao"
  | "util_para_polimeros"
  | "estabilidade_especial"
  | "adequada_para_meio_apolar"
  | "cadeia_curta";
```

### Regras de uso

- o jogador não digita texto livre
- o jogador seleciona entre 1 e 3 propriedades
- as opções são fixas e controladas pelo sistema
- cada fase define quais propriedades são esperadas em seu contexto

## Atributos numéricos das cartas

Os atributos das cartas são independentes das propriedades clicáveis. Eles servem para comparação, leitura pedagógica e apoio à decisão.

### Escala oficial

Todos os atributos usam escala de 1 a 5.

### Estrutura oficial

```ts
type MoleculeAttributes = {
  polaridade: 1 | 2 | 3 | 4 | 5;
  potencialEnergetico: 1 | 2 | 3 | 4 | 5;
  reatividade: 1 | 2 | 3 | 4 | 5;
  estabilidade: 1 | 2 | 3 | 4 | 5;
  caraterAcidoBasico: 1 | 2 | 3 | 4 | 5;
  interacaoBiologica: 1 | 2 | 3 | 4 | 5;
  volatilidade: 1 | 2 | 3 | 4 | 5;
};
```

### Regra de consistência

Toda molécula do MVP deve ter todos os atributos preenchidos na mesma escala.

## Modelo oficial de molécula

```ts
type Molecule = {
  id: string;
  nomeQuimico: string;
  nomeEpico: string;
  formulaMolecular: string;
  formulaEstrutural: string;
  classe: ChemicalClass;
  carbonos: number;
  tipoDeLigacao: BondType;
  atributos: MoleculeAttributes;
  propriedades: SelectableProperty[];
  descricaoCurta: string;
  pontosFortes: string[];
  limitacoes: string[];
};
```

### Regras para moléculas

#### Fórmula molecular

O campo `formulaMolecular` usa texto simples.

Exemplos:

- `CH4`
- `C2H6`
- `C2H4`
- `C6H6`

#### Fórmula estrutural

O campo `formulaEstrutural` também usa texto simples padronizado.

Exemplos:

- `CH4`
- `CH3-CH3`
- `CH2=CH2`
- `C6H6 (anel aromático)`

#### Classe química

Cada molécula do MVP deve pertencer a uma classe oficial:

- `alcano`
- `alceno`
- `aromatico`

#### Tipo de ligação

Cada molécula do MVP deve usar um tipo estrutural principal:

- `single`
- `double`
- `aromatic`

### Exemplo de molécula

```ts
const metano: Molecule = {
  id: "metano",
  nomeQuimico: "Metano",
  nomeEpico: "O Primeiro Sopro",
  formulaMolecular: "CH4",
  formulaEstrutural: "CH4",
  classe: "alcano",
  carbonos: 1,
  tipoDeLigacao: "single",
  atributos: {
    polaridade: 1,
    potencialEnergetico: 4,
    reatividade: 1,
    estabilidade: 4,
    caraterAcidoBasico: 1,
    interacaoBiologica: 2,
    volatilidade: 5,
  },
  propriedades: [
    "saturada",
    "aberta",
    "homogenea",
    "normal",
    "baixa_polaridade",
    "alta_volatilidade",
    "cadeia_curta",
    "util_como_combustivel",
  ],
  descricaoCurta: "A menor e mais simples molécula orgânica da jornada.",
  pontosFortes: [
    "estrutura simples",
    "alta volatilidade",
    "boa introdução à tetravalência do carbono",
  ],
  limitacoes: [
    "baixa reatividade",
    "baixa versatilidade estrutural",
  ],
};
```

## Modelo oficial de recursos de fase

```ts
type PhaseResources = {
  carbonAvailable: number;
  hydrogenMode: "implicit_infinite";
  availableFragments: string[];
  supportCards: string[];
};
```

### Regra de hidrogênio

No MVP, o hidrogênio é tratado como recurso implícito e infinito.

Ele:

- pode aparecer visualmente
- pode possuir carta de apoio
- não precisa ser controlado como recurso escasso

## Modelo oficial de recompensa

```ts
type Reward = {
  carbon?: number;
  fragments?: string[];
  unlockedMolecule?: string;
  unlockedTitle?: string;
};
```

### Regra

O MVP não precisa modelar recompensa de hidrogênio, pois o hidrogênio é implícito e infinito.

## Modelo oficial de feedback

```ts
type PhaseFeedback = {
  excellent: string;
  adequate?: string;
  inadequate: string;
};
```

## Modelo oficial de fase

```ts
type Phase = {
  id: string;
  chapterId: ChapterId;
  number: number;
  title: string;
  coreConcept: string;
  technicalType: PhaseType;
  displayType: string;
  narrative: string;
  objective: string;
  resources: PhaseResources;
  availableMolecules: string[];
  excellentAnswer: string;
  adequateAnswers: string[];
  expectedProperties: SelectableProperty[];
  pedagogicalNotes: string[];
  rewards: Reward;
  feedback: PhaseFeedback;
  score: {
    excellent: 3;
    adequate: 2;
    inadequate: 0;
  };
};
```

### Regras para fases

#### `availableMolecules`

Lista as moléculas que podem participar daquela fase, seja por construção, escolha ou consulta.

#### `excellentAnswer`

Define a resposta ideal do desafio.

#### `adequateAnswers`

Define respostas aceitáveis que continuam sendo tratadas como `correct`.

#### `expectedProperties`

Define as propriedades mais relevantes para justificar a resposta da fase.

#### `pedagogicalNotes`

Campo de apoio interno para design, análise pedagógica e documentação.

### Exemplo de fase

```ts
const chapter1phase3: Phase = {
  id: "chapter-1-phase-3",
  chapterId: "chapter-1",
  number: 3,
  title: "A Tocha do Portão Norte",
  coreConcept: "Hidrocarbonetos como combustíveis",
  technicalType: "construction_choice",
  displayType: "Construção + escolha",
  narrative:
    "Diante de uma tocha ancestral, o jogador precisa identificar qual das cadeias disponíveis melhor sustenta a chama.",
  objective:
    "Construir e escolher a molécula mais adequada para alimentar a Tocha do Portão Norte.",
  resources: {
    carbonAvailable: 3,
    hydrogenMode: "implicit_infinite",
    availableFragments: ["ligacao_simples"],
    supportCards: [],
  },
  availableMolecules: ["metano", "etano", "propano"],
  excellentAnswer: "propano",
  adequateAnswers: ["metano", "etano"],
  expectedProperties: [
    "saturada",
    "aberta",
    "homogenea",
    "normal",
    "baixa_polaridade",
    "alto_potencial_energetico",
    "util_como_combustivel",
  ],
  pedagogicalNotes: [
    "Propano é a resposta ideal.",
    "Metano e etano continuam corretos como combustíveis, mas são menos representativos.",
  ],
  rewards: {
    carbon: 1,
    unlockedMolecule: "propano",
    unlockedTitle: "Forjador de Cadeias",
  },
  feedback: {
    excellent:
      "Excelente escolha. O Propano representa muito bem o uso energético dos hidrocarbonetos.",
    adequate:
      "Boa escolha. Sua molécula também funciona como combustível, mas existe uma opção ainda mais representativa.",
    inadequate:
      "Essa molécula não é a melhor resposta para o desafio da tocha.",
  },
  score: {
    excellent: 3,
    adequate: 2,
    inadequate: 0,
  },
};
```

## Modelo lógico do inventário

O inventário faz parte do gameplay do MVP e precisa de estrutura lógica clara.

```ts
type PlayerInventory = {
  carbonAvailable: number;
  hydrogenMode: "implicit_infinite";
  unlockedFragments: string[];
  unlockedMolecules: string[];
  unlockedTitles: string[];
};
```

### Regras do inventário

#### Carbono

O carbono é um recurso progressivo e relevante no avanço do capítulo.

#### Hidrogênio

O hidrogênio é implícito, infinito e não escasso.

#### Fragmentos

Fragmentos representam novas possibilidades estruturais e têm função real no sistema.

Exemplos:

- `ligacao_simples`
- `ligacao_dupla`
- `estrutura_aromatica`

#### Estrutura aromática

A estrutura aromática é modelada de duas formas:

- como fragmento desbloqueável
- como tipo estrutural especial disponível na oficina

## Modelo de submissão da fase

```ts
type PhaseSubmission = {
  phaseId: string;
  selectedMoleculeId: string;
  selectedProperties: SelectableProperty[];
};
```

### Regras de submissão

- não há texto livre
- a justificativa é feita por seleção
- o jogador escolhe entre 1 e 3 propriedades
- a submissão sempre associa molécula e propriedades

## Modelo de resultado da fase

```ts
type PhaseResult = {
  qualitativeResult: QualitativeResult;
  validationResult: ValidationResult;
  scoreAwarded: 0 | 2 | 3;
};
```

### Interpretação oficial do resultado

- `excellent` -> `correct` -> 3 pontos
- `adequate` -> `correct` -> 2 pontos
- `inadequate` -> `incorrect` -> 0 pontos

## Diretriz final de modelagem

Sempre que houver dúvida entre tipos de dado, aplicar a seguinte distinção:

### Atributo de carta

Serve para leitura, comparação e apoio visual.

### Propriedade clicável

Serve para justificar a escolha do jogador.

### Recurso de inventário

Serve para limitar ou ampliar possibilidades de construção.

### Nota pedagógica

Serve para documentação e mediação, não necessariamente para exibição na interface.
