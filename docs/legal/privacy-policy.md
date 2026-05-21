# Politica de Privacidade de Cronicas do Reino do Carbono

- versao oficial: `2026-05-21.1`
- vigencia: `2026-05-21`

## 1. Proposito

Esta politica descreve, em linguagem clara, como **Cronicas do Reino do Carbono** trata dados pessoais no contexto de uso educacional atualmente operado pelo responsavel do projeto.

Ela deve ser publicada e referenciada nas telas publicas de autenticacao e lida em conjunto com os termos de uso do servico.

## 2. Escopo desta politica

Esta politica cobre o tratamento de dados pessoais relacionado a:

- cadastro e login;
- manutencao de sessao autenticada;
- persistencia de progresso, tentativas, inventario e recompensas;
- analytics operacionais minimos;
- relatorios pedagogicos ligados ao uso da turma;
- atendimento a direitos do titular e suporte operacional.

## 3. Quem trata os dados

### 3.1 Operacao atual

No estado atual da operacao:

- responsavel/controlador identificado: `Nicholas Contijo Moreira`
- localizacao informada: `Vila Velha - ES - Brasil`
- contato de privacidade: `nicholascm@gmail.com`
- canal para direitos do titular: `nicholascm@gmail.com`

### 3.2 Contexto escolar

Quando o servico for utilizado em contexto escolar, a escola, instituicao ou organizacao educacional envolvida podera participar da operacao como parte contratante, ambiente institucional de aplicacao pedagogica ou arranjo equivalente, conforme a relacao concreta adotada.

Se essa distribuicao de papeis mudar de forma relevante, esta politica deve ser atualizada para refletir a operacao real.

## 4. Quais dados o servico trata

### 4.1 Dados informados no cadastro

O servico pode tratar os seguintes dados fornecidos no cadastro:

- codigo da turma;
- nome de exibicao no jogo;
- username;
- senha, armazenada apenas como hash seguro.

### 4.2 Dados gerados durante o uso

O servico tambem pode tratar:

- identificador interno do jogador;
- dados de sessao autenticada;
- progresso por fase e capitulo;
- historico de tentativas;
- inventario e recompensas;
- eventos operacionais de analytics ligados ao uso do sistema;
- versao e timestamp da ciencia da politica e do aceite dos termos de uso;
- relatorios pedagogicos derivados do uso da plataforma na turma.

### 4.3 Dados que o servico nao deve coletar

No estado atual, o sistema nao deve coletar:

- texto livre do jogador como resposta de fase;
- documentos civis;
- endereco residencial;
- telefone;
- dados bancarios;
- credenciais em texto puro.

## 5. Para que os dados sao usados

Os dados tratados pelo servico sao usados para:

- autenticar o jogador e manter sua sessao;
- vincular o jogador a uma turma valida;
- salvar progresso, tentativas, pontuacao, inventario e recompensas;
- permitir continuidade pedagogica da experiencia;
- gerar relatorios pedagogicos visiveis ao professor, escola ou responsavel educacional competente;
- detectar problemas operacionais de autenticacao, uso e seguranca;
- viabilizar suporte operacional e melhoria controlada da plataforma;
- atender solicitacoes de acesso, correcao, exportacao e exclusao quando aplicavel.

O servico nao deve usar os dados para publicidade comportamental, venda de base de dados ou compartilhamento comercial de informacoes pessoais.

## 6. Base operacional do tratamento

No estado atual, a operacao assume como base operacional minima:

- execucao da conta e do jogo para autenticar o jogador e manter sua sessao;
- registro de progresso pedagogico para continuidade da experiencia;
- interesse operacional legitimo para seguranca, estabilidade, suporte e melhoria controlada da plataforma;
- uso educacional do servico no contexto da turma e do acompanhamento pedagogico aplicavel.

Quando houver arranjo institucional especifico com escola ou organizacao contratante, a distribuicao de responsabilidades e a base operacional devem ser formalizadas conforme a operacao concreta.

## 7. Faixa etaria e mediação educacional

O servico pode ser utilizado por publico misto em contexto educacional.

