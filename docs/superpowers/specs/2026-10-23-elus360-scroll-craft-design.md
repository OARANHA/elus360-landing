# Design: ELUS 360 em capítulos verticais

## Intent

Atualizar a landing do ELUS 360 para que a rolagem conte uma história clara sobre o problema comercial que a plataforma resolve. O visitante deve reconhecer o risco de perder oportunidades, descobrir como a IA transforma experiências em memória e instruções supervisionadas, e terminar sabendo qual é o próximo passo.

## Goals

- Manter a ordem atual das seções e a identidade visual existente do ELUS 360.
- Preservar sem substituição as imagens de “PROBLEMA” e o mascote; manter o mascote conduzindo a informação para essas imagens, com o conteúdo também legível em texto real.
- Dar ritmo de capítulos verticais com cenas distintas, conectadas por um fio visual recorrente.
- Criar a interação “cliques mágicos” para revelar, em um cenário ilustrativo, como uma experiência pode virar uma melhoria supervisionada de memória ou das instruções do agente.
- Manter o caminho principal de conversão “Fale com um especialista” e apontar todos os links “Entrar” para `https://elus.wandora.com.br/login`.
- Respeitar movimento reduzido, leitura por teclado, telas pequenas, conteúdo sem JavaScript e carregamento sob demanda quando possível.
- Usar o motor Scroll-craft sem alterá-lo; implementar a interação exclusiva em código da página.

## Non-goals

- Alterar funcionalidades do CRM, do endpoint de leads ou da aplicação autenticada.
- Prometer resultados comerciais, métricas, depoimentos ou recursos não verificados.
- Substituir as imagens existentes por imagens geradas ou introduzir áudio.
- Publicar, fazer merge ou implantar a landing como parte desta mudança.

## Anti-goals

- Não sugerir retreinamento automático do modelo após cada conversa nem aplicação autônoma de melhorias permanentes. O aprendizado do ELUS se dá por memória, propostas de melhoria e instruções versionadas, com aprovação humana.
- Não afirmar que o processamento agendado do Flywheel está ativo na instalação de produção; esse estado não foi verificado.
- Não exibir sucesso falso nem enviar dados da demonstração a serviços externos.
- Não transformar a página numa sequência de cartões intercambiáveis, inserir contadores de capítulos ou ocultar conteúdo essencial em animações.

## Approaches

1. **Capítulos verticais com cenas alternadas — escolhida pelo usuário.** Preserva a ordem e os elementos de marca; cada seção funciona como capítulo independente, ligada por um motivo visual do mascote. O encerramento da seção anterior prepara a próxima cena.
2. **Superfície interativa do produto.** A página inteira se comportaria como uma demonstração do CRM. Explicaria o produto diretamente, mas substituiria a narrativa e a ordem atuais por uma interface operável, contrariando a preferência por manter o percurso.
3. **Mundo contínuo cinematográfico.** Preservaria a sensação do escritório que se materializa no hero, mas faria toda a página parecer uma única cena sem cortes. Não atende à preferência do usuário por intercalar cenas distintas.

### Trade-offs da opção escolhida

A gramática Scroll-craft será **chaptered editorial**: leitura vertical, cortes claros entre capítulos e mídia numa coluna própria. Para cumprir essa gramática, a abertura deixa de ser uma cena de mídia em tela cheia e passa a ser uma página-título tipográfica; a primeira cena ilustrada começa no capítulo “PROBLEMA”. A barra fixa superior também é trocada por navegação de capítulos discreta e contextual. Logo, cores, fontes, marca, mascote, imagens e tom visual permanecem ELUS; a composição do hero e o comportamento da navegação mudam.

## User decisions captured

- Novidade que resolva um problema real do empresário.
- Ordem atual das seções mantida.
- Progressão vertical, de cima para baixo.
- Momento memorável: descobrir como a IA aprende.
- Interação exclusiva: “cliques mágicos”.
- Estilo visual atual do ELUS 360.
- Intercalar cenas distintas com um fio visual comum, sem misturar gramáticas de página.
- Criar a experiência com os recursos visuais e a identidade ELUS 360 já existentes.

## Product truth and content

