import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { validateLead, validWebhookUrl, signature, makeServer } from '../scripts/standalone-server.mjs';

test('export preserva a landing e o formulário comercial', () => {
  const html = readFileSync('standalone-dist/index.html', 'utf8');
  assert.match(html, /id="leadForm"/);
  assert.match(html, /https:\/\/elus\.wandora\.com\.br\//);
  assert.match(html, /class="cinema-team"/);
  assert.doesNotMatch(html, /<div class="office-actors"/);
  assert.match(html, /src="\/brand\/hero-office\.webp"/);
  assert.match(html, /src="\/brand\/hero-team\.webp"/);
  assert.match(html, /src="\/brand\/followup-scene\.webp"/);
  assert.match(html, /src="\/brand\/followup-mascot\.webp"/);
  assert.match(html, /src="\/brand\/followup-lead\.webp"/);
  assert.match(html, /src="\/brand\/followup-actions\.webp"/);
  assert.match(html, /id="leadForm"/);
  assert.match(html, /id="cinemaFollowupCTA"/);
  assert.match(html, /class="followup-stage cinema-followup" role="group"/);
  assert.match(html, /class="cinema-mobile-flow"/);
  assert.match(html, /class="cinema-mobile-step action"/);
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
    assert.equal((await fetch(base + '/')).status, 200);
    assert.equal((await fetch(base + '/privacidade')).status, 200);
    const result = await fetch(base + '/api/leads', { method:'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ nome:'Ana Silva', empresa:'Testes',email:'ana@example.com',telefone:'(51) 99999-1111', consent:true }) });
    assert.equal(result.status, 503);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
