# Plano de Refatoração da Mesa de Síntese Ramificada

## 1. Propósito

Este documento define a proposta de arquitetura para evoluir a mesa de síntese atual para uma mesa com:

- hidrogênios visíveis;
- geometria 2D mais próxima das convenções reais de ligações;
- crescimento por escolha do carbono de expansão;
- suporte a cadeias ramificadas;
- migração incremental sem reescrever todo o fluxo de fase de uma vez.

Este documento é um plano de arquitetura e execução.

Ele existe para:

- explicar por que o builder atual ficou pequeno demais para a direção desejada;
- registrar o modelo de dados alvo;
- orientar a nova organização de código;
- dividir a refatoração em entregas de baixo risco;
- consolidar as decisões de escopo aprovadas antes da implementação.

Enquanto este plano não for promovido explicitamente aos documentos normativos centrais, a especificação oficial em vigor continua sendo a descrita em `docs/tech/technical-spec.md` e `docs/design/game-design.md`.

### 1.1 Escopo aprovado para a refatoração

As decisões abaixo já foram aprovadas para esta trilha:

- os hidrogênios devem aparecer como átomos visíveis separados;
- o primeiro rollout já deve cobrir cadeia aberta e anéis;
- o modelo deve nascer com ligação simples, dupla e tripla;
- a UX deve oferecer `undo` e remoção direta de carbono terminal;
- o jogador pode expandir a estrutura a partir de qualquer carbono com valência livre;
- o reconhecimento oficial deve preparar caminho para isômeros constitucionais;
- a arquitetura deve integrar uma engine química externa desde o início.

---

## 2. Contexto atual

O builder atual foi simplificado para o MVP inicial.

Ele trabalha com:

- `layout` global (`open_chain` ou `closed_ring`);
- `carbonCount` global;
- lista sequencial de ligações entre carbonos consecutivos;
- hidrogênios calculados implicitamente;
- reconhecimento autoritativo de um conjunto pequeno de moléculas oficiais.

Esse modelo foi suficiente para:

- metano;
- etano;
- propano;
- eteno;
- propeno;
- buteno;
- benzeno.

Porém, esse formato tem limites estruturais claros:

- não representa ramificação;
- não permite escolher o carbono onde nasce um novo carbono;
- não modela a molécula como grafo arbitrário;
- mistura visual simplificado e regra química em uma estrutura pequena demais;
- não favorece exibição explícita de hidrogênios;
- dificulta layout 2D consistente quando a molécula deixa de ser apenas linear ou cíclica simples.

---

## 3. Objetivo da refatoração

O objetivo desta refatoração não é transformar a mesa em um editor químico profissional genérico.

O objetivo é construir uma mesa própria do jogo que:

- continue pedagógica;
- preserve o tom visual do laboratório de síntese;
- exponha melhor a estrutura da molécula;
- permita ramificação controlada;
- continue autoritativa e validável no servidor;
- permaneça limitada ao escopo didático do Capítulo I e da expansão imediata do MVP.

Em termos de UX, o jogador deve poder:

- visualizar os carbonos e os hidrogênios da estrutura;
- identificar em qual carbono clicar para expandir a cadeia;
- enxergar a alteração da valência em tempo real;
- perceber quando um carbono vira `CH3`, `CH2`, `CH` ou `C`;
- entender visualmente a diferença entre cadeia linear, ramificada, insaturada e aromática.

---

## 4. Decisão de arquitetura recomendada

### 4.1 Estratégia principal

A direção recomendada é:

- manter uma UI própria do projeto;
- migrar a renderização 2D da molécula para `SVG`;
- trocar o estado atual do builder por um grafo explícito de átomos e ligações;
- separar claramente:
  - estado químico;
  - derivação visual;
  - layout 2D;
  - validação autoritativa;
  - reconhecimento de molécula oficial;
- fazer a migração em camadas, sem trocar o fluxo inteiro de fase no primeiro passo.