No `main` de `OARANHA/elus` (`de8f86add650d13e6237275a2bf009e91dd0d785`), [`lib/agent-engine/flywheel/live.ts`](https://github.com/OARANHA/elus/blob/de8f86add650d13e6237275a2bf009e91dd0d785/lib/agent-engine/flywheel/live.ts) lê turnos reais, memória/resumo do contato, identifica falhas e grava propostas com o gate humano pendente. [`lib/ai/apply-proposal.ts`](https://github.com/OARANHA/elus/blob/de8f86add650d13e6237275a2bf009e91dd0d785/lib/ai/apply-proposal.ts) registra uma proposta aprovada na memória da organização ou cria e publica nova versão das instruções do agente, mantendo auditoria de quem aplicou. Isso sustenta três níveis de comunicação:

1. **Memória durante o atendimento:** histórico, dados e resumos ajudam o agente a manter contexto entre interações.
2. **Identificação de aprendizados:** Flywheel analisa atendimentos reais e prepara propostas de melhoria na memória organizacional ou no playbook do agente.
3. **Evolução supervisionada:** um administrador aprova a aplicação; o resultado vira memória organizacional ou instrução versionada/publicada para o agente.

Redação comercial proposta: **“Uma IA que aprende com a experiência da sua equipe.”** Apoio: “O ELUS mantém o contexto de cada atendimento, identifica oportunidades de melhoria e transforma experiências reais em conhecimento para seus agentes, com supervisão humana.” Explicitar que não há retreinamento automático do modelo a cada conversa. Embora o código inclua o loop agendado, não foi confirmado nesta revisão se o processamento está ativo na instalação de produção.

A interação de descoberta percorre os três níveis com dados locais e fictícios, sempre marcada como demonstração. Os passos são uma explicação visual do fluxo, não alegam que um atendimento real foi analisado, que uma proposta real existe ou que a aplicação ocorreu naquela instalação. A demonstração não envia dados nem faz chamadas de rede.

O percurso preserva as seções atuais nesta ordem: início, problema, produto, como funciona, recursos, agentes, diferenciais, para quem, chamada, preços, FAQ e fechamento. Preços continuam “sob consulta”. A chamada principal continua “Fale com um especialista”. “Entrar” aponta para `/login` na aplicação ELUS.

## Constraints

- Fonte canônica da landing: `lib/landing.ts`, um documento HTML serializado como string. A edição precisa continuar reproduzível pelo fluxo de exportação existente.
- Manter intactos os arquivos de imagem já usados em “PROBLEMA” e o percurso visual já associado ao mascote; fazer as informações surgirem junto às imagens, com HTML acessível independente da animação.
- O motor Scroll-craft é copiado e referenciado sem alterações por projeto. Regras específicas ficam na página.
- O projeto também contém a composição HyperFrames da cena do mascote; alterações nessa cena precisam manter a composição editável e sincronizada com o resultado da landing.
- Amostras de CRM já são declaradas ilustrativas; manter esse rótulo junto às demonstrações.
- Fontes revisadas no `main` de `OARANHA/elus`: `lib/agent-engine/flywheel/live.ts` e `lib/ai/apply-proposal.ts`. A verificação do loop agendado ativo em produção continua pendente.
- A origem de produção observada é `https://elus360.com.br/`. O checkout local contém alterações ainda não publicadas.

## Builder calls

- Identificar capítulos pelo conteúdo, sem números decorativos.
- Usar contraste de superfícies e tipografia do sistema ELUS; não usar texto em gradiente.
- Usar o mascote como guia do percurso, sem movimento contínuo chamativo. Respeitar `prefers-reduced-motion` e manter o conteúdo disponível sem animação.
- Implementar a interação demonstrativa dos três níveis: contexto do atendimento, proposta criada pelo Flywheel e aprovação administrativa que resulta em memória organizacional ou instrução de agente versionada. A interação será uma simulação local, rotulada como ilustrativa e fictícia; ela não executa aprovação ou publicação real. Botão, teclado e toque terão o mesmo resultado.
- Mostrar uma alternativa estática legível sem JavaScript e restaurar a experiência a fluxo normal em telas compactas.
- Preservar formulários e destinos atuais; não enviar campos pessoais pela URL.

## Acceptance criteria

- As seções continuam na ordem atual; cores, fontes, logo, mascote, imagens de “PROBLEMA” e o fluxo de informação conduzido pelo mascote permanecem presentes.
- A nova gramática tem abertura, cenas intermediárias e fechamento visualmente distintos, sem aplicação do mesmo efeito em todos os capítulos.
- A demonstração dos três níveis é operável por mouse, toque e teclado, usa dados marcados como ilustrativos e fictícios, não faz chamadas de rede e não representa execução real ou status operacional de produção.
- A narrativa distingue memória de atendimento, proposta de melhoria e mudança permanente aprovada por administrador; não afirma retreinamento automático do modelo.
- Cada estado tem leitura completa com movimento reduzido e quando JavaScript está indisponível.
- Os três links “Entrar” usam `https://elus.wandora.com.br/login`.
- Verificação visual da abertura, estados intermediários e saída em desktop e telefone; checagens de movimento reduzido, teclado, formulários, erros de console, recursos, links e overflow.
- O relatório final distingue verificações concluídas de itens não verificados, inclusive o comportamento em aparelho físico e implantação.

## Approval boundary

Este documento propõe a nova estrutura antes da implementação. A mudança da abertura cinematográfica para uma página-título e a troca da navegação fixa por navegação contextual são consequências relevantes da gramática escolhida e precisam ser aprovadas junto com o restante do design.
