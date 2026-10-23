import { getDb } from '../../../db';
import { leads } from '../../../db/schema';
import { and, eq, gt } from 'drizzle-orm';
export async function POST(request:Request){
 const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origem não autorizada.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Formato inválido.'},415);
 const raw=await request.text();if(raw.length>6000)return json({error:'Solicitação muito longa.'},413);
 let data;try{data=JSON.parse(raw)}catch{return json({error:'Solicitação inválida.'},400)}
 if(!data||typeof data!=='object'||Array.isArray(data))return json({error:'Solicitação inválida.'},400);
 if(data.website)return json({ok:true});
 const fields=['nome','empresa','email','telefone'] as const;
 const values=Object.fromEntries(fields.map(k=>[k,typeof data[k]==='string'?data[k].trim():''])) as Record<typeof fields[number],string>;
 if(values.nome.length<2||values.nome.length>120||values.empresa.length>160||values.email.length>254||!/^\S+@\S+\.\S+$/.test(values.email)||!/^\+?[\d\s().-]{8,24}$/.test(values.telefone)||data.consent!==true)return json({error:'Confira nome, e-mail, telefone e aceite de contato.'},400);
 try{const db=getDb();const now=Date.now();const previous=await db.select({id:leads.id}).from(leads).where(and(eq(leads.email,values.email.toLowerCase()),gt(leads.createdAt,now-60000))).limit(1);
 if(previous.length)return json({error:'Sua solicitação já foi recebida. Aguarde um minuto para reenviar.'},429);
 await db.insert(leads).values({id:crypto.randomUUID(),...values,email:values.email.toLowerCase(),createdAt:now,consentVersion:'2026-10-22'});
 return json({ok:true},201);
 }catch{return json({error:'Não foi possível registrar agora. Seus dados continuam no formulário; tente novamente.'},503)}
}
