# Pipeline de Assets

## Objetivo do documento

Este documento define como assets visuais devem ser planejados, produzidos e integrados ao MVP.

## Tipos de asset do projeto

O MVP pode usar os seguintes grupos de assets:

- background de capítulo;
- ilustração de molécula;
- textura de painel;
- moldura de carta;
- ícone de fragmento;
- elementos decorativos da bancada;
- efeitos de brilho e energia.

## Regra de uso

Assets devem reforçar a interface, não substituir a interface.

## O que deve permanecer em código

- textos;
- números;
- barras de atributos;
- indicadores de seleção;
- estados de botão;
- estrutura de layout;
- posição lógica de slots;
- feedbacks de erro e sucesso.

## O que pode ser asset bitmap

- cenários;
- texturas;
- fundos;
- ilustrações centrais;
- ornamentos;
- peças decorativas.

## Cartas de molécula

### Regra oficial

As cartas do jogo devem seguir um modelo híbrido.

Isso significa:

- shell visual da carta pode usar bitmap;
- arte principal da molécula pode usar bitmap;
- todo conteúdo variável da carta deve ser renderizado em código.

### Pode ser bitmap na carta

- moldura ornamental;
- textura base;
- brilho decorativo;
- selo visual recorrente;
- arte central da molécula.

### Deve permanecer vivo na carta

- nome químico;
- nome épico;
- fórmula molecular;
- fórmula estrutural resumida;
- atributos numéricos;
- barras de comparação;
- descrição curta;
- pontos fortes;
- limitações;
- propriedades destacadas;
- estados visuais de seleção, desbloqueio e comparação.

### Regra prática

Se a informação muda por molécula, fase, idioma, jogador ou contexto, ela não deve existir apenas dentro de uma imagem achatada.

## Convenção recomendada de organização

Os assets devem ser organizados por domínio visual, e não de forma genérica.

Estrutura recomendada:

```text
public/
  visual/
    backgrounds/
    cards/
      frames/
      textures/
      art/
    builder/
    panels/
    icons/
```

## Convenção de nomenclatura

Usar nomes estáveis e previsíveis.

Exemplos:

- `chapter-1-bg.png`
- `molecule-metano-main.png`
- `card-frame-common.png`
- `card-texture-paper-v1.png`
- `builder-workbench-v1.png`
- `panel-lore-parchment.png`

## Estratégia de produção

### Para o MVP

Priorizar assets que destravam a leitura visual do sistema:

- um fundo principal de capítulo;
- uma bancada da oficina;
- uma moldura de carta;
- uma textura base de carta;
- ilustrações das moléculas centrais do Capítulo I;
- alguns ícones de fragmentos.

### Regra de incrementalismo

O jogo deve continuar funcional mesmo antes da produção de todos os assets finais.

## Integração com a UI

Cada asset integrado deve ter:

- propósito claro;
- ponto de uso definido;
- fallback visual aceitável;
- nome estável para referência no código.

## Regra técnica

Nenhum asset visual deve carregar texto essencial para entendimento da mecânica principal.
