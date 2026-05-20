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
- checklist mínimo de privacidade/LGPD aplicável concluído;
- nenhuma divergência conhecida entre `content/` e `docs/design/phases.md` para o Capítulo I;
- nenhum erro bloqueador em autenticação, submissão de fase, progresso ou inventário.

## Checklist técnico

### Ambiente

- [x] `.env` configurado com valores válidos.
- [x] Banco local sobe corretamente com `npm run db:dev:up`.
- [x] Prisma gera cliente corretamente.
- [x] Seed inicial executa sem erro.
- [x] `npm run typecheck` passa sem erro.
- [x] `npm run build` passa sem erro.

### Autenticação

- [x] cadastro com turma válida funciona.
- [ ] cadastro com username já existente falha com mensagem adequada.
- [x] login com credenciais válidas funciona.
- [ ] login com senha inválida falha com mensagem adequada.
- [x] login e cadastro respondem com `429` sob excesso de tentativas na mesma janela.
- [x] rotas protegidas redirecionam visitante não autenticado para `/login`.
- [x] logout encerra a sessão corretamente.
- [x] sessão expirada deixa de autenticar e é removida do armazenamento operacional.

### Navegação principal

- [x] página inicial carrega sem erro.
- [x] `/hall` carrega com progresso e inventário do jogador.
- [x] `/hall?chapterId=chapter-1` abre o capítulo correto no salão.
- [x] `/chapter/[chapterId]` redireciona corretamente para `/hall?chapterId=...`.
- [x] fases bloqueadas não ficam acessíveis diretamente por URL.
- [x] `/collection` exibe cartas desbloqueadas sem erro.
- [x] `/library` exibe o catálogo dos livros sem erro.
- [x] `/library/[bookId]` abre um livro válido sem erro.
- [ ] `/profile` carrega sem erro.
- [ ] `/operator` carrega sem erro para usuário com papel `operator`.
- [ ] `/operator/player/[playerId]` carrega sem erro para usuário com papel `operator`.

## Checklist funcional do Capítulo I

### Integridade do capítulo

- [x] o capítulo possui 8 fases jogáveis.
- [x] as fases seguem ordem linear de desbloqueio.
- [x] o jogador inicia com a Fase 1 desbloqueada.
- [x] a conclusão correta de uma fase desbloqueia a próxima.
- [x] erro em uma fase não desbloqueia progressão.

### Fases de construção

- [x] estrutura válida gera molécula oficial correta.
- [x] estrutura inválida não gera molécula.
- [x] feedback de erro é exibido quando a estrutura é inválida.
- [x] fases `construction` não aceitam progressão com molécula incorreta.

### Fases de escolha

- [x] fases `choice` exigem seleção de molécula.
- [x] fases `choice` exigem de 1 a 3 propriedades.
- [x] seleção com propriedades fora do enum oficial é rejeitada no servidor.
- [x] resposta `excellent` pontua 3.
- [x] resposta `adequate` pontua 2.
- [x] resposta `inadequate` pontua 0.

### Fases híbridas

- [x] fases `construction_choice` exigem builder válido quando aplicável.
- [x] fases híbridas respeitam moléculas `excellent` e `adequate` do conteúdo oficial.
- [x] justificativa não corrige molécula errada.

### Cobertura mínima por tipo

- [x] ao menos uma fase `construction` foi concluída com resposta correta e incorreta.
- [x] ao menos uma fase `choice` foi concluída com resposta correta e incorreta.
- [x] ao menos uma fase `construction_choice` foi concluída com resposta correta e incorreta.

## Checklist de persistência

### Tentativas e progresso

- [x] cada submissão gera tentativa persistida.
- [x] `attemptCount` aumenta a cada nova tentativa.
- [x] `bestScore` preserva o melhor resultado da fase.
- [x] `isCompleted` só vira verdadeiro com `validationResult = correct`.
- [x] replay de fase concluída não corrompe progresso.
- [x] `chapterScore` soma corretamente os melhores resultados por fase.

### Inventário e recompensas

