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
```

## Setup local

Esta seção pode ser ajustada conforme a implementação real avançar.

### Pré-requisitos

- Node.js
- `npm`, `pnpm` ou `yarn`
- PostgreSQL acessível via Neon
- arquivo `.env` configurado

### Passos gerais

1. instalar dependências;
2. configurar variáveis de ambiente;
3. rodar migrations;
4. iniciar o servidor local.

Exemplo genérico:

```bash
npm install
npm run prisma:migrate
npm run dev
```

## Observação importante

A documentação oficial é a referência principal do projeto.

Se a implementação divergir das regras, estruturas ou fluxos descritos nos documentos oficiais, a documentação deve ser revisada explicitamente.

## Licença

Adicionar conforme a política final do projeto.
