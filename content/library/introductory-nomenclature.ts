import type { LibraryBook } from "@/lib/content/types";

export const introductoryNomenclatureBook: LibraryBook = {
  id: "nomenclatura-introdutoria",
  title: "Nomenclatura introdutória",
  subtitle: "Como reconhecer nomes básicos no repertório do MVP",
  shortDescription:
    "Guia enxuto para relacionar quantidade de carbonos, tipo de ligação e nomes simples usados no Capítulo I.",
  coreTopics: [
    "prefixos básicos",
    "alcano e alceno",
    "nome, fórmula e estrutura",
    "reconhecimento do repertório",
  ],
  sections: [
    {
      id: "prefixos-iniciais",
      title: "Prefixos associados ao número de carbonos",
      summary: "Os prefixos ajudam a identificar quantos carbonos aparecem na estrutura principal.",
      blocks: [
        {
          type: "bullets",
          title: "Prefixos do repertório atual",
          items: [
            "met-: 1 carbono",
            "et-: 2 carbonos",
            "prop-: 3 carbonos",
            "but-: 4 carbonos",
          ],
        },
        {
          type: "example",
          title: "Exemplo rápido",
          prompt: "O que o início de 'propano' indica?",
          explanation:
            "O prefixo 'prop-' indica que a cadeia principal tem 3 carbonos.",
        },
      ],
    },
    {
      id: "terminacoes-principais",
      title: "Como a terminação ajuda a leitura",
      summary: "No MVP, a terminação já orienta parte importante da classificação.",
      blocks: [
        {
          type: "comparison",
          title: "Terminações principais",
          items: [
            {
              label: "-ano",
              description:
                "Indica, nesse repertório introdutório, hidrocarboneto saturado com ligações simples na cadeia principal.",
            },
            {
              label: "-eno",
              description:
                "Indica, nesse repertório introdutório, hidrocarboneto com ligação dupla na cadeia principal.",
            },
            {
              label: "aromático",
              description:
                "No caso do benzeno, a leitura não é tratada como simples alceno; ele aparece como estrutura aromática introdutória.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Confusão comum",
          content:
            "Nem toda presença de ligações especiais deve ser tratada como se fosse apenas um 'alceno maior'. O benzeno é trabalhado separadamente por causa da aromaticidade.",
        },
      ],
    },
    {
      id: "nome-formula-estrutura",
      title: "Relacionando nome, fórmula molecular e fórmula estrutural",
      summary: "Ler bem uma molécula exige cruzar mais de uma representação.",
      blocks: [
        {
          type: "paragraph",
          content:
            "O nome indica uma leitura sistemática básica. A fórmula molecular mostra quantos átomos aparecem no total. A fórmula estrutural resumida mostra como os carbonos se conectam.",
        },
        {
          type: "comparison",
          title: "Exemplos do capítulo",
          items: [
            {
              label: "Etano",
              description: "Nome: etano · Fórmula molecular: C2H6 · Estrutural resumida: CH3-CH3.",
            },
            {
              label: "Eteno",
              description: "Nome: eteno · Fórmula molecular: C2H4 · Estrutural resumida: CH2=CH2.",
            },
            {
              label: "Propano",
              description: "Nome: propano · Fórmula molecular: C3H8 · Estrutural resumida: CH3-CH2-CH3.",
            },
          ],
        },
      ],
    },
    {
      id: "reconhecimento-rapido",
      title: "Como reconhecer mais rápido durante a fase",
      summary: "Em vez de decorar isoladamente, use pistas combinadas.",
      blocks: [
        {
          type: "bullets",
          title: "Estratégia de leitura",
          items: [
            "Olhe primeiro para quantos carbonos a estrutura sugere.",
            "Depois verifique se há só ligações simples ou se aparece ligação dupla.",
            "Use o nome da carta para confirmar sua leitura, e não como único critério.",
          ],
        },
        {
          type: "callout",
          tone: "success",
          title: "Conexão com o jogo",
          content:
            "Essa combinação ajuda quando você precisa comparar cartas rapidamente e decidir qual molécula é mais adequada ao desafio da fase.",
        },
      ],
    },
  ],
};
