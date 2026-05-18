# Runbook de Atendimento ao Titular

## Proposito

Este runbook define o fluxo interno minimo para atender solicitacoes relacionadas a dados pessoais no MVP de **Cronicas do Reino do Carbono**.

Ele existe para orientar a operacao enquanto o projeto ainda nao possui automacao completa para todos os direitos do titular.

## Escopo

Este runbook cobre solicitacoes de:

- confirmacao de tratamento;
- acesso aos dados;
- correcao de dados cadastrais;
- exportacao basica;
- exclusao ou anonimizacao de conta;
- esclarecimento sobre retencao e uso operacional.

## Pre-condicoes operacionais

Antes de usar este runbook em ambiente real, a operacao deve preencher:

- responsavel primario pelo atendimento: `Nicholas Contijo Moreira`
- canal oficial de recebimento: `nicholascm@gmail.com`
- prazo interno alvo para primeira resposta: `ate 7 dias corridos`
- criterio de validacao de identidade do solicitante: `[preencher]`

## Fontes internas de verdade

Para executar este fluxo, consulte primeiro:

1. `docs/tech/technical-spec.md`
2. `docs/legal/privacy-policy.md`
3. `docs/planning/lgpd-adequacy-plan.md`
4. `prisma/schema.prisma`

## Tipos de solicitacao

### 1. Confirmacao de tratamento

Objetivo:

- informar se o MVP trata dados da pessoa solicitante.

Resposta minima esperada:

- se existe conta vinculada;
- quais categorias de dados sao tratadas;
- finalidade geral do tratamento;
- referencia a politica de privacidade.

### 2. Acesso aos dados

Objetivo:

- fornecer visao legivel dos dados operacionais associados ao jogador.

Escopo minimo do acesso:

- dados cadastrais do jogador;
- dados de turma associados;
- sessoes ativas ou recentes, quando aplicavel;
- progresso por capitulo e fase;
- inventario e recompensas;
- analytics operacionais ligados ao jogador.

### 3. Correcao de dados

Objetivo:

- corrigir informacoes cadastrais inexatas ou desatualizadas.

Campos tipicos:

- `displayName`
- `username`
- associacao de turma, se a regra operacional permitir

Observacao:

- qualquer correcao deve preservar unicidade e invariantes tecnicos do sistema.

### 4. Exportacao basica

Objetivo:

- disponibilizar os dados do jogador em formato legivel para inspecao ou portabilidade basica.

Formato recomendado no MVP:

- JSON estruturado por entidade operacional do jogador.

Implementacao atual no repositorio:

- `GET /api/account/export`

### 5. Exclusao ou anonimizaicao

Objetivo:

- remover ou descaracterizar dados pessoais segundo a regra operacional adotada.

Decisao a fechar pela operacao:

- exclusao total dos registros pessoais;
- anonimizacao com preservacao de estatisticas agregadas;
- bloqueio temporario enquanto a solicitacao e validada.

Implementacao atual no repositorio:

- `DELETE /api/account`
- exige sessao autenticada;
- exige senha atual;
- exige frase explicita de confirmacao.

## Fluxo operacional padrao

### Etapa 1. Receber a solicitacao

Registrar:

- data e hora;
- canal de entrada;
- tipo de solicitacao;
- identificador informado pelo solicitante;
- responsavel interno que assumiu o caso.

### Etapa 2. Validar identidade e legitimidade

Confirmar, antes de qualquer resposta detalhada:

- se o solicitante e o proprio titular ou representante legitimo;
- se ha informacoes suficientes para localizar a conta;
- se o caso envolve contexto escolar que exija confirmacao adicional.

Nenhum dado detalhado deve ser entregue sem essa validacao.

### Etapa 3. Mapear a conta no sistema

Localizar, quando aplicavel:

- `Player`
- `Classroom`
- `Session`
- `PlayerPhaseAttempt`
- `PlayerPhaseSummary`
- `PlayerChapterProgress`
- `PlayerInventory`
- `PlayerRewardEvent`
- `PlayerAnalyticsEvent`

### Etapa 4. Classificar a acao necessaria

Escolher uma das trilhas:

- confirmacao;
- acesso;
- correcao;
- exportacao;
- exclusao/anonimizacao;
- esclarecimento documental.

### Etapa 5. Executar a resposta tecnica

#### Confirmacao

- responder se ha ou nao tratamento associado aos dados apresentados;
- descrever as categorias de dados tratadas.

#### Acesso ou exportacao

- montar extracao estruturada e revisavel;
- revisar se nao ha vazamento de dados de terceiros;
- entregar em formato legivel.

#### Correcao

- aplicar alteracao apenas nos campos autorizados;
- revalidar unicidade, integridade e impacto operacional;
- registrar o que foi alterado.

#### Exclusao ou anonimizaicao

- verificar se a regra operacional aprovada para o ambiente e exclusao ou anonimizacao;
- remover ou descaracterizar dados pessoais conforme a regra;
- invalidar sessoes remanescentes;
- registrar quais entidades foram afetadas.

### Etapa 6. Encerrar e registrar evidencia

Registrar internamente:

- decisao tomada;
- data de conclusao;
- entidades afetadas;
- pendencias ou bloqueios;
- revisao necessaria na documentacao, se o caso expuser lacuna.

## Matriz minima por entidade

### `Player`

- contem identidade basica e autenticacao;
- sujeito a acesso, correcao, exportacao e exclusao/anonimizacao.

### `Session`

- contem estado de sessao autenticada;
- sujeito a invalidacao e limpeza.

### `PlayerPhaseAttempt`

- contem historico de tentativas;
- sujeito a exportacao e a exclusao/anonimizacao conforme regra do ambiente.

### `PlayerPhaseSummary`

- contem estado resumido de progresso;
- sujeito a exportacao e a exclusao/anonimizacao.

### `PlayerChapterProgress`

- contem progresso consolidado por capitulo;
- sujeito a exportacao e a exclusao/anonimizacao.

### `PlayerInventory`

- contem snapshot de recursos do jogador;
- sujeito a exportacao e a exclusao/anonimizacao.

### `PlayerRewardEvent`

- contem historico operacional de recompensas;
- sujeito a exportacao e a exclusao/anonimizacao.

### `PlayerAnalyticsEvent`

- contem analytics operacionais;
- sujeito a exportacao e a exclusao/anonimizacao ou retencao reduzida, conforme regra do ambiente.

## Riscos e cuidados

- nao entregar dados sem validar identidade;
- nao expor dados de outros jogadores da mesma turma;
- nao confundir suporte operacional com permissao ampla do papel `operator`;
- nao executar exclusao manual sem registrar quais tabelas foram afetadas;
- nao manter resposta apenas na conversa; atualizar a documentacao quando surgir lacuna normativa.

## Pendencias de implementacao

Este runbook pode ser executado manualmente, mas depende de implementacoes futuras para ficar completo:

- criterio formal de validacao de identidade fora da sessao autenticada;
- fluxo de correcao autenticado ja existe e possui superficie no perfil;
- fluxo de exportacao autenticado ja existe e possui superficie no perfil;
- fluxo de exclusao autenticado ja existe e possui superficie no perfil;
- rotina automatica de limpeza de sessoes expiradas;
- governanca de auditoria para acessos internos sensiveis.

## Criterio de pronto

Este artefato so deve ser considerado plenamente operacional quando:

- os campos de responsavel e contato estiverem preenchidos;
- houver comandos, rotas ou operacoes documentadas para cada tipo de solicitacao;
- a politica publica e este runbook estiverem consistentes entre si;
- o checklist LGPD do repositorio puder ser validado contra implementacao real.
