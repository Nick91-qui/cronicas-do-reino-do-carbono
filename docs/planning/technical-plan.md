# Plano Técnico Operacional

## 1. Propósito

Este documento define o plano técnico operacional do estado atual do MVP de **Crônicas do Reino do Carbono**.

Ele não substitui:

- `docs/planning/implementation-plan.md`;
- `docs/planning/milestones-and-issues.md`;
- `docs/planning/qa-checklist.md`;
- `docs/tech/technical-spec.md`.

Seu papel é outro:

- transformar a análise técnica do repositório em backlog executável;
- priorizar correções e endurecimentos do MVP já funcional;
- organizar a sequência de trabalho por risco, impacto e dependência;
- definir critérios objetivos de aceite técnico por frente;
- reduzir ambiguidades entre "funciona" e "está pronto para sustentar evolução".

---

## 2. Snapshot técnico atual

Na revisão atual, o projeto apresenta o seguinte estado consolidado:

- arquitetura monolítica coerente em Next.js + TypeScript + Prisma;
- Capítulo I integrado e jogável;
- autenticação customizada por sessão em produção funcional;
- progresso, inventário, coleção e recompensas persistidos;
- suíte de testes passando no baseline atual;
- `npm run typecheck` passando;
- `npm test` passando.

Ao mesmo tempo, o repositório ainda possui débitos técnicos reais nas áreas abaixo:

- robustez de erro no frontend;
- endurecimento de autenticação e sessão;
- cobertura de testes comportamentais;
- redução de hardcodes do Capítulo I;
- preparação estrutural para expansão sem retrabalho.

---

## 3. Princípios de execução

O próximo ciclo técnico deve seguir estes princípios:

### 3.1 Corrigir risco real antes de expandir escopo

O projeto não precisa de mais superfície funcional antes de fechar robustez do que já existe.

### 3.2 Priorizar falhas silenciosas e estados presos

Erros que degradam a experiência do jogador sem mensagem clara devem vir antes de refinamentos arquiteturais.

### 3.3 Endurecer autenticação sem reescrever o modelo

O objetivo não é trocar a autenticação customizada agora, e sim reduzir risco operacional dentro do modelo atual.

### 3.4 Aumentar cobertura por comportamento, não só por presença estrutural

Testes devem validar fluxo real, regras e regressões críticas, e não apenas detectar texto ou wiring mínimo.

### 3.5 Remover hardcodes somente quando isso reduzir custo futuro

Nem todo acoplamento do MVP precisa ser abstraído agora. O foco é atacar os pontos que já encarecem manutenção ou expansão.

---

## 4. Frentes técnicas prioritárias

O ciclo técnico recomendado está organizado em seis frentes:

- **Frente A — Robustez de frontend e tratamento de erro**
- **Frente B — Segurança, autenticação e sessão**
- **Frente C — Persistência, progresso e idempotência**
- **Frente D — Testes e cobertura crítica**
- **Frente E — Conteúdo, capítulos e redução de hardcodes**
- **Frente F — Higiene operacional e observabilidade**

---

## 5. Ordem recomendada

Sequência oficial recomendada:

1. Frente A — Robustez de frontend e tratamento de erro
2. Frente B — Segurança, autenticação e sessão
3. Frente C — Persistência, progresso e idempotência
4. Frente D — Testes e cobertura crítica
5. Frente E — Conteúdo, capítulos e redução de hardcodes
6. Frente F — Higiene operacional e observabilidade

Justificativa:

- a Frente A elimina estados quebrados perceptíveis ao jogador;
- a Frente B reduz risco operacional e de abuso;
- a Frente C endurece o núcleo autoritativo do jogo;
- a Frente D consolida segurança contra regressão;
- a Frente E prepara expansão futura sem atrapalhar o fechamento do MVP atual;
- a Frente F fecha lacunas residuais de operação e manutenção.

---

## 6. Frente A — Robustez de frontend e tratamento de erro

### Objetivo

Eliminar falhas de UX causadas por erro de rede, exceções não tratadas e estados visuais presos.

### Problemas atuais

- `components/auth/auth-form.tsx` não trata erro de rede com `try/catch/finally`;
- `components/phase/phase-experience.tsx` deixa submissão vulnerável a estado preso em caso de falha de `fetch`;
- validação do builder pode falhar sem feedback amigável ao jogador.

### Entregas principais

