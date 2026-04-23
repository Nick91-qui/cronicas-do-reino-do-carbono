# Milestones e Issues

## Propósito

Este arquivo é o tracker operacional de `docs/planning/`.

Ele não repete o plano macro de implementação. Seu papel é acompanhar:

- status atual por milestone;
- pendências abertas;
- próximos passos de curto prazo;
- riscos de fechamento do MVP.

Referências:

- `docs/planning/implementation-plan.md`: visão estratégica, blocos, dependências e riscos;
- `docs/planning/qa-checklist.md`: validação manual e técnica do MVP.

## Snapshot atual

- [x] Milestone 1 — Fundação do projeto
- [x] Milestone 2 — Conteúdo tipado e loaders
- [x] Milestone 3 — Builder e validação química no servidor
- [x] Milestone 4 — Autenticação, sessão e turma
- [x] Milestone 5 — Loop central de fase
- [x] Milestone 6 — Persistência de tentativas e progresso
- [x] Milestone 7 — Inventário, coleção e recompensas
- [x] Milestone 8 — Integração completa do Capítulo I
- [x] Milestone 9 — QA, segurança e deploy
- [ ] Milestone 10 — Reposicionamento visual de site para jogo

## Estratégia de mudança

### Objetivo do ciclo

O próximo ciclo do projeto deve reposicionar a experiência visual do MVP para que ela seja percebida prioritariamente como jogo, e não como dashboard web com tema do jogo.

Essa mudança não altera o loop oficial, a modelagem de conteúdo ou a arquitetura central já aceitos. O foco é reenquadrar a apresentação do MVP para aderir melhor a:

- `docs/visual/visual-direction.md`;
- `docs/visual/ui-system.md`;
- `docs/design/game-design.md`.

### Princípio operacional

A estratégia oficial deste ciclo é preservar o núcleo jogável já validado e substituir gradualmente a moldura visual genérica por uma interface mais diegética, ritual-científica e orientada a progressão.

Em termos práticos, isso significa:

- manter gameplay, rotas, persistência, conteúdo e avaliação como base estável;
- atacar primeiro a moldura de navegação e progressão, que hoje ainda transmite leitura de produto web;
- aproximar telas, painéis e estados visuais da fantasia oficial do reino alquímico-cósmico;
- usar componentes reusáveis e tokens compartilhados, evitando redesign isolado por tela;
- preservar legibilidade e responsividade como restrições obrigatórias do MVP.

### Frentes prioritárias da mudança

#### 1. Moldura global e HUD

Substituir header e navegação protegida com linguagem de app por uma moldura persistente de jogo.

Objetivos:

- transformar navegação em HUD;
- expor identidade do jogador, capítulo, progresso e recursos como status do mundo;
- reduzir aparência de navbar tradicional;
- criar continuidade visual entre `/game`, capítulo, fase, coleção e perfil.

#### 2. Progressão e mapa de jogo

Reenquadrar páginas de hub e capítulo para que funcionem como sala do reino, mapa de progresso e trilha de provas.

Objetivos:

- reduzir blocos do tipo hero + métricas;
- representar fases como portais, trilhas, selos e estados desbloqueados;
- tornar mais visível a sensação de avanço linear do capítulo;
- reforçar leitura de campanha em vez de painel administrativo.

#### 3. Sistema visual compartilhado

Formalizar tokens e componentes-base para impedir que a interface continue crescendo com padrões genéricos.

Objetivos:

- expandir variáveis visuais globais;
- definir superfícies, molduras, brilhos, estados e ornamentos;
- separar melhor painéis de contexto, feedback, coleção e ação;
- consolidar uma hierarquia tipográfica de jogo com texto funcional altamente legível.

#### 4. Feedback e estados de gameplay

Aumentar o peso visual dos estados interativos e do retorno das ações.

Objetivos:

- tornar mais distintos os estados normal, hover, ativo, selecionado, bloqueado, erro, sucesso e concluído;
- reforçar feedback da forja, leitura de resultado e progressão;
- substituir feedbacks com aparência de formulário/app por linguagem de sistema do jogo.

#### 5. Coleção e recompensa

Reposicionar a coleção para funcionar como grimório vivo do jogador, e não apenas como catálogo de cards.

Objetivos:

- enquadrar cartas desbloqueadas como descobertas e memória de progresso;
- diferenciar melhor estados bloqueado, descoberto e dominado;
- reforçar a coleção como espaço de consulta e recompensa.

## Todo List por milestone

### Milestone 10 — Reposicionamento visual de site para jogo

Status: planejado.

- [x] revisar `app/(protected)/layout.tsx` como HUD persistente do jogo
- [x] redesenhar `/game` como hub de progressão e sala do reino
- [x] redesenhar `/chapter/[chapterId]` como mapa/trilha de provas
- [x] reenquadrar `/collection` como grimório e biblioteca de cartas
- [x] consolidar tokens visuais em `app/globals.css` e `tailwind.config.ts`
- [x] formalizar superfícies reutilizáveis para cena, painel, feedback e status
- [ ] revisar estados visuais obrigatórios conforme `docs/visual/ui-system.md`
- [ ] alinhar responsividade para desktop e mobile sem perder leitura de jogo
- [ ] validar que o novo enquadramento não degrada clareza pedagógica
- [ ] atualizar documentação visual se a implementação introduzir convenções novas estáveis

