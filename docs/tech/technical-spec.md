# Especificação Técnica

## 1. Propósito do documento

Este documento define a especificação técnica oficial do MVP de **Crônicas do Reino do Carbono**.

Seu papel é servir como referência principal para decisões de implementação relacionadas a:

- arquitetura;
- stack;
- autenticação;
- persistência;
- modelo operacional de dados;
- validação;
- segurança;
- testes;
- deploy.

Este documento deve permanecer alinhado com os demais documentos oficiais em `docs/`, especialmente:

- `docs/product/vision.md`;
- `docs/product/mvp-scope.md`;
- `docs/design/game-design.md`;
- `docs/design/content-model.md`;
- `docs/design/phases.md`;
- `docs/visual/visual-direction.md`;
- `docs/visual/ui-system.md`;
- `docs/visual/card-spec.md`;
- `docs/planning/implementation-plan.md`.

Se houver divergência entre implementação e especificação oficial, a documentação deve ser atualizada explicitamente.

---

## 2. Objetivos técnicos do MVP

A solução técnica do MVP deve:

- suportar o loop completo do Capítulo I;
- permitir autenticação vinculada à turma;
- persistir progresso, tentativas, inventário e recompensas;
- manter a avaliação de gameplay determinística e autoritativa no servidor;
- separar conteúdo estático de lógica de aplicação;
- permanecer simples o suficiente para implementação rápida e sustentável;
- permitir expansão futura para novos capítulos e novos conteúdos.

---

## 3. Escopo técnico do MVP

A implementação técnica do MVP deve suportar:

- cadastro e login de jogador com código da turma, nome de exibição, username e senha;
- acesso autenticado ao jogo;
- progressão linear por capítulo e fase;
- renderização do conteúdo oficial do Capítulo I;
- laboratório de síntese híbrido semilivre guiado por blueprints;
- validação de molécula construída;
- seleção de molécula-resposta;
- seleção de 1 a 3 propriedades como justificativa;
- avaliação automática da submissão;
- persistência de tentativas, progresso, inventário e recompensas;
- coleção de cartas desbloqueadas;
- analytics leves de gameplay.

O MVP não precisa suportar:

- multiplayer;
- colaboração em tempo real;
- dashboard docente;
- painel de autoria de conteúdo;
- múltiplos capítulos com ramificação complexa;
- personalização avançada;
- modo offline;
- editor químico livre completo.

---

## 4. Stack oficial

### Frontend

- **Framework:** Next.js
- **UI:** React
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS

### Backend

- **Runtime:** Node.js
- **Camada de servidor:** Next.js Route Handlers e módulos server-side em TypeScript

### Banco de dados

- **Banco principal:** PostgreSQL

### ORM

- **ORM oficial:** Prisma

### Autenticação

- **Modelo oficial:** autenticação customizada baseada em sessão

### Deploy

- **Aplicação:** Vercel
- **Banco:** Neon

### Validação

- **Biblioteca recomendada:** Zod

---

## 5. Direção arquitetural

O MVP deve ser implementado como uma aplicação web monolítica moderna.

Isso significa:

- frontend e backend no mesmo repositório;
- lógica de negócio centralizada na mesma aplicação;
- um banco de dados relacional principal;
- ausência de microserviços no MVP.

Essa abordagem foi escolhida para:

- reduzir complexidade operacional;
- acelerar a entrega;
- simplificar deploy e manutenção;
- manter a evolução futura viável sem sobre-engenharia.

---

## 6. Módulos centrais do sistema

A aplicação deve ser organizada em torno dos seguintes módulos:

### 6.1 Autenticação

Responsável por:

- cadastro;
- login;
- sessão autenticada;
- proteção de rotas.

### 6.2 Conteúdo do jogo

Responsável por:

- carregar capítulos, fases, moléculas, enums e definições oficiais;
- manter ids estáveis e tipados;
- expor conteúdo ao restante do sistema.

### 6.3 Builder molecular

Responsável por:

- modelar o estado temporário da construção;
- representar o blueprint ativo e seus slots;
- validar a estrutura montada;
- resolver a molécula resultante a partir de uma assinatura estrutural, quando válida.

### 6.4 Gameplay

Responsável por:

- interpretar submissões;
- avaliar respostas;
- mapear resultado qualitativo e resultado interno;
- aplicar desbloqueios e regras de progressão.