- encapsular `fetch` de login/cadastro com tratamento explícito de erro;
- encapsular `fetch` de validação do builder com fallback amigável;
- encapsular `fetch` de submissão de fase com `try/catch/finally`;
- garantir reset confiável de `isPending`, `isSubmitting` e estados derivados;
- revisar mensagens de erro para distinguir:
  - falha de validação;
  - falha de rede;
  - falha interna.

### Critérios de aceite

- nenhuma ação principal do jogador fica com loading infinito após falha;
- erro de rede em login, cadastro, validação e submissão retorna mensagem legível;
- refresh ou navegação subsequente não herda estado quebrado da tentativa anterior;
- o jogador sempre consegue tentar novamente sem recarregar manualmente a página.

### Estimativa

- esforço: baixo a médio;
- risco: baixo;
- impacto: alto.

---

## 7. Frente B — Segurança, autenticação e sessão

### Objetivo

Endurecer o modelo atual de autenticação sem substituir a arquitetura escolhida para o MVP.

### Problemas atuais

- ausência de rate limiting visível em login e cadastro;
- uso de hashing síncrono de senha;
- ausência de política explícita de limpeza de sessões expiradas;
- variável `AUTH_SECRET` exigida, mas sem uso evidente no fluxo atual;
- rota de validação do builder fora do padrão de hardening aplicado nas demais rotas.

### Entregas principais

- implementar rate limiting básico em login e cadastro;
- revisar se o hashing de senha deve migrar para variante assíncrona ou permanecer síncrono com decisão documentada;
- limpar sessões expiradas em leitura ou via rotina operacional definida;
- revisar necessidade real de `AUTH_SECRET`;
- alinhar a rota `builder/validate` ao padrão de resposta, cache e logging do projeto;
- revisar política de cookie e documentação de sessão.

### Critérios de aceite

- múltiplas tentativas abusivas de login/cadastro passam a ser mitigadas;
- sessões expiradas não acumulam indefinidamente sem estratégia definida;
- o conjunto de variáveis obrigatórias reflete apenas o que o sistema realmente usa;
- rotas de gameplay expõem postura de hardening consistente.

### Estimativa

- esforço: médio;
- risco: médio;
- impacto: alto.

---

## 8. Frente C — Persistência, progresso e idempotência

### Objetivo

Garantir que o núcleo autoritativo do jogo permaneça correto sob replay, erro parcial e evolução futura.

### Problemas atuais

- o fluxo está funcional, mas a validação transacional ainda merece cobertura mais profunda;
- o modelo usa snapshots e eventos corretos para o MVP, porém precisa de garantias melhores de replay e consistência;
- parte da semântica dos campos persistidos ainda está muito acoplada ao comportamento atual.

### Entregas principais

- revisar persistência de `constructedMoleculeId` e campos correlatos;
- revisar regras de replay para fase já concluída;
- testar explicitamente primeira conclusão, replay correto e replay incorreto;
- endurecer cenários de falha parcial na transação;
- revisar se o modelo atual suporta expansão para novos capítulos sem recalcular regras centrais.

### Critérios de aceite

- conclusão correta aplica recompensa apenas na primeira conclusão válida;
- replay não duplica recompensa nem corrompe `bestScore`, `attemptCount` ou desbloqueio;
- campos persistidos refletem com clareza a submissão real do jogador;
- comportamento do progresso segue determinístico em todos os fluxos principais.

### Estimativa

- esforço: médio;
- risco: médio;
- impacto: alto.

---

## 9. Frente D — Testes e cobertura crítica

### Objetivo

Elevar a segurança de mudança do projeto com cobertura focada em comportamento real e regressões prováveis.

### Problemas atuais

- parte do QA atual verifica presença textual de convenções;
- alguns testes de integração mockam excessivamente a camada persistente;
- faltam testes para autenticação, sessão, `builder/validate` e falhas críticas de progressão.

### Entregas principais

- adicionar testes de rota para login, cadastro, logout e validação do builder;
- ampliar testes de integração de progresso com menos mocks e mais comportamento real;
- cobrir cenários de replay, duplicidade de recompensa e sessão inválida;
- revisar o valor de introduzir integração com Prisma real de teste;
- decidir explicitamente se E2E/browser ainda fica fora do escopo do ciclo.

### Critérios de aceite

- fluxos críticos de autenticação, validação do builder e submissão têm cobertura comportamental mínima;
- regressões de replay e recompensa passam a ser detectadas automaticamente;
- o baseline de QA deixa de depender apenas de inspeção estrutural de arquivos.

### Estimativa

- esforço: médio;
- risco: baixo a médio;
- impacto: alto.

---

## 10. Frente E — Conteúdo, capítulos e redução de hardcodes

### Objetivo

