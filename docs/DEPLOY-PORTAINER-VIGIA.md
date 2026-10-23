# ELUS 360 — implantação na VPS Vigia via Portainer

## Decisão de hospedagem

- Servidor: Vigia (ELUS), hostname `vmi3617290`.
- Stack **nova**: `elus360`. Não confundir com a stack existente `elus`.
- Site: `https://elus360.com.br`; acesso à aplicação: `https://elus.wandora.com.br/`.
- Repositório: `https://github.com/OARANHA/elus360-landing.git`.
- Compose: `deploy/portainer-stack.yml`, branch `main`.
- A VPS e o Portainer **ainda não foram modificados** ao adicionar estes arquivos.

## Como funciona

1. GitHub Actions `.github/workflows/container.yml`: testa o export HTML, teste do servidor e `docker build` em PR. Depois de merge em `main`, publica `ghcr.io/oaranha/elus360-landing:main` e uma tag de commit.
2. O Portainer na **Vigia** deve apontar uma stack Git para este repositório e Compose. Re-pull/pull_policy sempre ativo. Registrar no GitHub o segredo `ELUS360_PORTAINER_WEBHOOK_URL` fornecido por essa Stack no Portainer para solicitar redeploy **após** o push da imagem nova.
3. `Dockerfile` exporta `lib/landing.ts` diretamente para HTML estático; container Node.js sem dependências externas executa `scripts/standalone-server.mjs`, sem D1 nem autenticação ChatGPT.
4. Apenas a landing pública, assets `/brand/`, a política `/privacidade`, healthcheck `/healthz` e o endpoint do formulário `POST /api/leads` são servidos.
5. Os leads entram no CRM ELUS pelo webhook existente, com `x-deskcomm-signature` HMAC SHA-256 sobre o JSON encaminhado.

## Portainer: pré-requisitos e primeiro deploy

**Gate operacional obrigatório:** confirmar se o Docker da VPS Vigia possui Portainer próprio ou conectar a Vigia como ambiente ao Portainer existente da Wandora. Na inspeção de 23/10/2026, o MCP do Portainer só expunha endpoint `local` da Wandora. Não criar a Stack nesse endpoint.

No Portainer com endpoint **Vigia** comprovado:

1. Garantir que a imagem GHCR exista e que o Portainer possa baixá-la (tornar o pacote público ou configurar credencial do registry).
2. Stacks → Add stack → Git Repository:
   - **Name:** `elus360`
   - **Repository URL:** `https://github.com/OARANHA/elus360-landing.git`
   - **Repository reference:** `refs/heads/main`
   - **Compose path:** `deploy/portainer-stack.yml`
   - **GitOps updates:** habilitar
3. Adicionar variáveis no Portainer (nunca no Git):
   - `ELUS_LEADS_WEBHOOK_URL`: URL HTTPS `https://elus.wandora.com.br/api/v1/webhooks/in/<token>`, obtida ao criar uma fonte de captura ativa **da organização comercial correta** no ELUS.
   - `ELUS_LEADS_WEBHOOK_SECRET`: mesmo segredo HMAC configurado nessa fonte no ELUS (obrigatório: falta de segredo ou URL deixa o formulário indisponível em vez de fingir sucesso).
   - `ELUS_WHATSAPP_NUMBER`: número comercial oficial com DDI, apenas dígitos, por exemplo o formato `55DDDNUMERO`. **Não inventar número.** Sem ele, o link de atendimento fica oculto.
4. Fazer primeiro deploy. A aplicação escuta porta `3000` no container, publicada **apenas no loopback da Vigia**, `127.0.0.1:18080`. Conferir `/healthz`; conectar o reverse proxy existente a esse destino depois de inspecionar a topologia da Vigia (redes Docker, Traefik e portas). NÃO trocar DNS antes de validar HTTP, HTTPS, leads e chat.
5. Obter o webhook de atualização da Stack Git no Portainer. Configurá-lo como segredo `ELUS360_PORTAINER_WEBHOOK_URL` do repositório GitHub. Novo merge em `main` → testes/build GHCR → notificação Portainer → imagem atualizada.

## Integração ELUS: comportamentos e limites

- O formulário atual da landing permanece com os mesmos campos. O proxy valida formato, campos e aceite. `website` é honeypot.
- Não há segundo banco, tabela ou área `/gestao`. Dados são gravados no ELUS, usando a fonte de captação definida pelo operador; as regras de funil e IA são configuradas **no ELUS**, não na landing.
- O envio do formulário é servidor→servidor e inclui assinatura `x-deskcomm-signature` calculada sobre o corpo bruto (contrato em `OARANHA/elus/lib/webhooks/inbound.ts`). O segredo nunca é enviado ao navegador.
- O botão de chat é um **acesso ao WhatsApp comercial do ELUS**: abre uma conversa no WhatsApp com texto de abordagem. Isso NÃO equivale a um webchat bidirecional embutido, que ainda não foi identificado na API pública do ELUS.
- A rota do servidor é restrita a `elus.wandora.com.br`; não redirecionar para endpoints arbitrários a partir de variáveis.
- A proteção da fonte no ELUS, a disponibilidade do WhatsApp, permissões e o recebimento real no funil precisam de teste ponta a ponta após configurar as variáveis.

## Pendências bloqueadoras de produção

- Verificar e conectar **endpoint Docker Vigia** no Portainer correto; os alvos MCP Docker da Vigia não fornecem inventário completo hoje.
- Merge da PR e publicação da imagem GHCR; configurar acesso ao pacote.
- Definir a fonte ativa de webhook, seu segredo e o número comercial correto, sem segredos no repo.
- Ligar reverse proxy, SSL e DNS do domínio elus360.com.br.
- Testar um envio consentido, confirmar lead no ELUS e abrir a conversa WhatsApp efetivamente atendida.
