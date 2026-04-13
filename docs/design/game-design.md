# Design de Jogo

## Objetivo deste documento

Este documento define as regras oficiais de design do MVP de **Crônicas do Reino do Carbono**. Seu papel é consolidar os sistemas centrais do jogo, eliminando ambiguidades entre produto, conteúdo, interface e implementação.

O foco deste documento é o funcionamento do jogo, e não os detalhes narrativos, pedagógicos ou técnicos de implementação.

## Princípio central do gameplay

O jogo foi desenhado para ensinar química orgânica introdutória por meio de um ciclo em que o aluno:

- recebe um problema contextualizado;
- constrói moléculas em uma oficina simplificada;
- analisa cartas de moléculas válidas;
- escolhe a molécula mais adequada para o desafio;
- justifica a escolha com base em propriedades;
- recebe feedback imediato;
- progride para a próxima fase.

A experiência não deve depender de texto livre, desenho químico avançado ou cálculo formal. O foco está em raciocínio estrutural, comparação entre moléculas e tomada de decisão guiada por conceitos químicos.

## Estrutura geral da campanha

No MVP:

- cada **capítulo** é composto por fases;
- cada **fase** corresponde a **um desafio principal**;
- o Capítulo I terá **8 fases**;
- a progressão será **linear**;
- cada fase introduz ou reforça um conceito central.

## Loop central do jogo

O loop principal do MVP é:

1. o jogador entra em uma fase;
2. lê a narrativa e entende o desafio;
3. visualiza os recursos disponíveis;
4. utiliza a oficina molecular para montar uma estrutura;
5. ao criar uma molécula válida, recebe ou visualiza a carta correspondente;
6. usa a carta como apoio para decidir qual molécula resolve melhor o problema;
7. seleciona a molécula escolhida;
8. marca propriedades que justificam sua escolha;
9. recebe feedback;
10. desbloqueia recompensas e avança, se tiver acertado.

## Fluxo oficial de uma fase

O fluxo base de fase no MVP será:

1. **narrativa**
2. **desafio**
3. **recursos disponíveis**
4. **oficina molecular**
5. **carta da molécula criada**
6. **seleção da resposta**
7. **justificativa por propriedades**
8. **feedback**
9. **recompensa**
10. **progressão**

Esse fluxo pode sofrer pequenas variações de apresentação, mas sua lógica deve permanecer estável.

## Tipos de fase no MVP

O MVP suporta três tipos principais de fase:

### 1. Fase de construção

O foco está em construir uma molécula específica corretamente.

Exemplo:

- construir metano;
- construir etano;
- construir eteno.

### 2. Fase de escolha

O foco está em selecionar, entre moléculas já conhecidas ou disponíveis, a mais adequada para resolver um problema.

Exemplo:

- escolher a melhor molécula para combustível;
- escolher a mais volátil;
- escolher a mais apropriada para transformação.

### 3. Fase de construção + escolha

O jogador constrói uma ou mais moléculas válidas, analisa as cartas geradas e depois escolhe qual delas deve usar como resposta para o desafio.

Esse tipo é importante porque liga diretamente oficina molecular, leitura da carta e raciocínio estratégico.

## Oficina molecular

### Papel da oficina

A oficina molecular é a principal mecânica de construção do MVP. Ela deve oferecer liberdade controlada suficiente para gerar aprendizagem estrutural sem se tornar um editor químico livre complexo.

### Modelo adotado

O MVP usará uma oficina **híbrida semilivre**.

Isso significa que:

- o jogador interage com átomos e possibilidades de ligação de forma visual;
- a interface permite montar estruturas simplificadas;
- o sistema guia a construção dentro de limites definidos;
- a validação da molécula é feita automaticamente.

### Recursos manipuláveis

Na oficina, o jogador poderá trabalhar com:

- quantidade disponível de carbonos;
- ligações estruturais permitidas na fase;
- arranjo simplificado da cadeia;
- hidrogênios ajustados pelo sistema.

### Regra dos hidrogênios

No MVP, os hidrogênios **não serão posicionados manualmente como elemento principal de montagem**.

O jogador:

- posiciona carbonos;
- escolhe a configuração de ligações disponível;
- o sistema completa os hidrogênios automaticamente por ligações simples, quando a estrutura for válida.