### 4.2 Motivo para manter `SVG`

`SVG` continua sendo a tecnologia recomendada para a mesa porque:

- cada átomo e cada ligação podem permanecer clicáveis;
- a depuração visual é simples;
- animações leves continuam fáceis;
- a integração com React é direta;
- bibliotecas maduras do domínio químico também usam ou exportam `SVG`;
- o problema histórico do projeto não foi “usar SVG”, mas sim depender de geometria manual simplificada demais.

### 4.3 Papel de uma engine química externa

Este plano assume que a mesa deve continuar sendo uma UI autoral do projeto.

Mesmo assim, a refatoração deve usar uma engine externa para:

- normalização estrutural;
- auto-layout 2D;
- exportações futuras;
- conferência química adicional.

As opções candidatas mais prováveis são:

- `OpenChemLib JS`;
- `RDKit.js`, se o custo de integração e o estado de manutenção forem aceitos;

### 4.4 Recomendação atual de engine

A recomendação atual deste plano é:

- `OpenChemLib JS` como engine primária de apoio químico e de depiction/layout;
- `SVG` próprio do projeto como camada de render e interação;
- `RDKit.js` como candidato secundário para comparação, validação futura ou utilidades específicas, não como primeira escolha da integração inicial.

Motivos:

- `OpenChemLib JS` oferece edição, coordenadas, `toSVG`, hidrogênios implícitos/explicitação e operações químicas relevantes sem o alerta atual de transição de manutenção observado em `RDKit.js`;
- a UI do jogo continua sob controle do projeto;
- a engine externa resolve o problema estrutural de layout e assinatura química sem obrigar a mesa a virar um editor químico genérico.

---

## 5. Novo modelo de dados

### 5.1 Princípio

O novo builder deve deixar de representar a molécula como “uma cadeia com contagem global” e passar a representá-la como um grafo molecular simplificado.

No escopo imediato da refatoração, esse grafo deve representar:

- carbonos explícitos;
- hidrogênios explícitos na camada visual derivada;
- ligações simples, duplas e triplas;
- cadeias abertas e cíclicas;
- ramificação arbitrária dentro das regras de valência da fase.

### 5.2 Estado canônico recomendado

Formato conceitual recomendado:

```ts
type BranchedAtomId = string;
type BranchedBondId = string;

type BranchedBondOrder = 1 | 2 | 3;

type BranchedAtom = {
  id: BranchedAtomId;
  element: "C" | "H";
  isDerivedHydrogen?: boolean;
};

type BranchedBond = {
  id: BranchedBondId;
  atomA: BranchedAtomId;
  atomB: BranchedAtomId;
  order: BranchedBondOrder;
};

type BranchedBuilderState = {
  version: 2;
  atoms: BranchedAtom[];
  bonds: BranchedBond[];
  rootAtomId: BranchedAtomId;
  selectedAtomId: BranchedAtomId | null;
  selectedBondId: BranchedBondId | null;
  ringAnchors?: BranchedAtomId[];
};
```

### 5.3 Regras do estado canônico

- os átomos editáveis iniciais do jogador são carbonos;
- hidrogênios visíveis são derivados automaticamente e não devem ser editados manualmente;
- toda ligação conecta dois átomos distintos;
- o grafo deve ser conexo;
- hidrogênios derivados podem ser materializados em projeções de render sem alterar a fonte de verdade do grafo editável;
- `rootAtomId` existe para orientar layout e estabilidade visual;
- seleções atuais da UI podem viver no estado da interface ou no estado canônico, desde que a fronteira seja clara.

### 5.4 Derivações calculadas

A partir de `BranchedBuilderState`, a aplicação deve derivar:

- vizinhança de cada átomo;
- valência ocupada por átomo;
- hidrogênios por átomo;
- projeção visual explícita dos hidrogênios;
- conectividade;
- presença de ciclo;
- tipo geral da estrutura;
- assinatura canônica para reconhecimento de molécula oficial.

