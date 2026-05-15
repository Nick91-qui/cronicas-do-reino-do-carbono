import type { LibraryBook } from "@/lib/content/types";

export const introductoryOrganicFunctionsBook: LibraryBook = {
  id: "funcoes-organicas-introdutorias",
  title: "Funções orgânicas introdutórias",
  subtitle: "Uma ponte para além dos hidrocarbonetos",
  shortDescription:
    "Visao preparatoria sobre o que sao funcoes organicas e como elas ampliam o estudo alem dos hidrocarbonetos estudados agora.",
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
      summary: "Os hidrocarbonetos sao o primeiro grupo estudado aqui e servem como porta de entrada para o estudo de organica.",
      blocks: [
        {
          type: "comparison",
          title: "O que estamos estudando agora",
          items: [
            {
              label: "Hidrocarbonetos",
              description:
                "Sao compostos formados apenas por carbono e hidrogenio nas primeiras leituras deste percurso.",
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
            "Este livro amplia sua visao e mostra que a quimica organica vai alem dos hidrocarbonetos.",
        },
      ],
    },
    {
      id: "por-que-aprender-isso-ja",
      title: "Por que antecipar essa ideia agora",
      summary: "Mesmo antes de estudar novos conteudos, e util entender que a quimica organica e maior do que as moleculas vistas ate aqui.",
      blocks: [
        {
          type: "paragraph",
          content:
            "Ao perceber que os hidrocarbonetos sao apenas uma parte do universo da quimica organica, o estudante entende melhor como as classificacoes se conectam a um estudo mais amplo.",
        },
        {
          type: "bullets",
          title: "Ganhos pedagógicos",
          items: [
            "Ajuda a perceber que ainda existem muitas outras familias de compostos para estudar.",
            "Prepara voce para estudos mais avancados.",
            "Ajuda a organizar mentalmente o conteúdo por famílias.",
          ],
        },
      ],
    },
    {
      id: "ponte-para-expansao",
      title: "Um passo alem",
      summary: "Outras familias podem ser estudadas depois sem perder a base que voce ja construiu.",
      blocks: [
        {
          type: "example",
          title: "Leitura de continuidade",
          prompt: "O que muda quando comecamos a estudar outras familias de compostos?",
          explanation:
            "A base sobre cadeias, ligacoes e identificacao estrutural continua util, mas novas familias exigem observar outros padroes e novas relacoes entre estrutura e propriedade.",
        },
        {
          type: "callout",
          tone: "success",
          title: "Como aproveitar este livro",
          content:
            "Trate este conteudo como uma preparacao conceitual curta para ampliar sua compreensao do conteudo.",
        },
      ],
    },
  ],
};