### 6.5 Progresso

Responsável por:

- registrar tentativas;
- manter resumo oficial por fase;
- atualizar progresso do capítulo.

### 6.6 Inventário e recompensas

Responsável por:

- persistir o snapshot do inventário;
- aplicar recompensas e desbloqueios;
- registrar histórico de eventos de recompensa.

### 6.7 Analytics

Responsável por:

- registrar eventos leves de gameplay;
- apoiar análise futura sem bloquear o fluxo principal.

### 6.8 Camada visual

Responsável por:

- mapear conteúdo estático a assets visuais oficiais;
- manter a fronteira entre bitmap decorativo e conteúdo vivo;
- padronizar cartas, painéis, builder e telas principais;
- permitir evolução visual sem alterar a lógica autoritativa do jogo.

---

## 7. Conteúdo estático e fonte da verdade

No MVP, o conteúdo oficial do jogo deve ser mantido em arquivos locais versionados no repositório.

Isso inclui:

- capítulos;
- fases;
- moléculas;
- enums;
- propriedades selecionáveis;
- recompensas definidas por conteúdo;
- campos visuais orientados a assets.

### 7.1 Regra oficial

O banco de dados **não** é a fonte de verdade para o conteúdo jogável estático.

O banco armazena apenas dados operacionais do jogador, como:

- autenticação;
- progresso;
- inventário;
- tentativas;
- recompensas concedidas;
- analytics.

### 7.2 Benefícios

Essa abordagem reduz:

- risco de deriva entre design e implementação;
- dificuldade de versionamento do conteúdo;
- custo de manutenção no MVP.

---

## 8. Requisitos funcionais

### 8.1 Autenticação

O sistema deve permitir que o jogador:

- crie uma conta vinculada a uma turma;
- faça login com credenciais válidas;
- mantenha uma sessão autenticada;
- faça logout.

### 8.2 Controle de acesso

O sistema deve:

- restringir gravações de progresso a usuários autenticados;
- proteger dados privados do jogador;
- impedir alterações indevidas em registros de outro jogador.

### 8.3 Entrega de fase

O sistema deve:

- carregar apenas fases desbloqueadas;
- apresentar o conteúdo oficial da fase correta;
- fornecer narrativa, objetivo, recursos, moléculas disponíveis e feedback.

### 8.4 Interação de gameplay

O sistema deve:

- permitir construção molecular guiada;
- permitir seleção de blueprint de construção quando aplicável;
- permitir preenchimento de slots com elementos válidos;
- permitir seleção da molécula-resposta;
- permitir seleção de propriedades justificadoras;
- submeter a resposta ao backend.

### 8.5 Persistência

O sistema deve:

- salvar tentativas;
- manter o melhor resultado por fase;
- atualizar o progresso do capítulo;
- persistir inventário e recompensas;
- permitir retomada posterior do progresso.

---

## 9. Requisitos não funcionais

### 9.1 Performance

- telas de fase devem carregar rapidamente em uso normal;
- a submissão deve parecer imediata ao jogador;
- leituras de progresso devem ser simples e previsíveis.

### 9.2 Confiabilidade

- progresso não deve ser perdido após submissão bem-sucedida;
- a validação deve ser determinística;
- ids oficiais devem permanecer estáveis.

### 9.3 Manutenibilidade

- regras de gameplay devem ser isoladas e testáveis;
- conteúdo deve permanecer separado da UI;
- modelos operacionais devem permitir expansão sem refatoração estrutural grande.

### 9.4 Segurança

- rotas protegidas devem exigir autenticação;
- toda escrita deve ser validada no servidor;
- segredos devem permanecer em variáveis de ambiente.

---

## 10. Arquitetura de frontend

### 10.1 Responsabilidades do frontend

O frontend é responsável por:

- renderizar a interface do jogo;
- exibir narrativa, objetivos, recursos e cartas;
- coletar interações locais do jogador;
- apresentar feedback e progresso;
- refletir o estado retornado pelo backend.

### 10.2 Princípios de UI

A interface deve:

- priorizar clareza sobre complexidade;
- funcionar em fluxo passo a passo;
- reduzir ambiguidade no estado da fase;
- manter coerência com o tom narrativo;
- evitar sobrecarga cognitiva desnecessária;
- seguir a trilha oficial definida em `docs/visual/`.