- [x] inventário inicial é criado ao registrar jogador.
- [x] recompensas de carbono são aplicadas uma única vez na primeira conclusão correta.
- [x] fragmentos desbloqueados aparecem no inventário.
- [x] moléculas desbloqueadas aparecem na coleção.
- [x] títulos desbloqueados são persistidos.
- [x] replay de fase concluída não duplica recompensa indevidamente.

### Analytics operacionais mínimos

- [x] registro de jogador cria evento de analytics.
- [x] autenticação cria evento de analytics.
- [x] submissão de fase cria eventos mínimos de avaliação.
- [x] conclusão de fase cria evento de conclusão.
- [x] concessão de recompensa cria evento quando aplicável.

## Checklist mínimo de privacidade e LGPD

### Transparência

- [ ] telas públicas de login e cadastro exibem link visível para política de privacidade.
- [ ] telas públicas de login e cadastro exibem link visível para termos de uso.
- [ ] cadastro informa dados coletados, finalidade principal e uso de cookie de sessão essencial.
- [ ] cadastro exige ciência da política de privacidade e aceite explícito dos termos de uso.
- [ ] cadastro persiste versão e timestamp de ciência/aceite para política e termos.
- [ ] documentação do repositório identifica controlador, operador e canal de contato para direitos do titular.

### Minimização e acesso

- [ ] payloads de analytics não repetem identificadores ou atributos pessoais sem necessidade.
- [ ] área `operator` expõe apenas campos necessários para suporte operacional explícito.
- [ ] concessão do papel `operator` segue regra documentada de necessidade e rastreabilidade.

### Retenção e direitos do titular

- [ ] existe regra documentada de retenção para sessão, conta, analytics e histórico de tentativas.
- [ ] existe fluxo documentado para correção, exportação e exclusão ou anonimização de conta.
- [ ] `GET /api/account/export` retorna os dados da conta autenticada sem expor `passwordHash`.
- [ ] `DELETE /api/account` exige sessão, senha atual e confirmação explícita antes de excluir a conta.
- [ ] sessões expiradas possuem rotina prevista de limpeza operacional.

## Checklist de conteúdo

- [x] ids de capítulo, fase, molécula e fragmento batem com `docs/design/content-model.md`.
- [x] `excellentAnswer` e `adequateAnswers` batem com `docs/design/phases.md`.
- [x] `expectedProperties` batem com o design oficial.
- [x] recompensas batem com o design oficial.
- [x] feedbacks batem com o design oficial.
- [x] moléculas do Capítulo I batem com o escopo oficial do MVP.

## Resultado da execução

Preencher ao final de cada rodada relevante de QA:

Itens não marcados neste checklist representam débito real de validação ou correção, e não apenas ausência de atualização documental.

### Rodada registrada — 2026-05-05

- Data: 2026-05-05
- Ambiente: local do repositório + produção em Neon/Vercel para alinhamento de schema
- Responsável: usuário com suporte do Codex
- `typecheck`: aprovado
- `build`: aprovado
- Testes automatizados: `npm test` aprovado
- Infra de produção: migrations Prisma alinhadas após saneamento de duplicidade histórica em `Player.displayName`
- Escopo confirmado nesta rodada:
  - persistência oficial do tutorial contextual de síntese por jogador;
  - presença das superfícies protegidas `profile` e `operator` no build atual;
  - manutenção da suíte automatizada mínima do MVP.
- Pendências preservadas:
  - smoke test manual recente de `/profile`, `/operator` e `/operator/player/[playerId]`;
  - validação manual de responsividade e clareza pedagógica do Milestone 10;
  - confirmação manual dos fluxos negativos de autenticação marcados acima.

### Rodada registrada — 2026-04-21

- Data: 2026-04-21
- Ambiente: local + Vercel + Neon
- Responsável: usuário com suporte do Codex
- `typecheck`: aprovado
- `build`: aprovado
- Smoke test manual: aprovado em produção
- Pendências encontradas: ajustar `APP_BASE_URL` para ficar sem barra final; aviso não bloqueante do Vitest/Vite sobre CJS
- Decisão final: MVP validado no fluxo central do jogador
