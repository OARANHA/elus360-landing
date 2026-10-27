# Hero ELUS 360 — Produto em foco

## Goal
Atualizar somente a hero da landing para explicar o ELUS 360 por meio de uma prévia de produto, preservando marca, conteúdo aprovado e captação de demonstrações.

## Copy e conversão
- Headline: “Seu comercial inteiro em um só lugar.”
- Subheadline: “CRM, atendimento, automações e IA integrados. Dê contexto à sua equipe, organize cada oportunidade e acompanhe o próximo passo da venda.”
- CTA principal único: “Solicitar demonstração”, apontando ao formulário existente em `#contato` na seção CTA comercial.
- Remover o formulário duplicado atualmente dentro da hero; manter o formulário comercial existente e seu processamento.

## Composição
- Preservar navegação, logo, Plus Jakarta Sans e identidade azul-noturno, azul e ciano.
- Texto e CTA à esquerda; prévia ampla da interface ilustrativa à direita em desktop.
- Usar rótulos existentes de CRM/atendimento e uma cena curta de conversa, contexto e próxima ação, sem métricas, depoimentos, clientes ou capacidades novos.
- Identificar a prévia como “Demonstração ilustrativa”.
- Em telas estreitas, empilhar conteúdo e prévia sem comprimir texto em etiquetas pequenas.

## Movimento e acessibilidade
- Uma entrada discreta da prévia, disparada quando a hero entra na viewport, via Motion já instalado.
- Com `prefers-reduced-motion: reduce`, mostrar a prévia diretamente, sem deslocamento.
- Manter rolagem nativa, foco visível, sem dependência de JavaScript para ler a headline, subheadline ou CTA.

## Fora de escopo
- Não mudar ordem ou conteúdo das demais seções, nem configuração de publicação, formulário de backend, DNS ou deploy.
