---
name: ELUS 360
description: Sistema visual extraído da landing comercial implementada.
colors:
  primary: "#2563EB"
  primary-dark: "#1D4ED8"
  primary-soft: "#EFF6FF"
  primary-border: "#DBEAFE"
  hero-night: "#07152e"
  hero-cyan: "#83cdff"
  hero-copy: "#e1ebfa"
  hero-action: "#2967ee"
  bg: "#F0F4FF"
  bg-soft: "#F8FAFF"
  white: "#FFFFFF"
  ink: "#0F172A"
  ink-2: "#475569"
  ink-3: "#64748B"
  muted: "#94A3B8"
  border: "#E2E8F0"
  border-soft: "#EDF1F8"
  violet: "#7C3AED"
  violet-soft: "#EDE9FE"
  green: "#10B981"
  green-soft: "#DCFCE7"
  green-ink: "#166534"
  amber: "#F59E0B"
  amber-soft: "#FFEDD5"
  amber-ink: "#92400E"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3.2rem, 5.1vw, 5.9rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.4vw + .8rem, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.14
    letterSpacing: "-.026em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: ".01em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "16px"
  pill: "999px"
spacing:
  field-gap: "13px"
  container-gutter: "clamp(20px, 4.5vw, 96px)"
  mobile-gutter: "20px"
  section: "96px"
  section-mobile: "72px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-ghost:
    backgroundColor: "rgba(255,255,255,.75)"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  hero-button-primary:
    backgroundColor: "{colors.hero-action}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  hero-form-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "34px 30px"
    width: "100%"
  form-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "32px 28px 30px"
    width: "min(400px, 100%)"
  field:
    backgroundColor: "#FBFCFE"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 14px 0 42px"
  feature-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "26px 22px"
  status-chip:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
---

# Design System: ELUS 360

## Overview

Este documento registra a implementação em `lib/landing.ts`, incluindo a cascata final de refinamentos comerciais. É uma extração do sistema existente, não uma aprovação de uma nova direção estética ou de uma metáfora criativa.

A identidade usa o logo oficial branco ELUS by Wandora: versão horizontal na navegação e vertical no rodapé. A navegação conserva o azul meia-noite; o hero usa um filme de escritório em tela inteira, escurecido por gradiente azul da esquerda para a direita, com título branco e destaque ciano. O formulário permanece branco. As seções inferiores conservam suas superfícies claras, detalhes violetas e cores de estado. O mascote de referência foi recolorido com ImageGen em azul, ciano, violeta e magenta, com transparência alfa nativa.

**Key Characteristics:**

- Hero e navegação azul meia-noite com marca oficial branca e destaque ciano.
- Escritório desenhado em linhas que se transforma em escritório realista, com poster e controle de movimento.
- Mascote pequeno e estático como assinatura no primeiro plano.
- Títulos compactos, botões em cápsula e cartões suavemente arredondados.
- Exemplos de interface com mais densidade que o conteúdo comercial.

## Colors

### Primary

O azul primário identifica ações, destaques do título e elementos de orientação. Sua variante escura marca hover; os tons claros acolhem ícones, estados e bordas. O gradiente vigente em destaques gerais vai do azul primário ao azul profundo (`linear-gradient(135deg,#2563eb,#274bc1)`). O título do hero usa branco com destaque ciano; seu CTA usa a variante hero-action. O azul primário global continua nas seções inferiores.

### Secondary

Violeta permanece nos exemplos, ícones e painéis de IA. Verde e âmbar representam estados e categorias do produto; devem conservar rótulos de texto junto à cor.

### Neutral

Branco sustenta os cartões. Azul meia-noite organiza hero e navegação; azul-gelo permanece nas seções inferiores; tinta escura serve a títulos e painéis escuros, com dois níveis de cinza azulado para texto auxiliar. Bordas claras separam superfícies.

## Typography

