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
- listar decisões ainda em aberto antes da implementação.

Enquanto este plano não for promovido explicitamente aos documentos normativos centrais, a especificação oficial em vigor continua sendo a descrita em `docs/tech/technical-spec.md` e `docs/design/game-design.md`.

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

### 4.3 Papel de uma engine química auxiliar

Este plano assume que a mesa deve continuar sendo uma UI autoral do projeto.

Mesmo assim, a refatoração pode usar uma engine auxiliar para:

- normalização estrutural;
- auto-layout inicial;
- exportações futuras;
- conferência química adicional.

As opções candidatas mais prováveis para uso auxiliar são:

- `OpenChemLib JS`;
- `RDKit.js`, se o custo de integração e o estado de manutenção forem aceitos;
- nenhuma engine externa na primeira entrega, desde que o layout 2D interno seja mantido intencionalmente pequeno e bem testado.

Este plano não depende de decisão imediata por uma biblioteca externa.

---

## 5. Novo modelo de dados

### 5.1 Princípio

O novo builder deve deixar de representar a molécula como “uma cadeia com contagem global” e passar a representá-la como um grafo molecular simplificado.

No escopo imediato da refatoração, esse grafo pode continuar centrado em carbonos e ligações C-C, com hidrogênios derivados automaticamente.

### 5.2 Estado canônico recomendado

Formato conceitual recomendado:

```ts
type BranchedAtomId = string;
type BranchedBondId = string;

type BranchedBondOrder = 1 | 2;

type BranchedAtom = {
  id: BranchedAtomId;
  element: "C";
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
};
```

### 5.3 Regras do estado canônico

- todo átomo do escopo inicial é carbono;
- toda ligação conecta dois átomos distintos;
- o grafo deve ser conexo;
- não há hidrogênios persistidos no estado canônico da edição;
- hidrogênios são sempre derivados;
- `rootAtomId` existe para orientar layout e estabilidade visual;
- seleções atuais da UI podem viver no estado da interface ou no estado canônico, desde que a fronteira seja clara.

### 5.4 Derivações calculadas

A partir de `BranchedBuilderState`, a aplicação deve derivar:

- vizinhança de cada átomo;
- valência ocupada por átomo;
- hidrogênios por átomo;
- forma textual local (`CH3`, `CH2`, `CH`, `C`);
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

- hidrogênios não devem ser inseridos manualmente na primeira versão da refatoração;
- hidrogênios devem ser recalculados a cada mutação estrutural;
- se `valenciaOcupada > 4`, a estrutura é inválida;
- a UI deve exibir invalidez antes mesmo da submissão final sempre que isso for determinístico.

### 6.3 Derivação visual

Para cada carbono:

- label principal: `CH3`, `CH2`, `CH` ou `C`;
- opcionalmente, hidrogênios podem aparecer como parte do label condensado na primeira entrega;
- uma segunda entrega pode separar visualmente alguns H em posições próprias se isso trouxer ganho pedagógico real.

### 6.4 Recomendação de escopo

Para controlar risco, a primeira versão da refatoração deve usar:

- carbono como nó explícito;
- hidrogênio como derivação visual condensada no label.

Ou seja:

- `CH3`
- `CH2`
- `CH`
- `C`

Isso já satisfaz “hidrogênios aparecem” sem introduzir de imediato uma explosão de nós e colisões visuais.

---

## 7. Posicionamento 2D dos carbonos

### 7.1 Princípio

O posicionamento da molécula deve deixar de depender de coordenadas feitas à mão por modo de layout global.

O novo layout deve ser calculado a partir do grafo.

### 7.2 Estratégia recomendada para a primeira entrega

Usar um algoritmo interno pequeno e controlado, com as seguintes ideias:

- tratar a molécula como árvore na primeira etapa;
- usar o `rootAtomId` como origem do layout;
- distribuir vizinhos por ângulos preferenciais;
- preservar ângulos aproximados de ligações orgânicas em 2D;
- evitar sobreposição por regras simples de relaxamento;
- manter estabilidade visual entre mutações pequenas.

### 7.3 Ângulos preferenciais

Na primeira entrega, não é necessário perseguir geometria física exata.

É suficiente perseguir convenções visuais coerentes:

- cadeia principal com direção predominante em zigue-zague;
- vizinho único pode seguir direção principal;
- dois vizinhos podem abrir em torno de 120 graus;
- três vizinhos devem evitar empilhamento visual;
- ramificação deve sair para cima/baixo alternadamente quando possível;
- ciclo aromático pode continuar sendo um caso especial.

### 7.4 Casos especiais de layout

#### Cadeias abertas pequenas

- usar zigue-zague padrão como base;
- manter comprimento de ligação constante;
- alternar a inclinação dos segmentos.

#### Ramificações

- ao adicionar um carbono, preferir o ângulo livre mais próximo da convenção local;
- reexecutar layout parcial a partir do átomo alterado;
- preservar o restante da molécula o máximo possível para evitar “pulos” visuais.

#### Estruturas cíclicas

- continuar com layout especializado;
- para anel de 6, manter geometria hexagonal explícita;
- aromaticidade pode continuar sendo um caso de render especial.

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

### 7.6 Fronteira entre química e visual

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

Na primeira versão do builder ramificado, o conjunto oficial do Capítulo I continua pequeno.

O reconhecimento pode continuar por assinatura controlada, por exemplo:

- número de carbonos;
- multiconjunto de graus;
- contagem de ligações duplas;
- presença de ciclo;
- padrão alternado aromático;
- fórmula molecular derivada.

Isso permite reconhecer:

- metano;
- etano;
- propano;
- propeno;
- buteno;
- benzeno;
- e futuramente diferenciar isômeros quando o conteúdo exigir.

### 8.4 Atenção para ramificação

Quando a ramificação entrar, a assinatura atual baseada apenas em contagem de carbonos e “tipo geral de ligação” deixa de ser suficiente.

O reconhecimento precisará distinguir:

- cadeia normal;
- cadeia ramificada;
- posição de insaturação quando aplicável;
- ciclo versus não ciclo.

Esse ponto impacta diretamente a evolução futura do conteúdo e precisa ser fechado antes de expandir o capítulo para isomeria constitucional.

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
  layout/
    branched-layout.ts
    ring-layout.ts
    geometry.ts
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

`layout/`

- coordenadas 2D;
- posicionamento incremental;
- casos especiais de ciclos.

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

### 10.2 Fase 1 — Nova base interna sem trocar a UI principal

Entregas:

- introduzir `BranchedBuilderState`;
- criar operações puras de edição;
- criar cálculo de hidrogênios;
- criar layout 2D simples;
- criar suíte de testes da nova base;
- manter a UI atual intacta.

Objetivo:

- estabilizar o núcleo novo antes de expô-lo ao jogador.

### 10.3 Fase 2 — Novo renderer SVG paralelo

Entregas:

- criar `synthesis-lab-v2.tsx`;
- renderizar carbonos com labels `CHx`;
- renderizar ligações simples e duplas;
- permitir seleção visual de átomo e ligação;
- exibir preview da nova mesa em ambiente controlado.

Objetivo:

- validar visual e interação sem trocar ainda o fluxo produtivo principal.

### 10.4 Fase 3 — Mutações reais de ramificação

Entregas:

- operação “adicionar carbono no átomo selecionado”;
- operação “remover carbono terminal”;
- operação “alternar ligação”;
- bloqueios de invalidez por valência;
- manutenção de layout estável após mutações.

Objetivo:

- tornar possível o caso descrito de crescimento linear e ramificado.

### 10.5 Fase 4 — Integração com validação oficial

Entregas:

- nova rota ou adaptação da rota de validação para `BranchedBuilderState`;
- resolução oficial de moléculas do Capítulo I;
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

- tentar desenhar hidrogênios individuais demais cedo;
- criar poluição visual e colisões.

Mitigação:

- começar por labels condensados `CHx`.

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

## 14. Perguntas em aberto para fechar antes da implementação

### 14.1 Escopo visual dos hidrogênios

Pergunta:

- na primeira entrega, os hidrogênios podem aparecer como label condensado `CH3`, `CH2`, `CH`, `C`, ou você quer desde o começo cada `H` desenhado como átomo separado em volta do carbono?

Impacto:

- muda bastante a complexidade do layout e da renderização.

### 14.2 Escopo das ligações na primeira fase da refatoração

Pergunta:

- a primeira entrega da mesa nova deve cobrir apenas ligação simples e dupla, ou já deve prever tripla no modelo e na UI, mesmo sem uso imediato?

Impacto:

- muda tipos, layout e toolbar.

### 14.3 Papel de anéis na primeira entrega

Pergunta:

- você quer que a primeira versão nova já preserve anéis e aromáticos, ou prefere entregar primeiro cadeia aberta com ramificação e só depois migrar a lógica de ciclos?

Impacto:

- é um divisor importante de escopo.

### 14.4 Escopo de remoção

Pergunta:

- quando o usuário “desfaz” um crescimento, você quer apenas um botão de undo geral, ou também ações diretas como remover um carbono terminal clicando nele?

Impacto:

- muda operações do builder e UX principal.

### 14.5 Modelo pedagógico da expansão

Pergunta:

- o aluno poderá adicionar carbono em qualquer carbono com valência livre, ou haverá fases em que certos carbonos ficarão propositalmente bloqueados para guiar aprendizagem?

Impacto:

- muda se o builder é livre controlado ou guiado por affordances contextuais.

### 14.6 Escopo do conteúdo oficial após a ramificação

Pergunta:

- no curto prazo, o conteúdo oficial continuará reconhecendo só as moléculas já existentes do Capítulo I, ou você já quer abrir caminho para isômeros ramificados como `isobutano` logo após a refatoração da mesa?

Impacto:

- muda a assinatura química oficial e a estratégia de validação.

### 14.7 Biblioteca externa

Pergunta:

- você quer que a primeira versão da refatoração já dependa de uma engine externa, ou prefere começar com layout interno pequeno e deixar a integração externa como etapa posterior se necessário?

Impacto:

- muda dependências, risco e ritmo da implementação.

---

## 15. Recomendação de decisão para início

Se a meta for reduzir risco e começar logo, a recomendação inicial é:

- hidrogênios como labels condensados `CHx`;
- foco inicial em cadeia aberta;
- suporte a ligação simples e dupla;
- layout interno pequeno em `SVG`;
- ramificação por clique em carbono com valência livre;
- ciclos preservados no builder atual até a segunda etapa;
- nenhum uso obrigatório de biblioteca externa na primeira entrega;
- rollout paralelo da mesa nova.

Essa combinação é a que melhor preserva:

- velocidade;
- clareza arquitetural;
- baixo risco de regressão;
- caminho de evolução posterior.
