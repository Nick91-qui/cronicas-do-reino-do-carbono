# Crônicas do Reino do Carbono

Projeto de jogo educacional focado em química orgânica introdutória, estruturado como um MVP web com progressão linear, construção molecular simplificada, escolha estratégica de moléculas e justificativa por propriedades.

## Propósito

Este repositório reúne a base oficial de documentação e implementação do MVP de **Crônicas do Reino do Carbono**.

O projeto foi concebido para ensinar conceitos introdutórios de química orgânica por meio de uma experiência jogável centrada em:

- construção molecular guiada;
- comparação entre moléculas;
- relação entre estrutura, propriedade e aplicação;
- progressão por fases;
- feedback imediato e aprendizagem por tentativa.

## Status do projeto

**MVP documentation-first, em planejamento e implementação**

Isso significa que a base conceitual, pedagógica, de design e técnica está sendo consolidada antes da implementação completa do produto.

## Stack

A stack oficial atual do MVP é:

- **Frontend:** Next.js, React, TypeScript e Tailwind CSS
- **Backend:** Next.js Route Handlers e módulos server-side
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Deploy:** Vercel + Neon

## Organização da documentação

A documentação oficial do projeto está organizada em áreas temáticas dentro de `docs/`:

```text
README.md

docs/
  product/
    vision.md
    mvp-scope.md
  design/
    game-design.md
    phases.md
    content-model.md
  narrative/
    narrative.md
  pedagogy/
    teacher-guide.md
  tech/
    technical-spec.md
  planning/
    implementation-plan.md
```

## Documentos principais

### Produto

- `docs/product/vision.md`
- `docs/product/mvp-scope.md`

### Design

- `docs/design/game-design.md`
- `docs/design/phases.md`
- `docs/design/content-model.md`

### Narrativa

- `docs/narrative/narrative.md`

### Pedagogia

- `docs/pedagogy/teacher-guide.md`

### Técnica

- `docs/tech/technical-spec.md`

### Planejamento

- `docs/planning/implementation-plan.md`

## Ordem recomendada de leitura

Para entender o projeto de forma consistente, recomenda-se ler nesta ordem:

1. `docs/product/vision.md`
2. `docs/product/mvp-scope.md`
3. `docs/design/game-design.md`
4. `docs/design/phases.md`
5. `docs/design/content-model.md`
6. `docs/narrative/narrative.md`
7. `docs/pedagogy/teacher-guide.md`
8. `docs/tech/technical-spec.md`
9. `docs/planning/implementation-plan.md`

## Estrutura resumida do repositório

Além da documentação, o repositório deve evoluir para incluir a implementação do MVP.

Estrutura resumida esperada:

```text
README.md

docs/
  product/
  design/
  narrative/
  pedagogy/
  tech/
  planning/

content/
app/
components/
lib/
prisma/
podman/
scripts/
```

## Banco de dados por ambiente

### Desenvolvimento local

O ambiente de desenvolvimento usa PostgreSQL local em container **Podman**.

Arquivos relevantes:

- `podman/postgres.env.example`
- `scripts/podman-db-up.sh`
- `scripts/podman-db-down.sh`
- `scripts/podman-db-logs.sh`
- `.env.example`

### Produção

Produção continua usando **Neon**.

Arquivo de referência:

- `.env.production.example`

## Setup local

### Pré-requisitos

- Node.js 20+
- `npm`
- `podman`
- arquivo `.env` configurado

### Subir PostgreSQL local com Podman

1. subir o banco local:

```bash
npm run db:dev:up
```

2. se necessário, acompanhar logs:

```bash
npm run db:dev:logs
```

3. para parar o container:

```bash
npm run db:dev:down
```

O script cria `podman/postgres.env` automaticamente a partir de `podman/postgres.env.example` se o arquivo ainda não existir.

### Configurar variáveis de ambiente

Para desenvolvimento local, copie a base abaixo para `.env`:

```bash
cp .env.example .env
```

O `DATABASE_URL` padrão de desenvolvimento já aponta para o PostgreSQL local em `localhost:5432`.

### Preparar Prisma e seed

Com o banco local de pé e `.env` configurado:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

O seed inicial cria a turma `TURMA-ALFA`.

### Rodar a aplicação

```bash
npm install
npm run dev
```

## Fluxo de produção

Em produção, substitua o `.env` local por valores equivalentes aos de `.env.production.example` e aponte `DATABASE_URL` para o Neon.

## Observação importante

A documentação oficial é a referência principal do projeto.

Se a implementação divergir das regras, estruturas ou fluxos descritos nos documentos oficiais, a documentação deve ser revisada explicitamente.

## Licença

Adicionar conforme a política final do projeto.