### 10.2.1 Regra visual oficial

A UI do MVP deve obedecer às seguintes regras:

- textos, números, barras e estados interativos permanecem em código;
- assets bitmap são usados para molduras, ilustrações, texturas e ornamentação;
- cartas de molécula seguem modelo híbrido orientado a dados;
- o laboratório de síntese por blueprints deve tornar visíveis slots, estados de preenchimento e ação de síntese.

### 10.3 Estado no frontend

No MVP, o gerenciamento de estado deve permanecer leve.

Separação recomendada:

- **estado de servidor:** progresso, inventário, conteúdo carregado, resultados persistidos;
- **estado de cliente:** interações temporárias, blueprint ativo, preenchimento de slots, seleção atual, estado local do builder e feedback transitório.

Não há necessidade de biblioteca pesada de estado global no MVP, salvo necessidade prática comprovada.

---

## 11. Arquitetura de backend

### 11.1 Responsabilidades do backend

O backend é responsável por:

- autenticação e autorização;
- entrega controlada de conteúdo dinâmico;
- validação de payloads;
- validação estrutural do builder;
- validação do blueprint e do preenchimento de slots;
- resolução da assinatura estrutural em molécula oficial;
- avaliação de fases;
- aplicação de progresso, recompensas e inventário;
- persistência do estado do jogador.

### 11.2 Estilo recomendado

Usar Route Handlers e módulos server-side no mesmo projeto Next.js.

Essa escolha:

- simplifica o setup;
- reduz fricção entre frontend e backend;
- centraliza lógica full-stack;
- é suficiente para a complexidade do MVP.

### 11.3 Autoridade do servidor

Toda regra crítica de gameplay deve ser executada no servidor.

O cliente pode:

- antecipar validações simples para UX;
- refletir estados de interface;
- orientar o fluxo visual.

O cliente não pode:

- decidir progressão;
- decidir pontuação oficial;
- validar resposta final como fonte de verdade.

---

## 12. Autenticação e sessão

### 12.1 Modelo oficial

O MVP usa autenticação customizada baseada em sessão.

### 12.2 Dados mínimos de cadastro

O fluxo de cadastro deve incluir pelo menos:

- código da turma;
- nome de exibição;
- username;
- senha.

### 12.3 Regras de sessão

- apenas usuários autenticados podem persistir progresso;
- rotas protegidas devem redirecionar usuários não autenticados;
- endpoints de escrita devem validar a identidade da sessão no servidor.

### 12.4 Requisitos de segurança

- senha armazenada apenas como hash seguro;
- cookies de sessão seguros e `HttpOnly`, quando aplicável;
- nenhuma credencial em texto puro persistida no banco.

---

## 13. Builder molecular

### 13.1 Modelo do builder

O MVP adota um laboratório de síntese híbrido semilivre.

Isso significa que:

- o jogador manipula carbonos e tipos de ligação permitidos;
- o sistema guia a construção dentro dos limites da fase;
- o sistema completa hidrogênios automaticamente quando a estrutura é válida.

### 13.2 Regras de envio

- não deve haver texto livre;
- as propriedades selecionadas devem pertencer ao conjunto oficial permitido;
- para `choice` e `construction_choice`, a seleção de propriedades deve conter de 1 a 3 itens;
- para `construction`, a avaliação é baseada na molécula construída e não exige o mesmo formato de envio no fluxo da UI.

### 13.3 Dados da tentativa no builder

**Decisão:** o estado do builder deve ser armazenado no histórico como JSON.

Isso permite que o sistema preserve:

- o que o jogador construiu;
- como a estrutura foi configurada;
- qual molécula resultou dessa configuração.

---

## 14. Modelo de avaliação

### 14.1 Camadas oficiais de resultado

O sistema de avaliação usa duas camadas de resultado:

**Resultado qualitativo visível**

- `excellent`
- `adequate`
- `inadequate`

**Resultado interno de validação**

- `correct`
- `incorrect`

**Mapeamento oficial**

- `excellent` → `correct`
- `adequate` → `correct`
- `inadequate` → `incorrect`

### 14.2 Mapeamento de pontuação

Pontuação oficial por resultado:

- `excellent = 3`
- `adequate = 2`
- `inadequate = 0`

