# ELUS 360 Hero, Menu e Recursos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Manter a hero exatamente como está, restaurar o menu clássico, estender o movimento ao longo da página e remodelar Recursos.

**Architecture:** `lib/landing.ts` continua como fonte HTML/CSS/JS da página. Atualizar o contrato de HTML para fixar a hero atual, remoção dos conteúdos, navegação antiga, progresso acessível da rolagem e nova composição de Recursos; manter o exportador standalone e os recursos atuais.

**Tech Stack:** HTML serializado em TypeScript, CSS responsivo, JavaScript do navegador, Node `node:test`, pnpm/Vinext.

**Spec:** `docs/superpowers/specs/2026-10-23-elus360-hero-nav-recursos-design.md`

## Global Constraints

- O HTML e estilos específicos da seção `#inicio` permanecem iguais a `origin/main`.
- Manter todas as seções, artes, narrativa de IA supervisionada, formulário e destinos atuais.
- Os seis textos e CTAs listados no spec permanecem ausentes.
- Honrar movimento reduzido, leitura por teclado, telas pequenas e conteúdo sem JavaScript.
- Não acrescentar promessas comerciais ou capacidades de produto não verificadas.

## Review Focus

- A altura fixa da navegação não cobre alvos de âncora — cobrir links do menu e scroll-padding no teste do contrato e navegador.
- Menu móvel não fica preso aberto após selecionar um link — verificar estado e fechamento no teste visual/interativo.
- Indicador da rolagem respeita reduced motion sem ocultar conteúdo — verificar CSS e viewport reduced-motion.
- Três grupos de Recursos mantêm toda a informação e empilham sem overflow — testar contrato e viewport de 390px.
- O diff de `#inicio` permanece vazio — comparar o trecho do hero entre `origin/main` e o resultado final.

---

### Task 1: Fixar os requisitos no contrato

**Files:**
- Modify: `test/landing-contract.test.mjs`
- Read: `lib/landing.ts`

- [ ] Adicionar testes falhando para hero idêntica ao baseline, menu clássico e ausência dos conteúdos explicitamente removidos em toda a página.
- [ ] Adicionar teste para três grupos novos de Recursos e ausência da grade antiga.
- [ ] Adicionar teste para progresso global, reduced motion, âncoras e fallback sem JavaScript.
- [ ] Rodar `node --test test/landing-contract.test.mjs` e verificar falhas por requisito ainda não implementado.

### Task 2: Restaurar menu e movimento ao longo da página

**Files:**
- Modify: `lib/landing.ts`
- Test: `test/landing-contract.test.mjs`

- [ ] Reintroduzir a navegação clássica e variante móvel, preservando os destinos atuais e adicionando fechamento do menu após seleção.
- [ ] Manter sem alteração o trecho de `#inicio` e suas regras específicas.
- [ ] Implementar indicador de progresso de página e revelações discretas nas seções até o fechamento, sem pin/scrub.
- [ ] Respeitar `prefers-reduced-motion`, teclado e conteúdo visível sem JavaScript.
- [ ] Rodar os testes da Task 1 e exportar o HTML standalone.

### Task 3: Remodelar Recursos como fluxo conectado

**Files:**
- Modify: `lib/landing.ts`
- Test: `test/landing-contract.test.mjs`

- [ ] Substituir a grade de oito cartões por grupos Organizar, Atender e Evoluir conectados visualmente.
- [ ] Distribuir os oito recursos existentes nos grupos sem introduzir afirmações novas.
- [ ] Criar empilhamento responsivo e preservar ordem de leitura sem JavaScript.
- [ ] Rodar todos os testes de contrato e exportação standalone.

### Task 4: Verificar e revisar visualmente

**Files:**
- Read: `lib/landing.ts`, `public/`, saída standalone
- Capture: estados de navegador desktop, 390px e movimento reduzido

- [ ] Rodar `node --test test/*.test.mjs tests/*.test.mjs`, lint focado e `pnpm build`.
- [ ] Conferir a igualdade da seção `#inicio` com `origin/main` e a ausência de overflow horizontal.
- [ ] Conferir menu, progresso até o rodapé, estados sem JS/reduced-motion, formulário e destinos de login.
- [ ] Corrigir defeitos materiais em um passe limitado e repetir as verificações impactadas.
- [ ] Revisar diff final antes de enviar à branch e integrar conforme autorização existente.

---

**Execution method:** Native execution in the authorized worktree.
