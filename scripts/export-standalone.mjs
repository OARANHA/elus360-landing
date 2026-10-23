import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The canonical visual source is an escaped HTML literal in lib/landing.ts.
// Export without evaluating TypeScript, installing dependencies or running the Sites runtime.
const source = readFileSync(resolve('lib/landing.ts'), 'utf8');
const prefix = 'const html = ';
const suffix = ';\nexport default html;';
if (!source.startsWith(prefix) || !source.trimEnd().endsWith('export default html;')) {
  throw new Error('Formato inesperado de lib/landing.ts');
}
const end = source.lastIndexOf(suffix);
if (end < prefix.length) throw new Error('Literal HTML não encontrado');
const html = JSON.parse(source.slice(prefix.length, end));
if (!html.startsWith('<!DOCTYPE html>') || !html.includes('id="leadForm"')) {
  throw new Error('HTML exportado não contém o formulário esperado');
}
const target = resolve('standalone-dist');
mkdirSync(target, { recursive: true });
writeFileSync(resolve(target, 'index.html'), html, 'utf8');
const privacy = '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Privacidade — ELUS 360</title><style>body{font:16px/1.75 system-ui,-apple-system,sans-serif;color:#17325a;margin:0;background:#f7fbff}main{max-width:760px;padding:32px;margin:35px auto}a{color:#2563eb}h1,h2{line-height:1.25}</style></head><body><main><a href="/">← ELUS 360</a><h1>Privacidade no contato comercial</h1><p>Ao solicitar uma demonstração, você informa nome, empresa, e-mail e telefone, com aceite para receber contato da equipe ELUS.</p><h2>Destino e finalidade</h2><p>Esses dados são encaminhados à plataforma ELUS, para registrar e acompanhar seu pedido comercial. Não são armazenados em um banco separado da landing. O atendimento e a gestão dos contatos acontecem no ELUS.</p><h2>Chat e navegação</h2><p>Se o botão de WhatsApp estiver configurado, ele abre o atendimento no WhatsApp; essa comunicação também segue as condições de privacidade daquele serviço. O site utiliza fontes hospedadas pelo Google Fonts.</p><h2>Seus direitos</h2><p>Você pode solicitar acesso, correção, exclusão ou encerramento do contato pelo mesmo canal utilizado pela equipe comercial, observadas as obrigações legais aplicáveis.</p><p>Atualizado em 23 de outubro de 2026.</p><a href="/#contato">Voltar ao formulário</a></main></body></html>';
writeFileSync(resolve(target, 'privacidade.html'), privacy, 'utf8');
process.stdout.write('Standalone export OK: HTML e privacidade\n');