Quando houver estudantes menores de idade, o uso deve ocorrer com mediacao da escola, do professor ou da organizacao responsavel pela atividade pedagogica, conforme aplicavel.

## 8. Cookies e sessao

O servico usa cookie de sessao essencial para manter o login do jogador e proteger as areas autenticadas.

Esse cookie:

- e necessario para funcionamento da area protegida;
- nao tem finalidade publicitaria;
- deve ser configurado com protecoes tecnicas compativeis com o ambiente de execucao.

## 9. Analytics operacionais e relatorios pedagogicos

O servico pode registrar eventos operacionais minimos, como:

- registro de jogador;
- autenticacao;
- submissao e avaliacao de fase;
- conclusao de fase;
- concessao de recompensa;
- eventos tecnicos relacionados a operacao da conta.

Esses registros devem obedecer aos seguintes limites:

- coletar apenas o minimo necessario;
- evitar dados redundantes no payload;
- nao registrar credenciais;
- nao registrar texto livre;
- nao ser reutilizados fora da finalidade operacional, pedagogica e evolutiva documentada.

Relatorios pedagogicos podem ser apresentados ao professor, escola ou responsavel educacional competente, na medida necessaria ao acompanhamento da turma.

## 10. Compartilhamento de dados

No estado atual, os dados podem ser processados por fornecedores de infraestrutura usados para hospedar a aplicacao e o banco.

Os provedores publicamente identificados sao:

- `Vercel`, para hospedagem da aplicacao;
- `Neon`, para banco de dados gerenciado.

O projeto nao deve compartilhar dados pessoais com terceiros para fins comerciais ou publicitarios.

Qualquer compartilhamento adicional relevante exige atualizacao desta politica.

## 11. Retencao e descarte

Os dados pessoais operacionais do servico devem seguir regra explicita de retencao.

No estado atual:

- sessoes devem ser retidas por ate `7 dias` ou ate logout;
- contas inativas devem ser revisadas para exclusao apos `12 meses sem acesso`;
- analytics operacionais devem ser retidos por ate `6 meses`;
- progresso, tentativas, inventario e recompensas devem ser retidos por ate `12 meses` ou ate pedido de exclusao;
- a exclusao oficial atualmente adotada e a exclusao total da conta e dos dados vinculados a ela, conforme o fluxo implementado no produto.

## 12. Direitos do titular

O titular dos dados, ou seu representante legitimo quando cabivel, deve poder solicitar:

- confirmacao de tratamento;
- acesso aos dados;
- correcao de dados cadastrais;
- exportacao basica dos dados do jogador em formato legivel;
- exclusao ou anonimizacao conforme a operacao aplicavel.

As solicitacoes devem seguir o runbook interno do repositorio:

- `docs/planning/data-subject-rights-runbook.md`

Para novas contas, o sistema registra versao e timestamp da ciencia desta politica e do aceite dos termos para fins de rastreabilidade operacional minima.

## 13. Seguranca minima

O servico deve adotar, no minimo:

- armazenamento de senha apenas como hash seguro;
- protecao de rotas autenticadas;
- validacao server-side de escritas;
- segregacao entre conteudo estatico e dados operacionais;
- minimizacao de dados em analytics e observabilidade interna;
- restricao de leitura na area administrativa e pedagogica ao estritamente necessario.

## 14. Atualizacoes desta politica

Esta politica deve ser revisada sempre que houver mudanca relevante em:

- cadastro, login ou sessao;
- analytics operacionais;
- relatorios pedagogicos;
- persistencia de progresso;
- papeis institucionais da operacao;
- compartilhamento com terceiros;
- retencao, exclusao, exportacao ou atendimento ao titular.

Nova versao deve ser publicada quando houver atualizacao relevante. Mudancas materiais podem exigir nova ciencia ou novo aceite, conforme a operacao considerar necessario.

## 15. Status deste documento

Status atual: politica publica oficial de uso educacional do servico, com operacao gratuita no piloto e aplicacao voltada ao contexto autorizado pelo responsavel.
