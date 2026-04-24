# Sistema de UI

## Objetivo do documento

Este documento define os blocos visuais e interativos da interface do MVP.

Seu foco é padronizar:

- componentes de tela;
- estados visuais;
- comportamento de feedback;
- organização entre cena, painel, builder e cartas.

## Camadas principais de UI

O MVP deve ser organizado em quatro camadas visuais:

1. cena de fase;
2. painéis de contexto;
3. laboratório de síntese;
4. cartas e feedback.

## Componentes principais

### PhaseScene

Responsável por:

- fundo da fase;
- título do capítulo e da fase;
- atmosfera visual;
- enquadramento do laboratório de síntese.

### LorePanel

Responsável por:

- capítulo atual;
- fase atual;
- narrativa curta;
- missão principal.

### InventoryPanel

Responsável por:

- recursos disponíveis na fase;
- fragmentos desbloqueados;
- elementos limitados;
- cartas ou recompensas relevantes.

### MolecularBuilder

Responsável por:

- seleção do blueprint;
- renderização do carbono central;
- posicionamento dos slots;
- seleção de elementos;
- preview de preenchimento;
- ação de criar.

### MoleculeCard

Responsável por:

- nome químico;
- nome épico;
- fórmula;
- ilustração;
- atributos;
- propriedades-chave;
- pontos fortes e limitações.

### FeedbackPanel

Responsável por:

- resultado da síntese;
- feedback narrativo;
- recompensas;
- progressão para próxima fase.

## Estados visuais obrigatórios

Cada componente interativo deve prever:

- normal;
- hover;
- ativo;
- selecionado;
- bloqueado;
- erro;
- sucesso;
- concluído.

### Convenção compartilhada de implementação

Para evitar drift entre telas, o projeto deve concentrar estados recorrentes em classes globais reutilizáveis.

Convenções atuais:

- `.ritual-link`: navegação secundária e ações leves;
- `.state-panel`: cards e painéis interativos com variações por `data-state`;
- `.state-action`: CTA principal e ação secundária com variações por `data-tone`;
- `.state-field`: campos de formulário com hover e foco consistentes;
- `data-state="active" | "success" | "locked"` para seleção, concluído e bloqueado;
- `data-tone="primary" | "secondary"` para hierarquia de ação.

Essas convenções devem cobrir, no mínimo:

- hover;
- foco visível por teclado;
- bloqueio;
- seleção ou destaque ativo;
- sucesso ou concluído quando aplicável.

## Sistema de laboratório de síntese

### Estrutura oficial

O laboratório de síntese visual do MVP deve ser composto por:

- núcleo central de carbono;
- blueprints selecionáveis;
- slots vazios;
- slots preenchidos;
- action bar;
- animação de síntese;
- retorno de estabilidade ou colapso.

### Regra de blueprint

Cada blueprint deve alterar:

- geometria dos slots;
- posição visual dos encaixes;
- leitura do tipo de valência em jogo;
- assinatura estrutural enviada ao backend.

### Regra de slot

Cada slot deve:

- ser clicável;
- indicar se está vazio ou preenchido;
- abrir menu de inventário contextual;
- mostrar brilho ao receber um elemento.

## Cartas de molécula

### Estrutura visual mínima

Cada carta deve conter:

- cabeçalho;
- fórmula;
- estrutura resumida;
- arte central;
- barra ou grade de atributos;
- descrição curta;
- resumo de pontos fortes;
- resumo de limitações.

### Regra de renderização

O conteúdo textual da carta deve vir dos dados, não de imagens prontas.

## Responsividade

### Desktop

Priorizar composição com cena central, painéis laterais e ação visível sem rolagem excessiva.

### Mobile

Reorganizar a interface em fluxo vertical:

- narrativa;
- laboratório de síntese;
- ação;
- cartas;
- feedback.

## Princípio técnico

O sistema de UI deve ser implementado em componentes React reutilizáveis com estilo em Tailwind CSS e variáveis visuais compartilhadas.