**Display Font / Body Font:** Plus Jakarta Sans, com fallback de sistema. A mesma família liga conteúdo e interface. Títulos usam peso alto e espaçamento de letras negativo; corpo e controles mantêm leitura simples.

A hierarquia normativa está no frontmatter. O título do hero tem largura máxima de 15 caracteres. Em 1100px usa clamp(3rem,5.4vw,4.2rem); em 800px, clamp(3rem,7.4vw,4.7rem); em 480px, clamp(2.45rem,10.6vw,3.2rem), máximo de 14 caracteres e entrelinha 1.08. Em telas a partir de 1800px usa 5.9rem. O subtítulo usa clamp(15px,1.12vw,19px), entrelinha 1.75 e máximo de 54 caracteres, reduzindo a 14px em 480px. Títulos de seção usam a escala headline; cartões variam de 15.5px a 17.5px e pesos 700–800. Campos usam 14.5px; consentimento usa 11px e entrelinha 1.6.

## Layout

O contêiner global é fluido: largura de 100%, sem max-width e gutters de clamp(20px,4.5vw,96px), fixados em 20px até 480px. Essa alteração vale também para as seções inferiores, que preservam suas cores e componentes claros.

O hero ocupa no mínimo 100svh no desktop, com padding de 132px 0 58px. A grade tem altura mínima de calc(100svh - 190px), colunas minmax(0,1fr) / minmax(340px,420px) e gap de clamp(40px,8vw,180px). Em 1100px, o formulário usa coluna de 320–370px e gap de 35px. Em 800px, a grade empilha com gap de 28px, sem altura mínima; texto e formulário têm máximo de 640px. Em 480px, o hero usa padding de 112px 0 64px. Em 1800px, a coluna do formulário tem 450px.

O filme cobre todo o hero com object-fit:cover; seu enquadramento passa de center para 58% center em 800px. O mascote fica no primeiro plano na assinatura, com largura fluida de 126–196px, 130px em 1100px/800px e 108px em 480px. O formulário ocupa sua coluna inteira; padding de 34px 30px, 28px 24px em 1100px, 28px 22px em 480px e 40px 34px em 1800px.

Em 1080px, recursos passam de quatro para duas colunas; produto e agentes ficam em uma coluna. Em 960px, navegação vira menu móvel, problemas ficam em uma coluna, fluxo fica vertical e grades de diferenciais/públicos passam a duas colunas. Em 640px, essas grades, recursos e rodapé ficam em uma coluna; sidebar ilustrativa e chat flutuante desaparecem. Seções usam o ritmo do frontmatter; cabeçalhos de seção têm máximo de 720px, FAQ de 760px e timeline de 780px.

## Elevation & Depth

A profundidade combina superfícies tonais, bordas suaves e sombras. O formulário no hero usa `0 22px 60px #03102555`; a sombra de formulário anterior permanece registrada como definição base. Cartões usam a sombra pequena; mockup usa a grande. Hover de cartões eleva de 4px a 5px. Os valores compartilhados estão na extensão do sidecar.

A navegação fixa mantém o fundo meia-noite após rolagem, sem blur, com borda azul escura. O filme de fundo foi renderizado com HyperFrames a partir da composição `motion-office`: loop silencioso de 12 segundos, 1600×900, com desenho de escritório que se revela realista. O controle de pausar/retomar fica no canto inferior direito (18px da base; gutter fluido à direita). Pausa fora da viewport e quando a página fica oculta; preferência por movimento reduzido mostra o poster. Falha de reprodução também apresenta a imagem estática. O gradiente CSS independente do vídeo garante contraste para o conteúdo. A animação flutuante permanece em outras ilustrações. A regra final de movimento reduzido desliga animações, transições e rolagem suave. Elementos de reveal permanecem visíveis na implementação final.

## Shapes

