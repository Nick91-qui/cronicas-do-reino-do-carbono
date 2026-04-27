# Documentação Mestre

## Propósito

Este arquivo é o índice mestre da pasta `docs/`.

Seu papel é:

- explicar como a documentação está organizada;
- distinguir documentos normativos de documentos auxiliares;
- registrar a ordem oficial de precedência em caso de conflito;
- reduzir ambiguidades entre regra de negócio, planejamento, conteúdo tipado e material de expansão.

## Regra geral

No MVP de **Crônicas do Reino do Carbono**:

- `docs/` define a regra oficial de negócio;
- `content/` materializa essa regra como implementação tipada derivada;
- o banco de dados não é fonte de verdade para conteúdo jogável estático.

Se houver divergência entre documentação normativa e implementação, a divergência deve ser resolvida explicitamente, com atualização documental e ajuste de código quando necessário.

## Ordem oficial de precedência

Em caso de conflito, a precedência oficial é:

1. `docs/tech/technical-spec.md`
2. `docs/design/content-model.md`
3. `docs/design/phases.md`
4. `content/`
5. demais arquivos de `docs/`

### Interpretação prática

- `technical-spec.md` governa contratos técnicos, validação autoritativa e restrições de arquitetura.
- `content-model.md` governa enums, ids, shape de conteúdo e invariantes.
- `phases.md` governa o design oficial do Capítulo I.
- `content/` implementa o conteúdo jogável validado de forma executável e tipada.
- os demais arquivos contextualizam, explicam, operacionalizam ou expandem o projeto.

## Classificação dos documentos

### 1. Documentos normativos centrais

Esses arquivos definem oficialmente o MVP e devem ser usados para decisão de produto, implementação e validação:

- `project-context.md`
- `product/vision.md`
- `product/mvp-scope.md`
- `design/game-design.md`
- `design/content-model.md`
- `design/phases.md`
- `tech/technical-spec.md`

### 2. Documentos normativos complementares

Esses arquivos não substituem os centrais, mas formalizam regras operacionais relevantes:

- `visual/visual-direction.md`
- `visual/ui-system.md`
- `visual/screen-map.md`
- `visual/card-spec.md`
- `visual/asset-pipeline.md`
- `planning/implementation-plan.md`
- `planning/milestones-and-issues.md`
- `planning/qa-checklist.md`
- `tech/builder-legacy-removal.md`

### 3. Documentos auxiliares de uso pedagógico e narrativo

Esses arquivos apoiam escrita, mediação pedagógica e expansão conceitual, mas não devem redefinir o MVP por conta própria:

- `narrative/narrative.md`
- `pedagogy/teacher-guide.md`

### 4. Documentos de expansão pós-MVP

Esses arquivos estão explicitamente fora do escopo normativo do MVP atual e servem como base para evolução futura:

- `narrative/lore.md`
- `pedagogy/data.md`

## Mapa da pasta

### `product/`

Define visão, problema, proposta de valor e escopo funcional do MVP.

### `design/`

Define gameplay, estrutura do conteúdo, fases, avaliações, propriedades e progressão oficial do capítulo.

### `tech/`

Define arquitetura, persistência, segurança, contratos do sistema e decisões técnicas relevantes.

### `planning/`

Define estratégia de execução, status operacional, pendências e checklist de QA.

### `visual/`

Define direção visual, sistema de UI, telas, cartas e relação entre código e assets.

### `narrative/`

Define o tom da escrita e, no caso de `lore.md`, o universo expandido pós-MVP.

### `pedagogy/`

Define o uso docente, leitura pedagógica do capítulo e material de expansão conceitual.

## Como usar esta documentação

### Para implementar

Consulte primeiro:

1. `tech/technical-spec.md`
2. `design/content-model.md`
3. `design/phases.md`
4. `product/mvp-scope.md`

### Para validar conteúdo

Consulte primeiro:

1. `design/phases.md`
2. `design/content-model.md`
3. `content/`
4. `planning/qa-checklist.md`

### Para revisar UX e apresentação

Consulte primeiro:

1. `visual/visual-direction.md`
2. `visual/ui-system.md`
3. `visual/screen-map.md`
4. `design/game-design.md`

### Para escrever textos e narrativa

Consulte primeiro:

1. `narrative/narrative.md`
2. `design/phases.md`
3. `product/vision.md`

Use `narrative/lore.md` apenas como referência de expansão, salvo promoção explícita de trechos para o escopo normativo.

### Para uso pedagógico

Consulte primeiro:

1. `pedagogy/teacher-guide.md`
2. `design/phases.md`
3. `product/mvp-scope.md`

Use `pedagogy/data.md` apenas como base ampliada de expansão, e não como fonte oficial de validação do MVP.

## Regra de manutenção

Sempre que houver mudança real em:

- autenticação;
- conteúdo do capítulo;
- builder molecular;
- avaliação de fase;
- inventário e recompensas;
- direção visual consolidada;
- regras de progresso;
- contratos técnicos do backend;

deve haver revisão explícita dos documentos normativos afetados.

## Critério de interpretação

Se um documento auxiliar ou pós-MVP conflitar com um documento normativo:

- o documento normativo prevalece;
- o auxiliar deve ser ajustado depois, se necessário;
- nenhuma regra do MVP deve ser promovida implicitamente a partir de material de expansão.