### Configurações de ligação

A oficina deve permitir, de forma progressiva, configurações como:

- quatro ligações simples;
- uma ligação dupla e duas simples;
- duas ligações duplas;
- uma ligação tripla e uma simples;
- estrutura aromática, quando desbloqueada.

A disponibilidade dessas configurações depende do avanço do jogador e dos recursos já liberados.

### Validação de estrutura

Ao concluir a montagem, o jogador utiliza a ação de criação da molécula.

Exemplo:

- botão **Criar molécula**

O sistema então:

- verifica a consistência estrutural;
- ajusta os hidrogênios conforme as regras simplificadas;
- cria a molécula se a estrutura for válida;
- impede a criação se houver inconsistência.

### Regra oficial de erro estrutural

No MVP, o sistema **não deve criar moléculas inválidas**.

Se houver erro estrutural, o jogo deve retornar uma mensagem curta, clara e objetiva, como:

- ligações inconsistentes;
- estrutura incompatível;
- não foi possível criar a molécula.

## Inventário

### Papel do inventário

O inventário é uma mecânica real do MVP e não apenas um elemento visual.

Ele serve para:

- reforçar progressão;
- limitar a complexidade disponível em cada fase;
- conectar narrativa, construção e desbloqueio;
- organizar os recursos do jogador.

### Componentes do inventário

O inventário pode incluir:

- átomos;
- fragmentos estruturais;
- cartas de moléculas desbloqueadas;
- títulos desbloqueados.

### Regra de uso dos recursos

Os recursos usados na construção não são tratados como consumo permanente irreversível.

No MVP, a lógica é de **alocação temporária**:

- o recurso é usado na montagem;
- a estrutura é testada;
- os recursos podem voltar ao estado utilizável conforme a lógica do sistema.

O objetivo não é punir o aluno por tentativa, e sim estruturar o progresso e a disponibilidade de construção.

### Importância no gameplay

No MVP, o inventário deve ser:

- visível;
- relevante;
- integrado ao fluxo do jogo.

Ele não deve ser excessivamente complexo, mas precisa participar de forma perceptível da experiência.

## Cartas de molécula

### Papel das cartas

As cartas são simultaneamente:

- recompensa;
- material de apoio pedagógico;
- ferramenta de decisão estratégica.

### Quando a carta aparece

Sempre que o jogador criar uma molécula válida, o sistema deve exibir a carta correspondente.

Se a carta já estiver desbloqueada, a apresentação pode ser reduzida ou resumida, mas a consulta continua disponível.

### Função pedagógica da carta

A carta deve ajudar o jogador a:

- reconhecer a molécula criada;
- associar fórmula, estrutura e classe;
- ler atributos e características;
- decidir se aquela molécula é adequada para o desafio atual;
- comparar alternativas já conhecidas.

### Coleção de cartas

O MVP deve incluir uma área de consulta às cartas já desbloqueadas.

Essa coleção funciona como:

- memória do progresso;
- apoio para comparação;
- reforço de aprendizagem.

## Fragmentos estruturais

Fragmentos estruturais, como ligação dupla ou estrutura aromática, fazem parte do sistema do MVP como desbloqueios reais com função simples.

### Papel dos fragmentos

Eles servem para:

- marcar avanço conceitual;
- liberar novas possibilidades na oficina;
- introduzir novos tipos de estrutura;
- reforçar o aprendizado por etapas.

### Exemplo

No início, o jogador pode construir apenas estruturas com ligações simples.

Ao desbloquear a ligação dupla:

- recebe a explicação correspondente;
- passa a poder selecionar essa opção na oficina;
- amplia o conjunto de moléculas construíveis.

## Seleção da molécula-resposta

Após construir ou consultar moléculas disponíveis, o jogador deve escolher a molécula que deseja usar como resposta para o desafio da fase.

Essa escolha é o núcleo estratégico da fase.

### Regra central

Cada fase terá:

- uma **molécula alvo ideal**;
- eventualmente uma ou mais **moléculas aceitáveis**;
- todas as demais moléculas serão tratadas como incorretas para aquele contexto.

Isso significa que o sistema trabalha com duas ideias:

- existe uma melhor resposta para o problema;
- pode haver outras respostas funcionalmente aceitáveis.

