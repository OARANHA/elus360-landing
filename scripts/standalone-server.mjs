import { createServer } from 'node:http';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createHash, createHmac } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(new URL('../', import.meta.url).pathname);
// The CDN can retain a previous script for a day. Tie each referenced CSS/JS
// URL to the bytes in this image so a new deployment cannot load stale code.
const index = readFileSync(resolve(root, 'standalone-dist/index.html'), 'utf8').replace(
  /((?:src|href)="(\/(?:brand\/[A-Za-z0-9_-]+\.js|scrollcraft\/scrollcraft\.(?:css|js))))"/g,
  (match, attribute, path) => {
    const fingerprint = createHash('sha256')
      .update(readFileSync(resolve(root, 'public' + path)))
      .digest('hex').slice(0, 12);
    return attribute + '?v=' + fingerprint + '"';
  },
);
const privacy = readFileSync(resolve(root, 'standalone-dist/privacidade.html'), 'utf8');
const port = Number(process.env.PORT || 3000);
const webhookUrl = process.env.ELUS_LEADS_WEBHOOK_URL || '';
const webhookSecret = process.env.ELUS_LEADS_WEBHOOK_SECRET || '';

export function validWebhookUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'elus.wandora.com.br'
      && /^\/api\/v1\/webhooks\/in\/[A-Za-z0-9_-]{8,}$/.test(url.pathname)
      && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  if (input.website) return { honeypot: true };
  const str = (k) => typeof input[k] === 'string' ? input[k].trim() : '';
  const nome = str('nome'), empresa = str('empresa');
  const email = str('email').toLowerCase(), telefone = str('telefone');
  if (nome.length < 2 || nome.length > 120 || empresa.length > 160
    || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !/^\+?[\d\s().-]{8,24}$/.test(telefone) || input.consent !== true) return null;
  return { nome, empresa, email, telefone, consentimento_comercial: 'sim', origem: 'elus360.com.br' };
}

export function signature(raw, secret) {
  return createHmac('sha256', secret).update(raw, 'utf8').digest('hex');
}

function chatHtml() {
  const phone = (process.env.ELUS_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (!/^\d{10,15}$/.test(phone)) return '';
  const text = encodeURIComponent('Olá! Vim pelo site ELUS 360 e quero conversar com a equipe.');
  const href = 'https://wa.me/' + phone + '?text=' + text;
  return '<style>.elus-chat-link{position:fixed;right:clamp(16px,3vw,36px);bottom:clamp(16px,3vw,32px);z-index:2000;display:flex;align-items:center;gap:10px;border-radius:999px;padding:13px 20px;background:#1765dc;color:white!important;font:700 14px/1.35 system-ui,sans-serif;text-decoration:none;box-shadow:0 12px 36px #06194655}.elus-chat-link:focus-visible{outline:3px solid #9adeff;outline-offset:3px}@media(max-width:540px){.elus-chat-link{padding:12px 15px;font-size:12px}}</style><a class="elus-chat-link" target="_blank" rel="noopener noreferrer" aria-label="Conversar com a equipe ELUS pelo WhatsApp" href="' + href + '">💬 Conversar com ELUS</a>';
}

function json(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(payload));
}

async function handleLeads(req, res) {
  const type = req.headers['content-type'] || '';
  if (!type.startsWith('application/json')) return json(res, 415, { error: 'Envie o formulário no formato JSON.' });
  const origin = req.headers.origin;
  if (origin) {
    let allowed = false;
    try {
      const site = new URL(origin);
      const host = req.headers.host;
      allowed = site.protocol === 'https:' && site.host === host;
      if (process.env.NODE_ENV !== 'production' && site.host === host) allowed = true;
    } catch {}
    if (!allowed) return json(res, 403, { error: 'Origem não autorizada.' });
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk.toString('utf8');
    if (raw.length > 6000) {
      res.setHeader('connection', 'close');
      return json(res, 413, { error: 'Formulário muito longo.' });
    }
  }
  let body;
  try { body = JSON.parse(raw); } catch { return json(res, 400, { error: 'Dados inválidos.' }); }
  const lead = validateLead(body);
  if (!lead) return json(res, 400, { error: 'Revise os campos e confirme o aceite.' });
  if (lead.honeypot) return json(res, 200, { ok: true });
  if (!validWebhookUrl(webhookUrl) || !webhookSecret) {
    return json(res, 503, { error: 'Atendimento temporariamente indisponível. Tente novamente.' });
  }
  const payload = JSON.stringify(lead);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST', signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-deskcomm-signature': signature(payload, webhookSecret),
        'origin': 'https://elus360.com.br',
      },
      body: payload,
    });
    if (!upstream.ok) return json(res, 502, { error: 'Não foi possível registrar no ELUS. Tente novamente.' });
    return json(res, 201, { ok: true });
  } catch {
    return json(res, 503, { error: 'ELUS indisponível no momento. Tente novamente.' });
  } finally { clearTimeout(timeout); }
}

function staticAsset(pathname, res, headOnly) {
  const isScrollcraft = pathname.startsWith('/scrollcraft/');
  const prefix = isScrollcraft ? '/scrollcraft/' : '/brand/';
  const directory = isScrollcraft ? 'scrollcraft' : 'brand';
  const file = pathname.slice(prefix.length);
  const allowed = isScrollcraft
    ? /^scrollcraft\.(css|js)$/.test(file)
    : /^[A-Za-z0-9_-]+\.(png|jpe?g|webp|svg|mp4|js)$/.test(file);
  if (!allowed) {
    res.writeHead(404); return res.end();
  }
  const target = resolve(root, 'public', directory, file);
  try {
    const st = statSync(target);
    const ext = file.split('.').at(-1);
    const type = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8' }[ext];
    res.writeHead(200, { 'content-type': type, 'content-length': st.size, 'cache-control': 'public, max-age=86400', 'x-content-type-options': 'nosniff' });
    if (headOnly) return res.end();
    return createReadStream(target).pipe(res);
  } catch {
    res.writeHead(404); return res.end();
  }
}

export function makeServer() {
  return createServer(async (req, res) => {
    let path;
    try { path = new URL(req.url || '/', 'http://localhost').pathname; }
    catch { return json(res, 400, { error: 'Rota inválida.' }); }
    if (req.method === 'POST' && path === '/api/leads') return handleLeads(req, res);
    if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: 'Método não permitido.' });
    const headOnly = req.method === 'HEAD';
    if (path === '/healthz') {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
      return res.end(headOnly ? undefined : 'ok');
    }
    if (path === '/favicon.ico') {
      res.writeHead(302, { location: '/brand/elus-vertical.png' }); return res.end();
    }
    if (path.startsWith('/brand/') || path.startsWith('/scrollcraft/')) return staticAsset(path, res, headOnly);
    if (path === '/' || path === '/privacidade' || path === '/privacidade/') {
      const html = path === '/' ? index.replace('</body>', chatHtml() + '</body>') : privacy;
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
      return res.end(headOnly ? undefined : html);
    }
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end(headOnly ? undefined : 'Página não encontrada');
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  makeServer().listen(port, '0.0.0.0', () => process.stdout.write('ELUS360 listening on ' + port + '\n'));
}
