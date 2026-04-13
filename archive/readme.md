# Crônicas do Reino do Carbono

**Crônicas do Reino do Carbono** é um jogo educacional em formato web que ensina química orgânica por meio de uma campanha narrativa, estratégica e progressiva. O jogador começa com moléculas simples, desbloqueia novas estruturas ao longo das fases e aprende a escolher a molécula mais adequada para cada desafio com base em propriedades químicas reais.

O projeto foi pensado para a 3ª série do Ensino Médio e combina aventura textual, construção molecular simplificada, cartas de moléculas, desafios contextuais e correção automática orientada por critérios pedagógicos.

## Visão geral

A proposta central do jogo é transformar conceitos introdutórios de química orgânica em uma jornada jogável. Em vez de receber apenas explicações expositivas, o aluno aprende durante a própria progressão:

- construindo moléculas respeitando regras químicas simplificadas
- comparando estruturas e propriedades
- escolhendo a molécula mais adequada para resolver um problema
- justificando a decisão por seleção de propriedades
- recebendo feedback imediato e recompensas de progresso

O tom do projeto mistura fantasia épica com linguagem científica, usando nomes narrativos para personagens, fases e moléculas sem perder a fidelidade conceitual.

## Objetivo pedagógico

A campanha inicial foi desenhada para introduzir fundamentos de química orgânica de forma gradual. Os conteúdos principais trabalhados são:

- tetravalência do carbono
- fórmula molecular e estabilidade estrutural
- crescimento da cadeia carbônica
- alcanos, alcenos, alcinos e aromaticidade introdutória
- saturação e insaturação
- polaridade muito baixa dos hidrocarbonetos
- volatilidade
- potencial energético
- reatividade
- aplicações reais de hidrocarbonetos

Ao final do primeiro capítulo, espera-se que o aluno consiga:

- montar moléculas simples respeitando valência
- distinguir alcano, alceno, alcino e aromático em nível introdutório
- relacionar tamanho da cadeia com volatilidade
- reconhecer hidrocarbonetos como compostos majoritariamente apolares
- associar insaturação com maior reatividade
- identificar alcenos como precursores de polímeros
- diferenciar aromaticidade de insaturação comum

## Loop central do jogo

O fluxo principal da experiência é:

1. O jogador recebe átomos, fragmentos estruturais ou pistas.
2. Usa esses recursos na oficina molecular para formar uma estrutura válida.
3. Desbloqueia a carta da molécula correspondente.
4. Entra em um desafio contextual dentro da narrativa.
5. Escolhe a molécula mais adequada para resolver o problema.
6. Justifica a escolha marcando propriedades relevantes.
7. Recebe feedback automático, pontuação e recompensas.
8. Avança para a fase seguinte.

## Regras químicas simplificadas

Para manter o MVP acessível sem sacrificar coerência, o sistema usa algumas regras base:

- carbono faz 4 ligações
- hidrogênio faz 1 ligação
- ligação simples caracteriza alcano
- ligação dupla caracteriza alceno
- ligação tripla caracteriza alcino
- anel aromático representa uma estrutura especial com estabilidade própria
- o sistema ajusta automaticamente o número de hidrogênios quando a estrutura é montada

Exemplos de síntese esperada:

- `1 C + 4 H -> CH4 (metano)`
- `2 C com ligação simples -> C2H6 (etano)`
- `2 C com ligação dupla -> C2H4 (eteno)`
- `6 C em anel aromático -> C6H6 (benzeno)`

## Sistema de atributos

As cartas e desafios usam uma escala de `1` a `5` para os atributos abaixo:

- polaridade
- potencial energético
- reatividade
- estabilidade
- caráter ácido-básico
- interação biológica
- volatilidade

Na campanha inicial, como o foco está em hidrocarbonetos, vários compostos compartilham baixa polaridade e caráter ácido-básico praticamente nulo. Isso é intencional e ajuda o aluno a perceber padrões dentro da família química.

## Sistema de justificativa e avaliação

A justificativa do jogador não depende de texto livre. Em vez disso, ele marca propriedades que sustentam sua escolha, como:

- cadeia curta
- cadeia média
- saturada
- insaturada
- aromática
- baixa polaridade
- alto potencial energético
- alta reatividade
- alta estabilidade
- alta volatilidade
- útil como combustível
- útil como precursor de transformação
- útil para polímeros
- adequada para meio apolar

Esse modelo facilita:

- correção automática
- uso em ambiente web
- avaliação objetiva do raciocínio químico
- análise pedagógica do desempenho do aluno

Sugestão de pontuação por fase:

- construção molecular: `0 a 3`
- escolha da molécula: `0 a 3`
- seleção de propriedades: `0 a 3`
- coerência geral: `0 a 1`

Total: `10 pontos por fase`

Rubrica qualitativa:

- excelente
- adequada
- parcial
- insuficiente

## Campanha inicial

O primeiro capítulo do jogo é:

**Capítulo I - A Ascensão dos Hidrocarbonetos**

Escopo do capítulo:

- duração estimada de 20 a 30 minutos
- foco em hidrocarbonetos
- progressão em 8 fases
- aumento gradual de complexidade conceitual e estratégica

### Fases do capítulo

1. **O Primeiro Sopro**
   Foco: tetravalência e construção do metano.

2. **A Ponte das Cadeias**
   Foco: ligação C-C e formação do etano.

3. **A Tocha do Portão Norte**
   Foco: comparação entre alcanos pequenos e potencial energético.

4. **O Véu dos Vapores**
   Foco: volatilidade e relação com o tamanho da cadeia.

5. **A Ruptura da Saturação**
   Foco: introdução da ligação dupla e construção do eteno.

6. **A Porta da Transformação**
   Foco: reatividade de alcenos e aplicação da insaturação.