### 5.5 Compatibilidade de contratos

Durante a migração, recomenda-se não substituir imediatamente todos os aliases atuais.

Estratégia:

- introduzir `BranchedBuilderState` ao lado do `GraphBuilderState`;
- criar novo namespace ou novo grupo de arquivos para o builder ramificado;
- adaptar o fluxo de fase para consumir um `BuilderState` discriminado por versão somente quando a UI nova estiver estável;
- retirar o contrato antigo apenas depois da cobertura funcional mínima do novo builder.

---

## 6. Cálculo de hidrogênios

### 6.1 Regra química simplificada

No escopo atual, cada carbono continua obedecendo à valência máxima 4.

Para cada átomo de carbono:

- `valenciaOcupada = soma(ordemDasLigacoesDoAtomo)`
- `hidrogenios = max(0, 4 - valenciaOcupada)`

Exemplos:

- carbono com uma ligação simples: `CH3`
- carbono com duas ligações simples: `CH2`
- carbono com três ordens totais de ligação: `CH`
- carbono com valência completa sem hidrogênio: `C`

### 6.2 Regras operacionais

- hidrogênios devem ser recalculados a cada mutação estrutural;
- se `valenciaOcupada > 4`, a estrutura é inválida;
- a UI deve exibir invalidez antes mesmo da submissão final sempre que isso for determinístico.

### 6.3 Derivação visual

Para cada carbono:

- o carbono continua sendo o átomo central editável;
- os hidrogênios derivados devem ser desenhados como átomos explícitos separados;
- o posicionamento dos H deve respeitar os ângulos livres restantes do carbono;
- a renderização pode exibir também um label condensado auxiliar em modo de debug ou acessibilidade, mas não como visual principal da experiência.

### 6.4 Recomendação de escopo

Para controlar risco mesmo com H explícito, a primeira versão deve:

- manter apenas carbono como nó editável;
- gerar e destruir nós de hidrogênio derivados a cada mutação;
- impedir qualquer fluxo em que o jogador precise selecionar ou editar diretamente um hidrogênio;
- tratar o conjunto de H como projeção visual derivada e não como estado autoritativo primário.

---

## 7. Posicionamento 2D dos carbonos

### 7.1 Princípio

O posicionamento da molécula deve deixar de depender de coordenadas feitas à mão por modo de layout global.

O novo layout deve ser calculado a partir do grafo.

### 7.2 Estratégia recomendada para a primeira entrega

Usar layout apoiado por engine química externa desde a primeira etapa, com as seguintes ideias:

- o grafo editável do projeto continua sendo a fonte de verdade;
- a engine gera ou normaliza coordenadas 2D dos carbonos;
- a aplicação projeta os hidrogênios explícitos a partir dessas coordenadas e da valência livre;
- o projeto preserva um pós-processamento leve para estabilidade visual e affordances do jogo;
- ciclos e cadeias abertas já entram no mesmo contrato de layout inicial.

### 7.3 Ângulos preferenciais

Na primeira entrega, a meta é perseguir convenções químicas visuais coerentes e estáveis:

- cadeia principal com direção predominante em zigue-zague;
- distribuição angular coerente para carbonos sp3, sp2 e sp;
- dois vizinhos podem abrir em torno de 120 graus quando a topologia pedir;
- uma tripla deve induzir alinhamento mais linear dos eixos relevantes;
- três vizinhos devem evitar empilhamento visual;
- ramificação deve sair para cima/baixo alternadamente quando possível;
- anéis devem seguir coordenadas regulares ou normalizadas pela engine;
- aromáticos continuam sendo um caso especial de render e reconhecimento.

### 7.4 Casos especiais de layout

#### Cadeias abertas e ramificadas

- usar zigue-zague padrão como base;
- manter comprimento de ligação constante;
- alternar a inclinação dos segmentos.

