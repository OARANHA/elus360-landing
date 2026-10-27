# Hero produto em foco — Implementation Plan

> **For agentic workers:** execute este plano diretamente nesta sessão. Trabalhe por tarefa e faça uma revisão final do branch.

**Goal:** substituir a composição visual da hero por uma apresentação de produto mais clara, mantendo a conversão no formulário comercial existente.

**Architecture:** a landing é um literal HTML serializado em `lib/landing.ts`. O Motion já está compilado em `public/brand/market-sections-motion.js` a partir de `scripts/market-sections-motion.mjs`; estender esse par evita nova dependência. A demonstração permanece estática e acessível, com movimento opcional somente na entrada do painel.

**Tech Stack:** HTML/CSS no literal da landing, JavaScript vanilla, Motion `motion/mini`, Vitest/Node test harness atual, Vinext.

**Spec:** [Hero ELUS 360 — Produto em foco](../specs/2026-10-27-hero-produto-em-foco.md)

## Global Constraints
- Preservar o conteúdo aprovado e a identidade existente: azul-noturno, azul, ciano e Plus Jakarta Sans.
- Não adicionar métricas, depoimentos, logotipos de clientes nem alegações de produto sem fonte.
- Consolidar a captura no formulário existente em `#contato`; preservar seu endpoint e estados.
- Todas as informações da hero devem continuar legíveis com movimento reduzido.

## Review Focus
- CTA ainda alcança o formulário comercial após remover o duplicado da hero.
- Prévia continua identificada como ilustrativa e não sugere operação de backend.
- Layout em desktop e largura móvel preserva leitura da mensagem e da interface.
- Mudança de preferência de movimento não deixa elementos ocultos.
- Controle de movimento existente não mantém referências quebradas após remover o fundo antigo.

---

### Task 1: Fixar contrato da hero

**Files:**
- Modify: `tests/standalone.test.mjs`

- [ ] Ajustar teste de export para exigir uma única formatação de formulário, CTA `#contato`, prévia ilustrativa, copy aprovada e estilos responsivos/reduced motion.
- [ ] Confirmar que o contrato falha contra a composição atual da hero.

### Task 2: Substituir composição da hero

**Files:**
- Modify: `lib/landing.ts`
- Test: `tests/standalone.test.mjs`

- [ ] Remover cenário de escritório, controle de pausa e formulário duplicado apenas do capítulo `#inicio`.
- [ ] Adicionar painel ilustrativo de interface com os rótulos aprovados e CTA único para `#contato`.
- [ ] Atualizar os estilos da hero para desktop, largura estreita, foco visível e movimento reduzido.
- [ ] Mover o alvo `#contato` para o formulário já existente em `#cta-comercial`.

### Task 3: Entrada Motion da prévia

**Files:**
- Modify: `scripts/market-sections-motion.mjs`
- Modify: `public/brand/market-sections-motion.js`
- Test: `tests/standalone.test.mjs`

- [ ] Adicionar observação de entrada única da prévia e animação leve de opacidade/posição com Motion.
- [ ] Ignorar a animação quando `prefers-reduced-motion: reduce` estiver ativo.
- [ ] Atualizar bundle de produção e validar sintaxe/contrato do script.

### Task 4: Atualizar fontes de design e documentação

**Files:**
- Modify: `README.md`
- Modify: `DESIGN.md`
- Modify: `scrollcraft/FINGERPRINTS.md`

- [ ] Substituir referências ao escritório e formulário na hero por produto em foco e formulário único no CTA comercial.

### Task 5: Verificação e integração

**Files:** branch completo

- [ ] Rodar export standalone, testes existentes, lint, TypeScript e build.
- [ ] Revisar o diff para confirmar que outras seções e a configuração de deploy não mudaram.
- [ ] Criar PR, conferir CI e integrar após os checks.
