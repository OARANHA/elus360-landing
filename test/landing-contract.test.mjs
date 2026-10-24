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

test("keeps the current title page and uses the classic navigation", () => {
  const titlePage = sectionMarkup("inicio");
  assert.match(titlePage, /data-sc-chapter="inicio"/);
  assert.doesNotMatch(titlePage, /<(?:img|video|picture|canvas)\b/i);
  assert.match(titlePage, /A experiência do seu time vira/);
  assert.ok(/<header\b[^>]*class="navbar"/.test(html), "classic fixed navbar exists");
  assert.ok(!/class="chapter-folio/.test(html), "chapter folio is removed");
  const nav = html.match(/<nav\b[^>]*class="nav-links"[\s\S]*?<\/nav>/)?.[0] ?? "";
  for (const [label, id] of [["Produto", "produto"], ["Como funciona", "como-funciona"], ["Agentes de IA", "agentes"], ["Preços", "precos"], ["FAQ", "faq"]]) {
    assert.match(nav, new RegExp(`href="#${id}"[^>]*>${label}`));
  }
  assert.match(html, /id="burger"[^>]*aria-expanded="false"[^>]*aria-controls="mobileMenu"/);
  assert.match(html, /id="mobileMenu"/);
  assert.match(html, /setMenuOpen\(false\)/, "mobile navigation has an explicit close path");
  const styles = html.slice(html.indexOf("<style>") + 7, html.indexOf("</style>"));
  const desktopCta = styles.lastIndexOf(".nav-cta{display:flex");
  const mobileCta = styles.lastIndexOf(".nav-cta{display:none");
  assert.ok(mobileCta > desktopCta, "mobile CTA visibility overrides the later desktop navbar styling");
  const mobileMenuRule = styles.slice(styles.lastIndexOf(".mobile-menu{"));
  assert.match(mobileMenuRule, /max-height:calc\(100dvh - 76px\)/);
  assert.match(mobileMenuRule, /overflow-y:auto/);
  assert.match(titlePage, /href="https:\/\/elus\.wandora\.com\.br\/login"[^>]*>Entrar/);
});

test("keeps all problem artwork and accessible information with the mascot", () => {
  const problem = sectionMarkup("problema");
  assert.match(problem, /<div class="followup-stage cinema-followup"[^>]*role="group"/, "the live composition has the class selectors used by its responsive styling and player");
  for (const asset of [
    "/brand/followup-scene.webp",
    "/brand/followup-lead.webp",
    "/brand/followup-mascot.webp",
    "/brand/followup-actions.webp",
  ]) {
    assert.ok(problem.includes(asset), `PROBLEMA keeps ${asset}`);
  }
  assert.match(problem, /Exemplo ilustrativo/);
  for (const removed of [
    "Lead sem retorno",
    "WhatsApp disperso",
    "Follow-up esquecido",
    "Equipe comercial e IA juntas · Conversas organizadas · Próximos passos visíveis",
    "Equipe comercial e IA juntas",
    "cinemaFollowupCTA",
    "cinemaFollowupEmail",
    "Quero conhecer o ELUS 360",
  ]) assert.ok(!html.includes(removed), `landing omits ${removed}`);
  assert.match(problem, /conversa|lembrete|acompanhamento/i);
});

test("presents Recursos as a connected three-stage flow instead of a card grid", () => {
  const resources = sectionMarkup("recursos");
  for (const title of ["Organizar", "Atender", "Evoluir"]) assert.ok(resources.includes(title), `resources has the ${title} stage`);
  for (const capability of [
    "CRM visual",
    "WhatsApp centralizado",
    "Radar de leads em risco",
    "Agentes de IA",
    "Base de conhecimento",
    "Transferência inteligente",
    "Automações de follow-up",
    "Registros e auditoria da IA",
  ]) assert.ok(resources.includes(capability), `resources keeps ${capability}`);
  assert.doesNotMatch(resources, /class="features-grid"/);
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
  assert.ok(html.includes("scroll-padding-top:92px"), "anchor navigation leaves room for the sticky menu");
  assert.ok(html.includes("@media(prefers-reduced-motion:reduce)"), "reduced motion is respected");
  assert.ok(html.includes("html:not(.js) .reveal{opacity:1!important"), "legacy reveals stay visible without JavaScript");
  assert.doesNotMatch(html, /data-sc-act="(?:pin|scrub)"/);
});

test("shows page-wide scroll progress without hiding content from reduced-motion or no-JS visitors", () => {
  assert.ok(/id="pageProgress"[^>]*aria-hidden="true"/.test(html), "page progress is decorative and exposed only visually");
  assert.ok(html.includes("pageProgressBar"), "page progress fill exists");
  assert.ok(html.includes("scrollHeight"), "progress uses the full document scroll range");
  assert.ok(/\.page-progress span\{[^}]*transform:scaleX\(0\)/.test(html), "progress starts from zero width");
  assert.ok(/progress\.style\.transform='scaleX\('\+ratio\+'\)'/.test(html), "scroll position updates the progress fill");
  assert.ok(html.includes("reduced.addEventListener('change',scheduleProgress)"), "changing the motion preference recalculates progress");
  assert.ok(!html.includes("progress.parentElement.style.display"), "reduced-motion visibility is not stuck in an inline style");
  assert.ok(/prefers-reduced-motion:reduce/.test(html), "reduced-motion handling remains");
  assert.ok(/html:not\(\.js\)[^{]*\.reveal\{opacity:1!important/.test(html), "revealed content remains visible without JavaScript");
});
