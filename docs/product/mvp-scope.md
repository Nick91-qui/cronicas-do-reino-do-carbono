# Escopo do MVP

## Objetivo do MVP

O MVP de **Crônicas do Reino do Carbono** tem como objetivo validar a experiência pedagógica central do projeto: ensinar conceitos introdutórios de química orgânica por meio de uma jornada curta, interativa e progressiva baseada em construção molecular simplificada, escolha estratégica de moléculas e justificativa por propriedades.

O MVP deve ser suficiente para responder, com clareza, às seguintes perguntas:

- o fluxo de jogo ajuda o aluno a compreender melhor os conceitos?
- a sequência construção → escolha → justificativa funciona didaticamente?
- a progressão entre fases está coerente do ponto de vista pedagógico?
- a experiência é compreensível e viável em contexto escolar e estudo individual?

## Escopo funcional do MVP

O MVP inclui:

- uma campanha inicial com **8 fases**;
- foco em **hidrocarbonetos**;
- uso em **web responsivo**;
- entrada do jogador com **código da turma, nome de exibição, username e senha**;
- persistência de progresso em banco de dados;
- laboratório de síntese em modelo **híbrido semilivre**;
- desbloqueio progressivo de moléculas e fases;
- seleção de propriedades como justificativa;
- correção automática;
- feedback curto ao jogador;
- registro de tentativas e progresso.

## Conteúdo incluído no MVP

O Capítulo I do MVP cobre:

- tetravalência do carbono;
- hidrocarbonetos;
- crescimento da cadeia carbônica;
- alcanos;
- alcenos;
- volatilidade;
- potencial energético;
- reatividade;
- aromaticidade introdutória.

### Moléculas oficiais do MVP

As moléculas oficiais da campanha inicial são:

- Metano
- Etano
- Propano
- Eteno
- Propeno
- Buteno
- Benzeno

O MVP não inclui alcinos como parte jogável oficial, ainda que eles possam ser considerados em expansões futuras.

## Estrutura da campanha inicial

O MVP terá:

- **1 capítulo inicial**
- **8 fases**
- progressão linear
- desbloqueio sequencial
- complexidade crescente

O Capítulo I é tratado como a primeira implementação oficial do sistema do jogo.

## O que o MVP precisa demonstrar

O MVP deve demonstrar que o projeto consegue:

- apresentar conceitos químicos de forma gradual;
- manter fidelidade conceitual com simplificação controlada;
- permitir ao aluno aprender por interação e decisão;
- oferecer feedback suficiente para orientar a progressão;
- sustentar a base de futuras expansões de conteúdo.

## Modelo oficial de avaliação

O MVP adotará um modelo de avaliação **híbrido**.

### Regra interna de progressão

No backend, toda submissão será consolidada como:

- `correct`
- `incorrect`

A progressão do jogador depende exclusivamente desse resultado.

### Regra oficial de avanço

O jogador só avança para a próxima fase quando obtiver:

- `correct`

Não haverá avanço por tentativa, participação ou pontuação mínima.

### Camada qualitativa para feedback

Embora a progressão seja binária, o sistema poderá apresentar ao jogador uma classificação qualitativa para a resposta, quando aplicável:

- **excellent** = 3 pontos
- **adequate** = 2 pontos
- **inadequate** = resposta incorreta, sem pontuação

Esses níveis servem para:

- enriquecer o feedback;
- apoiar análise pedagógica;
- alimentar a pontuação do jogador.

No entanto, apenas respostas classificadas como **correct** permitem progressão.

## Tentativas por fase

O jogador poderá realizar:

- **múltiplas tentativas por fase**

Regras do MVP:

- errar não bloqueia permanentemente a fase;
- o progresso só avança ao acertar;
- o histórico de tentativas deve ser persistido;
- o jogador pode repetir a fase até alcançar a resposta correta.

## Laboratório de síntese do MVP

A construção molecular do MVP seguirá um modelo **híbrido semilivre**.

### Princípios do laboratório de síntese

O laboratório de síntese deve permitir:

- interação visual simples;
- manipulação guiada de átomos e ligações;
- sensação de montagem;
- validação automática pelo sistema.

O objetivo não é oferecer um editor químico livre completo, mas uma experiência pedagógica de construção com liberdade controlada.

### Funcionamento esperado

O jogador poderá interagir com:

- átomos disponíveis;
- possibilidades de ligação;
- organização estrutural simplificada da molécula.

Após concluir a montagem, o jogador utilizará uma ação como:

- **Criar molécula**

O sistema então verifica se a estrutura é válida.

### Regra de validade

A molécula só é criada se a estrutura respeitar as regras químicas simplificadas do sistema.

Se a estrutura não for válida, a molécula **não é criada** e o sistema retorna uma mensagem curta de erro, como por exemplo:

- ligações inconsistentes;
- estrutura incompatível;
- não foi possível criar a molécula.

### Limite do sistema no MVP

