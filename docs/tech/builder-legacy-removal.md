# Remoção do Builder Legado

## Propósito

Este documento registra a remoção dos formatos legados do builder molecular:

- `LegacyBuilderState`
- `BlueprintBuilderState`

No estado atual do projeto, o builder aceita apenas `GraphBuilderState` como contrato oficial.

## Estado final

### Remoção concluída

- `lib/builder/types.ts` mantém apenas o formato canônico em grafo;
- `lib/builder/schema.ts` publica somente o schema canônico;
- `lib/builder/validate.ts` mantém apenas a validação em grafo;
- `app/api/phases/[phaseId]/builder/validate/route.ts` aceita apenas payload canônico;
- `lib/gameplay/schema.ts` aceita apenas `GraphBuilderState`;
- `lib/builder/compat/legacy-builder.ts` foi removido;
- a suíte principal do builder cobre apenas `GraphBuilderState`.

### Formato canônico

- `GraphBuilderState`

### Justificativa da remoção

Manter formatos legados no caminho principal do builder aumenta:

- complexidade de leitura;
- custo de teste;
- risco de regressão;
- ambiguidade sobre o contrato oficial;
- sobrecarga de manutenção.

## Pré-condições atendidas

- a UI oficial usa apenas `GraphBuilderState`;
- as rotas públicas não aceitam mais payloads legados;
- a suíte principal cobre o fluxo canônico;
- o corte de compatibilidade foi executado explicitamente.

## Escopo executado

Quando a remoção for executada, os pontos abaixo devem ser alterados:

### Tipos

Arquivo:

- `lib/builder/types.ts`

Resultado:

- `LegacyBuilderState` removido;
- `BlueprintBuilderState` removido;
- tipos auxiliares legados removidos;
- `BuilderState` reduzido para `GraphBuilderState`.

### Schemas

Arquivo:

- `lib/builder/schema.ts`

Resultado:

- schemas legados removidos;
- `canonicalBuilderStateSchema` mantido como schema público principal;
- `builderStateCompatibilitySchema` removido;
- `builderStateSchema` alinhado ao formato canônico.

### Validação

Arquivo:

- `lib/builder/validate.ts`
- `lib/builder/compat/legacy-builder.ts`

Resultado:

- dispatch de compatibilidade removido de `lib/builder/validate.ts`;
- `lib/builder/compat/legacy-builder.ts` removido;
- regras legadas removidas;
- resolução legada removida;
- mantido somente o caminho canônico em grafo.

### Rotas e gameplay

Arquivos:

- `app/api/phases/[phaseId]/builder/validate/route.ts`
- `lib/gameplay/schema.ts`

Resultado:

- aceitam apenas `GraphBuilderState`;
- menções a compatibilidade histórica removidas.

### Testes

Arquivos:

- `tests/unit/builder/validate.test.ts`

Resultado:

- mantidos apenas testes do fluxo canônico.

## Verificação esperada

- rodar `typecheck`, `build` e suíte de testes completa;
- confirmar ausência de referências residuais aos formatos legados fora do histórico Git.

## Critério de aceite atendido

- o builder aceitar somente `GraphBuilderState`;
- `typecheck` e `build` passarem;
- testes de unidade, smoke e integração passarem;
- não existirem referências residuais aos formatos legados fora do histórico Git.