#### Ramificações

- ao adicionar um carbono, preferir o ângulo livre mais próximo da convenção local;
- reexecutar layout parcial a partir do átomo alterado;
- preservar o restante da molécula o máximo possível para evitar “pulos” visuais.

#### Estruturas cíclicas

- entrar já na primeira etapa;
- usar geometria regular ou coordenadas normalizadas pela engine;
- para anel de 6, manter geometria hexagonal explícita quando apropriado;
- aromaticidade continua sendo um caso de render especial.

### 7.5 Estrutura de layout recomendada

```ts
type AtomLayout = {
  atomId: BranchedAtomId;
  x: number;
  y: number;
};

type BuilderLayoutSnapshot = {
  atoms: AtomLayout[];
  bondLength: number;
};
```

O layout deve ser derivado do estado canônico e nunca ser a fonte de verdade química.

### 7.6 Hidrogênios explícitos no layout

Os hidrogênios não devem participar da edição principal do grafo do jogador, mas devem participar da renderização final.

Estratégia:

- calcular as direções livres de cada carbono a partir dos seus vizinhos e ordens de ligação;
- posicionar H derivados nesses ângulos livres;
- reduzir sobreposição com deslocamentos leves;
- nunca usar a posição do H como critério de reconhecimento químico oficial.

### 7.7 Fronteira entre química e visual

- `BranchedBuilderState` define a química editável;
- `BuilderLayoutSnapshot` define a geometria visual transitória;
- reconhecimento de molécula não deve depender diretamente de coordenadas 2D;
- coordenadas existem só para render e interação.

---

## 8. Reconhecimento de molécula oficial

### 8.1 Regra principal

O servidor deve continuar autoritativo.

O cliente pode:

- pré-validar;
- exibir hidrogênios;
- destacar inconsistências;
- sugerir reconhecimento.

Mas o reconhecimento oficial deve continuar no servidor.

### 8.2 Estratégia recomendada

Separar três camadas:

1. validação estrutural do grafo;
2. derivação de propriedades químicas simplificadas;
3. resolução da molécula oficial do jogo.

### 8.3 Resolução inicial

Na primeira versão do builder ramificado, o conjunto oficial do Capítulo I continua pequeno, mas a arquitetura deve nascer apta a diferenciar isômeros constitucionais.

O reconhecimento não deve mais depender apenas de contagem simples.

Ele deve considerar uma assinatura controlada com pelo menos:

- número de carbonos;
- número total de hidrogênios;
- multiconjunto de graus do grafo carbônico;
- multiconjunto das ordens de ligação;
- presença de ciclo;
- posição relativa das insaturações;
- padrão alternado aromático;
- canonização da conectividade.

Isso permite reconhecer:

- metano;
- etano;
- propano;
- propeno;
- buteno;
- benzeno;
- e diferenciar isômeros quando o conteúdo exigir.

### 8.4 Atenção para ramificação

O reconhecimento precisa distinguir desde já:

- cadeia normal;
- cadeia ramificada;
- posição de insaturação quando aplicável;
- ciclo versus não ciclo.

Esse ponto impacta diretamente a expansão do conteúdo para isomeria constitucional e não deve ficar para uma etapa posterior improvisada.

---

## 9. Organização recomendada de código

### 9.1 Objetivo

Evitar repetir o acoplamento atual entre:

- representação química;
- preview;
- layout visual;
- render dos controles;
- validação.

### 9.2 Estrutura sugerida