O MVP **não** incluirá:

- editor químico completamente livre;
- representação estrutural avançada;
- sistema aberto de desenho químico.

## Inventário no MVP

O MVP incluirá inventário com papel real na experiência.

### Elementos do inventário

O sistema poderá trabalhar com:

- átomos;
- fragmentos estruturais;
- moléculas desbloqueadas;
- títulos desbloqueados.

### Regra oficial de uso

Os recursos usados na construção serão tratados como **alocados temporariamente**, e não como consumo permanente irreversível.

Isso significa que:

- o jogador utiliza recursos para montar estruturas;
- os recursos podem voltar ao inventário conforme a lógica do sistema;
- o inventário participa da experiência, mas não deve gerar bloqueio excessivo ou punição frustrante no MVP.

O objetivo é sustentar a fantasia e a progressão sem tornar a gestão de recursos o foco principal da experiência.

## Feedback ao jogador

O feedback do MVP deve ser:

- curto;
- claro;
- imediato;
- pedagogicamente útil.

### Formato esperado

O jogador deve ver:

- um nível qualitativo, quando aplicável;
- uma frase curta explicando o resultado.

Exemplos:

- “Excelente escolha. Você identificou corretamente a molécula mais adequada.”
- “Boa escolha. Sua resposta faz sentido, mas existe uma opção mais precisa para este desafio.”
- “Não foi dessa vez. Tente novamente.”

O MVP não incluirá, como regra geral:

- feedback textual longo;
- explicações abertas geradas por IA;
- análise discursiva aprofundada dentro da interface do aluno.

## Persistência de dados

O MVP deve usar banco de dados real desde o início.

### Banco oficial

- **PostgreSQL com Neon**

### O que será persistido no banco

O banco será usado para dados dinâmicos do jogador, como:

- conta/sessão do jogador;
- progresso;
- tentativas por fase;
- desbloqueios;
- pontuação;
- estado de progressão.

### O que não será salvo no banco como fonte principal

O conteúdo estático do jogo **não** será gerenciado pelo banco no MVP.

## Conteúdo do jogo no MVP

O conteúdo oficial do jogo será mantido em arquivos locais do projeto, como:

- `content/`
- e módulos equivalentes em código quando necessário

Isso inclui:

- fases;
- moléculas;
- propriedades;
- recompensas;
- textos narrativos;
- gabaritos estruturados.

### Regra oficial

As regras oficiais de negócio do conteúdo permanecem definidas primeiro em `docs/` e são então materializadas em `content/` como implementação tipada derivada.

O conteúdo será alterado diretamente por código quando a mudança já estiver alinhada com a documentação normativa.

O MVP não terá:

- painel administrativo;
- CMS;
- edição de conteúdo por interface;
- seed/migration como mecanismo principal de manutenção de conteúdo.

## Entrada e autenticação do jogador

O MVP terá entrada formal de jogador.

### Modelo oficial

O acesso será feito por:

- **código da turma**
- **nome de exibição**
- **username**
- **senha**

Esse modelo busca equilibrar:

- simplicidade de uso;
- identificação do aluno;
- contexto escolar;
- persistência de progresso.

O MVP não inclui, neste momento:

- login social;
- autenticação por provedores externos;
- recuperação sofisticada de conta;
- múltiplos perfis administrativos.

## Papel do professor no MVP

O MVP não incluirá funcionalidades internas específicas para professor dentro do sistema.

No entanto, o projeto terá:

- **material pedagógico separado na documentação**

Esse material servirá como apoio para:

- uso em sala;
- leitura dos objetivos por fase;
- interpretação de erros comuns;
- apoio à mediação do professor.

## O que não entra no MVP

Ficam explicitamente fora do escopo do MVP:

- multiplayer;
- chat;
- ranking global;
- painel administrativo;
- dashboard docente;
- feedback por IA;
- editor químico livre completo;
- sistema aberto de texto livre para justificativa;
- animações complexas como requisito central;
- múltiplas campanhas;
- ramificações narrativas;
- conteúdo além do Capítulo I como parte obrigatória da entrega.

## Critério de sucesso do MVP

O MVP será considerado bem-sucedido se conseguir demonstrar, de forma funcional e consistente, que:

- o aluno compreende o fluxo principal sem grande atrito;
- as fases apresentam progressão pedagógica clara;
- o laboratório de síntese é utilizável e coerente com os objetivos didáticos;
- o sistema de escolha e justificativa ajuda a diferenciar estruturas e propriedades;
- o conteúdo pode ser expandido futuramente sem reestruturar o produto inteiro.

## Diretriz geral de produto

Em caso de conflito entre:

- complexidade técnica;
- riqueza visual;
- sofisticação sistêmica;
- clareza pedagógica;

o MVP deve priorizar, nesta ordem:

1. clareza pedagógica;
2. fidelidade conceitual;
3. simplicidade funcional;
4. viabilidade técnica;
5. expansão futura.
