import type { LibraryBook } from "@/lib/content/types";

export const carbonAndChainsBook: LibraryBook = {
  id: "caracteristicas-do-carbono-e-das-cadeias",
  title: "Características do carbono e das cadeias",
  subtitle: "A base estrutural da quimica organica",
  shortDescription:
    "Revisao curta sobre tetravalencia, formacao de cadeias, tipos de ligacao e diferencas introdutorias entre estruturas.",
  coreTopics: [
    "tetravalência",
    "cadeias abertas e fechadas",
    "saturação e insaturação",
    "homogeneidade",
    "ligacoes sigma e pi",
    "angulos de ligacao",
  ],
  sections: [
    {
      id: "papel-do-carbono",
      title: "Por que o carbono e tao importante",
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
          title: "Exemplo",
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
                "A sequencia principal forma um ciclo. Isso aparece, por exemplo, na leitura introdutoria do benzeno.",
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
      id: "sigma-e-pi",
      title: "Ligacoes sigma e pi",
      summary: "Nem toda ligacao entre atomos tem o mesmo papel estrutural. As ligacoes sigma formam a base da conexao, e as ligacoes pi aparecem nas ligacoes multiplas.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Em nivel introdutorio, voce pode pensar que toda ligacao simples entre atomos envolve uma ligacao sigma. Quando aparece uma ligacao dupla, ela combina uma ligacao sigma com uma ligacao pi. Numa ligacao tripla, ha uma sigma e duas pi.",
        },
        {
          type: "comparison",
          title: "Diferenca inicial",
          items: [
            {
              label: "Ligacao sigma",
              description:
                "E a ligacao principal entre dois atomos. Ela aparece em toda ligacao simples e tambem faz parte das ligacoes duplas e triplas.",
            },
            {
              label: "Ligacao pi",
              description:
                "Aparece apenas quando existe ligacao multipla. Ela reforca a conexao entre os atomos e altera propriedades da estrutura.",
            },
          ],
        },
        {
          type: "example",
          title: "Leitura rapida",
          prompt: "No eteno, quantas ligacoes sigma e pi existem entre os dois carbonos?",
          explanation:
            "Entre os dois carbonos do eteno existe uma ligacao dupla. Isso significa uma ligacao sigma e uma ligacao pi entre eles.",
        },
      ],
    },
    {
      id: "angulos-das-ligacoes",
      title: "Angulos das ligacoes",
      summary: "A posicao das ligacoes ao redor do carbono ajuda a definir a forma da molecula.",
      blocks: [
        {
          type: "paragraph",
          content:
            "O carbono nao liga seus atomos ao acaso. A distribuicao das ligacoes no espaco cria angulos caracteristicos, que ajudam a entender a geometria da estrutura.",
        },
        {
          type: "bullets",
          title: "Angulos mais comuns neste estudo",
          items: [
            "Carbono com quatro ligacoes simples: geometria tetraedrica, com angulos proximos de 109,5°.",
            "Carbono em ligacao dupla: geometria trigonal plana, com angulos proximos de 120°.",
            "Carbono em ligacao tripla: geometria linear, com angulo de 180°.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Por que isso importa",
          content:
            "Esses angulos ajudam a explicar por que uma molecula pode ser mais aberta, mais plana ou mais alinhada, mesmo quando o numero de carbonos parece parecido.",
        },
      ],
    },
    {
      id: "formulas-estruturais",
      title: "Exemplos com formulas estruturais",
      summary: "Observar a formula estrutural ajuda a perceber o tipo de ligacao e a forma geral da cadeia.",
      blocks: [
        {
          type: "comparison",
          title: "Exemplos iniciais",
          items: [
            {
              label: "Etano",
              description:
                "Formula estrutural resumida: CH3-CH3. Entre os carbonos ha uma ligacao simples, portanto apenas uma ligacao sigma.",
            },
            {
              label: "Eteno",
              description:
                "Formula estrutural resumida: CH2=CH2. Entre os carbonos ha uma ligacao dupla, formada por uma sigma e uma pi.",
            },
            {
              label: "Etino",
              description:
                "Formula estrutural resumida: CH≡CH. Entre os carbonos ha uma ligacao tripla, formada por uma sigma e duas pi.",
            },
          ],
        },
        {
          type: "example",
          title: "Comparando pela estrutura",
          prompt: "Qual dessas formulas mostra carbonos com geometria mais alinhada: CH3-CH3, CH2=CH2 ou CH≡CH?",
          explanation:
            "CH≡CH, porque a ligacao tripla esta associada a geometria linear no carbono, com angulo de 180°.",
        },
      ],
    },
    {
      id: "homogeneidade-e-leitura",
      title: "Homogeneidade e leitura estrutural",
      summary: "Neste momento, vamos observar cadeias homogeneas.",
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
            "Aqui, o foco esta nos hidrocarbonetos.",
            "Isso ajuda a manter a leitura estrutural mais controlada neste comeco de estudo.",
            "Mais adiante, outras funções orgânicas podem ampliar essa leitura.",
          ],
        },
      ],
    },
  ],
};
