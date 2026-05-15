# Biblioteca Pedagógica

## Objetivo do documento

Este documento define a Biblioteca Pedagógica oficial do MVP de **Crônicas do Reino do Carbono**.

Seu papel é alinhar:

- o papel da biblioteca dentro do produto;
- a regra de acesso dos livros;
- o formato oficial dos livros no MVP;
- a estrutura de conteúdo esperada;
- os critérios de legibilidade e uso em mobile.

## Papel da biblioteca no MVP

A Biblioteca Pedagógica é uma área protegida de apoio ao estudo dentro do jogo.

Ela existe para:

- reforçar conceitos básicos de química orgânica;
- apoiar revisão rápida antes, durante ou depois das fases;
- oferecer leitura guiada sem depender apenas de cartas e feedbacks curtos;
- ampliar o valor pedagógico do MVP sem alterar o loop oficial de fases.

No MVP, a biblioteca **não** substitui:

- o capítulo jogável;
- a coleção de cartas;
- o feedback das fases;
- o guia do professor.

Ela funciona como material de apoio consultável pelo jogador.

## Regra oficial de acesso

No MVP:

- a Biblioteca é acessível apenas para jogador autenticado;
- os livros ficam disponíveis desde o primeiro acesso;
- os livros não dependem de desbloqueio por progresso;
- a leitura da biblioteca não altera pontuação, inventário ou progressão;
- o banco de dados não é fonte de verdade para o conteúdo dos livros.

### Interpretação prática

O jogador pode usar a biblioteca:

- antes de iniciar uma fase;
- no meio da campanha;
- após errar uma fase;
- como revisão independente.

Essa decisão foi tomada para manter a biblioteca como apoio pedagógico livre, e não como recompensa bloqueada.

## Catálogo inicial oficial do MVP

O MVP deve incluir, no mínimo, os seguintes livros:

1. **Características do carbono e das cadeias**
2. **Nomenclatura introdutória**
3. **Funções orgânicas introdutórias**

### Escopo esperado de cada livro

#### 1. Características do carbono e das cadeias

Deve cobrir, no mínimo:

- tetravalência do carbono;
- formação de cadeias carbônicas;
- cadeias abertas e fechadas;
- saturação e insaturação;
- noção de homogeneidade;
- relação básica entre estrutura e propriedades introdutórias.

#### 2. Nomenclatura introdutória

Deve cobrir, no mínimo:

- leitura inicial de prefixos associados ao número de carbonos;
- diferença entre alcano, alceno e aromático no nível do MVP;
- reconhecimento de nomes simples do repertório trabalhado no jogo;
- associação entre nome, fórmula molecular e fórmula estrutural resumida.

#### 3. Funções orgânicas introdutórias

Deve cobrir, no mínimo:

- o que significa função orgânica em nível introdutório;
- distinção entre hidrocarbonetos e funções orgânicas mais amplas;
- visão preparatória para evolução futura do jogo;
- exemplos simples que não entrem em conflito com o escopo atual do Capítulo I.

### Observação de escopo

O terceiro livro pode introduzir funções orgânicas como ponte para expansão futura, mas não deve redefinir o escopo jogável atual do MVP.

Se houver conflito entre esse livro e o Capítulo I oficial, prevalecem:

1. `docs/tech/technical-spec.md`
2. `docs/design/content-model.md`
3. `docs/design/phases.md`

## Relação com as demais superfícies

### Biblioteca vs coleção

- a coleção continua sendo o espaço de cartas e progresso;
- a biblioteca continua sendo o espaço de estudo conceitual;
- `grimório` deve permanecer associado às cartas, e não aos livros.

### Biblioteca vs fase

- a fase continua centrada em desafio, decisão e feedback;
- a biblioteca pode ser referenciada como apoio, mas não deve interromper o loop central obrigatoriamente;
- o jogador pode consultar os livros sem perder o sentido de campanha.

### Biblioteca vs guia do professor

- a biblioteca é voltada ao jogador;
- o guia do professor continua voltado à mediação pedagógica adulta.