### 14.3 Regras de avaliação para fases baseadas em escolha

**Decisão:**

**Caso 1 — a molécula selecionada é `excellent`**

- se a justificativa for suficientemente coerente com as propriedades esperadas, o resultado é `excellent`;
- se a justificativa for fraca, incompleta ou menos precisa, o resultado passa a ser `adequate`.

**Caso 2 — a molécula selecionada é `adequate`**

- o resultado permanece `adequate`, mesmo com uma seleção forte de propriedades.

**Caso 3 — a molécula selecionada não é nem `excellent` nem `adequate`**

- o resultado é `inadequate`.

### 14.4 Avaliação de fases de construção

Para fases de construção:

- a molécula-alvo construída determina o sucesso;
- se a molécula correta for construída e validada, o resultado é tratado como bem-sucedido de acordo com as regras da fase;
- se a estrutura for inválida ou a molécula construída estiver errada, o resultado é malsucedido.

**Recomendação:** representar a conclusão bem-sucedida de fases puramente de construção como `excellent`, a menos que o design futuramente introduza explicitamente uma faixa de sucesso mais fraca para fases somente de construção.

### 14.5 Determinismo

Toda avaliação de gameplay deve ser:

- determinística;
- autoritativa no servidor;
- derivada das definições oficiais de conteúdo.

---

## 15. Regras de progressão

### 15.1 Regra de desbloqueio

**Decisão:** o jogador desbloqueia a próxima fase somente quando a fase atual tiver:

```ts
validationResult = correct
```

Isso significa:

- `excellent` desbloqueia a próxima fase;
- `adequate` desbloqueia a próxima fase;
- `inadequate` não desbloqueia a próxima fase.

### 15.2 Regra de replay

**Decisão:** fases concluídas podem ser rejogadas.

### 15.3 Regra de melhoria de pontuação

**Decisão:** o replay pode melhorar a pontuação oficial armazenada da fase.

A pontuação oficial armazenada para uma fase é o melhor resultado obtido.

### 15.4 Pontuação do capítulo

A pontuação oficial do capítulo é a soma da melhor pontuação armazenada de cada fase.

---

## 16. Tentativas, resumos e estado da fase

### 16.1 Histórico de tentativas

**Decisão:** o sistema armazena todas as tentativas.

Isso inclui:

- tentativas malsucedidas;
- tentativas bem-sucedidas;
- tentativas de replay após a conclusão;
- snapshots do estado do builder, quando aplicável.

### 16.2 Necessidade de estado resumido

Como todas as tentativas são armazenadas e a melhor pontuação importa, o MVP também exige um estado resumido por fase.

**Recomendação:** manter um modelo de resumo dedicado para cada par jogador-fase.

Esse resumo deve armazenar pelo menos:

- se a fase já foi concluída alguma vez;
- melhor resultado qualitativo;
- melhor resultado de validação;
- melhor pontuação;
- timestamp da primeira conclusão;
- timestamp da tentativa mais recente;
- contagem total de tentativas.

### 16.3 Justificativa

Sem um resumo da fase, o sistema precisaria calcular repetidamente o estado oficial a partir das tentativas brutas, o que aumenta a complexidade e o risco.

---

## 17. Inventário e recompensas

### 17.1 Persistência do inventário

**Decisão:** o inventário do jogador persiste.

O inventário inclui o estado atual, como:

- disponibilidade de carbono;
- fragmentos desbloqueados;
- moléculas/cartas desbloqueadas;
- títulos desbloqueados.

### 17.2 Modelo de inventário

A implementação deve se alinhar ao modelo lógico definido em `docs/design/content-model.md`:

```ts
type PlayerInventory = {
  carbonAvailable: number;
  hydrogenMode: "implicit_infinite";
  unlockedFragments: string[];
  unlockedMolecules: string[];
  unlockedTitles: string[];
};
```

### 17.3 Estratégia de persistência do inventário

**Decisão:** o inventário deve ser persistido como um snapshot do estado atual, não apenas derivado em tempo de execução.

### 17.4 Histórico de recompensas

**Decisão:** as recompensas também devem ser armazenadas como eventos históricos.

Isso significa que o sistema mantém ambos:

- snapshot atual do inventário;
- histórico de concessão de recompensas.

### 17.5 Modelo de tratamento de recompensas

Esse modelo duplo oferece suporte a:

