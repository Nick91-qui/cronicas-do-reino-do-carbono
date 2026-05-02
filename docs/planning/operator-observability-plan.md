# Plano de Observabilidade Interna

## 1. Propósito

Este documento define a evolução mínima recomendada para uma superfície interna de leitura operacional protegida por `Player.role = operator`.

Ele existe para orientar uma etapa futura de observabilidade sem transformar o MVP, neste momento, em painel administrativo amplo.

---

## 2. Objetivo do ciclo

Permitir feedback operacional sobre os dados dos usuários com uma interface interna simples, somente leitura, voltada a:

- visualizar jogadores;
- enxergar vínculo com turma;
- acompanhar progresso resumido;
- identificar atividade recente;
- inspecionar inventário e estado de jogo quando necessário.

---

## 3. Princípios

- começar com leitura apenas;
- não expor mutações administrativas na primeira versão;
- reutilizar autenticação e sessão já existentes;
- proteger a área interna por role persistida no banco;
- limitar a superfície ao que ajuda suporte e validação operacional.

---

## 4. Pré-requisito já decidido

O banco passa a persistir `Player.role` com os valores:

- `player`
- `operator`

O valor padrão continua sendo `player`.

---

## 5. Escopo da primeira versão

### 5.1 Resumo geral

- total de jogadores;
- total de turmas;
- jogadores com ao menos uma fase concluída;
- jogadores com atividade recente.

### 5.2 Lista de jogadores

- nome no grimório;
- username;
- turma;
- fase mais avançada;
- pontuação total;
- última atividade.

### 5.3 Visão individual

- progresso por capítulo;
- tentativas por fase;
- inventário atual;
- recompensas registradas.

---

## 6. Fora do escopo da primeira versão

- editar turma;
- resetar progresso;
- alterar inventário;
- conceder recompensas manualmente;
- rodar migration;
- qualquer mutação destrutiva.

---

## 7. Ordem recomendada

1. adicionar guard server-side para `operator`
2. criar rota/página interna de listagem de jogadores
3. criar visão detalhada de jogador
4. revisar necessidade de filtros e paginação
5. decidir se a segunda versão incluirá ações mutáveis

---

## 8. Critério de aceite

A primeira versão pode ser considerada pronta quando:

- apenas usuários `operator` acessarem a área interna;
- a área exibir dados suficientes para feedback operacional de usuários;
- nenhuma ação de escrita administrativa estiver disponível;
- o fluxo não introduzir regressão nas rotas protegidas existentes.
