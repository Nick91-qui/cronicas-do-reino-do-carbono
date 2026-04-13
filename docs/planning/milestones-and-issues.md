# Milestones e Issues

## 1. Propósito do documento

Este documento organiza a execução do MVP em milestones técnicas objetivas, com critérios de aceite, dependências e issues de implementação.

Ele complementa:

- `docs/planning/implementation-plan.md`;
- `docs/tech/technical-spec.md`;
- `docs/design/content-model.md`;
- `docs/design/phases.md`.

Este documento deve ser usado para guiar execução incremental. Em caso de conflito, prevalecem as regras oficiais definidas em `docs/tech/technical-spec.md` e `docs/design/content-model.md`.

---

## 2. Regras operacionais obrigatórias

Toda implementação do MVP deve obedecer às seguintes regras:

- o conteúdo do jogo é estático e vive em arquivos locais versionados;
- o banco de dados existe apenas para autenticação, sessão, progresso, inventário, tentativas, recompensas e analytics;
- toda validação química e de gameplay é autoritativa no servidor;
- nenhuma submissão é aceita sem justificativa por propriedades quando a fase exigir escolha de molécula;
- a justificativa deve conter de 1 a 3 tags do enum oficial `SelectableProperty`;
- o cliente nunca define progressão, pontuação oficial ou validade final da resposta;
- toda entrada de escrita deve ser validada com schemas tipados.

---

## 3. Milestone 1 — Fundação do projeto

### Objetivo

Preparar a base técnica e estrutural do repositório.

### Escopo

- inicializar projeto Next.js com TypeScript;
- configurar Tailwind CSS;
- configurar Prisma;
- configurar conexão com Neon/PostgreSQL;
- definir estrutura base de diretórios segundo o spec técnico;
- configurar variáveis de ambiente mínimas;
- preparar convenções de tipagem e nomenclatura.

### Critérios de aceite

- projeto sobe localmente;
- conexão com banco funciona;
- Prisma gera cliente corretamente;
- estrutura de pastas reflete a arquitetura oficial;
- ambiente local suporta evolução dos próximos milestones.

### Dependências

- nenhuma.

### Issues principais

- definir versão exata de Node.js e gerenciador de pacotes;
- definir convenção exata de naming no Prisma;
- definir política mínima de `.env` para desenvolvimento.

---

## 4. Milestone 2 — Conteúdo tipado e loaders

### Objetivo

Materializar a fonte estática de verdade do jogo em arquivos e loaders tipados.

### Escopo

- criar estrutura de `content/`;
- modelar capítulos, fases, moléculas e enums conforme `docs/design/content-model.md`;
- implementar loaders tipados para conteúdo estático;
- validar integridade interna dos ids e referências;
- garantir que `phases.md` e conteúdo carregável usem o mesmo vocabulário técnico.

### Critérios de aceite

- conteúdo do Capítulo I é carregável por código;
- ids de fase, molécula e fragmento são validados;
- loaders falham de forma explícita em caso de referência inválida;
- nenhuma dependência de banco é usada para servir conteúdo estático.

### Dependências

- conclusão do Milestone 1.

### Issues principais

- decidir formato final dos arquivos de conteúdo (`.ts`, `.json` ou híbrido controlado);
- garantir compatibilidade entre nomes de exibição e ids técnicos;
- validar se haverá normalização de conteúdo em build time ou runtime.

---

## 5. Milestone 3 — Builder e validação química no servidor

### Objetivo

Implementar o núcleo químico do MVP com validação estrutural determinística.

### Escopo

- definir o formato do estado do builder;
- implementar parsing do builder state no servidor;
- validar estruturas segundo as regras simplificadas do projeto;
- completar hidrogênios automaticamente quando aplicável;
- resolver a molécula oficial resultante, quando houver correspondência;
- retornar erro claro para estruturas inválidas;
- persistir snapshots do builder nas tentativas.

### Critérios de aceite

- estruturas inválidas nunca geram moléculas válidas;
- a mesma entrada sempre produz o mesmo resultado;
- o servidor resolve corretamente moléculas oficiais do Capítulo I;
- builder state pode ser serializado e armazenado em JSON;
- o cliente recebe resposta suficiente para exibir preview ou erro.

### Dependências

- conclusão do Milestone 2.

### Issues principais

- definir forma exata do `builderStateJson`;
- definir se a rota de validação retorna apenas validade ou também a molécula resolvida;
- decidir como representar estrutura aromática no builder sem criar ambiguidade.