Reduzir os acoplamentos que já dificultam manutenção e preparar a base para múltiplos capítulos sem refactor grande.

### Problemas atuais

- carregadores e páginas ainda operam com forte suposição de Capítulo I único;
- `chapter-1` aparece como decisão fixa em partes importantes do app;
- a estrutura suporta expansão conceitualmente, mas não ainda no fluxo prático.

### Entregas principais

- remover hardcodes desnecessários de `chapter-1` nas páginas protegidas;
- alinhar rotas dinâmicas de capítulo ao loader de conteúdo como fonte de verdade;
- revisar se a navegação principal pode derivar o capítulo ativo do progresso real;
- documentar claramente o que continua propositalmente limitado ao MVP.

### Critérios de aceite

- páginas dinâmicas de capítulo não dependem de string fixa quando isso não é necessário;
- o sistema consegue reconhecer capítulos válidos a partir do conteúdo carregado;
- a expansão para Capítulo II deixa de exigir reestruturação da navegação central.

### Estimativa

- esforço: médio;
- risco: baixo a médio;
- impacto: médio.

---

## 11. Frente F — Higiene operacional e observabilidade

### Objetivo

Fechar lacunas residuais de operação, suporte e manutenção do sistema em ambiente real.

### Problemas atuais

- logging ainda é mínimo e centrado em `console.error`;
- há decisões operacionais implícitas que ainda não estão suficientemente formalizadas;
- o aviso não bloqueante do Vitest/Vite permanece em aberto.

### Entregas principais

- revisar escopo e formato do logging mínimo do servidor;
- definir política simples para limpeza de sessão expirada;
- revisar e documentar variáveis de ambiente realmente usadas;
- tratar ou registrar explicitamente o aviso do Vitest/Vite;
- alinhar checklist de QA com os novos endurecimentos técnicos.

### Critérios de aceite

- falhas críticas relevantes passam a gerar contexto suficiente para investigação;
- ambiente local e produção usam documentação compatível com o código real;
- o time consegue repetir validações centrais sem ambiguidade operacional.

### Estimativa

- esforço: baixo;
- risco: baixo;
- impacto: médio.

---

## 12. Backlog priorizado

### Prioridade P0

- corrigir estados presos em login, cadastro, validação do builder e submissão de fase;
- garantir feedback amigável para falha de rede e erro inesperado no cliente;
- revisar endurecimento básico de sessão;
- cobrir replay e recompensas com testes comportamentais.

### Prioridade P1

- adicionar rate limiting em autenticação;
- alinhar rota `builder/validate` ao padrão de hardening do projeto;
- revisar limpeza de sessão expirada;
- reduzir hardcodes críticos de `chapter-1`;
- ampliar testes de rota e integração realistas.

### Prioridade P2

- revisar variante síncrona de hashing de senha;
- revisar tipagem/modelagem de campos mais frouxos no schema;
- formalizar melhorias de observabilidade;
- documentar decisões residuais do ciclo.

---

## 13. Dependências entre frentes

- A Frente D depende parcialmente da A e da C para que os testes capturem o comportamento final esperado.
- A Frente E não deve começar antes de estabilizar A e B, para evitar expandir superfície sobre base ainda frágil.
- A Frente F deve acompanhar o fechamento das demais frentes, não antecedê-las.

---

## 14. Sequência de execução sugerida por sprint

### Sprint 1 — Estabilidade visível do jogador

- Frente A completa;
- partes mais urgentes da Frente B;
- testes mínimos cobrindo os erros corrigidos.

### Sprint 2 — Endurecimento do núcleo autoritativo

- Frente C;
- expansão principal da Frente D;
- revisão das rotas críticas.

### Sprint 3 — Preparação de escala controlada

- Frente E;
- fechamento da Frente F;
- atualização final de documentação e checklist.

---

## 15. Critério de fechamento do plano

Este plano pode ser considerado concluído quando:

- o frontend não apresentar estados presos nas ações principais;
- autenticação e sessão estiverem endurecidas no nível esperado para o MVP;
- replay, recompensa e progresso estiverem cobertos por testes comportamentais;
- os hardcodes mais restritivos do Capítulo I tiverem sido removidos ou documentados como limitação consciente;
- documentação de operação, QA e ambiente refletir o código real.

---

## 16. Próximo passo recomendado

O próximo passo técnico recomendado é iniciar pela **Frente A — Robustez de frontend e tratamento de erro**, porque ela entrega impacto imediato ao jogador, tem baixo risco de implementação e reduz falsos negativos durante o endurecimento das frentes seguintes.
