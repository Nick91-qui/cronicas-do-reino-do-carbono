# Direção Visual

## Objetivo do documento

Este documento define a direção visual oficial do MVP de **Crônicas do Reino do Carbono**.

Seu papel é alinhar:

- atmosfera estética;
- linguagem visual do mundo;
- princípios de composição da interface;
- fronteira entre UI em código e arte bitmap;
- consistência entre gameplay, narrativa e apresentação.

Ele não substitui `docs/design/game-design.md`. O documento de design define a lógica jogável; este documento define como essa lógica deve aparecer visualmente.

## Papel da direção visual no MVP

O visual do MVP deve:

- reforçar a fantasia de um reino alquímico-cósmico do carbono;
- tornar a construção molecular intuitiva;
- transformar cartas e painéis em ferramentas de leitura, e não apenas decoração;
- manter a interface legível em desktop e mobile;
- permitir evolução incremental sem exigir refeito completo da base visual.

## Identidade visual do jogo

### Tom geral

O jogo deve combinar:

- fantasia científica;
- alquimia;
- laboratório arcano;
- astronomia simbólica;
- instrumentação didática clara.

### Mistura visual esperada

A linguagem visual oficial do MVP combina:

- fundos atmosféricos escuros com profundidade;
- brilho energético em elementos interativos;
- painéis ornamentados inspirados em manuscritos, pergaminhos ou molduras arcanas;
- cartas de moléculas com leitura quase enciclopédica;
- elementos didáticos claros sobrepostos a um cenário mais épico.

## Princípios visuais

### 1. Gameplay primeiro

A interface deve continuar clara mesmo sem arte final completa.

### 2. Texto sempre vivo

Textos de interface, atributos, feedbacks, nomes de fase e números devem ser renderizados em HTML/CSS, não embutidos em imagens.

### 3. Arte como atmosfera e reforço

Imagens geradas ou ilustradas devem ser usadas principalmente para:

- fundos;
- ilustrações centrais;
- molduras;
- texturas;
- objetos de cenário;
- peças decorativas recorrentes.

### 4. Componentes reutilizáveis

O visual deve nascer de componentes de UI reusáveis, não de telas inteiramente montadas como imagens únicas.

### 5. Progressão visual

O jogo deve comunicar avanço conceitual também por aparência:

- novas geometrias de construção;
- novas molduras;
- novos fragmentos;
- maior complexidade visual nas fases avançadas.

## Direção cromática

### Paleta base

- fundo profundo: azuis escuros, carvão, marrom quase negro;
- luz arcana: ciano, azul elétrico, dourado quente;
- destaque de sistema: verde para sucesso, âmbar para atenção, vermelho para colapso estrutural;
- cartas: base clara com bordas energizadas e separadores coloridos.

### Regra de contraste

O contraste textual deve priorizar legibilidade. Elementos decorativos não podem competir com texto instrucional ou com alvos clicáveis.

## Tipografia

### Títulos

Títulos de capítulo, fase e grandes painéis podem ter caráter mais épico e ornamental.

### Texto funcional

Textos de missão, atributos, feedback, labels e botões devem usar fonte altamente legível.

### Regra oficial

Nunca depender de uma tipografia ornamental para explicar mecânicas centrais.

## Aplicação por áreas da interface

### Cena principal da fase

Deve comunicar:

- o desafio atual;
- o estado energético da construção;
- o foco central no átomo ou estrutura ativa.

### Laboratório de síntese

Deve parecer um mecanismo ritual-científico:

- carbono central como hub;
- slots como encaixes luminosos;
- ação de síntese com feedback forte;
- blueprint visualmente distinto por geometria.

### Cartas de molécula

Devem equilibrar:

- identidade épica;
- legibilidade técnica;
- comparação rápida.

### Painéis laterais

Devem organizar:

- lore;
- objetivo;
- inventário;
- status;
- recompensas.

## Fronteira entre código e asset visual

### Deve ser feito em código

- layout;
- grids;
- cards;
- barras de atributo;
- estados selecionado, hover, bloqueado e concluído;
- tooltips e feedbacks;
- textos e números;
- posicionamento lógico dos slots.

### Pode ser feito com assets

- backgrounds de capítulo;
- texturas de painel;
- ilustrações de moléculas;
- bancada de ação;
- brilho ornamental;
- molduras decorativas;
- ícones temáticos.

## Resultado esperado

Ao final, o MVP deve apresentar uma identidade visual clara e memorável, mesmo que ainda com quantidade limitada de assets.