---

## 6. Milestone 4 — Autenticação, sessão e turma

### Objetivo

Introduzir identidade persistente do jogador com vínculo à turma.

### Escopo

- implementar cadastro com código da turma, nome de exibição, username e senha;
- implementar login e logout;
- implementar sessão autenticada;
- proteger rotas privadas;
- persistir `Classroom`, `Player` e `Session`;
- aplicar hashing seguro de senha.

### Critérios de aceite

- um jogador consegue criar conta e autenticar;
- a sessão é validada no servidor para todas as escritas;
- progresso não pode ser gravado sem autenticação;
- vínculo com turma é persistido corretamente.

### Dependências

- conclusão do Milestone 1.

### Issues principais

- definir estratégia exata de sessão persistida;
- definir seed ou provisão inicial de turmas;
- definir política de unicidade para `username` por turma ou global.

---

## 7. Milestone 5 — Loop central de fase

### Objetivo

Implementar o fluxo oficial de fase ponta a ponta.

### Escopo

- carregar fase desbloqueada;
- renderizar narrativa, objetivo e recursos;
- integrar builder, coleção/cartas e escolha de molécula;
- implementar seleção de propriedades;
- implementar submissão de fase;
- avaliar resposta no servidor;
- retornar feedback qualitativo.

### Regras obrigatórias deste milestone

- fases `choice` e `construction_choice` exigem `selectedMoleculeId`;
- fases com justificativa exigem `selectedProperties` com 1 a 3 itens;
- as propriedades devem ser validadas contra `SelectableProperty`;
- não há texto livre;
- a qualidade da justificativa só qualifica resposta já potencialmente correta; não corrige molécula errada.

### Critérios de aceite

- o fluxo completo funciona para ao menos uma fase de cada tipo técnico;
- o servidor produz `excellent`, `adequate` ou `inadequate` conforme regra oficial;
- o mapeamento para `correct` e `incorrect` funciona corretamente;
- o cliente exibe feedback sem assumir regras locais.

### Dependências

- conclusão do Milestone 3;
- conclusão do Milestone 4.

### Issues principais

- definir shape final da submissão para fases `construction`;
- decidir se `construction` usa endpoint de submit separado ou mesma rota com payload adaptado;
- definir estratégia de reaproveitamento do preview do builder no fluxo de resposta.

---

## 8. Milestone 6 — Persistência de tentativas e progresso

### Objetivo

Persistir o estado oficial do jogador com segurança para replay e retomada.

### Escopo

- registrar `PlayerPhaseAttempt`;
- manter `PlayerPhaseSummary`;
- manter `PlayerChapterProgress`;
- atualizar melhor pontuação da fase;
- desbloquear próxima fase apenas com `validationResult = correct`;
- permitir replay de fases concluídas.

### Critérios de aceite

- todas as tentativas ficam registradas;
- o resumo da fase reflete o melhor resultado;
- o progresso do capítulo é atualizado sem ambiguidade;
- replay não corrompe progresso já obtido;
- atualizações críticas ocorrem de forma transacional quando necessário.

### Dependências

- conclusão do Milestone 5.

### Issues principais

- definir cálculo exato de `highestUnlockedPhaseNumber`;
- definir se `attemptCount` inclui toda submissão válida de payload ou apenas submissão avaliada;
- definir política para reprocessamento em caso de falha parcial de escrita.

---

## 9. Milestone 7 — Inventário, coleção e recompensas

### Objetivo

Persistir e refletir no jogo os desbloqueios do jogador.

### Escopo

- implementar `PlayerInventory`;
- implementar `PlayerRewardEvent`;
- aplicar recompensas por fase concluída;
- desbloquear cartas e títulos;
- expor coleção de moléculas desbloqueadas;
- refletir fragmentos estruturais desbloqueados no builder.

### Critérios de aceite

- recompensas são aplicadas uma única vez por evento elegível;
- inventário e histórico de recompensa permanecem consistentes entre si;
- coleção mostra somente cartas desbloqueadas;
- novos fragmentos realmente alteram possibilidades válidas do builder.

### Dependências

- conclusão do Milestone 6.

### Issues principais

- definir estratégia de idempotência para reward grants;
- definir ordem de aplicação entre fase concluída, reward event e inventory snapshot;
- decidir se coleção terá endpoint próprio ou derivará do inventário.

---

## 10. Milestone 8 — Integração completa do Capítulo I

