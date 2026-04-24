# Especificação de Cartas

## Objetivo do documento

Este documento define a estrutura visual e técnica oficial das cartas de molécula do MVP.

Seu papel é alinhar:

- composição da carta;
- fronteira entre bitmap e conteúdo vivo;
- uso pedagógico da carta;
- campos mínimos obrigatórios;
- estados visuais e variações de renderização.

## Papel das cartas no MVP

As cartas são simultaneamente:

- recompensa de progresso;
- apoio pedagógico;
- ferramenta de comparação;
- interface de escolha estratégica.

A carta não é apenas decoração. Ela precisa continuar útil para leitura e decisão.

## Regra oficial de implementação

A carta deve ser construída como componente de UI com suporte a assets bitmap.

A implementação oficial não deve usar uma imagem única contendo toda a carta pronta com texto embutido.

## Modelo híbrido

### Shell visual

Pode ser bitmap ou composição gráfica reaproveitável:

- moldura;
- textura;
- brilho de borda;
- ornamentos fixos;
- área ilustrada.

### Conteúdo vivo

Deve ser renderizado por código:

- nome químico;
- nome épico;
- fórmula molecular;
- fórmula estrutural;
- atributos e barras;
- descrição curta;
- pontos fortes;
- limitações;
- propriedades destacadas;
- selos contextuais como desbloqueada, criada no laboratório de síntese ou selecionada.


## Modelo de dados visual da carta

A carta deve ser alimentada por um bloco visual acoplado à molécula.

### Estrutura recomendada

```ts
type MoleculeCardVisual = {
  assets: {
    artworkAsset: string;
    frameAsset: string;
    textureAsset?: string;
    iconAsset?: string;
  };
  accentFrom: string;
  accentTo: string;
  attributePalette: "hydrocarbon" | "alkene" | "aromatic";
  preferredLayout: "expanded" | "compact";
  stateVariants?: Partial<Record<
    "locked" | "unlocked" | "newly_created" | "selected" | "rewarded",
    {
      frameAsset?: string;
      textureAsset?: string;
      badgeLabel?: string;
    }
  >>;
};
```

### Regras

- `assets` define apenas decoração e arte;
- `accentFrom` e `accentTo` suportam gradientes vivos em CSS;
- `attributePalette` define a família visual das barras;
- `preferredLayout` indica se a carta nasce expandida ou compacta;
- `stateVariants` sobrescreve decoração visual por estado sem duplicar texto.

## Estrutura visual mínima

Cada carta de molécula deve conter:

1. cabeçalho
2. bloco de identificação química
3. área principal de arte
4. bloco de atributos
5. descrição curta
6. pontos fortes
7. limitações
8. propriedades resumidas

## Seções da carta

### 1. Cabeçalho

Deve exibir:

- nome químico;
- nome épico, quando aplicável;
- identificação visual clara da carta.

### 2. Identificação química

Deve exibir:

- fórmula molecular;
- fórmula estrutural resumida;
- classe química, quando fizer sentido.

### 3. Arte principal

Pode usar bitmap específico por molécula.

A arte principal deve:

- reforçar identidade da molécula;
- manter consistência com a direção visual do capítulo;
- não carregar texto essencial.

### 4. Atributos

Os atributos devem ser mostrados com barras, escala ou outro elemento comparável.

No MVP, os atributos devem permanecer sincronizados com os dados oficiais de conteúdo.

### 5. Descrição curta

Deve apresentar uma leitura breve e pedagógica da molécula.

### 6. Pontos fortes

Deve listar as principais forças pedagógicas ou estratégicas da molécula.

### 7. Limitações

Deve listar as principais limitações ou restrições de uso da molécula.

### 8. Propriedades resumidas

Pode exibir palavras-chave ou frases curtas derivadas do conteúdo oficial.

## Estados visuais da carta

Cada carta pode aparecer nos seguintes estados:

- bloqueada;
- desbloqueada;
- recém-criada;
- selecionável;
- selecionada;
- comparada;
- recompensada.

## Variações de layout

### Carta expandida

Usada em:

- tela de fase;
- coleção;
- momentos de recompensa.

### Carta resumida

Usada em:

- listas;
- comparação rápida;
- inventário;
- grade de coleção.

## Regras pedagógicas

A carta deve favorecer:

- reconhecimento da molécula;
- associação entre estrutura e propriedade;
- leitura comparativa;
- tomada de decisão guiada.

## Regras técnicas

### Responsividade

A carta deve continuar legível em múltiplas larguras.

### Internacionalização futura

Como os textos são vivos, a carta pode ser adaptada futuramente para outros idiomas sem recriar a arte.

### Acessibilidade

O conteúdo da carta deve permanecer acessível a leitores de tela e seleção de texto quando aplicável.

## Estrutura de assets recomendada

```text
public/
  visual/
    cards/
      frames/
      textures/
      art/
```

## Resultado esperado

A carta final deve ter aparência rica e memorável, mas continuar sendo uma interface baseada em dados e não uma imagem estática achatada.

## Exemplo de vínculo entre conteúdo e carta

```ts
visual: {
  assets: {
    artworkAsset: "/visual/cards/art/molecule-metano-main.png",
    frameAsset: "/visual/cards/frames/card-frame-common.png",
    textureAsset: "/visual/cards/textures/card-texture-paper-v1.png",
  },
  accentFrom: "#21d4fd",
  accentTo: "#b721ff",
  attributePalette: "hydrocarbon",
  preferredLayout: "expanded",
  stateVariants: {
    newly_created: { badgeLabel: "Sintetizada" },
    selected: { badgeLabel: "Selecionada" },
  },
}
```

Nesse modelo, a arte continua em bitmap, mas título, fórmulas, barras, listas e badges continuam vivos na interface.