```text
lib/builder/
  state/
    branched-types.ts
    branched-schema.ts
    branched-operations.ts
    branched-selectors.ts
  chemistry/
    hydrogens.ts
    valence.ts
    graph-analysis.ts
    molecule-signature.ts
    engine-interop.ts
  layout/
    branched-layout.ts
    ring-layout.ts
    geometry.ts
    hydrogen-layout.ts
  validation/
    branched-validate.ts
    resolve-official-molecule.ts
  compatibility/
    graph-to-branched.ts
    branched-to-legacy-preview.ts
components/phase/
  synthesis-lab-v2.tsx
  synthesis-lab-svg.tsx
  synthesis-atom-node.tsx
  synthesis-bond-edge.tsx
  synthesis-builder-toolbar.tsx
```

### 9.3 Responsabilidades

`state/`

- tipos;
- schema;
- operações puras de mutação;
- selectors puros.

`chemistry/`

- valência;
- hidrogênios;
- análise do grafo;
- assinatura química simplificada.
- interoperabilidade com a engine externa.

`layout/`

- coordenadas 2D;
- posicionamento incremental;
- casos especiais de ciclos.
- projeção explícita dos hidrogênios.

`validation/`

- regras autoritativas;
- mensagens de erro;
- resolução da molécula oficial.

`components/phase/`

- renderização;
- interação;
- toolbar;
- estados de foco, hover e seleção.

### 9.4 Regra de arquitetura

Os componentes React não devem conter regra química central.

Eles podem:

- disparar operações;
- renderizar estados derivados;
- exibir feedback.

Mas regras de valência, conectividade e reconhecimento devem viver em `lib/builder/`.

---

## 10. Estratégia de migração incremental

### 10.1 Princípio

Não trocar simultaneamente:

- modelo de dados;
- validação;
- renderização;
- fluxo de fase;
- reconhecimento químico;
- conteúdo oficial.

A refatoração deve acontecer em camadas.

### 10.2 Fase 1 — Nova base interna com engine desde o início

Entregas:

- introduzir `BranchedBuilderState`;
- criar operações puras de edição;
- introduzir tipos para simples, dupla e tripla;
- criar cálculo de hidrogênios;
- integrar a engine externa escolhida;
- criar layout 2D de carbonos e anéis com apoio da engine;
- criar projeção explícita de hidrogênios;
- criar suíte de testes da nova base;
- manter a UI atual intacta.

Objetivo:

- estabilizar o núcleo novo antes de expô-lo ao jogador.

### 10.3 Fase 2 — Novo renderer SVG paralelo

Entregas:

- criar `synthesis-lab-v2.tsx`;
- renderizar carbonos e hidrogênios explícitos;
- renderizar ligações simples, duplas e triplas;
- permitir seleção visual de átomo e ligação;
- exibir preview da nova mesa em ambiente controlado.

Objetivo:

- validar visual e interação sem trocar ainda o fluxo produtivo principal.

### 10.4 Fase 3 — Mutações reais de ramificação

Entregas:

- operação “adicionar carbono no átomo selecionado”;
- operação “remover carbono terminal”;
- ação de `undo`;
- operação “alternar ligação”;
- bloqueios de invalidez por valência;
- manutenção de layout estável após mutações.

Objetivo:

- tornar possível o caso descrito de crescimento linear e ramificado.

### 10.5 Fase 4 — Integração com validação oficial

Entregas:

- nova rota ou adaptação da rota de validação para `BranchedBuilderState`;
- resolução oficial de moléculas do Capítulo I;
- suporte a diferenciação estrutural para isômeros;
- compatibilidade com `construction` e `construction_choice`;
- persistência da tentativa com o novo payload.

Objetivo:

- plugar o builder novo no loop real da fase.

### 10.6 Fase 5 — Substituição gradual da mesa antiga

Entregas:

- feature flag ou chave de rollout por fase;
- primeira fase usando a mesa nova;
- ajustes de UX;
- remoção da mesa antiga apenas depois de estabilização.

Objetivo:

- reduzir risco de regressão no capítulo inteiro.

---

## 11. Impactos previstos no código atual

### 11.1 Builder

Arquivos mais impactados:

- `lib/builder/types.ts`
- `lib/builder/schema.ts`
- `lib/builder/validate.ts`
- `lib/builder/graph-preview.ts`

### 11.2 Fase e UI

Arquivos mais impactados:

- `components/phase/phase-experience.tsx`
- `components/phase/synthesis-lab.tsx`
- `components/phase/synthesis-lab-visual.tsx`

### 11.3 Gameplay e rotas

Arquivos mais impactados:

- `app/api/phases/[phaseId]/builder/validate/route.ts`
- `app/api/phases/[phaseId]/submit/route.ts`
- `lib/gameplay/schema.ts`
- `lib/gameplay/evaluate-phase.ts`

### 11.4 Documentação normativa futura

Quando a arquitetura for confirmada e começar a substituir o contrato oficial, deverão ser revistos:

- `docs/tech/technical-spec.md`
- `docs/design/game-design.md`
- `docs/product/mvp-scope.md`
- possivelmente `docs/design/phases.md`, se a nova mesa alterar a leitura pedagógica das fases.

---

## 12. Critérios de aceite da refatoração

O builder novo pode ser considerado pronto para assumir fases reais quando:

- exibir hidrogênios de forma clara;
- suportar crescimento linear e ramificado;
- manter layout estável em mutações pequenas;
- validar valência corretamente;
- reconhecer as moléculas oficiais do capítulo coberto;
- não quebrar submit, progresso e persistência;
- manter boa usabilidade em mobile e desktop;
- possuir testes unitários suficientes no núcleo do builder;
- possuir ao menos um teste de integração do fluxo completo da fase.

---

## 13. Riscos principais

### 13.1 Escopo visual acima do necessário

Risco:

- tentar desenhar hidrogênios individuais cedo demais sem uma boa disciplina de layout;
- criar poluição visual e colisões.

Mitigação:

- usar a engine desde o início;
- separar layout dos carbonos e projeção dos H;
- testar mobile cedo.

### 13.2 Layout instável

Risco:

- a molécula “saltar” demais a cada clique.

Mitigação:

- usar `rootAtomId`;
- recalcular layout local sempre que possível;
- preservar coordenadas anteriores como pista.

### 13.3 Reconhecimento químico insuficiente

Risco:

- o modelo reconhecer contagens, mas não distinguir isômeros relevantes.

Mitigação:

- separar cedo assinatura química e resolução oficial.

### 13.4 Regressão no fluxo atual

Risco:

- quebrar submit, tutorial, progressão ou overlays.

Mitigação:

- mesa nova em paralelo;
- rollout progressivo.

---

## 14. Questões restantes que não bloqueiam o início

As decisões estruturais principais desta trilha já foram fechadas.

As questões abaixo podem ser refinadas durante a implementação sem travar o arranque da arquitetura:

- qual engine externa será confirmada como oficial da primeira integração, `OpenChemLib JS` ou alternativa equivalente;
- se a UI vai expor toggles auxiliares de debug para labels condensados além dos H explícitos;
- em que fase do conteúdo oficial a diferenciação de isômeros ramificados passa a valer como regra pedagógica concreta;
- se a primeira versão do anel aromático será representada com rótulo visual especializado ou apenas pela geometria e alternância de ligações;
- qual será a política final de undo: pilha local apenas da sessão da fase ou integração futura com histórico mais amplo do builder.

---

## 15. Recomendação de decisão para início

Com o escopo aprovado, a recomendação de início passa a ser:

- engine externa integrada desde a Fase 1;
- `OpenChemLib JS` como primeira candidata de implementação;
- hidrogênios explícitos como projeção visual derivada;
- cadeias e anéis no mesmo contrato de layout inicial;
- simples, dupla e tripla já no modelo;
- `undo` e remoção terminal já previstos nas operações do builder;
- assinatura estrutural preparada para isomeria.

Essa combinação aumenta o escopo inicial, mas evita duas refatorações consecutivas do mesmo núcleo químico.