- leituras mais simples do estado de gameplay;
- melhor auditabilidade;
- futuras análises e depuração.

---

## 18. Cartas e desbloqueáveis

### 18.1 Cartas

**Decisão:** cartas de moléculas desbloqueadas devem persistir por jogador.

### 18.2 Títulos

**Decisão:** títulos desbloqueados devem persistir por jogador.

### 18.3 Estratégia de desbloqueio

Os desbloqueáveis podem ser refletidos tanto:

- no snapshot do inventário;
- no histórico de eventos de recompensa ou desbloqueio.

---

## 19. Analytics

### 19.1 Nível de analytics

**Decisão:** o MVP inclui analytics de gameplay de nível médio.

Isso não significa uma plataforma completa de analytics nem um dashboard. Significa armazenar dados de eventos úteis para análise futura.

### 19.2 Eventos recomendados

Conjunto mínimo recomendado de eventos para armazenar:

- jogador registrado;
- jogador autenticado;
- fase aberta;
- molécula criada com sucesso;
- falha na criação da molécula;
- fase submetida;
- fase avaliada;
- fase concluída;
- recompensa concedida;
- tentativa de replay realizada.

### 19.3 Princípios de analytics

Os analytics devem:

- não bloquear o fluxo principal de gameplay;
- não expor dados sensíveis desnecessariamente;
- permanecer leves no MVP.

---

## 20. Modelo de banco de dados

### 20.1 Conjunto de entidades operacionais

O banco de dados deve incluir, no mínimo, as seguintes entidades operacionais:

- `Classroom`
- `Player`
- `Session`
- `PlayerPhaseAttempt`
- `PlayerPhaseSummary`
- `PlayerChapterProgress`
- `PlayerInventory`
- `PlayerRewardEvent`
- `PlayerAnalyticsEvent`

### 20.2 Esquema conceitual

#### `Classroom`

Representa uma turma usada durante autenticação e associação do jogador.

Campos sugeridos:

- `id`
- `code`
- `name`
- `createdAt`
- `updatedAt`

#### `Player`

Representa um jogador autenticado.

Campos sugeridos:

- `id`
- `classroomId`
- `displayName`
- `username`
- `passwordHash`
- `createdAt`
- `updatedAt`

#### `Session`

Representa o estado de sessão autenticada, se persistido no servidor.

Campos sugeridos:

- `id`
- `playerId`
- `expiresAt`
- `createdAt`

#### `PlayerPhaseAttempt`

Armazena todas as tentativas feitas por um jogador em uma fase.

Campos sugeridos:

- `id`
- `playerId`
- `phaseId`
- `phaseType`
- `builderStateJson`
- `constructedMoleculeId`
- `selectedMoleculeId`
- `selectedPropertiesJson`
- `qualitativeResult`
- `validationResult`
- `scoreAwarded`
- `createdAt`

#### `PlayerPhaseSummary`

Armazena o estado oficial resumido para um par jogador-fase.

Campos sugeridos:

- `id`
- `playerId`
- `phaseId`
- `isCompleted`
- `bestQualitativeResult`
- `bestValidationResult`
- `bestScore`
- `attemptCount`
- `firstCompletedAt`
- `lastAttemptAt`
- `updatedAt`

#### `PlayerChapterProgress`

Armazena o estado de progressão no nível do capítulo.

Campos sugeridos:

- `id`
- `playerId`
- `chapterId`
- `highestUnlockedPhaseNumber`
- `completedPhaseCount`
- `chapterScore`
- `updatedAt`

#### `PlayerInventory`

Armazena o snapshot atual do inventário.

Campos sugeridos:

- `id`
- `playerId`
- `carbonAvailable`
- `hydrogenMode`
- `unlockedFragmentsJson`
- `unlockedMoleculesJson`
- `unlockedTitlesJson`
- `updatedAt`

#### `PlayerRewardEvent`

Armazena o histórico de recompensas e desbloqueios.

Campos sugeridos:

- `id`
- `playerId`
- `phaseId`
- `rewardType`
- `rewardValue`
- `metadataJson`
- `grantedAt`

#### `PlayerAnalyticsEvent`

Armazena eventos de analytics de gameplay.

Campos sugeridos:

- `id`
- `playerId`
- `eventType`
- `phaseId`
- `payloadJson`
- `createdAt`

