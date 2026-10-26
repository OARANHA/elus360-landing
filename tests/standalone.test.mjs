import test from 'node:test';
import { Script as VmScript, runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateLead, validWebhookUrl, signature, makeServer } from '../scripts/standalone-server.mjs';

test('export preserva a landing e o formulário comercial', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  assert.match(html, /id="leadForm"/);
  assert.match(html, /https:\/\/elus\.wandora\.com\.br\/login/);
  assert.match(html, /<section\b(?=[^>]*\bid="inicio")(?=[^>]*\bclass="[^"]*\bhero\b)[^>]*>/);
  assert.doesNotMatch(html, /<div class="office-actors"/);
  assert.match(html, /id="problema"/);
  assert.match(html, /data-problem-step="0"/);
  assert.match(html, /data-problem-step="1"/);
  assert.match(html, /data-problem-step="2"/);
  assert.match(html, /data-state="início"/);
  assert.match(html, /state==='ativo'/);
  assert.match(html, /state==='concluído'/);
  assert.match(html, /src="\/brand\/problem-stage-inquiry\.webp"/);
  assert.match(html, /src="\/brand\/problem-stage-context\.webp"/);
  assert.match(html, /src="\/brand\/problem-stage-next-step\.webp"/);
  assert.match(html, /src="\/brand\/followup-lead\.webp"/);
  assert.match(html, /src="\/brand\/followup-mascot\.webp"/);
  assert.match(html, /src="\/brand\/followup-actions\.webp"/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(html, /id="followupStory"/);
  assert.match(html, /src="\/brand\/resources-motion\.js"/);
  assert.match(html, /src="\/brand\/how-motion\.js"/);
  assert.match(html, /src="\/brand\/agents-motion\.js"/);
  assert.doesNotMatch(html, /src="\/brand\/(?:journey-motion|followup-gsap)\.js"/);
  assert.doesNotMatch(html, /class="journey-stage"/);
  assert.doesNotMatch(html, /class="followup-stage cinema-followup"/);
  assert.doesNotMatch(html, /id="cinemaFollowupCTA"/);
  assert.match(html, /id="leadForm"/);
});

