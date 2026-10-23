import { requireChatGPTUser } from '../chatgpt-auth';
import { env } from 'cloudflare:workers';
import { getDb } from '../../db';
import { leads } from '../../db/schema';
import { desc } from 'drizzle-orm';
export const dynamic='force-dynamic';
export default async function Gestao(){
 const user=await requireChatGPTUser('/gestao');
 const owner=(env as unknown as Record<string,string>).SITE_OWNER_EMAIL;
 if(!owner||user.email.toLowerCase()!==owner.toLowerCase())return <main style={{padding:40}}><h1>Acesso restrito</h1><p>Esta área é exclusiva do proprietário.</p><a href="/">Voltar ao site</a></main>;
 const rows=await getDb().select().from(leads).orderBy(desc(leads.createdAt)).limit(500);
 return <main style={{fontFamily:'system-ui',maxWidth:1200,margin:'40px auto',padding:24,color:'#17325a'}}><a href="/">← ELUS 360</a><h1>Solicitações de demonstração</h1><p>{rows.length} contatos mais recentes · área restrita</p><div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',textAlign:'left'}}><thead><tr>{['Recebido em','Nome','Empresa','E-mail','WhatsApp'].map(t=><th key={t} style={{padding:14,borderBottom:'2px solid #cbd5e1'}}>{t}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id}><td style={{padding:14}}>{new Date(r.createdAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}</td><td>{r.nome}</td><td>{r.empresa||'—'}</td><td><a href={'mailto:'+r.email}>{r.email}</a></td><td><a target="_blank" rel="noreferrer" href={'https://wa.me/'+(r.telefone.replace(/\D/g,'').length<=11?'55':'')+r.telefone.replace(/\D/g,'')}>{r.telefone}</a></td></tr>)}</tbody></table></div>{!rows.length&&<p>Nenhuma solicitação recebida. Os envios do formulário aparecerão aqui.</p>}</main>
}
