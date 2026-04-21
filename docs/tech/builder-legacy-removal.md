# Remoção Planejada do Builder Legado

## Propósito

Este documento prepara a remoção dos formatos legados do builder molecular:

- `LegacyBuilderState`
- `BlueprintBuilderState`

No estado atual do projeto, a UI oficial da forja usa `GraphBuilderState` como formato canônico.

Os formatos legados permanecem apenas por compatibilidade interna temporária e não devem ser usados por novos fluxos.

## Estado atual

### Formato canônico

- `GraphBuilderState`

### Formatos legados mantidos por compatibilidade

- `LegacyBuilderState`
- `BlueprintBuilderState`

### Justificativa da remoção futura

Manter formatos legados no caminho principal do builder aumenta:

- complexidade de leitura;
- custo de teste;
- risco de regressão;
- ambiguidade sobre o contrato oficial;
- sobrecarga de manutenção.

## Pré-condições para remover

A remoção dos formatos legados deve acontecer somente quando estas condições forem verdadeiras:

- a UI oficial continuar usando apenas `GraphBuilderState`;
- nenhuma rota pública precisar aceitar payloads legados;
- não houver dependência operacional de payload histórico em produção;
- a suíte de testes cobrir o fluxo canônico do builder;
- o time aceitar explicitamente o corte de compatibilidade.

## Escopo de remoção

Quando a remoção for executada, os pontos abaixo devem ser alterados:

### Tipos

Arquivo:

- `lib/builder/types.ts`

Ações:

- remover `LegacyBuilderState`;
- remover `BlueprintBuilderState`;
- remover `BuilderBlueprintId`, `BuilderElement`, `BuilderSlotBondOrder`, `BuilderFilledSlot` e tipos associados que não forem mais usados;
- reduzir `BuilderState` para `GraphBuilderState`.

### Schemas

Arquivo:

- `lib/builder/schema.ts`

Ações:

- remover schemas legados;
- tornar `canonicalBuilderStateSchema` o schema público principal;
- remover `builderStateCompatibilitySchema`;
- alinhar `builderStateSchema` ao formato canônico.

### Validação

Arquivo:

- `lib/builder/validate.ts`

Ações:

- remover branches de `legacy` e `blueprint`;
- remover regras de validação legadas;
- remover resolução de moléculas para formatos legados;
- manter somente o caminho canônico em grafo.

### Rotas e gameplay

Arquivos:

- `app/api/phases/[phaseId]/builder/validate/route.ts`
- `lib/gameplay/schema.ts`

Ações:

- aceitar apenas `GraphBuilderState`;
- remover menções a compatibilidade histórica.

### Testes

Arquivos:

- `tests/unit/builder/validate.test.ts`

Ações:

- remover testes de compatibilidade legada;
- manter apenas testes do fluxo canônico.

## Ordem recomendada

1. confirmar ausência de uso real dos formatos legados;
2. ajustar testes para refletir apenas o formato canônico;
3. trocar schema público para o formato canônico;
4. remover lógica legada da validação;
5. remover tipos e helpers mortos;
6. rodar `typecheck`, `build` e suíte de testes completa;
7. registrar a mudança nos documentos técnicos e de planejamento.

## Critério de aceite da remoção

A remoção pode ser considerada concluída quando:

- o builder aceitar somente `GraphBuilderState`;
- `typecheck` e `build` passarem;
- testes de unidade, smoke e integração passarem;
- a forja continuar funcional em produção;
- não existirem referências residuais aos formatos legados fora do histórico Git.
