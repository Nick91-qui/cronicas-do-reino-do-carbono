# MVP — Crônicas do Reino do Carbono
## Stack Tecnológica + TDD + Checklist Completo

**Versão:** 1.0  
**Objetivo:** Guia definitivo para desenvolvimento do MVP com stack moderna, segura e testável  
**Público:** Agentes de desenvolvimento, times técnicas intermediárias  
**Escopo:** Setup, implementação, testes e deploy

---

## 📑 ÍNDICE RÁPIDO

1. [Objetivo do Projeto](#1-objetivo-do-projeto)
2. [Princípios Fundacionais](#2-princípios-fundacionais)
3. [Stack Recomendada](#3-stack-recomendada)
4. [Arquitetura](#4-arquitetura)
5. [Estrutura do Projeto](#5-estrutura-do-projeto)
6. [Modelagem de Dados](#6-modelagem-de-dados)
7. [Estratégia de Testes (TDD)](#7-estratégia-de-testes-tdd)
8. [Segurança](#9-segurança)
9. [Deploy e Operação](#10-deploy-e-operação)
10. [Checklist Completo](#11-checklist-completo-de-implementação)
11. [Roadmap de Sprints](#12-roadmap-de-sprints)
12. [Critério de Pronto do MVP](#13-critério-de-pronto-do-mvp)

---

## 1. Objetivo do Projeto

### 1.1 Visão Geral
Implementar um MVP web responsivo, seguro e pedagógico que permite aos alunos:
- Vivenciar jornada narrativa em 8 fases
- Construir moléculas simplificadas
- Receber feedback automático e determinístico
- Desbloquear recompensas e progredrir

### 1.2 Requisitos Funcionais Mínimos
- [x] Iniciar sessão do jogador
- [x] Visualizar fase atual com narrativa
- [x] Construir molécula (modelo simplificado)
- [x] Selecionar propriedades esperadas
- [x] Receber feedback automático
- [x] Desbloquear recompensas
- [x] Persistir progresso no banco
- [x] Retomar sessão anteriormente salva

### 1.3 Escopo Não Incluído no MVP
- ❌ Multiplayer ou chat
- ❌ IA para correção aberta
- ❌ Editor químico livre completo
- ❌ Dashboard docente avançado
- ❌ Real-time/WebSockets
- ❌ Ranking global

---

## 2. Princípios Fundacionais

### 2.1 Critérios de Decisão Técnica

**Priorizar, nesta ordem:**
1. **Estabilidade** — versões LTS, amplamente adotadas
2. **Compatibilidade** — menos surpresas, menos retrabalho
3. **Segurança** — reduzir superfície de ataque
4. **Simplicidade** — menos código, menos bugs
5. **Evoluibilidade** — fácil adicionar features no futuro

### 2.2 Política de Dependências

✅ **Aceitar:**
- Versões estáveis (LTS ou latest stable)
- Ecossistemas amplamente adotados (Node, React, TypeScript)
- Dependências com manutenção ativa
- Versões com changelogs claros

❌ **Evitar:**
- Versões beta, RC, alpha ou experimentais
- Bibliotecas pouco mantidas
- Dependências com histórico de segurança ruim
- Combinações instáveis sem comunidade sólida

### 2.3 Ambientes Separados

Sempre manter:
- **Development** — local, com hot-reload
- **Staging/Preview** — espelho de produção
- **Production** — o real

---

## 3. Stack Recomendada

### 3.1 Base de Versões Estáveis

| Componente | Versão Recomendada | Motivo |
|---|---|---|
| **Node.js** | 22 LTS | LTS até 2027, estável |
| **npm** | Incluído no Node 22 | Gerenciador nativo |
| **Next.js** | 15 stable | App Router maduro, SSR/SSG |
| **React** | 19 stable | Hooks estabelecidos, Performance |
| **TypeScript** | 5.8+ stable | Type safety rigoroso |
| **Tailwind CSS** | 4 stable | Utilities CSS modernas |
| **PostgreSQL** | 16 ou 17 | LTS (16) ou latest (17) |
| **Prisma** | 6 stable | ORM type-safe robusto |
| **Zod** | 3.x ou 4.x stable | Validação de schema |
| **React Hook Form** | 7 stable | Formulários eficientes |
| **Auth.js (NextAuth)** | 5 stable | Sessão segura |
| **shadcn/ui** | Compatível com React 19 | UI components + Radix |
| **ESLint** | 9 stable | Linting |
| **Prettier** | 3 stable | Formatação |
| **Jest** | 29 stable | Testes unitários + integração |
| **Vitest** | 2 stable | Alternativa ao Jest (opcional) |
| **Playwright** | 1.5x+ stable | E2E (opcional para MVP) |

### 3.2 Stack Completa por Camada

**Front-end / Full-stack**
```
Node.js 22 LTS
  ├── Next.js 15 App Router
  ├── React 19
  ├── TypeScript 5.8+
  ├── Tailwind CSS 4
  └── React Hook Form 7 + Zod
```

**Back-end**
```
Next.js 15 (App Router)
  ├── Route Handlers
  ├── Server Actions
  ├── Middleware de autenticação
  └── API Routes para operações críticas
```

**Banco de Dados**
```
PostgreSQL 16 ou 17
  ├── Prisma 6 (ORM)
  ├── Migrations versionadas
  └── Seed inicial
```

**Autenticação**
```
Auth.js 5 (NextAuth)
  └── Sessão segura com cookies HttpOnly
  
OU (simpler alternative)

Autenticação própria
  ├── Entrada por nome/código de sala
  └── Sessão segura no servidor
```

**UI**
```
shadcn/ui (compatível com React 19)
  └── Baseado em Radix UI + Tailwind
```

**Estado**
```
React State + Server State simples
  └── Zustand 5.x (opcional, se necessário)
```

**Qualidade**
```
ESLint 9 + typescript-eslint 8
Prettier 3
Jest 29 ou Vitest 2
Testing Library
```

**Deploy**
```
Vercel (aplicação)
Neon ou Supabase Postgres (banco)
```

**Monitoramento**
```
Sentry JavaScript SDK (opcional)
Vercel Analytics
PostHog (opcional)
```

---

## 4. Arquitetura

### 4.1 Modelo Recomendado: Monolítico Moderno

```
┌─────────────────────────────────────────┐
│     Aplicação Next.js (Vercel)          │
├──────────────────┬──────────────────────┤
│   Front-end      │    Back-end          │
│   (React 19)     │  (API + Server       │
│                  │   Actions)           │
└──────────────────┴──────────────────────┘
           │
           │ (Prisma ORM)
           ▼
┌─────────────────────────────────────────┐
│   PostgreSQL (Neon/Supabase)            │
│   - users, progress, inventory          │
│   - molecules, phases                   │
└─────────────────────────────────────────┘
```

### 4.2 Por que Monolítico?

✅ **Vantagens para MVP:**
- Reduz complexidade operacional
- Acelera desenvolvimento (sem sincronização entre serviços)
- Simplifica deploy e monitoramento
- Facilita manutenção por time pequeno
- Menos superfície de erro

❌ **Não usar microserviços no MVP**

Se no futuro precisar escalar, separar é mais fácil que refatorar monolítico mal estruturado.

---

## 5. Estrutura do Projeto

### 5.1 Organização de Diretórios

```
/cronicas-reino-carbono
├── src/
│   ├── /app
│   │   ├── /(public)
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── /capitulo-1
│   │   │   │   ├── page.tsx
│   │   │   │   ├── /fase
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── /cartas
│   │   │   │   ├── /inventario
│   │   │   │   └── /perfil
│   │   ├── /api
│   │   │   ├── /auth
│   │   │   │   ├── route.ts
│   │   │   │   └── login.ts
│   │   │   ├── /progress
│   │   │   │   ├── route.ts
│   │   │   │   └── [userId]/
│   │   │   ├── /phase
│   │   │   │   ├── route.ts (POST - submeter fase)
│   │   │   │   └── [phaseId]/
│   │   │   ├── /inventory
│   │   │   │   └── route.ts
│   │   │   ├── /health
│   │   │   │   └── route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── /components
│   │   ├── /ui                          # shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   └── ... (outros componentes)
│   │   ├── /game                        # Game logic components
│   │   │   ├── MoleculeCard.tsx
│   │   │   ├── MoleculeBuilder.tsx
│   │   │   ├── PhaseNarrative.tsx
│   │   │   ├── PropertySelector.tsx
│   │   │   ├── RewardModal.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── /layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   ├── /lib
│   │   ├── db.ts                        # Prisma client
│   │   ├── auth.ts                      # Auth logic
│   │   ├── progression.ts               # Phase unlocking, scoring
│   │   ├── game.ts                      # Molecule building
│   │   ├── inventory.ts                 # Inventory management
│   │   ├── scoring.ts                   # Score calculation
│   │   ├── validation.ts                # Zod schemas
│   │   ├── security.ts                  # Security utils
│   │   └── constants.ts
│   ├── /data
│   │   ├── molecules.ts                 # Molecule definitions
│   │   ├── phases.ts                    # Phase definitions
│   │   └── rewards.ts
│   ├── /types
│   │   ├── molecule.ts
│   │   ├── phase.ts
│   │   ├── player.ts
│   │   ├── inventory.ts
│   │   ├── submission.ts
│   │   └── index.ts
│   ├── /middleware
│   │   ├── auth.ts
│   │   └── security.ts
│   └── env.ts                           # Environment validation (Zod)
├── /prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── /migrations
├── /tests
│   ├── /unit
│   │   ├── game.test.ts
│   │   ├── scoring.test.ts
│   │   ├── progression.test.ts
│   │   ├── validation.test.ts
│   │   └── security.test.ts
│   ├── /integration
│   │   ├── auth.test.ts
│   │   ├── phase-completion.test.ts
│   │   ├── inventory.test.ts
│   │   └── database.test.ts
│   ├── /fixtures
│   │   ├── users.fixture.ts
│   │   ├── molecules.fixture.ts
│   │   ├── phases.fixture.ts
│   │   └── test-db.ts
│   └── jest.config.ts
├── .env.example
├── .env.local                           # NÃO versionar
├── .gitignore
├── .eslintrc.json
├── .prettierrc.json
├── prettier.config.js
├── tsconfig.json
├── next.config.js
├── package.json
├── package-lock.json                    # SEMPRE versionar
└── README.md
```

### 5.2 Convenções de Naming

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `MoleculeCard.tsx` |
| Funções/variáveis | camelCase | `calculateScore()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_PHASE_ATTEMPTS` |
| Tipos/Interfaces | PascalCase | `MoleculeType`, `PlayerProgress` |
| Arquivos de teste | `[name].test.ts` | `scoring.test.ts` |
| Routes API | `/api/[resource]/` | `/api/phase/` |

---

## 6. Modelagem de Dados

### 6.1 Schema Prisma Essencial

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User
model User {
  id           String   @id @default(cuid())
  name         String
  classCode    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  progress     PlayerProgress?
  attempts     PlayerPhaseAttempt[]
  inventory    Inventory?
  unlocked     UnlockedMolecule[]
  titles       UnlockedTitle[]

  @@index([classCode])
}

// Player Progress
model PlayerProgress {
  id               String   @id @default(cuid())
  userId           String   @unique
  currentPhaseId   Int      @default(1)
  totalScore       Int      @default(0)
  completedPhases  Int[]    @default([])
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Phase Attempt
model PlayerPhaseAttempt {
  id           String   @id @default(cuid())
  userId       String
  phaseId      Int
  moleculeId   String
  result       String   // "excellent" | "adequate" | "partial" | "inadequate"
  score        Int
  submittedAt  DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  phase        Phase    @relation(fields: [phaseId], references: [id])
  molecule     Molecule @relation(fields: [moleculeId], references: [id])

  @@index([userId])
  @@index([phaseId])
  @@unique([userId, phaseId]) // Previne tentativas duplicadas na mesma fase
}

// Molecule
model Molecule {
  id           String   @id
  name         String
  formula      String
  carbonCount  Int
  bondType     String   // "SINGLE" | "DOUBLE" | "TRIPLE" | "AROMATIC"
  phaseId      Int
  properties   Json     // { isAlkane, molarMass, boilingPoint, ... }
  createdAt    DateTime @default(now())

  phase        Phase    @relation(fields: [phaseId], references: [id])
  attempts     PlayerPhaseAttempt[]
  unlockedBy   UnlockedMolecule[]

  @@index([phaseId])
}

// Phase
model Phase {
  id                    Int      @id
  title                 String
  narrative             String
  objective             String
  availableMolecules    String[] // IDs
  expectedMolecule      String
  expectedProperties    String[] // Properties to validate
  rewards               Json     // { points, molecules, title }
  concept               String   // Concept learned

  molecules             Molecule[]
  attempts              PlayerPhaseAttempt[]
}

// Inventory
model Inventory {
  id                    String   @id @default(cuid())
  userId                String   @unique
  unlockedMolecules     String[] @default([])
  unlockedTitles        String[] @default([])
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Unlocked Molecule (tracking individual unlocks)
model UnlockedMolecule {
  id           String   @id @default(cuid())
  userId       String
  moleculeId   String
  unlockedAt   DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  molecule     Molecule @relation(fields: [moleculeId], references: [id])

  @@unique([userId, moleculeId]) // Previne duplicatas
  @@index([userId])
}

// Unlocked Title
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

### 6.2 Características do Schema

✅ **IDs com CUID** — melhor performance que UUID em Postgres  
✅ **Timestamps automáticos** — `createdAt`, `updatedAt`  
✅ **Constraints de unicidade** — evita duplicatas de desbloqueios  
✅ **Índices em chaves estrangeiras** — queries rápidas  
✅ **Cascade delete** — limpeza automática  
✅ **JSON para propriedades flexíveis** — sem sobrengenharia  

---

## 7. Estratégia de Testes (TDD)

### 7.1 Princípios TDD Aplicados

**Ciclo Red → Green → Refactor**

```
1. RED:      Escrever teste que falha
2. GREEN:    Implementar mínimo para passar
3. REFACTOR: Melhorar sem quebrar teste
```

**Padrão AAA em cada teste:**

```typescript
// ARRANGE:  Preparar dados iniciais
// ACT:      Executar ação
// ASSERT:   Validar resultado
```

### 7.2 Escopo de Testes por Área Crítica

#### 7.2.1 Lógica de Jogo (Unitários)

**O que testar:**
- ✅ Cálculo de pontuação por resultado
- ✅ Desbloqueio de próximas fases
- ✅ Construção e validação molecular
- ✅ Validação de propriedades

**Arquivo:** `tests/unit/game.test.ts`, `tests/unit/scoring.test.ts`, `tests/unit/progression.test.ts`

**Exemplo:**

```typescript
describe('Scoring', () => {
  it('deve retornar 100 pontos para resultado excelente', () => {
    // ARRANGE
    const result = 'excellent';
    const basePoints = 100;

    // ACT
    const score = calculateScore(result, basePoints);

    // ASSERT
    expect(score).toBe(100);
  });

  // TODO: Adicionar testes para adequate (80), partial (50), inadequate (0)
});
```

#### 7.2.2 Autenticação & Segurança (Integração)

**O que testar:**
- ✅ Criação de sessão segura
- ✅ Isolamento de dados (User A não vê progresso de User B)
- ✅ Validação de entrada (Zod schemas)
- ✅ Headers de segurança
- ✅ Rate limiting

**Arquivo:** `tests/integration/auth.test.ts`, `tests/unit/validation.test.ts`

**Exemplo:**

```typescript
describe('Data Isolation', () => {
  it('deve impedir User A de acessar progresso de User B', async () => {
    // ARRANGE
    const userA = await createTestUser('user-a');
    const userB = await createTestUser('user-b');
    const userBProgress = await createTestProgress(userB.id);

    // ACT
    const attemptAccess = await getProgressAs(userA.id, userB.id);

    // ASSERT
    expect(attemptAccess).toThrow('Unauthorized');
  });
});
```

#### 7.2.3 Persistência & Banco (Integração)

**O que testar:**
- ✅ Migrations rodam sem erro
- ✅ Seed inicial carrega todos os dados
- ✅ Relacionamentos consistentes
- ✅ Constraints funcionam

**Arquivo:** `tests/integration/database.test.ts`

**Exemplo:**

```typescript
describe('Database Seed', () => {
  it('deve seed todas as 8 moléculas do Capítulo 1', async () => {
    // ARRANGE - seed já foi executado no beforeAll
    
    // ACT
    const molecules = await prisma.molecule.findMany();

    // ASSERT
    expect(molecules).toHaveLength(8);
    expect(molecules.map(m => m.name)).toContain('Metano');
    expect(molecules.map(m => m.name)).toContain('Benzeno');
  });
});
```

### 7.3 Coverage Targets

| Área | Target | Motivo |
|---|---|---|
| `src/lib/scoring.ts` | 95%+ | Core do gameplay |
| `src/lib/progression.ts` | 90%+ | Lógica de desbloqueio |
| `src/lib/game.ts` | 85%+ | Construção molecular |
| `src/lib/validation.ts` | 80%+ | Gatekeeper de dados |
| `src/lib/security.ts` | 80%+ | Proteção |
| UI Components | 60%+ | Menos crítico (visual) |

**Global:** Apuntar para 75%+ de cobertura

### 7.4 Estrutura de Diretórios de Testes

```
/tests
├── /unit                         # Testes unitários (rápidos, sem BD)
│   ├── game.test.ts
│   ├── scoring.test.ts
│   ├── progression.test.ts
│   ├── validation.test.ts
│   └── security.test.ts
├── /integration                  # Testes integrados (com BD/API)
│   ├── auth.test.ts
│   ├── phase-completion.test.ts
│   ├── inventory.test.ts
│   └── database.test.ts
├── /fixtures                     # Dados mock reutilizáveis
│   ├── users.fixture.ts
│   ├── molecules.fixture.ts
│   ├── phases.fixture.ts
│   └── test-db.ts
└── jest.config.ts
```

### 7.5 Jest Config

```typescript
// tests/jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};

export default config;
```

### 7.6 Rodar Testes

```bash
# Unit tests apenas (rápido)
npm run test:unit

# Integration tests (requer BD)
npm run test:integration

# Tudo com coverage
npm run test:coverage

# Watch mode durante desenvolvimento
npm run test:watch
```

---

## 8. Segurança

### 8.1 Dependências

✅ **Política:**
- Usar versões estáveis suportadas
- Rodar `npm audit` antes de deploy
- Revisar dependências transitivas críticas
- Evitar pacotes pouco mantidos

```bash
# Auditoria
npm audit
npm audit fix --audit-level=moderate

# Revisar dependências
npm list
```

### 8.2 Secrets

❌ **NUNCA versionar:**
- Chaves de API
- Senhas de banco
- Segredos de sessão
- Tokens de deploy

✅ **USAR:**
- `.env.local` em desenvolvimento (no .gitignore)
- Variáveis seguras da Vercel em produção
- Secrets do GitHub Actions para CI

**Arquivo `.env.example`:**

```bash
# Banco
DATABASE_URL=postgresql://user:password@localhost:5432/carbono

# Autenticação
AUTH_SECRET=seu-secret-muito-secreto

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Monitoramento (opcional)
SENTRY_DSN=https://...
POSTHOG_KEY=phc_...
```

### 8.3 Banco de Dados

✅ **Requisitos:**
- Conexão por SSL/TLS
- Usuário com privilégios mínimos (não root)
- Migrations versionadas no git
- Backup automático habilitado no provedor

```prisma
// Exemplo de string segura
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Vercel/Neon lidam com SSL automaticamente
}
```

### 8.4 Sessão e Autenticação

Se usar autenticação com login:

✅ **Cookies:**
- HttpOnly (não acessível via JS)
- Secure em produção (HTTPS only)
- SameSite=Lax ou Strict
- Expiração clara

```typescript
// next-auth config
export const authOptions = {
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 dias
      },
    },
  },
};
```

### 8.5 Validação de Input

❌ **NUNCA confiar em input do cliente**

✅ **SEMPRE validar no servidor com Zod:**

```typescript
import { z } from 'zod';

// Schema de validação
const PhaseSubmissionSchema = z.object({
  phaseId: z.number().int().min(1).max(8),
  moleculeId: z.string().min(1),
  selectedProperties: z.array(z.string()).min(1),
});

// No endpoint
export async function POST(req: Request) {
  const data = await req.json();
  
  // Validar antes de processar
  const validation = PhaseSubmissionSchema.safeParse(data);
  if (!validation.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Proceder com dados validados
  const { phaseId, moleculeId, selectedProperties } = validation.data;
  // ...
}
```

### 8.6 Autorização

O jogador só pode:
- Acessar seu próprio progresso
- Alterar seu próprio inventário
- Completar fases conforme desbloqueio válido

```typescript
// Middleware de verificação
function ensureOwnsProgress(userId: string, requestingUserId: string) {
  if (userId !== requestingUserId) {
    throw new Error('Unauthorized');
  }
}

export async function GET(req: Request, { params }) {
  const session = await getSession(req);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Verificar que userId na URL é do usuário logado
  ensureOwnsProgress(params.userId, session.user.id);
  
  const progress = await db.playerProgress.findUnique({
    where: { userId: session.user.id },
  });
  
  return Response.json(progress);
}
```

### 8.7 Headers de Segurança

Configure em `next.config.js`:

```javascript
// next.config.js
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 9. Deploy e Operação

### 9.1 Ambiente e Configuração

**Separar sempre:**
- **Development** — local, `.env.local`, BD de teste
- **Preview/Staging** — Vercel preview deployments, BD staging
- **Production** — Vercel prod, BD prod

### 9.2 Vercel Deployment

**Requisitos:**
- [ ] Build reproduzível (`npm run build` funciona localmente)
- [ ] Env vars configuradas no painel Vercel
- [ ] Migrations executadas antes do deploy (com hook)
- [ ] Logs habilitados

**Deploy Flow:**

```
1. Push para main/deploy branch
2. GitHub Actions roda testes (lint, test, build)
3. Se passar, Vercel deploya automaticamente
4. Migrations rodam automaticamente
5. Seed executa se necessário (idempotente)
```

### 9.3 Database Setup (Neon ou Supabase)

**Passos:**

1. Criar conta em Neon ou Supabase
2. Criar banco para dev, staging, prod
3. Copiar DATABASE_URL
4. Adicionar às variáveis Vercel
5. Rodar migrations: `npx prisma migrate deploy`
6. Seed: `npm run seed`

```bash
# Local
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
npm run seed

# Vercel (via CLI ou painel)
# Configurar hook de deploy ou rodar manualmente via SSH
```

### 9.4 Observabilidade

**Logs mínimos:**
- ✅ Erros do servidor (em `_error.tsx` ou Sentry)
- ✅ Falhas de validação críticas
- ✅ Falhas de seed/migration
- ✅ Tentativas de acesso não autorizado

**Integração Sentry (opcional):**

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## 10. Deploy e Operação (Continuado)

### 10.1 Checklist de Deploy

**Antes de ir para Staging:**
- [ ] Todos os testes passam (unit + integration)
- [ ] Lint e typecheck sem erros
- [ ] Coverage ≥ 75%
- [ ] Build de produção reproduzível
- [ ] Auditoria de segurança (npm audit)
- [ ] Migrations testadas localmente
- [ ] Seed válido

**Antes de ir para Produção:**
- [ ] Staging estável por pelo menos 24h
- [ ] Nenhum erro no Sentry
- [ ] Database tem backup configurado
- [ ] Rollback plan documentado
- [ ] Monitores de health-check ativos
- [ ] Time notificado

---

## 11. Checklist Completo de Implementação

### FASE 1: FUNDAÇÃO (Semana 1)

#### Configuração Inicial
- [ ] **Stack Setup**
  - [ ] Node 22 LTS instalado
  - [ ] `npx create-next-app@latest` com App Router
  - [ ] TypeScript em modo strict
  - [ ] Tailwind CSS configurado
  
- [ ] **Linting & Formatting**
  - [ ] ESLint 9 configurado
  - [ ] Prettier 3 configurado
  - [ ] typescript-eslint 8 instalado
  - [ ] `.eslintrc.json` e `prettier.config.js` commitados
  
- [ ] **Git & CI/CD Básico**
  - [ ] `.gitignore` com `/node_modules`, `.env.local`, etc
  - [ ] `.env.example` documentado
  - [ ] README.md inicial com instruções de setup
  - [ ] GitHub Actions workflow básico (lint, test, build)

#### Estrutura de Diretórios
- [ ] `/src/app` criado
- [ ] `/src/components` criado
- [ ] `/src/lib` criado
- [ ] `/src/data` criado
- [ ] `/src/types` criado
- [ ] `/prisma` criado
- [ ] `/tests` criado com subdirs

#### Banco de Dados & Prisma
- [ ] Conta criada em Neon ou Supabase
- [ ] 3 bancos criados: dev, staging, prod
- [ ] DATABASE_URL configurada localmente (.env.local)
- [ ] `npx prisma init`
- [ ] Provider PostgreSQL configurado
- [ ] Prisma Client gerado

#### Schema Prisma (Versão 1)
- [ ] Modelo `User` implementado
- [ ] Modelo `PlayerProgress` implementado
- [ ] Modelo `Molecule` implementado
- [ ] Modelo `Phase` implementado
- [ ] Modelo `PlayerPhaseAttempt` implementado
- [ ] Modelo `UnlockedMolecule` implementado
- [ ] Modelo `UnlockedTitle` implementado
- [ ] Modelo `Inventory` implementado (opcional)
- [ ] Relacionamentos corretos
- [ ] Índices em foreign keys
- [ ] Constraints de unicidade

#### Primeira Migration
- [ ] `npx prisma migrate dev --name initial`
- [ ] Migration criada em `/prisma/migrations`
- [ ] Prisma Client gerado
- [ ] `prisma/schema.prisma` atualizado

#### Seed Inicial (Versão 1)
- [ ] `prisma/seed.ts` criado
- [ ] Script seed para moléculas (8 do Capítulo 1)
- [ ] Script seed para fases (8 fases)
- [ ] Script seed executável: `npx prisma db seed`
- [ ] Seed é idempotente (não duplica ao rodar 2x)

#### Validação com Zod
- [ ] `src/types/validation.ts` criado
- [ ] `MoleculeBuilderSchema` definido
- [ ] `PhaseSubmissionSchema` definido
- [ ] `PlayerInputSchema` definido
- [ ] Validação no servidor (não no cliente)

---

### FASE 2: AUTENTICAÇÃO & SEGURANÇA (Semana 1-2)

#### Configuração de Autenticação
- [ ] Decidir modelo (Auth.js vs simples)
  - [ ] **Se Auth.js 5:**
    - [ ] `npm install next-auth`
    - [ ] `route.ts` em `/app/api/auth/[...nextauth]`
    - [ ] Session provider no layout root
    - [ ] Cookies HttpOnly configurados
  - [ ] **Se simples:**
    - [ ] Entrada por nome do jogador
    - [ ] Código de turma opcional
    - [ ] Sessão segura no servidor (cookies)

#### Middleware de Autenticação
- [ ] `src/middleware.ts` criado
- [ ] Rotas protegidas verificadas
- [ ] Redirecionamento para login se não autenticado
- [ ] Session recovery implementado

#### Segurança de Headers
- [ ] `next.config.js` com headers de segurança
- [ ] Content-Security-Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Referrer-Policy

#### Proteção de Dados
- [ ] Autorização testada (User A não vê User B)
- [ ] Queries filtram sempre por `userId`
- [ ] Server Actions validam ownership
- [ ] Rate limiting básico em login/progress endpoints

#### Variáveis de Ambiente
- [ ] `.env.example` atualizado
- [ ] Variáveis em Vercel configuradas (dev, preview, prod)
- [ ] AUTH_SECRET gerado seguro
- [ ] DATABASE_URL em cada ambiente

---

### FASE 3: CORE DO JOGO (Semana 2-3)

#### Lógica de Scoring
- [ ] `src/lib/scoring.ts` implementado
  - [ ] `calculateScore(result, basePoints)` → pontuação por resultado
  - [ ] Resultados: excellent (100%), adequate (80%), partial (50%), inadequate (0%)
  - [ ] Nunca retorna pontuação negativa
- [ ] Testes unitários: `tests/unit/scoring.test.ts`
  - [ ] Cada resultado testado
  - [ ] Casos extremos testados

#### Progressão de Fases
- [ ] `src/lib/progression.ts` implementado
  - [ ] `canUnlockNextPhase(result)` → lógica de desbloqueio
  - [ ] `unlockNextPhase(userId, phaseId)` → avançar fase
  - [ ] Limite máximo: fase 8
  - [ ] Aplicar recompensas ao desbloquear
- [ ] Testes unitários: `tests/unit/progression.test.ts`
  - [ ] Desbloqueio correto
  - [ ] Limite respeitado
  - [ ] Recompensas aplicadas

#### Construção Molecular
- [ ] `src/lib/game.ts` implementado
  - [ ] `buildMolecule(carbonCount, bondType)` → molécula válida
  - [ ] `validateMoleculeStructure(molecule)` → valência de carbono
  - [ ] Suporta as 8 moléculas do MVP
  - [ ] Rejeita estruturas inválidas
- [ ] `src/data/molecules.ts` com 8 moléculas
- [ ] Testes unitários: `tests/unit/game.test.ts`
  - [ ] Construção de cada molécula
  - [ ] Validação de estrutura

#### Verificação de Resposta
- [ ] `src/lib/game.ts::checkPhaseAnswer()`
  - [ ] Compara molécula escolhida com esperada
  - [ ] Valida propriedades selecionadas
  - [ ] Retorna resultado (excellent/adequate/partial/inadequate)
  - [ ] Determinístico (sem IA, sem randomness)

#### Inventário e Recompensas
- [ ] `src/lib/inventory.ts` implementado
  - [ ] `addMoleculeToInventory(userId, moleculeId)`
  - [ ] `addTitleToInventory(userId, titleName)`
  - [ ] Previne duplicatas
- [ ] Testes unitários: `tests/unit/inventory.test.ts`

---

### FASE 4: PERSISTÊNCIA & INTEGRAÇÃO (Semana 3)

#### API Routes para Progresso
- [ ] **GET `/api/progress`** — retorna progresso do usuário
- [ ] **POST `/api/progress`** — cria/atualiza progresso
- [ ] **POST `/api/phase`** — submete resposta de fase
- [ ] **GET `/api/phase/[id]`** — carrega dados da fase
- [ ] Todas as rotas validam autenticação + autorização

#### Server Actions
- [ ] Considerar Server Actions para operações críticas
- [ ] Alternativa: rotas API simples

#### Testes de Integração
- [ ] `tests/integration/auth.test.ts`
  - [ ] Login/logout funciona
  - [ ] Isolamento de dados funciona
  - [ ] Sessão é segura
  
- [ ] `tests/integration/phase-completion.test.ts`
  - [ ] Fluxo completo: submit molécula → save progresso → unlock recompensa
  - [ ] Score é salvo
  - [ ] Próxima fase é desbloqueada
  
- [ ] `tests/integration/inventory.test.ts`
  - [ ] Moléculas adicionadas ao inventário
  - [ ] Títulos desbloqueados
  
- [ ] `tests/integration/database.test.ts`
  - [ ] Migrations rodam
  - [ ] Seed completo funciona
  - [ ] Relacionamentos são consistentes
  - [ ] Constraints funcionam

#### Test Database
- [ ] Docker Compose configurado (ou usar SQLite para testes)
- [ ] Jest configurado para usar test DB
- [ ] Setup/teardown de testes implementado
- [ ] Testes rodam em < 1min

---

### FASE 5: INTERFACE DO MVP (Semana 4)

#### Telas Mínimas
- [ ] **`/` (Home)** — Iniciar jornada ou retomar
  - [ ] Botão "Começar Jornada"
  - [ ] Se há progresso, botão "Continuar"
  
- [ ] **`/capitulo-1/fase/[id]`** — Fase atual
  - [ ] Narrativa da fase
  - [ ] Descrição do desafio
  - [ ] Botão para abrir "Oficina Molecular"
  - [ ] Barra de progresso (fases 1-8)
  
- [ ] **Oficina Molecular** (Modal/Page)
  - [ ] Seletor de carbonos (1-6)
  - [ ] Seletor de tipo de ligação
  - [ ] Preview de molécula construída
  - [ ] Botão "Próximo"
  
- [ ] **Seletor de Propriedades** (Modal/Page)
  - [ ] Checkboxes de propriedades esperadas
  - [ ] Descrição breve de cada propriedade
  - [ ] Botão "Submeter"
  
- [ ] **Feedback** (Modal)
  - [ ] Resultado: excelente/adequado/parcial/inadequado
  - [ ] Motivo da avaliação
  - [ ] Pontuação recebida
  - [ ] Botão "Próximo" ou "Tentar Novamente"
  
- [ ] **Recompensa** (Modal)
  - [ ] Se desbloqueou molécula: mostrar card
  - [ ] Se desbloqueou título: mostrar título épico
  - [ ] Botão "Continuar"

#### Componentes Game
- [ ] `MoleculeCard.tsx` — card da molécula
- [ ] `MoleculeBuilder.tsx` — construtor simplificado
- [ ] `PhaseNarrative.tsx` — narrativa da fase
- [ ] `PropertySelector.tsx` — seleção de propriedades
- [ ] `RewardModal.tsx` — modal de recompensa
- [ ] `ProgressBar.tsx` — barra de fases

#### Componentes UI (shadcn/ui)
- [ ] `Button`
- [ ] `Card`
- [ ] `Modal` / `Dialog`
- [ ] `Checkbox`
- [ ] `Select` / `Dropdown`
- [ ] `Badge` (para propriedades)

#### Responsividade
- [ ] [ ] Telas testadas em mobile (375px)
- [ ] [ ] Telas testadas em tablet (768px)
- [ ] [ ] Telas testadas em desktop (1024px+)
- [ ] [ ] Todas as interações funcionam com touch

#### UX
- [ ] Máximo 3 interações principais por fase
- [ ] Botões claros com textos descritivos
- [ ] Feedback imediato após ação
- [ ] Erros explicados em linguagem clara
- [ ] Sem scroll excessivo

---

### FASE 6: CONTEÚDO DO MVP (Semana 4)

#### Moléculas (8 do Capítulo 1)
- [ ] **Fase 1: Metano** (CH₄)
  - [ ] Narrativa: "O Primeiro Sopro"
  - [ ] Fórmula correta
  - [ ] Propriedades: alcano, saturado
  
- [ ] **Fase 2: Etano** (C₂H₆)
  - [ ] Narrativa: "A Ponte das Cadeias"
  - [ ] Fórmula correta
  
- [ ] **Fase 3: Propano** (C₃H₈)
  - [ ] Narrativa: "A Tocha do Portão Norte"
  
- [ ] **Fase 4: Eteno** (C₂H₄)
  - [ ] Narrativa: "O Véu dos Vapores"
  - [ ] Propriedade: dupla ligação
  
- [ ] **Fase 5: Propeno** (C₃H₆)
  - [ ] Narrativa: "A Ruptura da Saturação"
  
- [ ] **Fase 6: Buteno** (C₄H₈)
  - [ ] Narrativa: "A Porta da Transformação"
  
- [ ] **Fase 7: Polímero** (indústria)
  - [ ] Narrativa: "A Oficina dos Polímeros"
  - [ ] Conceito: polimerização
  
- [ ] **Fase 8: Benzeno** (C₆H₆)
  - [ ] Narrativa: "A Coroa Aromática"
  - [ ] Propriedade: aromático

#### Recompensas por Fase
- [ ] Cada fase desbloqueia molécula correspondente
- [ ] Fase 8 desbloqueia título épico final
- [ ] Seed com todas as recompensas

---

### FASE 7: TESTES COMPLETOS (Semana 4)

#### Coverage
- [ ] Unit coverage ≥ 85%
- [ ] Integration coverage ≥ 75%
- [ ] Global ≥ 75%

#### Testes Críticos
- [ ] Todas as 8 fases testadas
- [ ] Cada resultado (excellent/adequate/partial/inadequate) testado
- [ ] Desbloqueio de recompensas testado
- [ ] Persistência de progresso testado
- [ ] Isolamento de dados testado
- [ ] Validação de input testado

#### CI/CD
- [ ] GitHub Actions workflow
- [ ] Lint passa na PR
- [ ] Tests passam na PR
- [ ] Build de produção passa
- [ ] Coverage report publicado
- [ ] Merge bloqueado se algum falha

---

### FASE 8: AUDIT & DEPLOY (Semana 4)

#### Segurança
- [ ] `npm audit` sem vulnerabilidades críticas
- [ ] Dependências atualizadas se necessário
- [ ] Headers de segurança verificados
- [ ] Validação de input verificada
- [ ] Autorização verificada

#### Qualidade
- [ ] `npm run lint` sem erros
- [ ] `npm run test:coverage` ≥ 75%
- [ ] `npm run build` sem erros
- [ ] Lockfile (`package-lock.json`) commitado

#### Deploy to Staging
- [ ] Ambiente staging configurado em Vercel
- [ ] DATABASE_URL de staging configurada
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Health check funciona
- [ ] Jornada completa testada manualmente

#### Deploy to Production
- [ ] DATABASE_URL de produção configurada
- [ ] Backup de produção habilitado
- [ ] Rollback plan documentado
- [ ] Sentry configurado (se usar)
- [ ] Analytics habilitado
- [ ] DNS/domínio apontado
- [ ] Deploy executado
- [ ] Smoke tests manualmente
- [ ] Time notificado

---

### FASE 9: FINALIZAÇÕES (Pós-MVP)

#### Documentação
- [ ] README.md completo
- [ ] Instruções de setup local
- [ ] Instruções de seed
- [ ] Instruções de deploy
- [ ] Troubleshooting

#### Monitoramento
- [ ] Logs de erro habilitados
- [ ] Dashboard de métricas básicas
- [ ] Alertas configurados
- [ ] Retention de logs definido

#### Performance (Nice-to-have)
- [ ] Bundle size auditado
- [ ] Lazy loading de componentes se necessário
- [ ] Cache de API otimizado

---

## 12. Roadmap de Sprints

### Sprint 1 (1 semana)
**Goal:** Fundação + TDD setup + Banco + Schema

**Deliverables:**
- [ ] Stack instalada e funcionando
- [ ] Prisma + PostgreSQL rodando
- [ ] Schema Prisma v1 com 8 modelos
- [ ] Primeira migration e seed
- [ ] Jest configurado com fixtures
- [ ] Primeiro test unitário passando
- [ ] GitHub Actions CI/CD básico

**Commit principal:** "setup: stack base + prisma + jest"

---

### Sprint 2 (1-2 semanas)
**Goal:** Core do jogo + Segurança

**Deliverables:**
- [ ] `src/lib/scoring.ts` com testes
- [ ] `src/lib/progression.ts` com testes
- [ ] `src/lib/game.ts` com testes
- [ ] Autenticação configurada (Auth.js ou simples)
- [ ] Validação Zod implementada
- [ ] Headers de segurança
- [ ] Integration tests de auth

**Commit principal:** "feat: core game logic + auth + validation"

---

### Sprint 3 (1-2 semanas)
**Goal:** UI + Integração + Dados

**Deliverables:**
- [ ] Todas as telas implementadas
- [ ] Componentes game funcionando
- [ ] API routes criadas
- [ ] Seed de 8 moléculas + 8 fases
- [ ] Jornada completa testada (UI E2E manual)
- [ ] Persistência funcionando
- [ ] Coverage ≥ 75%

**Commit principal:** "feat: ui + api + full journey"

---

### Sprint 4 (3-5 dias)
**Goal:** QA + Deploy

**Deliverables:**
- [ ] Todos os testes passando
- [ ] Lint + typecheck passando
- [ ] npm audit limpo
- [ ] Deploy to staging
- [ ] Deploy to production
- [ ] Monitoring ativo
- [ ] Documentação pronta

**Commit principal:** "release: v1.0 - MVP"

---

## 13. Critério de Pronto do MVP

O MVP estará **pronto para usar em produção** quando:

### Funcionalidade
- ✅ Jogador consegue iniciar uma jornada
- ✅ Jogador consegue completar as 8 fases do Capítulo 1
- ✅ Oficina molecular funciona no modelo simplificado
- ✅ Sistema corrige automaticamente (sem IA)
- ✅ Recompensas são aplicadas corretamente
- ✅ Progresso é salvo e pode ser retomado
- ✅ Jornada completa leva ~30-45 minutos

### Qualidade
- ✅ Coverage ≥ 75% (unit + integration)
- ✅ Lint sem erros
- ✅ TypeScript sem warnings
- ✅ Build reproduzível
- ✅ Testes rodam em < 2 minutos
- ✅ Zero erros não tratados em produção (Sentry)

### Segurança
- ✅ `npm audit` sem críticas/altas
- ✅ Headers de segurança configurados
- ✅ Validação de input em todas as rotas
- ✅ Autorização testada (User A não acessa User B)
- ✅ Secrets não expostos
- ✅ Rate limiting em endpoints críticos

### Disponibilidade
- ✅ Uptime ≥ 99% em staging por 24h
- ✅ Deploy automático via CI/CD
- ✅ Rollback plan documentado
- ✅ Backup de BD automático
- ✅ Logs agregados e acessíveis

### Documentação
- ✅ README completo
- ✅ Setup local funciona para novo dev
- ✅ Deploy process documentado
- ✅ Troubleshooting incluído

---

## 14. Próximas Ações

### Imediatamente
1. Review deste documento com o time
2. Confirmar versões estáveis atuais (Node, Next, etc)
3. Criar repositório com `.gitignore`, `.env.example`
4. Executar Checklist de Fase 1

### Semana 1
- Setup completo da stack
- Jest configurado
- Schema Prisma v1
- Primeiro seed

### Semana 2
- Scoring + Progression implementados
- Auth funcional
- Integration tests

### Semana 3
- UI completa
- API routes
- Jornada E2E manual

### Semana 4
- Testes finais
- Deploy to staging
- Deploy to production

---

## 15. Referências

### Tecnologias
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript 5.8+ Handbook](https://www.typescriptlang.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Docs](https://zod.dev)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [Auth.js NextAuth Docs](https://authjs.dev)

### Testing
- [Jest Docs](https://jestjs.io)
- [Testing Library Best Practices](https://testing-library.com/docs)
- [Test Driven Development by Example — Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

### Segurança
- [OWASP Top 10](https://owasp.org/www-project-top-ten)
- [Next.js Security](https://nextjs.org/docs/architecture/security)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-syntax.html)

---

## Changelog

| Versão | Data | Mudanças |
|---|---|---|
| 1.0 | 2025-01-10 | Documento consolidado com stack, TDD, checklist completo |

---

**Este é o documento definitivo. Qualquer dúvida, consulte-o antes de tomar decisões técnicas.**

**Próxima ação:** Time revisa, confirma stack, e começa Sprint 1. ✅