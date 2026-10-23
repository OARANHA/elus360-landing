---
name: ELUS 360
description: Identidade visual observada no protótipo da landing comercial.
colors:
  background: "#F0F4FF"
  background-soft: "#F8FAFF"
  surface: "#FFFFFF"
  ink: "#0F172A"
  secondary: "#475569"
  border: "#E2E8F0"
  primary: "#2563EB"
  primary-dark: "#1D4ED8"
  primary-soft: "#EFF6FF"
  violet: "#7C3AED"
  violet-soft: "#EDE9FE"
  success: "#10B981"
  warning: "#F59E0B"
typography:
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  pill: "999px"
spacing:
  gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
---
# Design System: ELUS 360

## Overview

**Creative North Star: "Conversas Conectadas"**

Identidade clara, tecnológica e comercial, extraída do protótipo local da landing do Z.Chat. Superfícies azul-gelo e brancas, texto escuro, ações azuis e violeta de apoio para referências a IA e automação. O mascote 3D e as marcas oficiais devem ser preservados.

**Key Characteristics:**
- Interface predominantemente clara
- Azul principal e violeta de apoio
- Tipografia Plus Jakarta Sans
- Profundidade suave
- Mascote tridimensional

A documentação descreve o protótipo fornecido anteriormente na conversa, não uma implementação já presente neste repositório. Recursos de produto e alegações comerciais continuam sujeitos à verificação.

## Colors

- **Azul-gelo** (background): base principal.
- **Branco** (surface): painéis e campos.
- **Azul operacional** (primary): CTAs e ações principais.
- **Violeta** (violet): detalhes relacionados a automação e IA.
- **Tinta escura** (ink): títulos e texto principal.
- **Cinza ardósia** (secondary): texto explicativo.
- **Verde e âmbar** (success, warning): estados semânticos.

**The Action-Blue Rule.** Azul identifica a ação principal; violeta não deve competir com todos os CTAs.

## Typography

**Display Font:** Plus Jakarta Sans, com fallback system-ui.
**Body Font:** Plus Jakarta Sans, com fallback system-ui.

O protótipo importa pesos 400, 500, 600, 700 e 800. Corpo de 16px, entrelinha 1.6; botões de 15px e peso 700. Evitar inventar uma escala de títulos não extraída dos componentes.

## Layout

Contêiner central com largura máxima de 1200px, margens automáticas e respiro lateral de 24px. Ajustar colunas e fluxos para mobile. Não cortar conteúdo por altura fixa.

## Elevation & Depth

Sombras macias de tinta escura comunicam elevação; gradiente azul-violeta aparece em detalhes expressivos.

### Shadow Vocabulary
- Pequena: 0 2px 12px rgba(15,23,42,.06).
- Média: 0 8px 30px rgba(15,23,42,.10).
- Alta: 0 24px 70px rgba(15,23,42,.16).
- Azul: 0 12px 34px rgba(37,99,235,.28).

**The Quiet Depth Rule.** Elevação indica importância, não deve virar brilho decorativo permanente.

## Shapes

Raios de 8, 12, 16 e 22px nos elementos; botões em pílula de 999px. Preservar os contornos reais do mascote.

## Components

### Buttons
Primário azul com texto branco; padding 14px por 26px, raio pílula, 15px/700. Transições breves de cor/sombra/transformação. O foco por teclado deve permanecer visível.

### Cards / Containers
Painéis claros sobre azul-gelo, com elevação discreta e raio de acordo com a função, evitando cartões iguais para todo conteúdo.

### Navigation
Acesso claro aos conteúdos comerciais e ao login já existente, com tratamento responsivo.

### Animated Hero
Protótipo CSS/SVG apresenta o fluxo conversa → IA → oportunidade; respeita prefers-reduced-motion. A composição Hyperframes ainda não é vídeo renderizado.

## Do's and Don'ts

### Do:
- **Do** preservar cores, mascote e logotipos oficiais.
- **Do** assegurar leitura e foco em desktop e mobile.
- **Do** diferenciar uma demonstração de um recurso verificado.

### Don't:
- **Don't** mudar o projeto para tema escuro sem redesign aprovado.
- **Don't** substituir imagens oficiais por ícones genéricos.
- **Don't** divulgar métricas, clientes, preços ou recursos não verificados.
- **Don't** tratar a documentação do protótipo como validação de produção.
