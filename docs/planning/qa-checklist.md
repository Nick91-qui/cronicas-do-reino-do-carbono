# Checklist de QA do MVP

## Propósito

Este documento define o checklist mínimo de QA para o MVP de **Crônicas do Reino do Carbono**.

Ele existe para:

- padronizar a validação manual dos fluxos críticos;
- registrar o que precisa ser verificado antes de considerar o MVP estável;
- reduzir regressões entre ajustes de conteúdo, gameplay e persistência;
- servir como base para futuros smoke tests automatizados.

Este checklist complementa:

- `README.md`;
- `docs/product/mvp-scope.md`;
- `docs/design/phases.md`;
- `docs/design/content-model.md`;
- `docs/tech/technical-spec.md`;
- `docs/planning/implementation-plan.md`.

## Regra de uso

Sempre que houver mudança em qualquer uma das áreas abaixo, o checklist correspondente deve ser revalidado:

- autenticação;
- conteúdo em `content/`;
- builder molecular;
- avaliação de fase;
- progresso;
- inventário;
- coleção;
- rotas e telas protegidas;
- persistência Prisma.

## Critério mínimo de liberação

Para considerar o MVP apto para nova entrega interna ou validação ampliada, o mínimo esperado é:

- `npm run typecheck` passando;
- `npm run build` passando;
- smoke test manual dos fluxos críticos concluído;
- nenhuma divergência conhecida entre `content/` e `docs/design/phases.md` para o Capítulo I;
- nenhum erro bloqueador em autenticação, submissão de fase, progresso ou inventário.

## Checklist técnico

### Ambiente

- [ ] `.env` configurado com valores válidos.
- [ ] Banco local sobe corretamente com `npm run db:dev:up`.
- [ ] Prisma gera cliente corretamente.
- [ ] Seed inicial executa sem erro.
- [ ] `npm run typecheck` passa sem erro.
- [ ] `npm run build` passa sem erro.

### Autenticação

- [ ] cadastro com turma válida funciona.
- [ ] cadastro com username já existente falha com mensagem adequada.
- [ ] login com credenciais válidas funciona.
- [ ] login com senha inválida falha com mensagem adequada.
- [ ] rotas protegidas redirecionam visitante não autenticado para `/login`.
- [ ] logout encerra a sessão corretamente.

### Navegação principal

- [ ] página inicial carrega sem erro.
- [ ] `/game` carrega com progresso e inventário do jogador.
- [ ] `/chapter/chapter-1` exibe as 8 fases do capítulo.
- [ ] fases bloqueadas não ficam acessíveis diretamente por URL.
- [ ] `/collection` exibe cartas desbloqueadas sem erro.
- [ ] `/profile` carrega sem erro.

## Checklist funcional do Capítulo I

### Integridade do capítulo

- [ ] o capítulo possui 8 fases jogáveis.
- [ ] as fases seguem ordem linear de desbloqueio.
- [ ] o jogador inicia com a Fase 1 desbloqueada.
- [ ] a conclusão correta de uma fase desbloqueia a próxima.
- [ ] erro em uma fase não desbloqueia progressão.

### Fases de construção

- [ ] estrutura válida gera molécula oficial correta.
- [ ] estrutura inválida não gera molécula.
- [ ] feedback de erro é exibido quando a estrutura é inválida.
- [ ] fases `construction` não aceitam progressão com molécula incorreta.

### Fases de escolha

- [ ] fases `choice` exigem seleção de molécula.
- [ ] fases `choice` exigem de 1 a 3 propriedades.
- [ ] seleção com propriedades fora do enum oficial é rejeitada no servidor.
- [ ] resposta `excellent` pontua 3.
- [ ] resposta `adequate` pontua 2.
- [ ] resposta `inadequate` pontua 0.

### Fases híbridas

- [ ] fases `construction_choice` exigem builder válido quando aplicável.
- [ ] fases híbridas respeitam moléculas `excellent` e `adequate` do conteúdo oficial.
- [ ] justificativa não corrige molécula errada.

### Cobertura mínima por tipo

- [ ] ao menos uma fase `construction` foi concluída com resposta correta e incorreta.
- [ ] ao menos uma fase `choice` foi concluída com resposta correta e incorreta.
- [ ] ao menos uma fase `construction_choice` foi concluída com resposta correta e incorreta.

## Checklist de persistência

### Tentativas e progresso

- [ ] cada submissão gera tentativa persistida.
- [ ] `attemptCount` aumenta a cada nova tentativa.
- [ ] `bestScore` preserva o melhor resultado da fase.
- [ ] `isCompleted` só vira verdadeiro com `validationResult = correct`.
- [ ] replay de fase concluída não corrompe progresso.
- [ ] `chapterScore` soma corretamente os melhores resultados por fase.

### Inventário e recompensas

- [ ] inventário inicial é criado ao registrar jogador.
- [ ] recompensas de carbono são aplicadas uma única vez na primeira conclusão correta.
- [ ] fragmentos desbloqueados aparecem no inventário.
- [ ] moléculas desbloqueadas aparecem na coleção.
- [ ] títulos desbloqueados são persistidos.
- [ ] replay de fase concluída não duplica recompensa indevidamente.

### Analytics operacionais mínimos

- [ ] registro de jogador cria evento de analytics.
- [ ] autenticação cria evento de analytics.
- [ ] submissão de fase cria eventos mínimos de avaliação.
- [ ] conclusão de fase cria evento de conclusão.
- [ ] concessão de recompensa cria evento quando aplicável.

## Checklist de conteúdo

- [ ] ids de capítulo, fase, molécula e fragmento batem com `docs/design/content-model.md`.
- [ ] `excellentAnswer` e `adequateAnswers` batem com `docs/design/phases.md`.
- [ ] `expectedProperties` batem com o design oficial.
- [ ] recompensas batem com o design oficial.
- [ ] feedbacks batem com o design oficial.
- [ ] moléculas do Capítulo I batem com o escopo oficial do MVP.

## Resultado da execução

Preencher ao final de cada rodada relevante de QA:

- Data:
- Ambiente:
- Responsável:
- `typecheck`:
- `build`:
- Smoke test manual:
- Pendências encontradas:
- Decisão final:
