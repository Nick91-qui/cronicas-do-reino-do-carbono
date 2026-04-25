# Plano de Implementação

## 1. Propósito do documento

Este documento define o plano oficial de implementação do MVP de **Crônicas do Reino do Carbono**.

Ele existe para:

- orientar a ordem de implementação;
- organizar a entrega em blocos práticos e marcos de execução;
- alinhar engenharia, integração de conteúdo e QA;
- tornar explícitas dependências e riscos;
- definir o que significa um MVP tecnicamente pronto.

Este plano é estruturado para execução, e não apenas para documentação. Ele deve ser usado em conjunto com:

- `docs/product/vision.md`;
- `docs/product/mvp-scope.md`;
- `docs/design/game-design.md`;
- `docs/design/content-model.md`;
- `docs/design/phases.md`;
- `docs/tech/technical-spec.md`.

### 1.1 Snapshot de execução atual

Na revisão atual, o repositório já ultrapassou a fase de fundação e possui uma fatia vertical funcional relevante do MVP.

Estado consolidado:

- Bloco 1 — Fundação: concluído;
- Bloco 2 — Fatia de risco de gameplay: concluído em versão funcional;
- Bloco 3 — Autenticação e banco de dados: concluído em versão funcional;
- Bloco 4 — Loop central de gameplay: concluído em versão funcional;
- Bloco 5 — Progresso, inventário e recompensas: concluído em versão funcional;
- Bloco 6 — Integração do Capítulo I: concluído no escopo do MVP;
- Bloco 7 — Estabilização, QA e implantação: concluído no fluxo central aceito;
- Bloco 8 — Reposicionamento visual de site para jogo: próximo ciclo recomendado.

Este documento continua válido como plano, mas não deve mais ser lido como se o projeto estivesse prestes a iniciar o Bloco 1.

---

## 2. Princípios de planejamento

O plano de implementação segue os princípios abaixo.

### 2.1 Jogabilidade vertical precoce

O projeto deve se tornar jogável o mais cedo possível, mesmo em uma fatia limitada.

### 2.2 Risco principal primeiro

O builder molecular e o fluxo de validação autoritativa são os riscos centrais e devem ser validados cedo.

### 2.3 Fundação antes de escala

A base técnica, o modelo operacional e as convenções do projeto devem ser definidos antes da expansão funcional ampla.

### 2.4 Conteúdo integrado progressivamente

O conteúdo do Capítulo I deve ser integrado em blocos menores, e não todo de uma vez.

### 2.5 Documentação continua oficial

Se a implementação alterar qualquer regra oficial, a documentação deve ser atualizada explicitamente.

### 2.6 QA acompanha a implementação

Testes e validação devem acompanhar as entregas críticas, e não ficar restritos ao final.

---

## 3. Estratégia de entrega

### 3.1 Modelo de execução

A abordagem oficial do MVP é uma implementação por blocos com fatias verticais progressivas.

A ordem geral é:

1. fundação técnica;
2. validação do risco central de gameplay;
3. autenticação e persistência base;
4. loop central de gameplay;
5. progresso, inventário e recompensas;
6. integração progressiva do Capítulo I;
7. estabilização, QA e deploy;
8. reposicionamento visual da experiência para leitura prioritária de jogo.

### 3.2 Interpretação prática

Isso significa que:

- a arquitetura central é criada primeiro;
- o risco técnico principal é testado cedo;
- uma primeira experiência jogável aparece antes da cobertura total do capítulo;
- blocos posteriores expandem robustez, conteúdo e confiabilidade.

---

## 4. Visão geral dos blocos

A implementação está organizada nos seguintes blocos:

- **Bloco 1 — Fundação**
- **Bloco 2 — Fatia de risco de gameplay**
- **Bloco 3 — Autenticação e banco de dados**
- **Bloco 4 — Loop central de gameplay**
- **Bloco 5 — Progresso, inventário e recompensas**
- **Bloco 6 — Integração do Capítulo I**
- **Bloco 7 — Estabilização, QA e implantação**
- **Bloco 8 — Reposicionamento visual de site para jogo**

---

## 5. Bloco 1 — Fundação

### Objetivo

Preparar a base técnica do projeto para que os blocos seguintes possam ser implementados sem retrabalho estrutural.

### Entregas principais

- projeto Next.js inicializado;
- TypeScript configurado;
- Tailwind CSS configurado;
- Prisma configurado;
- conexão com PostgreSQL/Neon validada;
- estrutura inicial de pastas definida;
- convenções de nomenclatura e tipos alinhadas à documentação oficial.

### Saídas esperadas

Ao final deste bloco, o projeto deve ter:

- estrutura mínima navegável;
- banco acessível;
- base de código pronta para módulos de autenticação, conteúdo e gameplay;
- organização coerente com `docs/tech/technical-spec.md`.

### Dependências

- nenhuma dependência técnica prévia relevante.

---

## 6. Bloco 2 — Fatia de risco de gameplay

### Objetivo

Validar cedo a mecânica de maior risco do MVP: o builder molecular guiado com validação estrutural autoritativa no servidor.

### Por que este bloco vem cedo

Se o builder não funcionar de forma clara, estável e pedagogicamente útil, o MVP perde sua mecânica central.

### Entregas principais

- UI inicial do builder;
- modelo de estado temporário do builder;
- validação estrutural no backend;
- resolução da molécula a partir da configuração válida;
- retorno de erro para estrutura inválida;
- preview ou card básico da molécula criada.

### Critérios de sucesso

- o jogador consegue montar uma estrutura simples válida;
- o servidor valida a estrutura de forma determinística;
- estruturas inválidas não geram moléculas;
- a UI recebe retorno suficiente para orientar nova tentativa.

### Dependências

- conclusão do Bloco 1.

---

## 7. Bloco 3 — Autenticação e banco de dados

### Objetivo

Introduzir identidade do jogador, autenticação vinculada à turma e persistência operacional básica.

### Entregas principais

- fluxo de cadastro;
- fluxo de login;
- sessão autenticada;
- proteção de rotas;
- entidades operacionais mínimas de `Classroom`, `Player` e `Session`;
- hashing seguro de senha.

### Critérios de sucesso

- um jogador novo consegue se cadastrar;
- um jogador existente consegue autenticar;
- rotas protegidas exigem sessão válida;
- a identidade persistida está corretamente vinculada à turma.

### Dependências

- conclusão do Bloco 1;
- alinhamento com o modelo operacional definido em `docs/tech/technical-spec.md`.

---

## 8. Bloco 4 — Loop central de gameplay

### Objetivo

Implementar o fluxo oficial de fase em versão funcional, ainda sem cobertura total do capítulo.

### Entregas principais

- carregamento de conteúdo de fase;
- exibição de narrativa curta e objetivo;
- exibição de recursos disponíveis;
- integração entre builder, escolha da molécula e seleção de propriedades;
- submissão da resposta;
- avaliação no servidor;
- feedback qualitativo ao jogador.

### Critérios de sucesso

- a fase pode ser jogada do início ao feedback final;
- a submissão retorna `excellent`, `adequate` ou `inadequate` quando aplicável;
- a camada interna de validação mapeia corretamente para `correct` e `incorrect`;
- o fluxo visual respeita o design oficial.

### Dependências

- conclusão do Bloco 2;
- conclusão do Bloco 3.

---

## 9. Bloco 5 — Progresso, inventário e recompensas

### Objetivo

Persistir o estado oficial do jogador e garantir progressão segura entre tentativas, sucesso e replay.

### Entregas principais

- histórico de tentativas por fase;
- resumo por jogador-fase;
- progresso por capítulo;
- snapshot de inventário;
- aplicação de recompensas;
- histórico de eventos de recompensa;
- lógica de melhor pontuação.

### Critérios de sucesso

- o jogador pode errar e tentar novamente sem perda estrutural de progresso;
- o melhor resultado da fase é preservado;
- a próxima fase só é desbloqueada com `correct`;
- o inventário reflete corretamente desbloqueios e recompensas.

### Dependências

- conclusão do Bloco 3;
- conclusão do Bloco 4.

---

## 10. Bloco 6 — Integração do Capítulo I

### Objetivo

Integrar progressivamente o conteúdo real das 8 fases do Capítulo I.

### Estratégia de integração

O conteúdo deve ser integrado em três subblocos:

### 6A — Fases 1 e 2

Foco em:

- fluxo de construção fundamental;
- estabilidade estrutural do carbono;
- ligação entre carbonos.

### 6B — Fases 3 a 5

Foco em:

- lógica de escolha;
- comparação entre moléculas;
- volatilidade e potencial energético;
- introdução de ligação dupla.

### 6C — Fases 6 a 8

Foco em:

- transformação química;
- polimerização;
- aromaticidade;
- integração do conjunto completo do capítulo.

### Critérios de sucesso

- todas as fases usam o conteúdo oficial;
- ids e propriedades batem com `docs/design/content-model.md`;
- respostas ideais e adequadas batem com `docs/design/phases.md`;
- recompensas e feedback permanecem coerentes com o design oficial.

### Dependências

- conclusão do Bloco 4;
- conclusão do Bloco 5.

---

## 11. Bloco 7 — Estabilização, QA e implantação

### Objetivo

Refinar o MVP para disponibilização em ambiente de produção com confiabilidade mínima adequada.

### Entregas principais

- correção de bugs críticos;
- refinamento de UI e feedback;
- cobertura mínima de testes unitários e integração;
- analytics leves funcionando;
- deploy em produção na Vercel;
- validação final do ambiente com banco Neon.

### Critérios de sucesso

- fluxos críticos funcionam em produção;
- erros de persistência não geram falso sucesso na UI;
- login, submissão, progresso e inventário funcionam ponta a ponta;
- o sistema está pronto para uso por um jogador novo.

### Dependências

- conclusão dos Blocos 1 a 6.

---

## 12. Bloco 8 — Reposicionamento visual de site para jogo

### Objetivo

Reposicionar a percepção do MVP para que a experiência seja lida prioritariamente como jogo, preservando o núcleo funcional já validado.

### Entregas principais

- HUD autenticada em lugar de navegação com aparência de app;
- hub principal `/game` reenquadrado como sala do reino e ponto de progressão;
- capítulo reenquadrado como trilha de provas, portais e estados de avanço;
- coleção reenquadrada como grimório e biblioteca de recompensas;
- tokens visuais compartilhados para superfícies, molduras, brilho e estados;
- revisão dos estados obrigatórios de UI conforme `docs/visual/ui-system.md`.

### Critérios de sucesso

- as rotas protegidas passam a compartilhar linguagem visual coerente de jogo;
- progresso, bloqueio, conquista e ação ficam visíveis sem depender de metáforas de dashboard;
- a nova camada visual preserva contraste, leitura pedagógica e uso mobile;
- o ciclo não introduz regressão no loop central, autenticação ou persistência.

### Dependências

- conclusão do Bloco 7;
- aderência explícita a `docs/visual/visual-direction.md`;
- aderência explícita a `docs/visual/ui-system.md`.

---

## 13. Dependências entre blocos

A sequência mínima recomendada é:

- Bloco 1 antes de todos os demais;
- Bloco 2 antes do loop completo de gameplay;
- Bloco 3 antes da persistência oficial do jogador;
- Bloco 4 antes da integração completa do capítulo;
- Bloco 5 antes da validação final de progressão;
- Bloco 6 antes do hardening final;
- Bloco 7 como fechamento do MVP funcional;
- Bloco 8 após o fechamento funcional, usando a base estável para reenquadramento visual sem reabrir o núcleo sistêmico.

Embora haja espaço para trabalho paralelo em partes da UI e do conteúdo, o projeto deve respeitar essa ordem lógica para evitar retrabalho.

---

## 14. Estratégia do ciclo visual pós-MVP

### Objetivo

Após o fechamento funcional do MVP, o próximo ciclo deve reposicionar a percepção do produto para que a experiência seja lida antes como jogo e apenas secundariamente como aplicação web.

Esse ciclo não existe para refazer o núcleo sistêmico já validado. Ele existe para:

- reenquadrar a moldura visual do jogo;
- aproximar implementação e direção visual oficial;
- reduzir padrões de dashboard, landing page e app administrativo;
- aumentar a coerência entre hub, capítulo, fase, coleção e autenticação.

### Princípio de execução

O Bloco 8 deve preservar como base estável:

- rotas;
- autenticação;
- persistência;
- conteúdo oficial;
- avaliação de fase;
- progressão já aceita.

O trabalho deve se concentrar em interface, composição, estados visuais e linguagem sistêmica.

### Ordem interna recomendada

O ciclo visual deve seguir a seguinte prioridade:

1. moldura global autenticada e HUD;
2. hub principal `/game` como sala do reino e ponto de progressão;
3. capítulo como trilha de provas e portais;
4. coleção como grimório e biblioteca de recompensas;
5. consolidação de tokens, superfícies e estados visuais compartilhados;
6. refinamento de feedback e leitura de progressão nas fases.

### Critério de sucesso do ciclo

Ao final do Bloco 8, o MVP deve:

- preservar legibilidade pedagógica e responsividade;
- apresentar continuidade visual entre as rotas protegidas;
- comunicar progresso, bloqueio, conquista e ação com linguagem de jogo;
- reduzir claramente a leitura de interface genérica de site.

---

## 15. Riscos principais

### 15.1 Builder molecular

Risco:

- dificuldade de equilibrar liberdade controlada, clareza visual e validação estrutural.

Mitigação:

- validar cedo no Bloco 2;
- manter o modelo semilivre dentro dos limites do MVP.

### 15.2 Deriva entre conteúdo e implementação

Risco:

- o código divergir da documentação oficial de fases, ids, propriedades e avaliação.

Mitigação:

- usar conteúdo estático versionado;
- alinhar naming e tipos à documentação oficial;
- revisar integração fase por fase.

### 15.3 Complexidade de persistência

Risco:

- misturar tentativa, progresso, inventário e recompensa de forma inconsistente.

Mitigação:

- separar tentativas de resumos;
- usar modelo operacional explícito;
- aplicar atualizações críticas em transação quando necessário.

### 15.4 Escopo excessivo

Risco:

- tentar incluir sistemas fora do MVP, como painel docente, autoria de conteúdo ou editor químico avançado.

Mitigação:

- seguir rigidamente o escopo oficial;
- adiar extensões para revisões futuras.

### 15.5 Percepção visual genérica

Risco:

- o MVP permanecer funcional, mas continuar sendo percebido como aplicação web tematizada em vez de jogo.

Mitigação:

- executar o Bloco 8 como ciclo explícito;
- consolidar HUD, progressão visual e superfícies compartilhadas;
- validar a implementação contra `docs/visual/visual-direction.md` e `docs/visual/ui-system.md`.

---

## 16. Relação com os Demais Documentos

Para evitar sobreposição entre documentos de `docs/planning/`, este arquivo deve permanecer no nível estratégico.

- `implementation-plan.md`: ordem macro de execução, blocos, dependências e riscos.
- `milestones-and-issues.md`: tracker operacional em formato de todo list, com status e pendências correntes.
- `qa-checklist.md`: checklist executável de validação técnica e funcional.

Itens operacionais, tarefas de curto prazo e acompanhamento de fechamento não devem ser duplicados aqui quando já estiverem mantidos nos outros dois arquivos.

---

## 17. Definição de pronto

O MVP será considerado pronto quando:

- as 8 fases do Capítulo I estiverem integradas e consistentes com a documentação oficial;
- o builder funcionar com validação autoritativa no servidor;
- autenticação, sessão e vínculo com turma estiverem estáveis;
- tentativas, progresso, inventário e recompensas estiverem persistindo corretamente;
- a progressão por `correct` estiver funcionando sem ambiguidades;
- testes cobrirem as áreas críticas definidas no spec técnico;
- o deploy em produção estiver ativo e funcional para um jogador novo;
- a linguagem visual principal das rotas protegidas estiver coerente com a direção oficial de jogo.

---

## 18. Resultado esperado deste plano

Ao seguir este plano, o projeto deve chegar a um MVP:

- tecnicamente viável;
- pedagogicamente fiel;
- simples de operar;
- coerente com a documentação oficial;
- pronto para validação real em contexto de uso.
