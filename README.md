# ELUS360 — site comercial

Landing page responsiva para apresentar o ELUS360 e captar novos clientes.

- Site publicado: https://elus360-comercial.brainy-calf-7594.chatgpt.site
- Domínio desejado: https://elus360.com.br (a conexão de DNS/SSL precisa ser confirmada).
- Acesso à aplicação: https://elus.wandora.com.br/

## Conteúdo

- Hero em largura total com escritório que passa de desenho em traço para imagem real, vídeo adaptado para celular, pausa e preferência por movimento reduzido.
- Identidade visual, logos oficiais, mascote e formulário comercial.
- Captura de leads via `POST /api/leads`, persistida em Cloudflare D1.
- Área `/gestao`, protegida por autenticação ChatGPT e autorização por `SITE_OWNER_EMAIL`.
- Política de privacidade em `/privacidade`.
- Projetos editáveis HyperFrames em `motion-office/` e `motion-hero/`.

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
- `DESIGN.md` e `.impeccable/design.json`: decisões visuais.
- `motion-office/README.md`: edição e renderização da hero atual.
- `docs/STARTER.md`: documentação técnica original do starter.

Exportado da versão publicada do Sites, commit de origem `fd2328bee38f7fb7c810616879ca69b4b9d58d8c`.