test('a narrativa de problema usa três imagens compactas sem markup antigo sobrando', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  const section = html.match(/<section\b(?=[^>]*\bid="problema")(?=[^>]*\bclass="[^"]*\bproblem-story-section\b)[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'Seção Problema ausente ou sem fechamento');
  assert.equal((section.match(/<li class="problem-step/g) || []).length, 3);
  assert.equal((section.match(/<figure class="problem-step-visual"/g) || []).length, 3);
  assert.equal((section.match(/class="problem-step-photo"/g) || []).length, 3);
  assert.equal((section.match(/class="problem-step-art(?: problem-step-art--mascot)?"/g) || []).length, 3);
  assert.match(html, /\.problem-story-section \.problem-container\{[^}]*max-width:1140px[^}]*padding-inline:0/);
  assert.match(html, /grid-template-columns:repeat\(3,minmax\(0,315px\)\);justify-content:center;[^}]*gap:20px/);
  assert.match(html, /\.problem-step-visual\{[^}]*aspect-ratio:9\/16/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)\{\.problem-step/);
  assert.match(section, /aria-label="Narrativa em três etapas; todos os textos permanecem visíveis"/);
  assert.match(section, /Role para percorrer as etapas; use os números para selecionar uma diretamente/);
  assert.match(section, /aria-label="Selecionar etapa 2: As pontas se conectam"/);
  assert.match(section, /As cenas e telas são ilustrativas e fictícias/);
  assert.doesNotMatch(section, /cinestory|data-story-tab|followupMotionToggle|aria-hidden="true"[^>]*>[^<]*(?:O interesse|As pontas|próximo passo)/i);
  assert.doesNotMatch(html.slice(html.indexOf('id="problema"'), html.indexOf('id="agentes"')), /id="cinestoryPanel|class="cinestory-art|class="cinestory-footer/);
  assert.match(html, /window\.addEventListener\('resize',schedulePositionUpdate\)/);
  assert.match(html, /Math\.floor\(progress\*3\)/);
  assert.match(html, /window\.addEventListener\('scroll',schedulePositionUpdate/);
});

test('a etapa ativa acompanha a rolagem nos dois sentidos, redimensionamento e movimento reduzido', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  const script = html.match(/<script>\s*\(function\(\)\{\s*var root=document\.querySelector\('#problemStory \.problem-story-steps'\)[\s\S]*?<\/script>/)?.[0];
  assert.ok(script, 'Controlador de rolagem da narrativa ausente');
  const listeners = {};
  let pendingFrame;
  const stateLabels = [];
  const stateNodes = [0, 1, 2].map((i) => ({ set textContent(value) { stateLabels[i] = value; } }));
  const steps = [0, 1, 2].map((i) => ({
    dataset: {},
    attributes: {},
    classList: { toggle() {} },
    getAttribute(name) { return name === 'data-problem-step' ? String(i) : null; },
    querySelector() { return stateNodes[i]; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    scrollIntoView(options) { this.lastScroll = options; },
  }));
  const buttons = [0, 1, 2].map((i) => ({
    attributes: {},
    addEventListener(name, callback) { this.listeners ||= {}; this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    getAttribute(name) { return name === 'data-problem-go' ? String(i) : null; },
  }));
  const next = { addEventListener(name, callback) { this.listeners ||= {}; this.listeners[name] = callback; } };
  const controls = { hidden: true, querySelectorAll() { return buttons; }, querySelector() { return next; } };
  const rootRect = { top: 100, bottom: 1720, height: 1620 };
  const root = { querySelectorAll() { return steps; }, getBoundingClientRect() { return rootRect; } };
  const status = { hidden: true, textContent: '' };
  const hint = { hidden: true };
  const reduced = { matches: false, addEventListener() {} };
  const window = {
    innerHeight: 800,
    innerWidth: 1280,
    matchMedia(query) { return query.includes('max-width') ? { matches: this.innerWidth <= 760 } : reduced; },
    addEventListener(name, callback) { listeners[name] = callback; },
    requestAnimationFrame(callback) { pendingFrame = callback; return 1; },
  };
  const document = {
    getElementById(id) { return id === 'problemStoryStatus' ? status : id === 'problemStoryHint' ? hint : null; },
    querySelector(selector) { return selector === '.problem-story-controls' ? controls : selector === '#problemStory .problem-story-steps' ? root : null; },
    querySelectorAll() { return []; },
  };
  const source = script.replace(/^<script>|<\/script>$/g, '');
  new VmScript(source).runInNewContext({ document, window });
  const flush = (event) => { listeners[event](); pendingFrame?.(); pendingFrame = null; };
  const states = () => steps.map((step) => step.dataset.state);
  assert.deepEqual(states(), ['ativo', 'início', 'início']);
  rootRect.top = -500; rootRect.bottom = 1120;
  flush('scroll');
  assert.deepEqual(states(), ['concluído', 'ativo', 'início']);
  rootRect.top = -1100; rootRect.bottom = 520;
  flush('scroll');
  assert.deepEqual(states(), ['concluído', 'concluído', 'ativo']);
  rootRect.top = -500; rootRect.bottom = 1120;
  flush('scroll');
  assert.deepEqual(states(), ['concluído', 'ativo', 'início']);
  window.innerHeight = 1000;
  rootRect.top = -400; rootRect.bottom = 1220;
  flush('resize');
  assert.deepEqual(states(), ['concluído', 'ativo', 'início']);
  window.innerWidth = 390;
  reduced.matches = true;
  buttons[2].listeners.click();
  assert.equal(steps[2].lastScroll.behavior, 'auto');
  assert.deepEqual(states(), ['concluído', 'concluído', 'ativo']);
  rootRect.top = -1800; rootRect.bottom = -180;
  flush('scroll');
  assert.deepEqual(states(), ['concluído', 'concluído', 'concluído']);
  assert.match(status.textContent, /Narrativa concluída/);
  rootRect.top = 1001; rootRect.bottom = 2621;
  flush('scroll');
  assert.deepEqual(states(), ['ativo', 'início', 'início']);
  assert.equal(controls.hidden, false);
  assert.equal(hint.hidden, false);
  assert.equal(status.hidden, false);
});

test('cada cartão de Para quem é contém sua própria arte e ícone', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  const start = html.indexOf('id="para-quem"');
  const end = html.indexOf('</section>', start);
  assert.ok(start >= 0 && end > start, 'Seção Para quem é ausente ou incompleta');
  const section = html.slice(start, end);
  const cards = [...section.matchAll(/<article class="w-card[^>]*>[\s\S]*?<\/article>/g)].map(([card]) => card);
  assert.equal(cards.length, 6, 'A seção deve manter os seis segmentos');
  for (const card of cards) {
    assert.equal((card.match(/<div class="w-card-art"/g) || []).length, 1);
    assert.equal((card.match(/<\/div>/g) || []).length, 1);
    assert.match(card, /<span class="w-ic">[\s\S]*?<\/span><\/div>\s*<h3>/);
    assert.match(card, /<img class="w-sector-art" src="\/brand\/audience-[a-z-]+\.webp"/);
  }
});

test('a ilustração de Diferenciais usa proporção quadrada e arquivo próprio', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  assert.match(html, /<img src="\/brand\/differential-flow\.webp"/);
  assert.match(html, /\.differential-art img\{[^}]*height:auto;aspect-ratio:1;/);
  assert.ok(existsSync('public/brand/differential-flow.webp'));
});


test('os arquivos WebP do site existem e têm assinatura válida', () => {
  const files = [
    'hero-office.webp',
    'hero-team.webp',
    'followup-scene.webp',
    'followup-mascot.webp',
    'followup-lead.webp',
    'followup-actions.webp',
    'differential-flow.webp',
    'audience-clinic.webp',
    'audience-ecommerce.webp',
    'audience-real-estate.webp',
    'audience-services.webp',
    'audience-agency.webp',
    'audience-consulting.webp',
  ];
  for (const file of files) {
    const path = 'public/brand/' + file;
    assert.ok(existsSync(path), 'Arte ausente: ' + path);
    assert.ok(statSync(path).size > 10000, 'Arte inválida ou vazia: ' + path);
    const bytes = readFileSync(path);
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', 'Cabeçalho WebP: ' + file);
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', 'Formato WebP: ' + file);
  }
});

test('lead exige consentimento e campos adequados', () => {
  const entrada = { nome: 'Ana Silva', empresa: 'Comércio', email: 'ANA@EXEMPLO.COM', telefone: '(51) 99999-1234', consent: true };
  const lead = validateLead(entrada);
  assert.equal(lead.email, 'ana@exemplo.com');
  assert.equal(lead.nome, 'Ana Silva');
  assert.equal(validateLead({ ...entrada, consent: false }), null);
  assert.deepEqual(validateLead({ website: 'robô' }), { honeypot: true });
});

test('endereço autorizado é o webhook do ELUS', () => {
  assert.equal(validWebhookUrl('https://elus.wandora.com.br/api/v1/webhooks/in/token123456'), true);
  assert.equal(validWebhookUrl('https://evil.example/api/v1/webhooks/in/token123456'), false);
  assert.equal(validWebhookUrl('http://elus.wandora.com.br/api/v1/webhooks/in/token123456'), false);
});
test('assinatura conforme contrato HMAC SHA-256 ELUS', () => {
  assert.equal(signature('{"nome":"Ana"}', 'segredo'), '858ac179392a709e751697cdee3e56e2726ae572a055e9acfcee22567c79c790');
});
test('servidor sobe, responde healthz e não aceita formulário sem origem configurada', async () => {
  const server = makeServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    assert.equal((await fetch(base + '/healthz')).status, 200);
    const page = await fetch(base + '/');
    assert.equal(page.status, 200);
    const servedHtml = await page.text();
    for (const path of ['/scrollcraft/scrollcraft.css', '/scrollcraft/scrollcraft.js', '/brand/resources-motion.js', '/brand/how-motion.js', '/brand/agents-motion.js']) {
      const fingerprint = createHash('sha256').update(readFileSync('public' + path)).digest('hex').slice(0, 12);
      assert.ok(servedHtml.includes(path + '?v=' + fingerprint), 'Asset sem versão: ' + path);
    }
    assert.equal((await fetch(base + '/privacidade')).status, 200);
    for (const [path, type] of [['/scrollcraft/scrollcraft.css', /text\/css/], ['/scrollcraft/scrollcraft.js', /javascript/]]) {
      const asset = await fetch(base + path);
      assert.equal(asset.status, 200);
      assert.match(asset.headers.get('content-type'), type);
      assert.ok((await asset.text()).length > 100);
    }
    for (const file of ['followup-gsap.js','followup-motion.js','followup-player.js','journey-motion.js']) {
      const asset = await fetch(base + '/brand/' + file);
      assert.equal(asset.status, 200);
      assert.match(asset.headers.get('content-type'), /javascript/);
      assert.ok((await asset.text()).length > 100);
    }
    const result = await fetch(base + '/api/leads', { method:'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ nome:'Ana Silva', empresa:'Testes',email:'ana@example.com',telefone:'(51) 99999-1111', consent:true }) });
    assert.equal(result.status, 503);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('timeline de acompanhamento conta a história e respeita movimento reduzido', () => {
  const Script = VmScript;
  const motion = readFileSync('public/brand/followup-motion.js', 'utf8');
  const player = readFileSync('public/brand/followup-player.js', 'utf8');
  new Script(motion);
  new Script(player);
  const steps = [];
  const fakeTimeline = {
    addLabel(name) { steps.push(name); return this; },
    from() { return this; },
    fromTo() { return this; },
    to() { return this; }
  };
  const makeNode = () => ({ style: {}, setAttribute() {}, insertBefore(node) { this.glow = node; } });
  const path = { getTotalLength() { return 10; }, getPointAtLength() { return { x: 5, y: 5 }; } };
  const svg = makeNode();
  svg.querySelectorAll = () => [path, path];
  svg.appendChild = () => {};
  const anchor = makeNode();
  const nodes = {
    '.followup-contact': makeNode(),
    '.followup-mascot-anchor': anchor,
    '.followup-resolution': makeNode(),
    '.cinema-followup-scene': makeNode(),
    '.followup-connections': svg
  };
  const context = { window: { gsap: { timeline() { return fakeTimeline; } } },
    document: { createElement: makeNode, createElementNS: makeNode } };
  runInNewContext(motion, context);
  assert.equal(context.window.createElusFollowupTimeline({ querySelector: s => nodes[s] }), fakeTimeline);
  assert.deepEqual(steps, ['lead', 'interruption', 'elus', 'followup']);
  assert.equal(anchor.glow.className, 'followup-live-glow');
  assert.match(player, /prefers-reduced-motion/);
  assert.match(player, /timeline\.restart\(\)/);
  assert.match(player, /document\.hidden/);
  assert.match(player, /followup-live-glow,\.followup-flow-dot/);
});

test('HyperFrames e landing compartilham exatamente a mesma timeline', () => {
  const live = readFileSync('public/brand/followup-motion.js', 'utf8');
  const preview = readFileSync('motion-followup/assets/followup-motion.js', 'utf8');
  assert.equal(preview, live);
});

test('as três cenas seguem a rolagem e os controles permanecem acessíveis', () => {
  const source = readFileSync('public/brand/problem-scroll.js', 'utf8');
  new VmScript(source);
  const makeNode = () => {
    const attributes = {};
    const listeners = {};
    return {
      attributes, listeners, style: { transform: '', setProperty() {} },
      classList: { add() {}, toggle() {} },
      setAttribute(key, value) { attributes[key] = value; },
      addEventListener(key, listener) { listeners[key] = listener; },
      focus() { this.focused = true; }
    };
  };
  const meters = Array.from({ length: 3 }, makeNode);
  const tabs = Array.from({ length: 3 }, (_, i) => {
    const tab = makeNode();
    tab.querySelector = () => meters[i];
    return tab;
  });
  const panels = Array.from({ length: 3 }, makeNode);
  const arts = Array.from({ length: 3 }, makeNode);
  const stage = makeNode();
  const sceneChanges = [];
  stage.dispatchEvent = event => sceneChanges.push(event.detail.index);
  stage.offsetHeight = 600;
  stage.querySelectorAll = selector => ({ '[data-story-tab]': tabs, '[data-scene]': panels, '[data-art-scene]': arts })[selector];
  const track = makeNode();
  track.offsetHeight = 1400;
  let top = 0;
  track.getBoundingClientRect = () => ({ top });
  const replay = makeNode();
  replay.querySelector = () => ({ textContent: '' });
  const listeners = {};
  const motionPreference = { matches: false };
  const browser = {
    CustomEvent: class { constructor(name, options) { this.detail = options.detail; } },
    scrollY: 0,
    matchMedia: () => motionPreference,
    addEventListener(name, listener) { listeners[name] = listener; },
    requestAnimationFrame(callback) { callback(); },
    scrollTo(options) { this.scrollTarget = options; }
  };
  runInNewContext(source, { window: browser, document: { getElementById(id) {
    return ({ followupTrack: track, followupStory: stage, followupMotionToggle: replay })[id];
  } } });
  assert.equal(tabs[0].attributes['aria-selected'], 'true');
  top = -400; listeners.scroll();
  assert.equal(tabs[1].attributes['aria-selected'], 'true');
  assert.equal(meters[0].style.transform, 'scaleX(1.000)');
  top = -800; listeners.scroll();
  assert.equal(tabs[2].attributes['aria-selected'], 'true');
  assert.deepEqual(sceneChanges, [0, 1, 2]);
  assert.equal(panels[0].attributes['aria-hidden'], 'true');
  browser.scrollY = 800;
  tabs[1].listeners.click();
  assert.equal(browser.scrollTarget.top, 400);
  motionPreference.matches = true;
  tabs[2].listeners.keydown({ key: 'Home', preventDefault() {} });
  assert.equal(tabs[0].focused, true);
  assert.equal(browser.scrollTarget.behavior, 'instant');
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /ArrowRight/);
  assert.doesNotMatch(source, /gsap|setInterval/);
});

test('as artes cabem na moldura e cada cena aciona o Motion com fallback acessível', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  assert.match(html, /cinestory-art-frame img\{[^}]*inset:6% 3%;width:94%;height:88%;max-width:none;max-height:none;object-fit:contain/);
  assert.match(html, /cinestory-art-frame--elus img\{inset:8% 10%;width:80%;height:84%/);
  const source = readFileSync('scripts/problem-motion.mjs', 'utf8');
  const controller = readFileSync('public/brand/problem-scroll.js', 'utf8');
  assert.match(source, /from 'motion\/mini'/);
  assert.match(source, /reduced\.matches/);
  assert.match(source, /elus:scenechange/);
  assert.match(controller, /CustomEvent\('elus:scenechange'/);
  const bundle = readFileSync('public/brand/problem-motion.js', 'utf8');
  new VmScript(bundle);
  assert.ok(bundle.length > 3000);
});

test('Recursos preserva as capacidades e usa Motion com adaptação de layout', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  const section = html.match(/<section class="section resource-section" id="recursos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  for (const title of ['Organizar', 'Atender', 'Evoluir', 'CRM visual', 'WhatsApp centralizado', 'Radar de leads em risco', 'Agentes de IA', 'Base de conhecimento', 'Transferência inteligente', 'Automações de follow-up', 'Registros e auditoria da IA']) {
    assert.ok(section.includes(title), `Recurso ausente: ${title}`);
  }
  assert.equal((section.match(/class="resource-stage(?: resource-stage-evolve)?"/g) || []).length, 3);
  assert.match(html, /@media\(max-width:760px\)\{\.resources-heading/);
  const source = readFileSync('scripts/resources-motion.mjs', 'utf8');
  assert.match(source, /from 'motion\/mini'/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  new VmScript(readFileSync('public/brand/resources-motion.js', 'utf8'));
});

test('Como funciona percorre sete etapas ilustradas pelo scroll', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  const section = html.match(/<section class="section how-section" id="como-funciona"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  for (const title of ['A mensagem chega', 'O agente identifica o cliente', 'A IA responde com a sua base', 'O lead é qualificado e movido no funil', 'O humano assume com contexto', 'O follow-up é agendado', 'Sem resposta? Entra no Radar de risco']) {
    assert.ok(section.includes(title), `Etapa ausente: ${title}`);
  }
  assert.equal((section.match(/data-how-step="\d"/g) || []).length, 7);
  assert.equal((section.match(/data-how-scene="\d"/g) || []).length, 7);
  assert.match(html, /@media\(max-width:900px\)\{\.how-layout/);
  const source = readFileSync('scripts/how-motion.mjs', 'utf8');
  assert.match(source, /from 'motion\/mini'/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /requestAnimationFrame\(update\)/);
  new VmScript(readFileSync('public/brand/how-motion.js', 'utf8'));
});

test('Agentes mantém mascote e fluxo horizontal com linhas vivas e leitura acessível', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  const section = html.match(/<section class="section agents-section" id="agentes"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.match(section, /src="\/brand\/mascot-elus\.png"/);
  assert.equal((section.match(/class="flow-card"/g) || []).length, 4);
  assert.equal((section.match(/class="agents-wire"/g) || []).length, 3);
  assert.equal((section.match(/class="learning-step(?: is-active)?"/g) || []).length, 3);
  assert.equal((section.match(/class="learning-select"/g) || []).length, 3);
  assert.match(section, /class="learning-kicker">Uma evolução supervisionada/);
  assert.match(html, /#agentes \.learning-heading \.learning-kicker\{display:block/);
  for (const title of ['Mensagem chega', 'Agente responde', 'Lead qualificado', 'Humano assume', 'Base de conhecimento', 'Supervisão humana']) assert.ok(section.includes(title));
  assert.match(html, /@media\(max-width:760px\)\{\.agents-grid/);
  const source = readFileSync('scripts/agents-motion.mjs', 'utf8');
  assert.match(source, /from 'motion\/mini'/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(html, /@keyframes agents-wire-travel/);
  assert.match(html, /@keyframes agents-learning-travel/);
  assert.match(source, /elus:learning-step/);
  new VmScript(readFileSync('public/brand/agents-motion.js', 'utf8'));
});
