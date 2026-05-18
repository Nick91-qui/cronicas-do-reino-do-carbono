# Plano de Adequação à LGPD

## Propósito

Este documento define o plano oficial de adequação do MVP de **Crônicas do Reino do Carbono** aos requisitos mínimos de privacidade e proteção de dados pessoais aplicáveis ao projeto.

Ele existe para:

- transformar o diagnóstico de risco em plano executável;
- orientar implementação, documentação e QA com uma mesma referência;
- reduzir exposição jurídica e operacional em autenticação, analytics, observabilidade interna e retenção;
- explicitar entregas mínimas antes de ampliar uso real com alunos.

Este plano complementa:

- `docs/project-context.md`;
- `docs/tech/technical-spec.md`;
- `docs/planning/implementation-plan.md`;
- `docs/planning/qa-checklist.md`;
- `docs/legal/privacy-policy.md`;
- `docs/planning/data-subject-rights-runbook.md`.

## Escopo

Este plano cobre o tratamento de dados pessoais no MVP, especialmente:

- cadastro e autenticação;
- sessão por cookie;
- vínculo com turma;
- progresso, tentativas, inventário e recompensas;
- analytics de gameplay;
- superfícies internas protegidas por `operator`;
- documentação pública e interna de privacidade;
- rotinas de retenção, exclusão e atendimento ao titular.

Este plano não substitui aconselhamento jurídico formal. Ele define a base técnica e documental mínima para implementação responsável no repositório.

## Premissas

- o projeto atende alunos do Ensino Médio e, portanto, deve tratar como cenário real a presença de dados de adolescentes;
- `docs/` continua sendo a fonte oficial de regra do MVP;
- a adequação deve priorizar minimização, finalidade explícita, rastreabilidade e baixo atrito operacional;
- nenhuma expansão de analytics ou observabilidade interna deve ocorrer antes de controles mínimos de privacidade.

## Objetivo de adequação do MVP

Ao final desta trilha, o projeto deve:

- informar claramente o que coleta, para quê, por quanto tempo e quem acessa;
- coletar apenas os dados necessários para autenticação, progressão e operação pedagógica do MVP;
- ter fluxo definido para consulta, correção, exclusão e retenção;
- limitar a superfície `operator` ao mínimo necessário e com governança explícita;
- separar eventos operacionais indispensáveis de telemetria opcional;
- permitir QA objetivo de privacidade antes de uso ampliado.

## Frentes de trabalho

### Frente 1. Base documental e governança

Entregas:

- criar politica de privacidade do MVP em linguagem clara;
- criar documento operacional interno com base legal assumida, finalidade e papeis;
- documentar controlador, operador e canal de contato para direitos do titular;
- alinhar `technical-spec`, `qa-checklist` e docs de planejamento com a política.

### Frente 2. Transparência nas interfaces públicas

Entregas:

- adicionar aviso de privacidade no cadastro;
- adicionar link visível para política de privacidade nas telas públicas;
- informar uso de cookie de sessão essencial;
- explicar de forma breve o uso de dados de progresso e analytics operacionais.

### Frente 3. Minimização de dados e modelagem

Entregas:

- revisar se `displayName`, `username` e `classroomCode` são todos necessários no formato atual;
- revisar payloads de analytics para remover identificadores ou atributos redundantes;
- documentar quais tabelas contêm dado pessoal direto, indireto ou comportamental;
- definir quais dados podem ser anonimizados sem quebrar o MVP.

### Frente 4. Direitos do titular

Entregas:

- definir fluxo para consulta de dados de conta;
- definir fluxo para correção de dados cadastrais;
- definir fluxo para exclusão ou anonimização de conta;
- definir exportação mínima de dados do jogador em formato legível;
- definir responsabilidades quando a solicitação vier via escola ou responsável.

### Frente 5. Retenção e descarte

Entregas:

- definir prazo de retenção para sessão, analytics, tentativas e conta inativa;
- definir o que deve ser excluído, anonimizado ou agregado ao fim do prazo;
- criar rotina técnica para limpeza de sessão expirada;
- planejar job administrativo para exclusão/anonimização de dados históricos.

### Frente 6. Observabilidade interna e papel `operator`

Entregas:

- restringir a superfície `operator` aos campos estritamente necessários;
- documentar quem pode receber o papel `operator` e sob quais critérios;
- registrar necessidade de auditoria mínima de acesso interno;
- remover exposição desnecessária de identidade, inventário e histórico fino quando não forem essenciais.

### Frente 7. QA e validação contínua

Entregas:

- acrescentar checklist LGPD ao QA do repositório;
- revisar testes de auth, sessão e rotas internas com foco em privacidade;
- exigir validação manual de textos legais e fluxos de direitos do titular antes de produção.

## Ordem recomendada de implementação

### Fase 1. Congelamento de risco alto

1. documentar política e regras mínimas de retenção;
2. adicionar transparência básica nas telas públicas;
3. congelar expansão de analytics e `operator` até revisão de minimização.

### Fase 2. Controles de produto e backend

1. implementar links e avisos de privacidade;
2. revisar payloads de analytics;
3. reduzir campos expostos na área `operator`;
4. criar rotas ou runbooks para exclusão, exportação e correção.

### Fase 3. Operação contínua

1. automatizar limpeza de sessão expirada;
2. automatizar retenção de analytics e histórico quando aplicável;
3. validar periodicamente o checklist de QA de privacidade.

## Artefatos mínimos esperados no repositório

- `docs/legal/privacy-policy.md`;
- `docs/planning/data-subject-rights-runbook.md`;
- especificação técnica atualizada com regras de minimização, retenção e acesso;
- checklist de QA com critérios de privacidade;
- implementação das superfícies e rotas mínimas decididas para direitos do titular.

## Decisões abertas que precisam ser fechadas

- qual será a base legal operacional adotada para cadastro e uso pedagógico do MVP;
- quem é o controlador formal dos dados quando o jogo for usado por uma escola;
- se o `displayName` precisa continuar único globalmente;
- se analytics devem permanecer identificados por jogador ou migrar para estratégia pseudonimizada;
- se exclusão deve remover progresso ou anonimizar mantendo estatísticas agregadas.

## Critério de conclusão

Esta trilha só pode ser considerada concluída quando:

- a política de privacidade estiver publicada e referenciada nas telas públicas;
- os dados coletados estiverem documentados com finalidade e retenção;
- a superfície `operator` tiver minimização e governança explícitas;
- existir fluxo definido para acesso, correção, exportação e exclusão;
- o checklist LGPD do repositório estiver validado na rodada de QA relevante.
