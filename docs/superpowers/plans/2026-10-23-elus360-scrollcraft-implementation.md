# ELUS 360 Scroll-craft Implementation Plan

> **For agentic workers:** Implement natively in this checkout, task by task. Keep the existing branch and do not publish or deploy.

**Goal:** Recompose the ELUS 360 landing as vertical editorial chapters and demonstrate the supervised learning cycle truthfully.

**Architecture:** Keep `lib/landing.ts` as the route's HTML source and preserve the current Next/Vinext route, lead form, section order, product art, and mascot-led PROBLEMA sequence. Copy the unmodified Scroll-craft runtime into public assets, then author page-specific chapter navigation, semantic scroll markers, scene styles, and the local three-step learning demonstration in the landing HTML.

**Tech Stack:** TypeScript HTML-string source, CSS, browser JavaScript, Scroll-craft engine, existing Vite/Vinext build, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-23-elus360-scroll-craft-design.md`

## Global Constraints

- Keep the existing section order, ELUS palette/type/logo/mascot, and the PROBLEMA images with mascot-led information.
- Use the `chaptered editorial` grammar: typographic title page without hero media; no fixed bar; contextual chapter folio; hard changes of ground; media in its own column.
- Preserve all existing lead form behavior and set every “Entrar” link to `https://elus.wandora.com.br/login`.
- Demonstrate service context, Flywheel proposals, and administrator-approved durable memory or versioned agent instructions using local fictional data only.
- Do not claim automatic model retraining, real proposal execution, or that scheduled Flywheel processing is active in production.
- Keep Scroll-craft engine files unchanged; honor reduced motion, keyboard and touch use, and responsive compositions.
- Do not publish, merge, or deploy.

## Review Focus

- The mobile folio must remain reachable and must not cover content or the lead CTA.
- Reduced-motion and JavaScript-disabled visitors must still receive the full learning explanation and site content.
- Clicking through the learning demonstration must never perform network calls or imply an actual proposal was approved/published.
- Chapter transitions must remain visually distinct without applying one repeated reveal to all sections.
- Replacing the hero must not remove the first-screen “Entrar” path or change its `/login` destination.

---

### Task 1: Lock the page contract with failing tests

**Files:**
- Create: `test/landing-contract.test.mjs`
- Read: `lib/landing.ts`

**Interfaces:**
- Consumes: default HTML string exported by `lib/landing.ts`.
- Produces: executable Node tests for section order, editorial folio, media-free title page, login targets, PROBLEMA art/text, and supervised learning claims/demo.

- [ ] Write `node:test` assertions for the section order and required semantic/content invariants.
- [ ] Run `node --test test/landing-contract.test.mjs`; confirm failures identify the absent chapter structure and learning narrative.
- [ ] Keep test predicates tied to rendered HTML behavior and user-visible copy, not CSS implementation details.

### Task 2: Install the unmodified runtime and implement editorial chapters

**Files:**
- Create: `public/scrollcraft/scrollcraft.js`
- Create: `public/scrollcraft/scrollcraft.css`
- Modify: `lib/landing.ts`
- Test: `test/landing-contract.test.mjs`

**Interfaces:**
- Consumes: Scroll-craft engine from `.agents/skills/scroll-craft/engine/`.
- Produces: title page, contextual chapter folio, varied chapter treatments, and engine-driven scroll markers while retaining site behavior.

- [ ] Copy engine files without edits and reference them from the page.
- [ ] Replace the fixed navbar/full-media hero with an ELUS typographic title page and contextual chapter folio.
- [ ] Add chapter markers and style selected sections as separate editorial scenes; retain the PROBLEMA mascot/image sequence and all existing section anchors.
- [ ] Keep an “Entrar” link on the title page and point every login link to `/login`.
- [ ] Run the landing contract tests and fix regressions in the test's owning task.

### Task 3: Add the supervised learning signature interaction

**Files:**
- Modify: `lib/landing.ts`
- Test: `test/landing-contract.test.mjs`

**Interfaces:**
- Consumes: editorial chapter shell from Task 2.
- Produces: a local, keyboard/touch-accessible three-step demonstration with an explanatory static fallback.

- [ ] Add failing assertions for the three learning levels, illustrative-data label, manual approval, and no network effect.
- [ ] Run the contract tests and confirm the new learning assertions fail.
- [ ] Implement a local state progression: atendimento com contexto → proposta do Flywheel → aprovação ilustrativa que cria memória organizacional ou versão de instruções.
- [ ] Keep the complete explanation visible without JavaScript and under reduced motion; no network request or real product action.
- [ ] Run the contract tests and confirm all assertions pass.

### Task 4: Verify build, behavior, and visual states

**Files:**
- Read: final `lib/landing.ts` and copied runtime assets.
- Capture: desktop and phone screenshots/scroll states under `scrollcraft/builds/elus360/`.

**Interfaces:**
- Consumes: complete implementation from Tasks 2–3.
- Produces: build/test results and reviewed captures for title, PROBLEMA, learning peak, lower-page navigation, and closing CTA.

- [ ] Run `node --test test/landing-contract.test.mjs` and `npm run build`.
- [ ] Start the local preview and capture desktop, 390px phone, and reduced-motion views, including intermediate scroll states.
- [ ] Check keyboard order, chapter tracking, learning demo state, `/login` destinations, form behavior, console/network errors, and horizontal overflow.
- [ ] Inspect screenshots and correct all material defects in one bounded pass; capture one final set.
- [ ] Record what was verified and unverified; do not claim physical-device or production verification.

## Self-review

- Spec coverage: page structure and tradeoffs (Task 2); learning truth and local demonstration (Task 3); preserved art, order, destinations, accessibility, and visual proof (Tasks 1–4).
- Test ownership: static content and semantic behavior are in `landing-contract.test.mjs`; viewport-specific behavior is checked against final browser captures and keyboard interaction.
- Dependencies are linear: chapter shell precedes its signature interaction; verification consumes both.
- Review focus is tied to mobile, reduced motion/JS absence, local-only behavior, varied scene treatment, and login visibility.