---

## 21. Estratégia de persistência

### 21.1 Conteúdo estático

Carregado a partir de arquivos locais em tempo de execução ou build.

### 21.2 Dados operacionais do jogador

Armazenados em PostgreSQL.

### 21.3 Atualizações por submissão avaliada

Após cada submissão de fase avaliada, o sistema deve atualizar:

- histórico de tentativas;
- resumo da fase;
- progresso do capítulo;
- snapshot do inventário, se houver recompensa ou desbloqueio;
- histórico de recompensas, se houver recompensa ou desbloqueio;
- eventos de analytics.

### 21.4 Recomendação de transação

**Recomendação:** realizar atualizações críticas de progressão em transação de banco de dados, quando aplicável.

Isso é especialmente importante quando uma única submissão dispara múltiplas escritas.

---

## 22. Design de páginas e rotas

### 22.1 Estrutura de páginas

Estrutura recomendada:

```bash
/app
/(public)
/login
/register

/(protected)
/game
/chapter/[chapterId]
/phase/[phaseId]
/collection
/profile
```

### 22.2 Grupos de rotas de API

Grupos recomendados:

**Autenticação**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Acesso a conteúdo**

- `GET /api/chapters/[chapterId]`
- `GET /api/phases/[phaseId]`

**Gameplay**

- `POST /api/phases/[phaseId]/builder/validate`
- `POST /api/phases/[phaseId]/submit`

**Progresso**

- `GET /api/progress`
- `GET /api/progress/[chapterId]`

**Inventário**

- `GET /api/inventory`

**Coleção**

- `GET /api/collection`

### 22.3 Princípios das rotas

As rotas devem:

- validar toda entrada;
- exigir autenticação quando apropriado;
- nunca confiar no estado de progressão enviado pelo cliente;
- evitar expor lógica oculta de resposta além do necessário para a fase;
- retornar formatos estáveis de resposta.

---

## 23. Validação

### 23.1 Validação no servidor

Todas as operações de escrita devem ser validadas no servidor.

Isso inclui:

- payloads de autenticação;
- códigos de turma;
- payloads do builder;
- submissões de fase;
- propriedades selecionadas;
- parâmetros de rota.

### 23.2 Ferramenta recomendada

**Recomendação:** usar `Zod` para validação de requisições e checagens internas de schema.

### 23.3 Regras de seleção de propriedades

Para fases aplicáveis:

- as propriedades selecionadas devem pertencer ao enum oficial;
- a quantidade deve estar entre 1 e 3;
- duplicatas devem ser rejeitadas ou normalizadas.

---

## 24. Segurança

### 24.1 Controles obrigatórios

O MVP deve implementar:

- hash seguro de senha;
- proteção de rotas autenticadas;
- autorização no servidor para todas as escritas do jogador;
- gerenciamento de segredos por variáveis de ambiente;
- validação de entrada em todas as rotas de mutação.

### 24.2 Controles recomendados

Controles adicionais recomendados:

- rate limiting básico em endpoints de autenticação;
- logging estruturado no servidor;
- respostas de erro seguras, sem vazamento de detalhes internos.

### 24.3 Minimização de dados

Coletar apenas os dados necessários para:

- acesso vinculado à turma;
- identidade do jogador no jogo;
- persistência do progresso.

Nenhum dado pessoal desnecessário deve ser coletado no MVP.

---

## 25. Tratamento de erros

### 25.1 Princípios

Os erros devem ser:

- seguros;
- curtos;
- previsíveis;
- não destrutivos para o progresso do jogador.

### 25.2 Expectativas técnicas

O sistema deve:

- retornar erros de validação estruturados;
- distinguir erros de autenticação de erros de gameplay;
- evitar corrupção parcial de progressão;
- impedir estados falsos de sucesso na UI quando a persistência falhar.

---

## 26. Estratégia de testes

### 26.1 Nível mínimo exigido

**Decisão:** testes unitários e de integração são obrigatórios para áreas críticas.

### 26.2 Prioridades de testes unitários

Devem cobrir:

- lógica de validação do builder;
- lógica de avaliação de fases;
- mapeamento de resultados qualitativos;
- lógica de atualização da melhor pontuação;
- regras de desbloqueio de progressão;
- regras de aplicação de recompensas.

