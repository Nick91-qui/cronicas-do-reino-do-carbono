# Politica de Privacidade do MVP

## 1. Proposito

Esta politica descreve, em linguagem clara, como o MVP de **Cronicas do Reino do Carbono** trata dados pessoais durante cadastro, autenticacao, uso do jogo e operacao interna minima.

Este documento deve ser publicado e referenciado nas telas publicas de autenticacao antes de uso ampliado com jogadores reais.

## 2. Escopo desta politica

Esta politica cobre o tratamento de dados pessoais realizado pelo MVP web hospedado para:

- cadastro e login;
- manutencao de sessao autenticada;
- persistencia de progresso e historico de jogo;
- analytics operacionais minimos;
- suporte interno de leitura operacional restrita.

## 3. Quem e o responsavel pelos dados

### 3.1 Operacao atual do MVP

Enquanto este MVP estiver sendo operado diretamente pelo mantenedor do projeto, o responsavel pela operacao deve ser identificado publicamente antes da disponibilizacao externa.

Campos obrigatorios para publicacao:

- responsavel/controlador: `[preencher antes da publicacao]`
- contato de privacidade: `[preencher antes da publicacao]`
- canal para direitos do titular: `[preencher antes da publicacao]`

### 3.2 Uso por escola ou instituicao

Se o MVP for operado em parceria com escola, curso ou instituicao:

- o papel de controlador e operador deve ser definido formalmente antes do uso;
- o canal de atendimento ao titular e o responsavel legal devem ser informados de forma explicita;
- esta politica deve ser revisada para refletir essa operacao concreta.

## 4. Quais dados o MVP trata

### 4.1 Dados informados no cadastro

O MVP pode tratar os seguintes dados fornecidos no cadastro:

- codigo da turma;
- nome de exibicao no jogo;
- username;
- senha, armazenada apenas como hash seguro.

### 4.2 Dados gerados durante o uso

O MVP tambem pode tratar:

- identificador interno do jogador;
- dados de sessao autenticada;
- progresso por fase e capitulo;
- historico de tentativas;
- inventario e recompensas;
- eventos operacionais de analytics relacionados ao uso do jogo.

### 4.3 Dados que o MVP nao deve coletar

No estado atual do MVP, o sistema nao deve coletar:

- texto livre do jogador como resposta de fase;
- documentos civis;
- endereco residencial;
- telefone;
- dados bancarios;
- credenciais em texto puro.

## 5. Para que os dados sao usados

Os dados tratados pelo MVP sao usados para:

- autenticar o jogador e manter sua sessao;
- vincular o jogador a uma turma valida;
- salvar progresso, tentativas, pontuacao, inventario e recompensas;
- permitir continuidade pedagogica da experiencia;
- detectar problemas operacionais minimos de autenticacao e uso;
- viabilizar suporte interno restrito, quando necessario.

O MVP nao deve usar os dados para publicidade comportamental, venda de base de dados ou compartilhamento comercial de informacoes pessoais.

## 6. Base operacional minima do tratamento

Para o MVP, o tratamento deve permanecer limitado ao necessario para:

- execucao da experiencia autenticada do jogo;
- registro de progresso pedagogico;
- seguranca e operacao basica da aplicacao.

Antes de uso ampliado com instituicoes de ensino ou alunos reais, a base legal e a distribuicao de responsabilidades devem ser formalizadas pela operacao responsavel.

## 7. Cookies e sessao

O MVP usa cookie de sessao essencial para manter o login do jogador e proteger areas autenticadas.

Esse cookie:

- e necessario para funcionamento da area protegida;
- nao tem finalidade publicitaria;
- deve ser configurado com protecoes tecnicas compativeis com o ambiente de execucao.

## 8. Analytics operacionais minimos

O MVP pode registrar eventos operacionais minimos, como:

- registro de jogador;
- autenticacao;
- submissao e avaliacao de fase;
- conclusao de fase;
- concessao de recompensa.

Esses eventos devem obedecer aos seguintes limites:

- coletar apenas o minimo necessario;
- evitar dados redundantes no payload;
- nao registrar credenciais;
- nao registrar texto livre;
- nao ser reutilizados fora da finalidade operacional e evolutiva documentada.

## 9. Compartilhamento de dados

No estado atual do MVP, os dados podem ser processados por fornecedores de infraestrutura usados para hospedar a aplicacao e o banco, como plataforma de deploy e banco de dados gerenciado.

O projeto nao deve compartilhar dados pessoais com terceiros para fins comerciais ou publicitarios.

Qualquer compartilhamento adicional exige atualizacao desta politica e revisao documental da finalidade.

## 10. Retencao e descarte

Os dados pessoais operacionais do MVP devem seguir regra explicita de retencao.

No estado atual da documentacao:

- sessoes expiradas devem ser removidas por rotina operacional;
- contas, historico de tentativas e analytics devem receber prazo definido de retencao antes de uso ampliado;
- quando aplicavel, a exclusao deve remover ou anonimizar os dados pessoais segundo a regra operacional adotada.

Enquanto o prazo final de retencao nao estiver definido em ambiente real, esse ponto permanece como requisito obrigatorio de implementacao antes da ampliacao de uso.

## 11. Direitos do titular

O titular dos dados, ou seu representante legitimo quando cabivel, deve poder solicitar:

- confirmacao de tratamento;
- acesso aos dados;
- correcao de dados cadastrais;
- exclusao ou anonimizacao conforme a operacao aplicavel;
- exportacao basica dos dados do jogador em formato legivel.

As solicitacoes devem seguir o runbook interno do repositorio:

- `docs/planning/data-subject-rights-runbook.md`

## 12. Seguranca minima

O MVP deve adotar, no minimo:

- armazenamento de senha apenas como hash seguro;
- protecao de rotas autenticadas;
- validacao server-side de escritas;
- segregacao entre conteudo estatico e dados operacionais;
- minimizacao de dados em analytics e observabilidade interna.

## 13. Atualizacoes desta politica

Esta politica deve ser revisada sempre que houver mudanca relevante em:

- cadastro, login ou sessao;
- analytics;
- persistencia de progresso;
- area `operator`;
- compartilhamento com terceiros;
- retencao, exclusao ou exportacao de dados.

## 14. Status deste documento

Status atual: documento base implementado no repositorio e pendente de preenchimento dos campos operacionais de contato antes da publicacao externa.