## Justificativa por propriedades

### Papel da justificativa

Após escolher a molécula, o jogador deve selecionar propriedades que expliquem sua decisão.

Essa etapa existe para:

- tornar o raciocínio visível;
- reforçar a relação estrutura → propriedade → aplicação;
- enriquecer o feedback pedagógico;
- diferenciar uma escolha ideal de uma escolha apenas aceitável.

### Quantidade de propriedades

No MVP, o jogador poderá selecionar de:

- **1 a 3 propriedades**

### Função da justificativa no sistema

A justificativa **não é apenas decorativa**, mas também **não invalida sozinha uma molécula correta**.

Sua função é qualificar a resposta.

Em termos práticos:

- a molécula escolhida define se a resposta é potencialmente correta ou incorreta;
- as propriedades ajudam a determinar a qualidade da resposta;
- a justificativa pode diferenciar uma resposta **excellent** de uma resposta **adequate**.

## Modelo de avaliação

O MVP adota um modelo de avaliação híbrido com três níveis visíveis para o jogador.

### Níveis qualitativos

- **excellent**
- **adequate**
- **inadequate**

### Significado dos níveis

#### Excellent

A molécula escolhida é a resposta ideal para o desafio, e a justificativa está coerente com essa escolha.

#### Adequate

A molécula escolhida é aceitável para resolver o desafio, mas não representa a melhor resposta possível, ou a justificativa é menos precisa do que a ideal.

#### Inadequate

A molécula escolhida não resolve adequadamente o problema proposto.

## Resultado interno de correção

Para fins de progressão, o backend consolida os resultados em dois estados:

- `correct`
- `incorrect`

### Mapeamento oficial

- **excellent** → `correct`
- **adequate** → `correct`
- **inadequate** → `incorrect`

## Regra de progressão

O jogador só avança para a próxima fase quando obtiver:

- `correct`

Isso significa que:

- **excellent** avança;
- **adequate** avança;
- **inadequate** não avança.

## Tentativas

O jogador pode realizar:

- múltiplas tentativas por fase

### Regra de erro

Ao errar:

- recebe feedback;
- permanece na fase atual;
- pode tentar novamente imediatamente.

Não há:

- perda permanente de progresso;
- bloqueio definitivo;
- punição excessiva por tentativa.

## Pontuação

### Escala por fase

Cada fase equivale a um desafio principal e tem a seguinte pontuação:

- **excellent** = 3 pontos
- **adequate** = 2 pontos
- **inadequate** = 0 pontos

### Pontuação do capítulo

A pontuação total do capítulo é a soma da pontuação das fases concluídas.

No Capítulo I:

- máximo possível: **24 pontos**

## Recompensas

As recompensas do MVP podem incluir:

- novos átomos;
- novos fragmentos estruturais;
- novas cartas de moléculas;
- novos títulos.

### Função das recompensas

As recompensas servem para:

- marcar avanço;
- ampliar as possibilidades de construção;
- reforçar a narrativa de progressão;
- sustentar a motivação do jogador.

## Títulos

Os títulos do MVP têm função:

- narrativa;
- cosmética;
- comemorativa.

Eles não alteram mecanicamente o desempenho do jogador.

## Feedback ao jogador

O feedback do MVP deve ser:

- imediato;
- curto;
- claro;
- coerente com o nível qualitativo da resposta.

### Estrutura recomendada

O feedback pode conter:

- nível da resposta;
- frase breve explicativa;
- indicação de avanço ou nova tentativa;
- recompensa desbloqueada, quando houver.

## Princípios de design do MVP

Em caso de dúvida sobre decisão de design, o jogo deve seguir estes princípios:

### 1. Aprendizagem antes de complexidade

Toda mecânica deve ser compreensível e ter valor pedagógico claro.

### 2. Liberdade controlada

A oficina deve permitir experimentação sem se transformar em sistema complexo demais para o MVP.

### 3. Clareza de progressão

O jogador deve entender o que desbloqueou, por que avançou e o que mudou.

### 4. Relação estrutura-propriedade-aplicação

Esse é o eixo conceitual central do jogo.

### 5. Reutilização futura

As regras do MVP devem ser simples, mas compatíveis com expansão posterior.
