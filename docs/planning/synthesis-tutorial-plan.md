# Plano Técnico do Tutorial da Bancada

## 1. Propósito

Este documento define o plano técnico para introduzir um tutorial de uso da bancada de síntese no MVP de **Crônicas do Reino do Carbono**.

Ele existe para:

- reduzir atrito de onboarding na primeira fase de síntese;
- ensinar controles da bancada sem criar uma nova fase oficial do capítulo;
- preservar a progressão atual do MVP;
- orientar uma implementação incremental de baixo risco.

---

## 2. Decisão de produto

O projeto **não** abrirá uma `Fase 0` oficial neste momento.

A direção escolhida é:

- tutorial contextual antes e durante a primeira síntese relevante;
- ajuda reutilizável nas demais fases de síntese;
- sem alterar a ordem oficial das fases do Capítulo I.

Justificativa:

- menor custo de implementação;
- menor risco de contaminar conteúdo, progresso e QA do capítulo;
- onboarding acontece no contexto real de uso da bancada;
- o tutorial pode evoluir depois para persistência mais forte sem reestruturar o conteúdo.

---

## 3. Objetivo do ciclo

Permitir que um jogador novo entenda os controles básicos da bancada antes de depender deles para resolver a primeira prova de síntese.

Ao final do ciclo, o jogador deve compreender pelo menos:

- como alternar a geometria da cadeia;
- como ajustar a quantidade de carbonos;
- como alternar ligações quando permitido;
- como validar a estrutura;
- como avançar para as próximas etapas após a validação.

---

## 4. Escopo da primeira versão

### 4.1 Tutorial automático na primeira síntese

O tutorial deve abrir automaticamente apenas na primeira entrada de um jogador em uma fase de síntese escolhida como ponto de onboarding.

Escopo recomendado:

- primeira fase com `technicalType` que use a bancada;
- tutorial em overlay leve, dividido em passos curtos;
- apenas 4 a 5 passos;
- texto curto e objetivo, sem excesso de lore.

### 4.2 Ajuda manual permanente

Depois do primeiro contato, o jogador deve poder reabrir a explicação por um botão de ajuda.

Escopo recomendado:

- botão `Como usar a bancada`;
- disponível em todas as fases com bancada;
- reusa o mesmo conteúdo do tutorial inicial, com pequenas adaptações se necessário.

### 4.3 Persistência oficial por jogador

Como o tutorial passou a fazer parte estável do onboarding oficial, o projeto deve registrar a visualização por jogador autenticado.

Escopo recomendado:

- persistência no banco;
- flag explícita de tutorial visto no jogador;
- reabertura manual sempre permitida;
- sem depender de navegador/dispositivo para decidir a abertura automática.

---

## 5. Fora do escopo desta etapa

- criar nova fase oficial no capítulo;
- criar pontuação, recompensa ou progresso para o tutorial;
- persistir progresso do tutorial no banco;
- adicionar analytics nova de produto antes da validação manual da UX;
- reestruturar o loop oficial das fases.

---

## 6. UX recomendada

### 6.1 Formato

O formato recomendado é um **tour guiado leve** sobre a bancada.

Características:

- um passo por vez;
- foco em ação concreta;
- texto curto;
- fechamento simples;
- sem overlay pesado cobrindo todos os controles ao mesmo tempo.

### 6.2 Ordem dos passos

Sequência recomendada:

1. `Geometria`
   Explicar cadeia aberta e fechada.
2. `Carbonos`
   Explicar como aumentar e reduzir a quantidade.
3. `Ligações`
   Explicar como alternar ligações disponíveis.
4. `Validação`
   Explicar que a bancada só libera avanço após validar estrutura reconhecida.
5. `Próximo passo`
   Explicar que, depois da validação, o jogador segue para carta/leitura.

### 6.3 Regras de microcopy

- usar linguagem direta;
- evitar parágrafos longos;
- explicar função prática antes do flavor;
- priorizar clareza em mobile;
- não repetir instruções já visíveis no console ritual.

---

## 7. Arquitetura recomendada

### 7.1 Componentes novos

Criar um componente dedicado, por exemplo:

- `components/phase/synthesis-tutorial.tsx`

Responsabilidades:

- exibir o tutorial em passos;
- controlar navegação entre passos;
- expor eventos de fechar, concluir e reabrir;
- permanecer desacoplado da lógica de submissão.

### 7.2 Integração principal

Integrar o tutorial em:

- `components/phase/phase-experience.tsx`

Responsabilidades da integração:

- decidir se o tutorial abre automaticamente;
- habilitar abertura manual;
- condicionar o tutorial a fases com bancada;
- não interferir no fluxo de submit.

### 7.3 Integração visual

Integrar o tutorial ao contexto da bancada em:

- `components/phase/synthesis-lab.tsx`
- ou, se necessário, `components/phase/synthesis-lab-visual.tsx`

Responsabilidades:

- posicionar o gatilho manual de ajuda;
- expor âncoras visuais ou blocos de referência;
- preservar a responsividade atual dos controles.

---

## 8. Persistência recomendada

Persistência oficial:

- banco de dados;
- campo booleano dedicado no jogador para a primeira versão oficial.

Comportamento:

- se o jogador ainda não tiver visto o tutorial, abrir automaticamente;
- ao concluir ou fechar explicitamente, registrar como visto;
- botão manual ignora esse bloqueio e sempre pode reabrir.

### Evolução futura opcional

Se surgirem outros tutoriais oficiais:

- migrar de flag única para estrutura extensível por tutorial;
- revisar impacto em seed, testes e autenticação.

---

## 9. Critérios de aceite

A primeira versão pode ser considerada pronta quando:

- o tutorial automático abrir apenas na primeira experiência de síntese;
- o jogador conseguir fechá-lo e continuar normalmente;
- existir um botão manual para reabrir a ajuda;
- o tutorial não quebrar layout mobile da bancada;
- o avanço entre etapas da fase continuar intacto;
- o texto do tutorial cobrir os controles mínimos da bancada;
- `typecheck` e `test` permanecerem verdes.

---

## 10. Ordem de implementação

Sequência recomendada:

1. criar componente visual do tutorial;
2. integrar abertura automática por `localStorage`;
3. adicionar botão manual `Como usar a bancada`;
4. revisar microcopy e ordem dos passos;
5. validar manualmente em mobile e desktop;
6. decidir depois se há necessidade de persistência no banco.

---

## 11. Backlog da implementação

### Entrega A — Estrutura do tutorial

- criar `synthesis-tutorial.tsx`;
- definir API do componente;
- definir passos e conteúdo base.

### Entrega B — Integração com a fase

- integrar no `phase-experience`;
- abrir automaticamente só na primeira síntese;
- impedir conflito com overlays já existentes.

### Entrega C — Ajuda permanente

- adicionar botão manual de ajuda;
- revisar posição do gatilho em mobile;
- garantir reabertura sem resetar a fase.

### Entrega D — Validação final

- revisar clareza do texto;
- testar abertura/fechamento;
- testar navegação entre etapas;
- validar que a bancada segue utilizável sob overlay.

---

## 12. Riscos e cuidados

Riscos principais:

- overlay competir com controles densos no mobile;
- tutorial repetir demais instruções já visíveis no header/console;
- tutorial abrir cedo demais e parecer bloqueio em vez de ajuda;
- espalhar a lógica entre muitos componentes e encarecer manutenção.

Mitigações:

- manter um passo por vez;
- usar texto curto;
- integrar no nível de `phase-experience`;
- limitar a primeira versão oficial a uma flag simples por jogador.

---

## 13. Próximo passo recomendado

Abrir uma branch dedicada para implementar o MVP do tutorial contextual da bancada.

Nome sugerido:

- `feat-synthesis-tutorial`
