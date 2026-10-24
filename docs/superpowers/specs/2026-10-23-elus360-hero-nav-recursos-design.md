# ELUS 360 — hero preservada, navegação e Recursos

## Intenção

Atualizar a navegação e o ritmo visual da landing para dar movimento perceptível durante toda a leitura, mantendo a abertura atual aprovada. A seção Recursos deve explicar o sistema como uma jornada conectada, em vez de uma grade de cartões iguais.

## Objetivos

- Preservar sem alterações o HTML e o visual da seção atual `#inicio`.
- Restaurar o menu clássico do ELUS 360 com navegação fixa, CTA comercial, link de entrada e menu móvel acessível.
- Criar movimento de rolagem que acompanha toda a página, além de entradas visuais graduais nas seções.
- Substituir a grade de oito cartões de Recursos por três etapas conectadas: organizar, atender e evoluir.
- Manter a ordem das seções, as cores, fontes, marcas e imagens atuais.
- Manter ausentes da página: “Lead sem retorno”, “WhatsApp disperso”, “Follow-up esquecido”, a frase combinada de equipe/conversas/próximos passos, “Seu melhor e-mail” e “Quero conhecer o ELUS 360”.
- Preservar conteúdo factual de recursos, formulário comercial, destinos de login e a narrativa de IA supervisionada.

## Fora de escopo

- Não remodelar a hero, trocar sua copy, imagem, tipografia, ações ou composição.
- Não substituir artes existentes nem mexer na seção PROBLEMA aprovada.
- Não afirmar retreinamento automático, resultados garantidos ou capacidades não confirmadas.
- Não alterar o endpoint de leads, autenticação ou funcionalidades do CRM.

## Abordagens

1. **Hero intacta + menu clássico + jornada de recursos conectada — escolhida.** Restaura a navegação conhecida e organiza capacidades em três momentos visuais relacionados, mantendo o conteúdo no fluxo vertical. Movimento acionado pela rolagem percorre a página sem prender capítulos.
2. **Substituir também a abertura pelo layout antigo do print.** Reintroduz a hero anterior, mas conflita com a instrução explícita de manter a hero atual.
3. **Conservar a grade de cartões e apenas alterar cores/animações.** É uma mudança menor, mas não atende ao pedido de remodelar Recursos por completo.

## Decisões e limites

- O menu fixo terá Produto, Como funciona, Agentes de IA, Preços e FAQ, além de Entrar e Solicitar demonstração. O comportamento móvel mantém `aria-expanded`, foco visível e acesso aos mesmos destinos.
- A hero atual permanece exatamente igual em marcação e estilos próprios; navegação e indicador global de progresso são elementos externos a ela.
- O progresso da página avança continuamente da abertura até o fim. Revelações de conteúdo acontecem por viewport com movimento discreto; `prefers-reduced-motion` elimina deslocamentos/animações e o conteúdo permanece visível sem JavaScript.
- Recursos será dividido em Organizar (CRM, WhatsApp e radar), Atender (agentes, base de conhecimento e transferência) e Evoluir (automações e registros/auditoria), em uma composição responsiva conectada por um trilho visual.
- A apresentação conserva os qualificadores de configuração/contrato e não cria métricas nem afirma que recursos ilustrativos estão ativos para todos os clientes.
- A página mantém a sequência, os destinos de login e todas as imagens atuais.

## Critérios de aceite

- O trecho de `#inicio` é byte a byte equivalente ao `origin/main`.
- O menu clássico substitui o fólio contextual e navega pelos alvos corretos; o menu móvel abre, fecha e atualiza `aria-expanded`.
- A página tem progresso visual da rolagem até o rodapé e movimento de entrada em seções intermediárias e finais; conteúdo estático é legível sem JavaScript e com movimento reduzido.
- Recursos não contém a grade anterior e apresenta os três grupos no desktop e em telas estreitas, sem overflow horizontal.
- Os textos explicitamente removidos seguem ausentes; PROBLEMA, formulário, `/api/leads`, links `/login` e conteúdo supervisionado de IA permanecem.
- Testes de contrato, build, lint focado e revisão visual em desktop/mobile/movimento reduzido são executados e reportados antes de integrar/publicar.
