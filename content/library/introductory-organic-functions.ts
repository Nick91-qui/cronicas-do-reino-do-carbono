import type { LibraryBook } from "@/lib/content/types";

export const introductoryOrganicFunctionsBook: LibraryBook = {
  id: "funcoes-organicas-introdutorias",
  title: "Funções orgânicas introdutórias",
  subtitle: "Uma ponte para além dos hidrocarbonetos",
  shortDescription:
    "Visão preparatória sobre o que são funções orgânicas e como elas ampliam o estudo além do repertório atual do Capítulo I.",
  coreTopics: [
    "ideia de função orgânica",
    "hidrocarbonetos",
    "expansão do repertório",
    "preparação futura",
  ],
  sections: [
    {
      id: "o-que-e-funcao-organica",
      title: "O que significa função orgânica",
      summary: "Função orgânica é uma forma de agrupar compostos por características estruturais relevantes.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Em nível introdutório, função orgânica ajuda a reconhecer famílias de substâncias que compartilham certos padrões estruturais e comportamentos químicos gerais.",
        },
        {
          type: "bullets",
          title: "Ideia central",
          items: [
            "Não se trata apenas do número de carbonos.",
            "A presença de certos grupos ou padrões muda a leitura da molécula.",
            "Essas diferenças ampliam o repertório além dos hidrocarbonetos.",
          ],
        },
      ],
    },
    {
      id: "onde-os-hidrocarbonetos-entram",
      title: "Onde os hidrocarbonetos entram nessa história",
      summary: "Os hidrocarbonetos são o foco atual do jogo e servem como porta de entrada para o estudo de orgânica.",
      blocks: [
        {
          type: "comparison",
          title: "Leitura do escopo atual",
          items: [
            {
              label: "Hidrocarbonetos",
              description:
                "São compostos formados apenas por carbono e hidrogênio no repertório introdutório do Capítulo I.",
            },
            {
              label: "Outras funções orgânicas",
              description:
                "Passam a envolver outros padrões estruturais e podem introduzir novos comportamentos e aplicações.",
            },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Importante",
          content:
            "Este livro prepara a leitura futura, mas não altera a regra oficial do Capítulo I, que continua centrado em hidrocarbonetos.",
        },
      ],
    },
    {
      id: "por-que-aprender-isso-ja",
      title: "Por que antecipar essa ideia agora",
      summary: "Mesmo antes de jogar novos capítulos, é útil entender que o repertório da orgânica é maior do que o conjunto atual de cartas.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Ao perceber que os hidrocarbonetos são apenas uma parte do universo da química orgânica, o estudante entende melhor que as classificações do jogo fazem parte de uma estrutura maior de estudo.",
        },
        {
          type: "bullets",
          title: "Ganhos pedagógicos",
          items: [
            "Evita tratar o repertório atual como se fosse toda a orgânica.",
            "Prepara a transição para capítulos futuros.",
            "Ajuda a organizar mentalmente o conteúdo por famílias.",
          ],
        },
      ],
    },
    {
      id: "ponte-para-expansao",
      title: "Ponte para expansões futuras",
      summary: "Novos capítulos podem introduzir famílias além dos hidrocarbonetos sem quebrar a base já construída.",
      blocks: [
        {
          type: "example",
          title: "Leitura de continuidade",
          prompt: "O que muda quando o jogo sair dos hidrocarbonetos?",
          explanation:
            "A base sobre cadeias, ligações e identificação estrutural continua útil, mas novas famílias exigem observar outros padrões e novas relações entre estrutura e propriedade.",
        },
        {
          type: "callout",
          tone: "success",
          title: "Como usar este livro no MVP",
          content:
            "Trate este conteúdo como preparação conceitual curta. Ele serve para ampliar horizonte, não para substituir o foco jogável atual.",
        },
      ],
    },
  ],
};