### 26.3 Prioridades de testes de integração

Devem cobrir:

- fluxo de cadastro e login;
- autenticação vinculada à turma;
- fluxo de submissão de fase;
- criação de tentativa e atualização de resumo;
- fluxo de atualização de recompensa e inventário;
- fluxo de replay e substituição da melhor pontuação.

---

## 27. Deploy

### 27.1 Modelo oficial de deploy

**Decisão:**

- aplicação implantada na `Vercel`;
- banco de dados hospedado na `Neon`.

### 27.2 Configuração obrigatória

A configuração de produção deve incluir:

- variáveis de ambiente configuradas;
- migrations do banco aplicadas;
- estratégia de seed ou provisionamento de turmas definida;
- conteúdo estático do jogo disponível no artefato de deploy.

### 27.3 Ambientes

**Decisão:**

- `local`
- `production`

Nenhum ambiente de staging é obrigatório para o MVP.

---

## 28. Variáveis de ambiente

As variáveis provavelmente necessárias incluem:

- `DATABASE_URL`
- `APP_BASE_URL`
- `AUTH_SECRET`
- `SESSION_SECRET`

Outras variáveis podem ser incluídas conforme a implementação exata da sessão.

---

## 29. Organização de código recomendada

### 29.1 Estrutura de pastas

Estrutura recomendada:

```bash
/app
/(public)
/login
/register
/(protected)
/game
/chapter/[chapterId]
/phase/[phaseId]
/collection
/profile
/api
/auth
/phases
/progress
/inventory
/collection

/components
/game
/builder
/cards
/feedback
/layout
/ui

/content
/chapters
/phases
/molecules
/enums

/lib
/auth
/content
/builder
/gameplay
/progress
/inventory
/analytics
/db
/validation

/prisma
schema.prisma
```

### 29.2 Responsabilidades por camada

#### `/content`

Dados estáticos oficiais do jogo.

#### `/lib/content`

Loaders tipados, helpers de lookup e normalização de conteúdo.

#### `/lib/builder`

Parsing do estado do builder e validação estrutural.

#### `/lib/gameplay`

Regras de avaliação, lógica de pontuação, mapeamento qualitativo e lógica de progressão.

#### `/lib/progress`

Atualizações do resumo da fase e do progresso do capítulo.

#### `/lib/inventory`

Aplicação de inventário e recompensas.

#### `/lib/auth`

Helpers customizados de autenticação e sessão.

#### `/lib/validation`

Schemas `Zod` e validadores de requisição.

---

## 30. Notas abertas de implementação

Os detalhes a seguir não bloqueiam o projeto, mas precisam ser escolhidos de forma consistente durante a implementação:

- estratégia exata de persistência de sessão;
- convenções exatas de nomenclatura no schema do Prisma;
- se eventos de analytics são gravados de forma síncrona ou por caminho assíncrono leve;
- se a rota de validação do builder retorna sugestões parciais ou apenas o estado de validade.

Esses são detalhes de implementação, não dúvidas de produto.

---

## 31. Direção técnica final

O MVP deve ser implementado como uma aplicação web orientada por conteúdo, validada no servidor e vinculada a turmas, com arquitetura simples, mas robusta.

Os princípios técnicos mais importantes são:

- o conteúdo estático permanece versionado no código;
- a validação de gameplay é determinística e autoritativa no servidor;
- o progresso do jogador é persistente e seguro para replay;
- o histórico de tentativas e os resumos do melhor resultado coexistem;
- a arquitetura permanece simples o suficiente para entregar o MVP sem sistemas desnecessários.

Esta é a direção técnica oficial para o MVP.


### 11.3 Contrato do builder molecular

O contrato técnico do builder deve evoluir para representar explicitamente:

- blueprint ativo;
- lista de slots definidos pelo blueprint;
- ocupação atual de cada slot;
- elementos disponíveis no inventário da fase;
- resultado estrutural resolvido.

Esse contrato substitui progressivamente abordagens simplificadas baseadas apenas em contagem de carbonos e tipo de ligação.

### 11.4 Fronteira entre conteúdo e visual

A camada de conteúdo pode incluir campos visuais orientados a assets, mas:

- a lógica de progressão continua independente da apresentação;
- o backend não depende de bitmaps para validar gameplay;
- a UI usa esses campos apenas para renderização visual consistente.
