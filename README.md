# ELUS360 — site comercial

Landing page responsiva para apresentar o ELUS360 e captar novos clientes.

- Site publicado: https://elus360-comercial.brainy-calf-7594.chatgpt.site
- Domínio desejado: https://elus360.com.br (a conexão de DNS/SSL precisa ser confirmada).
- Acesso à aplicação: https://elus.wandora.com.br/login

## Implementação atual da landing

A abertura tipográfica editorial atual é preservada sem alterações. A navegação clássica ELUS em azul-meia-noite fica sticky no topo; uma barra fina acompanha o avanço da rolagem até o fim da página. A leitura mantém a identidade azul-gelo, o destaque violeta, Plus Jakarta Sans, logos e mascotes. A direção e o briefing estão registrados em [`scrollcraft/FINGERPRINTS.md`](scrollcraft/FINGERPRINTS.md) e [`scrollcraft/builds/elus360/BRIEF.md`](scrollcraft/builds/elus360/BRIEF.md).

A sequência existente permanece: início → problema → produto → como funciona → recursos → agentes → diferenciais → para quem → CTA comercial → preços → FAQ → fechamento. O formulário ocupa o CTA comercial; o último capítulo encerra a leitura com um convite contextual. O menu clássico oferece links para Produto, Como funciona, Agentes de IA, Preços e FAQ, além de Entrar e Solicitar demonstração. Recursos apresenta CRM, canais, agentes, automações e auditoria em três etapas conectadas: organizar, atender e evoluir. Os links “Entrar” usam `/login` na aplicação ELUS.

A seção PROBLEMA reúne três cenas verticais 9:16 em um grupo compacto. Cada imagem mantém seu texto legível sobre um degradê escuro e uma arte de atendimento, mascote ou ações. Ao rolar, a etapa em foco muda em ordem; antes da narrativa, as etapas futuras ficam em início; depois, ficam concluídas. Os números selecionam uma etapa, e em telas estreitas levam até ela. O conteúdo não depende de animação, não fica oculto e a rolagem permanece livre. Movimento reduzido elimina transições e rolagem suave. As telas e cenas são identificadas como exemplos fictícios.

A descoberta sobre IA descreve três níveis: contexto durante o atendimento, propostas do Flywheel baseadas em atendimentos reais e mudanças duráveis de memória ou instruções somente após aprovação do administrador. Não afirma retreinamento automático de modelos nem processamento agendado ativo em produção. Os “cliques mágicos” apenas alternam o destaque de três etapas estáticas em uma demonstração local com dados fictícios; não criam nem aprovam propostas reais.

A leitura narrativa e as três etapas da demonstração permanecem disponíveis sem JavaScript; o botão da demonstração fica oculto nesse caso. Link para pular ao conteúdo, foco visível, índice nativo e estados acessíveis apoiam a navegação por teclado. A preferência por movimento reduzido remove deslocamentos e animações, mantendo a leitura e as ações.

Permanecem no projeto:

- Captura de leads via `POST /api/leads`, persistida em Cloudflare D1.
- Área `/gestao`, protegida por autenticação ChatGPT e autorização por `SITE_OWNER_EMAIL`.
- Política de privacidade em `/privacidade`.
- Projetos editáveis HyperFrames em `motion-office/`, `motion-followup/` e `motion-hero/`.

O build e os testes de contrato passaram para esta revisão. O navegador CUA não conseguiu acessar a prévia local (`ERR_CONNECTION_REFUSED`), então a revisão visual local ainda está pendente. O resultado precisa ser conferido em desktop, celular e movimento reduzido após publicação; os testes estáticos não substituem essa revisão.

## Executar

Requer Node.js >=22.13 e pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
pnpm build
```

O código usa React, Vinext, Cloudflare Workers, D1 e Drizzle. A landing está em `lib/landing.ts`, servida por `app/route.ts`. Os assets estão em `public/brand/`.

## Banco e autenticação

Configure o binding D1 `DB` e aplique `drizzle/0000_simple_thunderbird.sql`. Defina `SITE_OWNER_EMAIL` como segredo no ambiente de hospedagem. Não publique esse valor no repositório.

A autenticação da gestão depende do fluxo de login fornecido pelo Sites; uma hospedagem externa exige integração equivalente. O botão de login comercial aponta para a aplicação ELUS.

O formulário armazena leads no D1. Envio de e-mail e sincronização automática com o CRM ELUS não estão implementados.

## Hospedagem e documentação

`.openai/hosting.json` conserva o vínculo com o projeto Sites existente. Este repositório contém os arquivos-fonte; um push ao GitHub não configura DNS nem publica automaticamente na Cloudflare.

- `PRODUCT.md`: escopo do produto.
- `DESIGN.md` e `.impeccable/design.json`: registro anterior do sistema visual; a composição editorial atual está descrita acima e nos documentos Scroll-craft vinculados.
- `motion-office/README.md`: edição e renderização da composição de escritório preservada no projeto.
- `docs/STARTER.md`: documentação técnica original do starter.

Exportado da versão publicada do Sites, commit de origem `fd2328bee38f7fb7c810616879ca69b4b9d58d8c`.
