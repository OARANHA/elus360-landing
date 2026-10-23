import assert from "node:assert/strict";
import test from "node:test";
import html from "../lib/landing.ts";

const sectionIds = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);

function sectionMarkup(id) {
  const start = html.indexOf(`id="${id}"`);
  assert.notEqual(start, -1, `section #${id} exists`);
  const next = html.indexOf("<section", start + 1);
  return html.slice(start, next === -1 ? html.length : next);
}

test("preserves the current landing section order", () => {
  assert.deepEqual(sectionIds, [
    "inicio",
    "problema",
    "produto",
    "como-funciona",
    "recursos",
    "agentes",
    "diferenciais",
    "para-quem",
    "cta-comercial",
    "precos",
    "faq",
    "fechamento",
  ]);
});

test("uses an editorial folio and a media-free title page", () => {
  assert.match(html, /<nav\b[^>]*class="[^"]*chapter-folio/);
  const titlePage = sectionMarkup("inicio");
  assert.match(titlePage, /data-sc-chapter="inicio"/);
  assert.doesNotMatch(titlePage, /<(?:img|video|picture|canvas)\b/i);
  assert.doesNotMatch(html, /class="navbar"/);
  assert.match(html, /aria-live="polite"[^>]*id="folioCurrent"|id="folioCurrent"[^>]*aria-live="polite"/);
  const folio = html.match(/<nav\b[^>]*class="[^"]*chapter-folio[^"]*"[\s\S]*?<\/nav>/)?.[0] ?? "";
  for (const id of sectionIds) assert.ok(folio.includes(`href="#${id}"`), `folio links to #${id}`);
  assert.doesNotMatch(folio, /—/, "chapter folio uses slash punctuation");
  assert.match(titlePage, /href="https:\/\/elus\.wandora\.com\.br\/login"[^>]*>Entrar/);
});

test("keeps all problem artwork and accessible information with the mascot", () => {
  const problem = sectionMarkup("problema");
  for (const asset of [
    "/brand/followup-scene.webp",
    "/brand/followup-lead.webp",
    "/brand/followup-mascot.webp",
    "/brand/followup-actions.webp",
  ]) {
    assert.ok(problem.includes(asset), `PROBLEMA keeps ${asset}`);
  }
  assert.match(problem, /Exemplo ilustrativo/);
  assert.match(problem, /conversa|lembrete|acompanhamento/i);
});

test("every Entrar link goes directly to the ELUS login page", () => {
  const destinations = [...html.matchAll(/href="([^"]+)"[^>]*>Entrar\b/gi)].map((match) => match[1]);
  assert.ok(destinations.length >= 1);
  assert.ok(destinations.every((href) => href === "https://elus.wandora.com.br/login"));
});

test("explains the three supervised learning levels without model-retraining claims", () => {
  assert.ok(/Uma IA que aprende com a experiência da sua equipe/i.test(html), "supervised learning message is present");
  assert.ok(/Memória durante o atendimento/i.test(html), "attending memory level is explained");
  assert.ok(/Flywheel/i.test(html), "Flywheel is explained");
  assert.ok(/administrador.{0,100}aprova|aprovação.{0,100}administrador/i.test(html), "admin approval is explicit");
  assert.ok(/memória organizacional/i.test(html), "organizational memory is explicit");
  assert.ok(/nova versão das instruções do agente/i.test(html), "approved agent instructions are versioned");
  assert.ok(/não retreina automaticamente o modelo/i.test(html), "no automatic model retraining claim");
});

test("the learning demonstration is labelled, local, and has a static explanation", () => {
  const demo = sectionMarkup("evolucao-ia");
  assert.ok(/Demonstração ilustrativa/i.test(demo), "demo is labelled");
  assert.ok(/dados fictícios/i.test(demo), "demo data is identified as fictitious");
  assert.ok(/data-learning-step/.test(demo), "three-step controls are present");
  assert.ok(/sem JavaScript.{0,120}visíveis/i.test(demo), "all explanations remain visible without JavaScript");
  assert.ok(/nenhuma proposta real é criada, aprovada ou publicada/i.test(demo), "demo cannot approve real proposals");
  assert.ok(/\/scrollcraft\/scrollcraft\.js/.test(html), "Scroll-craft runtime is included");
  assert.ok(/\/scrollcraft\/scrollcraft\.css/.test(html), "Scroll-craft stylesheet is included");
});

test("keeps the lead form wired in the commercial chapter and honors the scroll sequence", () => {
  const commercial = sectionMarkup("cta-comercial");
  assert.ok(commercial.includes('id="leadForm"'), "lead form remains in the commercial chapter");
  assert.ok(commercial.includes('id="contato"'), "contact anchor remains stable");
  assert.ok(html.includes("fetch('/api/leads'"), "lead submission endpoint remains wired");
  assert.ok(html.includes("scroll-padding-top:24px"), "in-flow navigation does not leave a fixed-header gap");
  assert.ok(html.includes("@media(prefers-reduced-motion:reduce)"), "reduced motion is respected");
  assert.ok(html.includes("html:not(.js) .reveal{opacity:1!important"), "legacy reveals stay visible without JavaScript");
  assert.doesNotMatch(html, /data-sc-act="(?:pin|scrub)"/);
});