7. **A Oficina dos Polímeros**
   Foco: uso de alcenos como precursores de polímeros.

8. **A Coroa Aromática**
   Foco: aromaticidade e reconhecimento do benzeno como caso especial.

### Progressão de desbloqueios

A árvore principal de síntese e desbloqueio prevista para o capítulo é:

- `Metano (CH4)`
- `Etano (C2H6)`
- `Propano (C3H8)`
- `Eteno (C2H4)`
- `Propeno (C3H6)`
- `Buteno (C4H8)`
- `Benzeno (C6H6)`

Moléculas adicionais já mapeadas para expansão da campanha inicial ou fases futuras:

- `Butano (C4H10)`
- `Pentano (C5H12)`
- `Etino (C2H2)`
- `Propino (C3H4)`

## Cartas da campanha inicial

As cartas de moléculas seguem uma estrutura padronizada com:

- nome épico e nome químico
- fórmula molecular
- fórmula estrutural simplificada
- classe química
- atributos em escala de 1 a 5
- descrição curta
- pontos fortes
- limitações
- aplicações ou gancho didático
- palavras-chave para seleção de propriedades

Moléculas já detalhadas nos materiais do projeto:

- Metano
- Etano
- Propano
- Butano
- Pentano
- Eteno
- Propeno
- Buteno
- Etino
- Propino
- Benzeno

## Identidade narrativa e front-end

O projeto já possui uma camada narrativa pensada para o site, incluindo:

- texto de abertura de cada fase
- missão principal
- frase de desafio
- mensagens de vitória excelente, adequada ou parcial
- encerramento do capítulo
- títulos de progressão

Exemplos de títulos já definidos:

- Centelha de Carbono
- Guardião do Metano
- Forjador de Cadeias
- O Volátil
- Arauto da Insaturação
- Mestre da Ruptura
- Artesão das Cadeias Vivas
- Arquiteto do Reino do Carbono

## Estrutura prevista do produto

### Telas principais

- tela inicial
- narrativa da fase
- recursos recebidos
- oficina molecular
- carta desbloqueada
- desafio
- justificativa por propriedades
- resultado e recompensa
- progresso do capítulo

### Funcionalidades mínimas do MVP

- entrar no jogo com nome
- visualizar a fase atual
- montar moléculas simples em uma oficina semilivre
- escolher moléculas para desafios
- selecionar propriedades como justificativa
- receber feedback automático
- acumular pontuação
- desbloquear cartas e novas fases
- salvar progresso

### Funcionalidades desejáveis

- tela de cartas desbloqueadas
- barra de progresso
- sistema de títulos
- resumo final da campanha

### Itens para depois do MVP

- ranking
- multiplayer
- editor químico completamente livre
- animações complexas
- dashboard pedagógico robusto
- feedback textual com IA

## Especificação tecnológica recomendada

A recomendação atual para o MVP é construir um **web app responsivo**.

### Stack sugerida

- **Front-end:** Next.js, React, TypeScript e Tailwind CSS
- **Back-end:** API Routes ou Server Actions do próprio Next.js
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** NextAuth ou autenticação simples por nome/código de sessão
- **Hospedagem:** Vercel + Neon Postgres

### Motivos da escolha

- uma única base para front-end e back-end
- iteração rápida
- baixo custo inicial
- boa experiência em notebook, tablet e celular
- facilidade de deploy
- escalabilidade para fases futuras

### Entidades principais do domínio

O modelo de dados sugerido contempla:

- `users`
- `player_progress`
- `inventory`
- `unlocked_molecules`
- `molecules`
- `phases`
- `player_phase_attempts`

### Estratégia de conteúdo

Para o MVP, a recomendação é começar com conteúdo hardcoded em `JSON`, `TypeScript` ou seed de banco, deixando um painel administrativo para uma fase posterior.

## Organização dos documentos do projeto

Os arquivos Markdown deste repositório cumprem papéis complementares:

- [`readme.md`](/home/nmoreira/Projetos/cronicas-do-carbono/readme.md): visão geral consolidada do projeto
- [`inicio_cronicas_do_carbono.md`](/home/nmoreira/Projetos/cronicas-do-carbono/inicio_cronicas_do_carbono.md): sistema-base, regras químicas, loop e expansão conceitual
- [`fases.md`](/home/nmoreira/Projetos/cronicas-do-carbono/fases.md): estrutura pedagógica das 8 fases, recompensas e árvore de desbloqueios
- [`fases_front-end.md`](/home/nmoreira/Projetos/cronicas-do-carbono/fases_front-end.md): textos narrativos e mensagens de interface para o site
- [`cartas.md`](/home/nmoreira/Projetos/cronicas-do-carbono/cartas.md): especificação das cartas e atributos das moléculas
- [`gabarito.md`](/home/nmoreira/Projetos/cronicas-do-carbono/gabarito.md): gabarito do professor, critérios de correção e rubrica pedagógica
- [`spec.md`](/home/nmoreira/Projetos/cronicas-do-carbono/spec.md): recomendação tecnológica para implementação do MVP

## Próximos passos sugeridos

Os materiais já permitem iniciar a implementação de um MVP. A ordem mais natural de execução é:

1. estruturar os dados de moléculas, fases e cartas
2. implementar a oficina molecular simplificada
3. montar o fluxo de desafio e justificativa por propriedades
4. adicionar correção automática e persistência de progresso
5. integrar a camada narrativa e as recompensas

## Status atual

O projeto já possui base suficiente para entrar em produção de MVP em quatro frentes paralelas:

- design do conteúdo pedagógico
- modelagem de dados
- implementação do jogo web
- elaboração do material de apoio ao professor

A campanha inicial está conceitualmente fechada, com capítulo, fases, cartas, critérios de avaliação e direção tecnológica definidos.