## Formato oficial dos livros no MVP

Os livros do MVP devem ser implementados como conteúdo vivo renderizado por código.

Eles **não** devem ser:

- PDF embutido;
- imagem longa com texto achatado;
- simulação de livro físico com paginação rígida;
- interface que dependa de gesto complexo para leitura.

### Modelo de leitura oficial

O livro deve ser montado como:

- um leitor imersivo de tela ampla;
- com uma seção ou página por vez;
- com blocos visuais reutilizáveis;
- com navegação lateral clara entre esquerda e direita.

### Estrutura recomendada da página de livro

Cada livro deve conter:

1. cabeçalho do livro
2. resumo introdutório curto
3. sumário simples de seções
4. seções de conteúdo
5. blocos de exemplo, destaque ou comparação quando útil

## Regra de montagem mobile-first

Como prioridade oficial, os livros devem ser pensados primeiro para **mobile**.

Isso significa:

- largura estreita como caso principal;
- leitura por páginas ou seções individualizadas;
- parágrafos curtos;
- blocos com respiro claro entre si;
- títulos e subtítulos bem separados;
- listas simples em vez de texto corrido excessivo;
- comparações renderizadas em cartões empilhados, e não em tabelas largas;
- linguagem visual consistente com o restante do jogo, mas sem sacrificar legibilidade.

### O que evitar no mobile

Evitar, no MVP:

- colunas múltiplas como estrutura principal do livro;
- tabelas largas como forma principal de comparação;
- blocos muito longos sem quebra;
- ornamentação que reduza contraste ou compressa a área útil de leitura;
- dependência de rolagem vertical contínua para consumir o núcleo do conteúdo;
- excesso de interações ocultas para revelar conteúdo essencial.

## Estrutura de conteúdo recomendada

O conteúdo dos livros deve ser dividido em seções curtas.

Cada seção pode usar blocos como:

- texto introdutório;
- lista de pontos-chave;
- exemplo guiado;
- alerta de confusão comum;
- comparação curta;
- conexão com o jogo.

### Regra editorial

Cada bloco deve responder a uma ideia principal.

Se uma explicação ficar longa demais para leitura confortável em celular, ela deve ser quebrada em novos blocos ou novas seções.

### Regra de paginação

Se uma seção ficar densa demais para caber com conforto em uma única tela de leitura, ela deve ser dividida em novas páginas internas ou em novas seções curtas.

## Modelo de dados recomendado

```ts
type LibraryBookId =
  | "caracteristicas-do-carbono-e-das-cadeias"
  | "nomenclatura-introdutoria"
  | "funcoes-organicas-introdutorias";

type LibraryContentBlock =
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "bullets";
      title?: string;
      items: string[];
    }
  | {
      type: "callout";
      tone: "info" | "warning" | "success";
      title: string;
      content: string;
    }
  | {
      type: "example";
      title: string;
      prompt?: string;
      explanation: string;
    }
  | {
      type: "comparison";
      title: string;
      items: Array<{
        label: string;
        description: string;
      }>;
    };

type LibrarySection = {
  id: string;
  title: string;
  summary?: string;
  blocks: LibraryContentBlock[];
};

type LibraryBook = {
  id: LibraryBookId;
  title: string;
  subtitle?: string;
  shortDescription: string;
  coreTopics: string[];
  sections: LibrarySection[];
};
```

### Regras

- o conteúdo deve continuar versionado em arquivos locais;
- o conteúdo deve ser tipado;
- o conteúdo deve ser renderizável sem depender de HTML arbitrário vindo de fora;
- o shape deve favorecer composição simples em React e leitura paginada estável em mobile.

## Critérios de sucesso da Biblioteca no MVP

A Biblioteca pode ser considerada corretamente definida no MVP quando:

- existir como área protegida própria;
- os 3 livros iniciais estiverem acessíveis desde o primeiro login;
- a leitura for confortável em celular;
- o conteúdo não depender de assets achatados para funcionar;
- a biblioteca ampliar apoio pedagógico sem confundir seu papel com o das cartas ou das fases.