### Objetivo

Integrar as 8 fases oficiais com seus conteúdos, feedbacks e recompensas.

### Escopo

- integrar fases 1–2;
- integrar fases 3–5;
- integrar fases 6–8;
- validar coerência entre `content-model`, `phases`, `teacher-guide` e implementação;
- revisar feedbacks, propriedades esperadas e respostas adequadas.

### Critérios de aceite

- todas as 8 fases estão jogáveis;
- ids e enums coincidem com a documentação;
- respostas `adequate` e `excellent` respeitam o conteúdo oficial;
- feedbacks e recompensas batem com os documentos em `docs/`.

### Dependências

- conclusão do Milestone 7.

### Issues principais

- revisar se todas as fases têm conteúdo carregável equivalente ao documento textual;
- garantir que exemplos pedagógicos não conflitam com lógica técnica;
- revisar se todas as propriedades esperadas existem no enum oficial.

---

## 11. Milestone 9 — QA, segurança e deploy

### Objetivo

Fechar o MVP com estabilidade mínima de produção.

### Escopo

- testes unitários dos módulos críticos;
- testes de integração dos fluxos críticos;
- validação final de autenticação e autorização;
- validação final de persistência e replay;
- analytics leves;
- deploy em Vercel com Neon;
- smoke tests em produção.

### Critérios de aceite

- testes cobrem builder, avaliação, progresso e recompensas;
- escrita protegida depende sempre de sessão válida;
- produção sobe com conteúdo estático oficial e banco configurado;
- um jogador novo consegue cadastrar, jogar, avançar e retomar progresso.

### Dependências

- conclusão do Milestone 8.

### Issues principais

- definir conjunto mínimo de testes de integração para aceite;
- definir logging mínimo em produção;
- definir observabilidade mínima para falhas de submissão.

---

## 12. Issues transversais

As issues abaixo atravessam múltiplos milestones e devem ser acompanhadas continuamente.

### 12.1 Tipagem e contratos

- garantir aderência estrita aos enums e tipos de `docs/design/content-model.md`;
- impedir drift entre conteúdo estático e contratos do backend;
- manter nomes técnicos em inglês e textos de exibição em português quando aplicável.

### 12.2 Validação de submissão

- validar `phaseId`, `selectedMoleculeId` e `selectedProperties` no servidor;
- rejeitar propriedades fora do enum oficial;
- rejeitar seleção vazia quando a fase exigir justificativa;
- rejeitar mais de 3 propriedades;
- normalizar ou rejeitar duplicatas explicitamente.

### 12.3 Autoridade do servidor

- a lógica química não pode existir apenas no cliente;
- a progressão não pode depender de estado enviado pelo frontend;
- toda regra de pontuação deve ser recalculada no servidor a partir do conteúdo oficial.

### 12.4 Conteúdo e persistência

- não mover conteúdo estático para banco por conveniência;
- não usar banco como CMS do MVP;
- manter operacional e conteúdo claramente separados.

### 12.5 Coerência pedagógica

- não aceitar resposta sem justificativa quando a fase exigir justificativa;
- não introduzir texto livre em lugar de tags selecionáveis;
- não transformar resposta `adequate` em erro de progressão.

---

## 13. Ordem recomendada de execução

A sequência recomendada é:

1. Milestone 1 — Fundação do projeto
2. Milestone 2 — Conteúdo tipado e loaders
3. Milestone 3 — Builder e validação química no servidor
4. Milestone 4 — Autenticação, sessão e turma
5. Milestone 5 — Loop central de fase
6. Milestone 6 — Persistência de tentativas e progresso
7. Milestone 7 — Inventário, coleção e recompensas
8. Milestone 8 — Integração completa do Capítulo I
9. Milestone 9 — QA, segurança e deploy

Essa ordem existe para reduzir retrabalho e validar primeiro os pontos de maior risco técnico.

---

## 14. Definição de pronto por implementação

O MVP estará pronto para aceite técnico quando:

- as 8 fases oficiais estiverem integradas;
- o conteúdo continuar estático em arquivos locais;
- o banco estiver limitado ao domínio operacional do jogador;
- a validação química e de gameplay ocorrer integralmente no servidor;
- nenhuma submissão válida de fase baseada em escolha for aceita sem 1 a 3 propriedades;
- autenticação, progresso, inventário, recompensas e replay estiverem estáveis;
- o fluxo completo funcionar em produção para um jogador novo.
