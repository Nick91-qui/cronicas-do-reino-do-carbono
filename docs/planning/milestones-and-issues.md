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

## Todo List por milestone

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
- [ ] remover `LegacyBuilderState` e `BlueprintBuilderState` após corte explícito de compatibilidade
- [ ] executar plano de remoção documentado em `docs/tech/builder-legacy-removal.md`

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

## Próxima sequência recomendada

1. manter documentação e checklist sincronizados com a produção
2. tratar o aviso não bloqueante do Vitest/Vite quando houver janela técnica
3. opcionalmente ampliar cobertura de integração com Prisma real de teste
4. decidir a janela técnica para remover compatibilidade legada do builder
5. iniciar planejamento do próximo ciclo pós-MVP

## Critério de fechamento do tracker

O tracker pode ser considerado encerrado quando:

- [x] as 8 fases oficiais estiverem validadas como pacote completo
- [x] `typecheck` e `build` estiverem estáveis
- [x] checklist de QA mínimo estiver preenchido e sem bloqueadores
- [x] autenticação, progresso, inventário, recompensas e replay estiverem estáveis
- [x] fluxo ponta a ponta estiver validado para um jogador novo

## Registro de aceite

- Data: 2026-04-21
- Ambiente validado: Vercel + Neon
- Escopo validado: cadastro, login, `/game`, todas as fases, persistência de progresso, `/collection`, logout e retomada de sessão
- Resultado: aceite funcional do MVP no fluxo central do jogador
- Observações residuais:
  - ajustar `APP_BASE_URL` para remover barra final;
  - aviso não bloqueante do Vitest/Vite sobre CJS permanece em aberto.
