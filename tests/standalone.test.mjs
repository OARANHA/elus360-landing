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
  assert.match(html, /id="followupStory"/);
  assert.match(html, /class="cinestory"/);
  assert.match(html, /id="cinestoryTab0"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /src="\/brand\/followup-scene\.webp"/);
  assert.match(html, /src="\/brand\/followup-lead\.webp"/);
  assert.match(html, /src="\/brand\/followup-mascot\.webp"/);
  assert.match(html, /src="\/brand\/followup-actions\.webp"/);
  assert.match(html, /id="followupMotionToggle"/);
  assert.match(html, /id="followupTrack"/);
  assert.match(html, /src="\/brand\/problem-scroll\.js"/);
  assert.match(html, /src="\/brand\/problem-motion\.js"/);
  assert.match(html, /src="\/brand\/resources-motion\.js"/);
  assert.doesNotMatch(html, /src="\/brand\/(?:journey-motion|followup-gsap)\.js"/);
  assert.doesNotMatch(html, /class="journey-stage"/);
  assert.doesNotMatch(html, /class="followup-stage cinema-followup"/);
  assert.doesNotMatch(html, /id="cinemaFollowupCTA"/);
  assert.match(html, /id="leadForm"/);
});


test('os seis arquivos WebP existem no build e têm assinatura válida', () => {
  const files = [
    'hero-office.webp',
    'hero-team.webp',
    'followup-scene.webp',
    'followup-mascot.webp',
    'followup-lead.webp',
    'followup-actions.webp',
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
    for (const path of ['/scrollcraft/scrollcraft.css', '/scrollcraft/scrollcraft.js', '/brand/problem-scroll.js', '/brand/problem-motion.js', '/brand/resources-motion.js']) {
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
