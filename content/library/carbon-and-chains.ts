import type { LibraryBook } from "@/lib/content/types";

export const carbonAndChainsBook: LibraryBook = {
  id: "caracteristicas-do-carbono-e-das-cadeias",
  title: "Características do carbono e das cadeias",
  subtitle: "A base estrutural da jornada orgânica",
  shortDescription:
    "Revisão curta sobre tetravalência, formação de cadeias e diferenças introdutórias entre tipos de estrutura.",
  coreTopics: [
    "tetravalência",
    "cadeias abertas e fechadas",
    "saturação e insaturação",
    "homogeneidade",
  ],
  sections: [
    {
      id: "papel-do-carbono",
      title: "Por que o carbono ocupa o centro do jogo",
      summary: "O carbono forma muitas estruturas porque consegue fazer quatro ligações.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Na química orgânica introdutória, o carbono aparece como elemento central porque consegue se ligar várias vezes de modo estável. Essa capacidade permite formar cadeias, anéis e diferentes padrões estruturais.",
        },
        {
          type: "bullets",
          title: "Ideias-chave",
          items: [
            "O carbono é tetravalente: tende a completar quatro ligações.",
            "Essas ligações podem ser com hidrogênio ou com outros átomos de carbono.",
            "A forma como os carbonos se conectam muda o comportamento da molécula.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Conexão com o jogo",
          content:
            "No laboratório de síntese, estruturas inválidas costumam falhar justamente porque o arranjo não respeita essa lógica básica de ligações do carbono.",
        },
      ],
    },
    {
      id: "cadeias-carbonicas",
      title: "Como as cadeias carbônicas se formam",
      summary: "Quando carbonos se ligam entre si, a molécula deixa de ser apenas um átomo isolado e passa a formar uma cadeia.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Ao ligar um carbono a outro, a molécula cresce. Esse crescimento altera tamanho, forma e muitas vezes as propriedades observadas no desafio.",
        },
        {
          type: "comparison",
          title: "Comparação inicial",
          items: [
            {
              label: "Cadeia curta",
              description:
                "Tende a ser mais simples de reconhecer e, em vários casos introdutórios, pode estar associada a maior volatilidade.",
            },
            {
              label: "Cadeia maior",
              description:
                "Aumenta a massa da estrutura e pode mudar a forma como a molécula se comporta em comparação com moléculas menores.",
            },
          ],
        },
        {
          type: "example",
          title: "Exemplo do capítulo",
          prompt: "Metano, etano e propano pertencem à mesma família?",
          explanation:
            "Sim. Os três são hidrocarbonetos saturados da família dos alcanos. O que muda entre eles é o número de carbonos na cadeia.",
        },
      ],
    },
    {
      id: "abertas-fechadas-saturadas",
      title: "Cadeias abertas, fechadas, saturadas e insaturadas",
      summary: "Essas classificações ajudam a descrever a estrutura principal da molécula.",
      blocks: [
        {
          type: "comparison",
          title: "Classificações básicas",
          items: [
            {
              label: "Aberta",
              description:
                "A sequência principal de carbonos não forma um ciclo. É a leitura mais comum nas primeiras moléculas do capítulo.",
            },
            {
              label: "Fechada",
              description:
                "A sequência principal forma um ciclo. No Capítulo I, isso aparece na leitura introdutória do benzeno.",
            },
            {
              label: "Saturada",
              description:
                "A estrutura principal não apresenta ligação dupla ou tripla entre carbonos.",
            },
            {
              label: "Insaturada",
              description:
                "A estrutura principal apresenta ao menos uma ligação múltipla entre carbonos, como a dupla.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Confusão comum",
          content:
            "Uma molécula maior não é automaticamente insaturada. Tamanho da cadeia e tipo de ligação são critérios diferentes.",
        },
      ],
    },
    {
      id: "homogeneidade-e-leitura",
      title: "Homogeneidade e leitura estrutural",
      summary: "No repertório atual do jogo, as cadeias trabalhadas são homogêneas.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Quando a cadeia principal é formada apenas por carbonos entre os elementos da sequência estrutural considerada, ela é descrita como homogênea nesse nível introdutório.",
        },
        {
          type: "bullets",
          title: "Para guardar",
          items: [
            "No Capítulo I, o foco está em hidrocarbonetos.",
            "Isso ajuda a manter a leitura estrutural mais controlada no início da campanha.",
            "Mais adiante, outras funções orgânicas podem ampliar essa leitura.",
          ],
        },
      ],
    },
  ],
};