Botões principais usam cápsulas. Campos e FAQ usam a curva média; cartões e formulário usam a curva grande. A chave xl foi mantida por compatibilidade, mas seu valor final coincide com lg. Indicadores circulares, ícones em quadrados arredondados e o mascote com cantos arredondados completam o vocabulário.

## Components

### Buttons

Botões primários são azuis com texto branco; ghost tem fundo branco translúcido e borda azul clara; branco aparece sobre fundos escuros. Hover sobe 2px e desloca a seta 3px. Foco visível recebe contorno; links e botões têm a regra específica de 3px azul translúcido com offset de 2px. Controles desabilitados usam opacidade .65 e cursor de espera.

### Chips

Pílulas de estado combinam texto escuro e fundo suave. Chips de exemplo devem manter a categoria legível. Eyebrow e badge promocional do hero estão ocultos pela cascata final.

### Cards / Containers

Cartões de recursos têm borda suave, sombra pequena e hover com sombra média. Formulário tem superfície branca, sem borda e sombra própria. O painel de IA usa tinta escura, textos claros e tags coloridas. O mockup recebe identificação explícita de visão ilustrativa.

### Inputs / Fields

Campos têm borda clara, ícones à esquerda e placeholder com contraste reforçado (`#52627a`). Foco troca a borda para azul, fundo para branco e aplica halo de 4px em azul translúcido. Consentimento e nota legal usam fluxo de texto em bloco na cascata final, com links sublinhados. O status de envio aparece no próprio formulário; não há estilo visual separado de erro implementado.

### Navigation

Barra fixa de 76px, logo horizontal oficial com altura automática e marcador 360, links claros de peso 600 e ciano no hover. O logo tem largura de 148px, 124px em 1100px e 134px em 640px. Menu móvel azul escuro se abre abaixo da barra e acompanha `aria-expanded`. O login continua como ação textual. O controle móvel tem área de 46px.

### Marca e filme do hero

Preservar proporção e transparência das marcas oficiais. O rodapé usa a versão vertical, com largura de 150px, reduzida a 130px em mobile. O mascote recolorido mantém alfa nativa e aparece como assinatura estática, sem substituir o filme de escritório.

A camada `.office-gradient` usa `linear-gradient(90deg,rgba(4,16,38,.97) 0%,rgba(5,22,47,.91) 28%,rgba(9,35,67,.54) 64%,rgba(12,35,58,.22) 100%)`. Até 800px passa a `linear-gradient(90deg,rgba(4,16,38,.95),rgba(5,22,47,.83) 54%,rgba(9,35,67,.61))`. Os valores vêm do bloco final “Full-width office hero” em `lib/landing.ts`.

O vídeo usa poster de 1600×900 e fonte móvel até 800px. O controle de movimento tem texto acessível, estado pressionado e foco visível. A preferência por movimento reduzido oculta vídeo e controle e apresenta o poster. A variante ghost do hero permanece transparente com borda azul escura e texto claro; o CTA principal continua azul.

### FAQ

Perguntas são botões de largura integral em cartões de curva média. Uma resposta abre por vez, com `aria-expanded`; o ícone circular gira e ganha fundo azul. A expansão usa grid com transição de .32s, desativada quando há preferência por movimento reduzido.

## Do's and Don'ts

### Do:

- **Do** preservar Plus Jakarta Sans, o azul primário, as marcas oficiais e o mascote recolorido autorizado.
- **Do** respeitar a cascata final ao reutilizar componentes e conferir as larguras móveis.
- **Do** manter rótulos, foco visível e feedback de envio junto aos controles.

### Don't:

- **Don't** propagar o fundo escuro do hero para as seções inferiores ou restaurar as regras antigas de hero azul-gelo.
- **Don't** distorcer o logo oficial nem remover o poster, a pausa ou o suporte a movimento reduzido.
- **Don't** tratar indicadores do mockup como métricas comerciais verificadas.
- **Don't** apresentar esta extração como uma nova direção estética aprovada pelo proprietário.
