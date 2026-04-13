# MVP: Crônicas do Reino do Carbono

> **Stack Tecnológica + Arquitetura + Segurança + Checklist Revisado**
>
> **Versão:** 1.2  
> **Objetivo:** guia definitivo para desenvolvimento do MVP com stack moderna, segura, simples e executável  
> **Público:** agentes de desenvolvimento e times técnicos intermediários  
> **Escopo:** setup, implementação, persistência, segurança e deploy  
> **Observação:** a estratégia de testes não é detalhada neste documento, pois o projeto já utilizará Jest.

---

## Índice Rápido

1. [Objetivo do Projeto](#1-objetivo-do-projeto)
2. [Princípios Fundacionais](#2-princípios-fundacionais)
3. [Decisões Arquiteturais Confirmadas](#3-decisões-arquiteturais-confirmadas)
4. [Stack Recomendada](#4-stack-recomendada)
5. [Arquitetura](#5-arquitetura)
6. [Estrutura do Projeto](#6-estrutura-do-projeto)
7. [Modelagem de Dados](#7-modelagem-de-dados)
8. [Lógica de Jogo e Avaliação](#8-lógica-de-jogo-e-avaliação)
9. [Segurança](#9-segurança)
10. [Deploy e Operação](#10-deploy-e-operação)
11. [Checklist Completo de Implementação](#11-checklist-completo-de-implementação)
12. [Roadmap de Sprints](#12-roadmap-de-sprints)
13. [Critério de Pronto do MVP](#13-critério-de-pronto-do-mvp)
14. [Perguntas em Aberto](#14-perguntas-em-aberto)

---

## 1. Objetivo do Projeto

### 1.1 Visão Geral

Implementar um MVP web responsivo, seguro e pedagógico que permita aos alunos:

- vivenciar uma jornada narrativa em 8 fases;
- construir moléculas em modelo simplificado;
- receber correção automática e determinística;
- receber feedback simples: acertou ou não acertou;
- desbloquear recompensas;
- persistir e retomar o progresso.

### 1.2 Requisitos Funcionais Mínimos

- iniciar sessão do jogador;
- visualizar fase atual com narrativa;
- construir molécula simplificada;
- selecionar propriedades esperadas;
- receber correção automática;
- mostrar retorno claro: acertou ou não acertou;
- desbloquear recompensas ao acertar;
- persistir progresso no banco;
- retomar sessão anteriormente salva.

### 1.3 Escopo Não Incluído no MVP

- multiplayer ou chat;
- IA para correção aberta;
- editor químico livre completo;
- dashboard docente avançado;
- real-time / WebSockets;
- ranking global;
- sistema avançado de tentativas com notas parciais.

---

## 2. Princípios Fundacionais

### 2.1 Critérios de Decisão Técnica

Priorizar, nesta ordem:

1. Estabilidade
2. Compatibilidade
3. Segurança
4. Simplicidade
5. Evoluibilidade

### 2.2 Política de Dependências

**Aceitar**

- versões estáveis;
- ecossistemas amplamente adotados;
- dependências com manutenção ativa;
- bibliotecas com documentação clara.

**Evitar**

- beta, alpha e RC;
- bibliotecas pouco mantidas;
- dependências desnecessárias;
- abstrações prematuras.

### 2.3 Ambientes Separados

Manter sempre:

- development;
- staging / preview;
- production.

---

## 3. Decisões Arquiteturais Confirmadas

Esta versão consolida as principais decisões para reduzir ambiguidade e evitar retrabalho.

### 3.1 Tipo de aplicação

**Decisão:** monólito moderno com Next.js.

**Justificativa**

- menos complexidade operacional;
- menos integração entre serviços;
- deploy mais simples;
- ideal para MVP pequeno.

### 3.2 Estratégia de autenticação

**Decisão:** autenticação simples própria.

**Fluxo**

- aluno informa nome;
- aluno informa código da turma opcional, se aplicável;
- sistema cria ou recupera sessão segura no servidor;
- cookie `HttpOnly` mantém a sessão.

**Justificativa**

- mais simples que Auth.js para este contexto;
- reduz dependências;
- acelera implementação;
- suficiente para MVP escolar sem login social.

### 3.3 Estratégia de sessão

**Decisão:** sessão stateful persistida no banco.

**Modelo recomendado**

- ao iniciar a sessão, o sistema cria um registro de sessão no banco;
- um token aleatório seguro é gerado no servidor;
- apenas o hash do token é salvo no banco;
- o token original vai no cookie `HttpOnly` do navegador;
- a cada request autenticada:
  - o servidor lê o cookie;
  - calcula o hash;
  - procura a sessão correspondente;
  - identifica o usuário.

**Justificativa**

- mais seguro que guardar identificadores simples no cookie;
- facilita invalidação de sessão;
- facilita expiração;
- mais fácil de depurar que sessão totalmente stateless no MVP;
- mais controlável para ambiente escolar.

### 3.4 Correção da fase

**Decisão:** avaliação binária.

- acertou;
- não acertou.

**Justificativa**

- reduz complexidade pedagógica e técnica;
- facilita UX;
- facilita persistência;
- facilita regra de desbloqueio.

### 3.5 Tentativas por fase

**Decisão:** múltiplas tentativas permitidas.

**Regra**

- jogador pode errar e tentar novamente;
- progresso só avança quando houver acerto;
- histórico de tentativas pode ser salvo para auditoria básica.

**Justificativa**

- mais coerente com uso educacional;
- evita bloqueio indevido;
- permite aprendizado por repetição.

### 3.6 Inventário e desbloqueios

**Decisão:** fonte de verdade normalizada.

**Regras**

- usar tabelas de desbloqueio (`UnlockedMolecule`, `UnlockedTitle`);
- usar tabela de conclusão de fase;
- evitar duplicação com arrays redundantes em progresso.

**Justificativa**

- menos risco de inconsistência;
- melhor rastreabilidade;
- mais fácil de evoluir.

### 3.7 Compatibilidade da stack

**Decisão:** antes da Sprint 1, validar compatibilidade prática de:

- Next.js;
- React;
- Tailwind;
- Prisma;
- shadcn/ui.

Se houver atrito relevante, priorizar a combinação mais estável do ecossistema, mesmo que não seja a versão mais nova.

---

## 4. Stack Recomendada

### 4.1 Base de Versões Estáveis

| Componente | Recomendação | Motivo |
| --- | --- | --- |
| Node.js | 22 LTS | estabilidade |
| npm | incluído no Node LTS | padrão do ecossistema |
| Next.js | 15 stable | App Router maduro |
| React | 19 stable | alinhado ao Next atual |
| TypeScript | 5.8+ | tipagem forte |
| Tailwind CSS | versão estável compatível com o projeto | evitar fricção |
| PostgreSQL | 16 ou 17 | robusto |
| Prisma | 6 stable | ORM type-safe |
| Zod | stable | validação |
| React Hook Form | 7 stable | formulários |
| shadcn/ui | compatível com a stack validada | UI reutilizável |
| ESLint | 9 stable | lint |
| Prettier | 3 stable | formatação |
| Jest | versão estável compatível com a stack | testes já adotados |

### 4.2 Stack Completa

**Aplicação**

- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS.

**Back-end**

- Route Handlers;
- Server Components;
- Server Actions apenas se agregarem clareza.

**Banco**

- PostgreSQL;
- Prisma;
- migrations versionadas;
- seed idempotente.

**Autenticação**

- sessão própria com cookie seguro `HttpOnly`;
- persistência de sessão em banco.

**Validação**

- Zod no servidor.

**Deploy**

- Vercel;
- Neon ou Supabase Postgres.

---

## 5. Arquitetura

### 5.1 Modelo

```text
Usuário
  ↓
Next.js App
  ├── páginas
  ├── componentes
  ├── rotas API
  ├── autenticação simples
  └── lógica do jogo
  ↓
Prisma
  ↓
PostgreSQL
```

### 5.2 Regras arquiteturais

- não introduzir microserviços;
- não usar WebSocket no MVP;
- não usar engine de regras excessivamente genérica;
- manter lógica principal em `src/lib`;
- manter conteúdo do jogo versionado no repositório;
- separar claramente:
  - UI;
  - regras de domínio;
  - persistência;
  - validação.

---

## 6. Estrutura do Projeto

```text
/cronicas-reino-carbono
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── capitulo-1/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── fase/[id]/page.tsx
│   │   │   │   ├── cartas/page.tsx
│   │   │   │   ├── inventario/page.tsx
│   │   │   │   └── perfil/page.tsx
│   │   ├── api/
│   │   │   ├── session/route.ts
│   │   │   ├── progress/route.ts
│   │   │   ├── phase/route.ts
│   │   │   ├── phase/[id]/route.ts
│   │   │   └── health/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── game/
│   │   └── layout/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── session.ts
│   │   ├── progression.ts
│   │   ├── game.ts
│   │   ├── rewards.ts
│   │   ├── validation.ts
│   │   ├── security.ts
│   │   └── constants.ts
│   ├── data/
│   │   ├── molecules.ts
│   │   ├── phases.ts
│   │   └── rewards.ts
│   ├── types/
│   │   ├── molecule.ts
│   │   ├── phase.ts
│   │   ├── player.ts
│   │   ├── submission.ts
│   │   └── index.ts
│   └── env.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 7. Modelagem de Dados

### 7.1 Diretrizes de modelagem

**Regras**

- permitir múltiplas tentativas por fase;
- não duplicar inventário em tabelas redundantes;
- manter progressão simples;
- registrar desbloqueios com unicidade;
- usar enums sempre que fizer sentido;
- tratar moléculas como catálogo global;
- modelar relação fase ↔ moléculas de forma relacional;
- modelar fases concluídas em tabela própria.

### 7.2 Schema Prisma Revisado

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum BondType {
  SINGLE
  DOUBLE
  TRIPLE
  AROMATIC
}

enum AttemptStatus {
  CORRECT
  INCORRECT
}

model User {
  id                String               @id @default(cuid())
  name              String
  classCode         String?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt

  progress          PlayerProgress?
  attempts          PlayerPhaseAttempt[]
  unlockedMolecules UnlockedMolecule[]
  unlockedTitles    UnlockedTitle[]
  sessions          Session[]
  completedPhases   CompletedPhase[]

  @@index([classCode])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  tokenHash    String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model PlayerProgress {
  id             String   @id @default(cuid())
  userId         String   @unique
  currentPhaseId Int      @default(1)
  totalCorrect   Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model CompletedPhase {
  id          String   @id @default(cuid())
  userId      String
  phaseId     Int
  completedAt DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  phase       Phase    @relation(fields: [phaseId], references: [id])

  @@unique([userId, phaseId])
  @@index([userId])
  @@index([phaseId])
}

model PlayerPhaseAttempt {
  id                 String        @id @default(cuid())
  userId             String
  phaseId            Int
  moleculeId         String
  selectedProperties String[]
  status             AttemptStatus
  submittedAt        DateTime      @default(now())

  user               User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  phase              Phase         @relation(fields: [phaseId], references: [id])
  molecule           Molecule      @relation(fields: [moleculeId], references: [id])

  @@index([userId])
  @@index([phaseId])
  @@index([userId, phaseId])
}

model Molecule {
  id           String   @id
  name         String
  formula      String
  carbonCount  Int
  bondType     BondType
  properties   Json
  createdAt    DateTime @default(now())

  attempts     PlayerPhaseAttempt[]
  unlockedBy   UnlockedMolecule[]
  availableIn  PhaseAvailableMolecule[]
}

model Phase {
  id                  Int                    @id
  title               String
  narrative           String
  objective           String
  expectedMolecule    String
  expectedProperties  String[]
  minimumProperties   String[]
  concept             String
  rewardPoints        Int                    @default(0)
  rewardTitle         String?

  attempts            PlayerPhaseAttempt[]
  availableMolecules  PhaseAvailableMolecule[]
  completedBy         CompletedPhase[]
}

model PhaseAvailableMolecule {
  id          String   @id @default(cuid())
  phaseId     Int
  moleculeId  String

  phase       Phase    @relation(fields: [phaseId], references: [id], onDelete: Cascade)
  molecule    Molecule @relation(fields: [moleculeId], references: [id], onDelete: Cascade)

  @@unique([phaseId, moleculeId])
  @@index([phaseId])
  @@index([moleculeId])
}

model UnlockedMolecule {
  id           String   @id @default(cuid())
  userId       String
  moleculeId   String
  unlockedAt   DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  molecule     Molecule @relation(fields: [moleculeId], references: [id])

  @@unique([userId, moleculeId])
  @@index([userId])
}

model UnlockedTitle {
  id           String   @id @default(cuid())
  userId       String
  titleName    String
  unlockedAt   DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, titleName])
  @@index([userId])
}
```

### 7.3 Mudanças importantes em relação à versão anterior

**Removido**

- `Inventory` como tabela principal redundante;
- resultado textual complexo (`excellent`, `adequate` etc.);
- `phaseId` diretamente em `Molecule`;
- `completedPhases Int[]`;
- `availableMolecules String[]`.

**Ajustado**

- `AttemptStatus` agora é binário: `CORRECT` ou `INCORRECT`;
- múltiplas tentativas por fase são permitidas;
- progressão salva apenas o estado consolidado;
- fases concluídas ficam em tabela própria;
- disponibilidade de moléculas por fase é relacional;
- sessões ficam persistidas em banco.

### 7.4 Exemplo do campo `properties` em `Molecule`

O campo `properties` deve seguir um formato consistente.

**Exemplo recomendado**

```json
{
  "polaridade": 1,
  "potencialEnergetico": 4,
  "reatividade": 1,
  "estabilidade": 4,
  "caraterAcidoBasico": 1,
  "interacaoBiologica": 2,
  "volatilidade": 5,
  "tags": [
    "cadeia curta",
    "saturada",
    "baixa polaridade",
    "alta volatilidade",
    "util como combustivel"
  ]
}
```

**Regra**

- manter sempre os mesmos campos;
- evitar estruturas JSON diferentes entre moléculas;
- usar `tags` apenas para propriedades textuais do jogo;
- valores numéricos devem seguir escala consistente.

---

## 8. Lógica de Jogo e Avaliação

### 8.1 Princípio

A correção do MVP será 100% determinística.

**Não haverá**

- IA;
- avaliação textual aberta;
- subjetividade;
- tolerância sem regra definida.

### 8.2 Regra de correção

O jogador acerta somente se:

- a molécula enviada estiver entre as respostas aceitas da fase;
- as propriedades selecionadas contiverem o conjunto mínimo exigido para validação.

**Observação importante**

O sistema continua com saída binária:

- `CORRECT`;
- `INCORRECT`.

Mas internamente a validação não deve exigir comparação literal exata de todos os campos.

### 8.3 Função de avaliação

**Exemplo conceitual**

```ts
type SubmissionResult = "CORRECT" | "INCORRECT";

function checkPhaseAnswer(input: {
  acceptedMoleculeIds: string[];
  submittedMoleculeId: string;
  minimumRequiredProperties: string[];
  selectedProperties: string[];
}): SubmissionResult {
  const moleculeAccepted = input.acceptedMoleculeIds.includes(input.submittedMoleculeId);

  const selectedSet = new Set(input.selectedProperties);

  const hasMinimumProperties = input.minimumRequiredProperties.every((prop) =>
    selectedSet.has(prop)
  );

  return moleculeAccepted && hasMinimumProperties ? "CORRECT" : "INCORRECT";
}
```

### 8.4 Regra de progressão

- se `CORRECT`, desbloqueia a próxima fase;
- se `INCORRECT`, permanece na mesma fase;
- fase máxima do capítulo: `8`.

### 8.5 Regra de recompensas

Ao acertar uma fase:

- desbloqueia a molécula da fase, se aplicável;
- soma pontos da fase, se houver;
- registra fase concluída;
- desbloqueia título final na fase 8, se definido.

### 8.6 Feedback ao usuário

O feedback do MVP deve ser simples.

**Se acertou**

- mensagem positiva;
- indicar que a fase foi concluída;
- mostrar recompensa desbloqueada, se houver;
- botão para seguir.

**Se não acertou**

- mensagem clara de erro;
- indicar para tentar novamente;
- sem detalhamento excessivo no MVP.

**Exemplos**

- "Você acertou!"
- "Ainda não foi dessa vez. Tente novamente."

---

## 9. Segurança

### 9.1 Sessão

Usar cookie com:

- `HttpOnly`;
- `Secure` em produção;
- `SameSite=Lax`;
- expiração definida.

**Regra de armazenamento**

- nunca salvar token puro no banco;
- salvar apenas hash do token;
- gerar token aleatório criptograficamente seguro.

### 9.2 Input validation

Toda entrada deve ser validada no servidor com Zod.

**Exemplo**

```ts
import { z } from "zod";

export const PlayerSessionSchema = z.object({
  name: z.string().min(2).max(50),
  classCode: z.string().max(20).optional(),
});

export const PhaseSubmissionSchema = z.object({
  phaseId: z.number().int().min(1).max(8),
  moleculeId: z.string().min(1),
  selectedProperties: z.array(z.string()),
});
```

### 9.3 Autorização

Usuário só pode:

- acessar seu próprio progresso;
- submeter sua própria fase;
- ver seus próprios desbloqueios.

Nunca confiar em `userId` vindo do cliente sem cruzar com a sessão.

### 9.4 CSRF

**O que é**

CSRF significa *Cross-Site Request Forgery*. É um tipo de ataque em que um site malicioso tenta induzir o navegador do usuário a enviar uma requisição autenticada para outro sistema, aproveitando o fato de que os cookies podem ser enviados automaticamente pelo navegador.

**Neste projeto**

Como o MVP usará sessão por cookie, isso merece atenção.

**Proteção mínima adotada no MVP**

- usar `SameSite=Lax` no cookie;
- validar método HTTP corretamente;
- validar origem (`Origin`) e/ou `Referer` em rotas críticas de escrita;
- aceitar apenas `Content-Type` esperado;
- não expor endpoints mutáveis desnecessários.

Para o MVP, isso é suficiente. Se o sistema crescer, considerar proteção CSRF dedicada.

### 9.5 Headers

Adicionar no `next.config.js` ou `middleware`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

Se possível, adicionar também uma CSP adequada.

### 9.6 Secrets

**Nunca versionar**

- `DATABASE_URL`;
- segredo de sessão;
- tokens.

**Usar**

- `.env.local`;
- secrets da Vercel;
- secrets de CI.

### 9.7 Rate limiting

Aplicar rate limiting básico em:

- criação de sessão;
- submissão de fase.

Mesmo simples, isso já protege contra abuso trivial.

---

## 10. Deploy e Operação

### 10.1 Ambientes

- dev;
- staging;
- prod.

### 10.2 Plataforma

- aplicação: Vercel;
- banco: Neon ou Supabase.

### 10.3 Requisitos de deploy

- build funcionando localmente;
- variáveis configuradas por ambiente;
- migrations versionadas;
- seed idempotente;
- endpoint de health-check.

### 10.4 Observabilidade

**Mínimo recomendado**

- logs de erro;
- logs de falha em validação crítica;
- logs de acesso negado;
- monitoramento básico em staging e produção.

Sentry é opcional, mas recomendado.

---

## 11. Checklist Completo de Implementação

### Fase 1: Fundação

**Setup**

- Node 22 LTS instalado;
- Next.js criado com App Router;
- TypeScript strict;
- Tailwind configurado;
- ESLint configurado;
- Prettier configurado;
- Jest mantido como framework de testes.

**Estrutura**

- diretórios base criados;
- `.env.example` criado;
- `README.md` inicial criado;
- CI básico criado.

**Banco**

- PostgreSQL provisionado;
- Prisma iniciado;
- schema revisado implementado;
- migration inicial criada;
- seed inicial criado;
- seed idempotente.

### Fase 2: Sessão e Segurança

- fluxo de sessão simples implementado;
- tabela `Session` criada e funcional;
- cookie `HttpOnly` configurado;
- recuperação de sessão implementada;
- middleware de proteção criado;
- validação Zod implementada;
- headers de segurança configurados;
- rate limiting básico definido;
- validação de origem / `Referer` em rotas críticas implementada.

### Fase 3: Core do Jogo

- `buildMolecule()` implementado;
- `validateMoleculeStructure()` implementado;
- `checkPhaseAnswer()` implementado;
- progressão por acerto implementada;
- desbloqueio de recompensa implementado;
- múltiplas tentativas persistidas;
- tabela `CompletedPhase` funcionando;
- relação `PhaseAvailableMolecule` funcionando.

### Fase 4: Persistência e APIs

- `POST /api/session`;
- `GET /api/progress`;
- `POST /api/phase`;
- `GET /api/phase/[id]`;
- autenticação e autorização em todas as rotas;
- progresso persistido corretamente;
- retomada de sessão funcionando.

### Fase 5: Interface

- home com iniciar ou continuar;
- tela de fase com narrativa;
- oficina molecular;
- seletor de propriedades;
- modal de feedback simples;
- modal de recompensa;
- barra de progresso;
- responsividade mínima em mobile, tablet e desktop.

### Fase 6: Conteúdo

- 8 fases cadastradas;
- 7 moléculas cadastradas;
- propriedades esperadas por fase cadastradas;
- propriedades mínimas por fase cadastradas;
- narrativa de cada fase cadastrada;
- recompensas por fase cadastradas;
- título final cadastrado.

### Fase 7: Qualidade e Deploy

- lint sem erros;
- build sem erros;
- migrations funcionando;
- staging validado;
- produção configurada;
- backup habilitado;
- health-check funcionando;
- smoke test manual executado.

---

## 12. Roadmap de Sprints

### Sprint 1

**Objetivo:** fundação + banco + schema + sessão simples.

**Entregas**

- setup da stack;
- Prisma configurado;
- schema revisado;
- migration inicial;
- seed inicial;
- sessão simples com cookie `HttpOnly`.

### Sprint 2

**Objetivo:** lógica do jogo + segurança.

**Entregas**

- construção molecular;
- validação da resposta;
- progressão entre fases;
- bloqueio / desbloqueio;
- validações Zod;
- headers e proteção.

### Sprint 3

**Objetivo:** UI + integração + persistência.

**Entregas**

- telas principais;
- rotas API;
- persistência de progresso;
- feedback simples;
- desbloqueio de recompensas;
- jornada completa funcional.

### Sprint 4

**Objetivo:** QA + staging + produção.

**Entregas**

- correções finais;
- auditoria básica;
- staging;
- produção;
- documentação mínima.

---

## 13. Critério de Pronto do MVP

O MVP estará pronto quando:

### Funcionalidade

- jogador consegue iniciar sessão;
- jogador consegue jogar as 8 fases;
- sistema corrige automaticamente;
- feedback é claro: acertou ou não acertou;
- progresso é salvo;
- progresso pode ser retomado;
- recompensas são desbloqueadas corretamente.

### Qualidade

- lint sem erros;
- build reproduzível;
- schema e migrations estáveis;
- fluxo principal funcionando sem falha crítica.

### Segurança

- sessão segura por cookie `HttpOnly`;
- validação de input em todas as rotas;
- autorização aplicada;
- secrets protegidos;
- headers mínimos configurados.

### Operação

- staging ativo;
- produção ativa;
- backup do banco habilitado;
- logs disponíveis;
- rollback minimamente documentado.

---

