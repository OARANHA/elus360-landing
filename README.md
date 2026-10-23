# ELUS360 — site comercial

Landing page responsiva para apresentar o ELUS360 e captar novos clientes.

- Site publicado: https://elus360-comercial.brainy-calf-7594.chatgpt.site
- Domínio desejado: https://elus360.com.br (a conexão de DNS/SSL precisa ser confirmada).
- Acesso à aplicação: https://elus.wandora.com.br/login

## Implementação atual da landing

A revisão local adota capítulos editoriais, com leitura vertical de cima para baixo e abertura tipográfica sem mídia. Preserva a identidade azul-gelo, o destaque violeta, Plus Jakarta Sans, logos e mascotes. A direção e o briefing estão registrados em [`scrollcraft/FINGERPRINTS.md`](scrollcraft/FINGERPRINTS.md) e [`scrollcraft/builds/elus360/BRIEF.md`](scrollcraft/builds/elus360/BRIEF.md).

A sequência existente permanece: início → problema → produto → como funciona → recursos → agentes → diferenciais → para quem → CTA comercial → preços → FAQ → fechamento. O formulário ocupa o CTA comercial; o último capítulo encerra a leitura com um convite contextual. Um fólio de capítulo em fluxo normal substitui a barra fixa, indica o capítulo atual e oferece índice recolhível. Os links “Entrar” usam `/login` na aplicação ELUS.

Os quatro artworks de PROBLEMA foram preservados, com informações do mascote também legíveis em texto. O ritmo usa revelações selecionadas de títulos, listas escalonadas e paralaxe discreta nessa arte. A página não usa capítulos fixados, vídeo controlado pela rolagem, magnetismo ou deriva contínua de fundo.

A descoberta sobre IA descreve três níveis: contexto durante o atendimento, propostas do Flywheel baseadas em atendimentos reais e mudanças duráveis de memória ou instruções somente após aprovação do administrador. Não afirma retreinamento automático de modelos nem processamento agendado ativo em produção. Os “cliques mágicos” apenas alternam o destaque de três etapas estáticas em uma demonstração local com dados fictícios; não criam nem aprovam propostas reais.

A leitura narrativa e as três etapas da demonstração permanecem disponíveis sem JavaScript; o botão da demonstração fica oculto nesse caso. Link para pular ao conteúdo, foco visível, índice nativo e estados acessíveis apoiam a navegação por teclado. A preferência por movimento reduzido remove deslocamentos e animações, mantendo a leitura e as ações.

Permanecem no projeto:

- Captura de leads via `POST /api/leads`, persistida em Cloudflare D1.
- Área `/gestao`, protegida por autenticação ChatGPT e autorização por `SITE_OWNER_EMAIL`.
- Política de privacidade em `/privacidade`.
- Projetos editáveis HyperFrames em `motion-office/`, `motion-followup/` e `motion-hero/`.

O build e os testes de contrato passaram para esta revisão. Não há capturas de tela desta versão: o navegador local não conseguiu executar. Portanto, responsividade, acabamento visual e comportamento assistivo ainda não têm validação em navegador; os testes não substituem essa revisão. A alteração está no código local, sem publicação ou merge confirmados. Registros anteriores de hero e movimento não constituem aprovação visual deste redesign.

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
