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

A identidade usa o logo oficial branco ELUS by Wandora: versão horizontal na navegação e vertical no rodapé. A navegação conserva o azul meia-noite; a hero combina título branco com destaque ciano e uma prévia ampla e ilustrativa do fluxo comercial. O CTA principal azul leva ao formulário existente na seção comercial. As seções inferiores conservam suas superfícies claras, detalhes violetas e cores de estado. O mascote recolorido permanece disponível nas seções que já o utilizam.

**Key Characteristics:**

- Hero e navegação azul meia-noite com marca oficial branca e destaque ciano.
- Hero com mensagem comercial à esquerda e painel ilustrativo de produto à direita, empilhados em telas estreitas.
- Uma captura comercial no CTA da página; a hero não duplica a coleta de dados.
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

A hierarquia normativa está no frontmatter. O título da hero usa `clamp(2.8rem,4.4vw,4.5rem)` em desktop e `clamp(2.45rem,11vw,3.3rem)` em telas estreitas, com largura de leitura de até 12 caracteres. O subtítulo usa escala fluida, máximo aproximado de 47 caracteres e entrelinha 1.7–1.78. O conteúdo do painel mantém rótulos legíveis e reduz densidade de navegação no celular, em vez de comprimir o texto de desktop.

## Layout

O contêiner global é fluido: largura de 100%, sem max-width e gutters de clamp(20px,4.5vw,96px), fixados em 20px até 480px. Essa alteração vale também para as seções inferiores, que preservam suas cores e componentes claros.

A hero usa padding fluido de 126–176px no topo e 72–104px na base. Em desktop, a grade divide o espaço em duas colunas com proporção aproximada de 0,78 / 1,22 e intervalo fluido de 36–76px. A partir de 960px, texto e prévia empilham; abaixo de 600px, o painel usa navegação horizontal e conteúdo vertical, sem altura fixa ou rolagem presa.

O painel de produto ocupa a coluna visual principal, com barra de marca, navegação ilustrativa e sequência conversa → contexto → próxima ação. O conteúdo é explicitamente marcado como ilustrativo/fictício e permanece visível sem JavaScript. Uma única entrada sutil é acionada quando a prévia alcança a viewport; a animação não muda o conteúdo nem bloqueia a rolagem. Movimento reduzido conclui o estado diretamente.

Em 1080px, recursos passam de quatro para duas colunas; produto e agentes ficam em uma coluna. Em 960px, navegação vira menu móvel, fluxo fica vertical e grades de diferenciais/públicos passam a duas colunas. A seção Problema mantém três imagens em até 760px; abaixo desse limite, as cenas empilham na ordem de leitura. Em 640px, essas grades, recursos e rodapé ficam em uma coluna; sidebar ilustrativa e chat flutuante desaparecem. Seções usam o ritmo do frontmatter; cabeçalhos de seção têm máximo de 720px, FAQ de 760px e timeline de 780px.

## Elevation & Depth

A profundidade combina superfícies tonais, bordas suaves e sombras. A prévia da hero usa uma sombra ampla sobre o fundo noturno; cartões de conteúdo usam a sombra pequena e mockups de seções usam a grande. Hover de cartões eleva de 4px a 5px. Os valores compartilhados estão na extensão do sidecar.

A navegação fixa mantém o fundo meia-noite após rolagem, sem blur, com borda azul escura. A hero não contém movimento contínuo; a prévia recebe uma entrada única e retorna aos estados estático/final. A seção Problema usa imagens estáticas e atualiza o foco conforme a rolagem; seus textos permanecem visíveis e movimento reduzido elimina transições e rolagem suave. As animações de outras ilustrações preservam seus controles de pausa quando aplicável.

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

Barra sticky de 76px, logo horizontal oficial com altura automática e marcador 360, links claros de peso 600 e ciano no hover. A revisão atual usa o logo com 134px e os destinos Produto, Como funciona, Agentes de IA, Preços e FAQ, além de Entrar e Solicitar demonstração. O menu móvel azul escuro se abre abaixo da barra e acompanha `aria-expanded`; o controle móvel tem área de 46px. Uma barra superior fina acompanha o progresso de rolagem e some com movimento reduzido.

### Marca e painel de produto da hero

Preservar proporção e transparência das marcas oficiais. O rodapé usa a versão vertical, com largura de 150px, reduzida a 130px em mobile. O painel da hero apresenta uma simulação editorial da interface; não reproduz um estado conectado ao backend.

A camada `.office-gradient` usa `linear-gradient(90deg,rgba(4,16,38,.97) 0%,rgba(5,22,47,.94) 25%,rgba(9,35,67,.55) 60%,rgba(12,35,58,.29) 100%)`. Até 800px passa para gradiente mais denso sobre a equipe, conforme o bloco final em `lib/landing.ts`.

O painel usa componentes HTML editáveis, sem imagem achatada da interface. O status do movimento é `início` → `transição` → `concluído`; a mudança só afeta a entrada visual e não controla a legibilidade. Em movimento reduzido, a prévia aparece diretamente no estado final. O CTA aponta ao único formulário comercial existente.

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

## Evolução visual — 23/10/2026

- **Hero:** a composição de escritório e o formulário duplicado foram substituídos por uma prévia ilustrativa do fluxo comercial e um CTA único para o formulário existente.
- **Problema/acompanhamento:** três cenas verticais com texto sobre imagem e artes ELUS existentes. A rolagem natural atualiza o foco e os estados início, ativo e concluído; a navegação numerada seleciona cada etapa. Nenhum conteúdo é ocultado; telas estreitas empilham os quadros e movimento reduzido remove transições e rolagem suave.
- **Projetos HyperFrames:** fontes correspondentes em `motion-office/` e `motion-followup/`; a landing utiliza a animação no próprio DOM para fluidez e carregamento mais leve. A renderização da nova cena pelo CLI HyperFrames e capturas visuais da página ainda não foram executadas.