### Milestone 8 — Integração completa do Capítulo I

Status: concluído.

- [x] revisar as 8 fases em `content/` contra `docs/design/phases.md`
- [x] validar `excellentAnswer`, `adequateAnswers`, `expectedProperties`, feedbacks e recompensas
- [x] revisar coerência entre fases `construction`, `choice` e `construction_choice`
- [x] confirmar que desbloqueios de inventário e coleção refletem corretamente a progressão do capítulo
- [x] revisar consistência visual e textual dos fluxos de fase
- [x] registrar decisão final de pronto do Capítulo I

### Milestone 9 — QA, segurança e deploy

Status: concluído.

- [x] definir stack oficial de testes automatizados
- [x] criar testes unitários mínimos para builder e avaliação de fase
- [x] criar testes de integração mínimos para submissão, progresso e recompensas
- [x] documentar comando oficial de testes no repositório
- [x] revisar proteção de rotas e exigência de sessão em todas as escritas
- [x] revisar tratamento de erros para evitar falso sucesso na UI
- [x] definir logging mínimo para falhas críticas
- [x] revisar variáveis de ambiente de desenvolvimento e produção
- [x] preparar checklist de deploy
- [x] executar smoke test em ambiente conectado ao Neon/Vercel

Stack atual preparada:

- `node:test` para smoke tests leves de repositório;
- `Vitest` para testes unitários em módulos puros do domínio;
- ambiente `node` como padrão inicial;
- sem browser/E2E nesta etapa.

## Issues abertas

### Builder e validação

- [ ] endurecer QA dos estados válidos e inválidos do builder
- [ ] revisar cobertura de aromaticidade e fragmentos desbloqueáveis
- [x] isolar compatibilidade legada do builder em módulo separado
- [ ] revisar pontos de expansão já modelados para não contaminarem o MVP
- [x] remover `LegacyBuilderState` e `BlueprintBuilderState` após corte explícito de compatibilidade
- [x] executar plano de remoção documentado em `docs/tech/builder-legacy-removal.md`

### Autenticação e autorização

- [ ] revisar endurecimento de sessão
- [ ] revisar autorização nas rotas de escrita
- [ ] revisar fluxos de erro de cadastro, login e logout

### Persistência e idempotência

- [ ] ampliar validação transacional e cobertura de replay
- [ ] revisar idempotência de recompensas
- [ ] revisar comportamento em cenários de falha parcial

### Conteúdo e aderência documental

- [ ] revisar aderência fina entre `content/` e `docs/design/`
- [ ] evitar drift entre implementação e documentação oficial
- [ ] atualizar documentação explicitamente quando houver divergência real

### Direção visual e percepção de produto

- [x] reduzir padrões visuais que ainda passam sensação de dashboard ou landing page
- [x] consolidar HUD, trilha de progresso e superfícies diegéticas como linguagem oficial
- [ ] revisar coerência entre hub, capítulo, fase, coleção e autenticação
- [ ] garantir que atmosfera visual não prejudique contraste, leitura e uso mobile

## Próxima sequência recomendada

1. abrir o Milestone 10 com redesign do `layout` autenticado e da tela `/game`
2. transformar a navegação global em HUD e definir tokens compartilhados de jogo
3. reenquadrar `/chapter/[chapterId]` e `/collection` dentro da nova linguagem
4. revisar estados visuais de fase, feedback e progressão contra `docs/visual/ui-system.md`
5. manter documentação e checklist sincronizados com as decisões consolidadas
6. tratar o aviso não bloqueante do Vitest/Vite quando houver janela técnica
7. opcionalmente ampliar cobertura de integração com Prisma real de teste

## Critério de fechamento do tracker

O tracker pode ser considerado encerrado quando:

- [x] as 8 fases oficiais estiverem validadas como pacote completo
- [x] `typecheck` e `build` estiverem estáveis
- [x] checklist de QA mínimo estiver preenchido e sem bloqueadores
- [x] autenticação, progresso, inventário, recompensas e replay estiverem estáveis
- [x] fluxo ponta a ponta estiver validado para um jogador novo
- [ ] linguagem visual principal do MVP estiver percebida como jogo de forma consistente nas rotas protegidas

## Registro de aceite

- Data: 2026-04-21
- Ambiente validado: Vercel + Neon
- Escopo validado: cadastro, login, `/game`, todas as fases, persistência de progresso, `/collection`, logout e retomada de sessão
- Resultado: aceite funcional do MVP no fluxo central do jogador
- Observações residuais:
  - ajustar `APP_BASE_URL` para remover barra final;
  - aviso não bloqueante do Vitest/Vite sobre CJS permanece em aberto.
