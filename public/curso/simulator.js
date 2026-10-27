/* Academia ELUS360: prática guiada pelas marcações do modo Ler, sem operações no CRM. */
(() => {
"use strict";
const root=document.querySelector("[data-sim-root]"), source=document.getElementById("course-sim-data");
if(!root||!source)return;
let data;try{data=JSON.parse(source.textContent||"{}")}catch{return}
if(!Array.isArray(data.steps)||!data.steps.length||!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(data.key||""))return;
const $=s=>root.querySelector(s);
const stage=$("[data-sim-image]"),title=$("[data-sim-title]"),body=$("[data-sim-text]"),tip=$("[data-sim-tip]"),count=$("[data-sim-count]"),prompt=$("[data-sim-prompt]"),feedback=$("[data-sim-feedback]"),progress=$("[data-sim-progress]"),bar=$("[data-sim-progress-bar]"),back=$('[data-sim-action="back"]'),next=$('[data-sim-action="next"]'),repeat=$('[data-sim-action="repeat"]'),finish=$("[data-sim-finish]");
if(![stage,title,body,tip,count,prompt,feedback,progress,bar,back,next,repeat,finish].every(Boolean))return;
const W=1440,H=900, validImage=v=>typeof v==="string"&&/^\/curso\/capturas\/[a-z0-9_-]+_elus\.png$/i.test(v);
const validRect=r=>r&&["x","y","w","h"].every(k=>Number.isFinite(r[k]))&&r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=W&&r.y+r.h<=H;
const pct=(v,base)=>(100*v/base).toFixed(5)+"%";
const steps=data.steps.map(s=>({...s,marks:Array.isArray(s.marks)?s.marks.filter(validRect):[]}));
let stepIndex=0, markIndex=0, satisfied=false, done=false;
const total=steps.reduce((n,s)=>n+Math.max(1,s.marks.length),0);
const numberBefore=i=>steps.slice(0,i).reduce((n,s)=>n+Math.max(1,s.marks.length),0);
const current=()=>steps[stepIndex];
const marker=()=>current().marks[markIndex]||null;
const intersects=(a,b)=>a&&b&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const actTarget=()=>{const m=marker(),t=current().target;return m&&validRect(t)&&intersects(m,t)?t:null};
function message(s,kind=""){feedback.textContent=s;feedback.dataset.kind=kind}
function save(){try{let a=JSON.parse(localStorage.getItem("elus360:curso:concluidas:v1")||"[]");if(!Array.isArray(a))a=[];localStorage.setItem("elus360:curso:concluidas:v1",JSON.stringify([...new Set([...a,data.key])]));document.querySelectorAll("[data-done-for]").forEach(e=>{if(e.getAttribute("data-done-for")===data.key)e.classList.add("is-done")})}catch{}}
function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
function completed(){
done=true;stage.replaceChildren(make("div","sim-complete-art","✓ Prática concluída"));
title.textContent="Você concluiu todas as marcações";body.textContent="Você percorreu as orientações do modo Ler na mesma ordem. Nenhuma informação do CRM foi alterada.";
prompt.textContent="Você pode repetir a prática ou seguir para outra aula.";tip.hidden=true;message("Todas as indicações concluídas.","correct");
count.textContent=total+" de "+total+" indicações";progress.setAttribute("aria-valuenow",String(steps.length));bar.style.width="100%";back.disabled=false;next.hidden=true;repeat.hidden=false;finish.hidden=false;save();
}
function render(){
if(stepIndex>=steps.length){completed();return}
done=false;satisfied=false;
const s=current(),m=marker(),t=actTarget(),hasImage=validImage(s.image);
const pos=numberBefore(stepIndex)+markIndex+1;
title.textContent=s.title||"Etapa "+(stepIndex+1);
body.textContent=s.text||"Observe a tela ilustrativa.";
count.textContent="Indicação "+pos+" de "+total+" · Tela "+(stepIndex+1)+" de "+steps.length;
progress.setAttribute("aria-valuenow",String(stepIndex));bar.style.width=(100*(pos-1)/total)+"%";
back.disabled=stepIndex===0&&markIndex===0;next.hidden=false;next.disabled=false;
repeat.hidden=true;finish.hidden=true;
tip.replaceChildren();if(s.tip){tip.append(make("strong",null,"Para lembrar"),make("p",null,s.tip));tip.hidden=false}else tip.hidden=true;
stage.replaceChildren();message("");
if(m){
prompt.textContent="Marcação "+(markIndex+1)+": "+(m.label||"Observe a região destacada.")+(t?" Selecione a área indicada na tela.":" Esta é uma indicação de leitura; observe e avance.");
next.textContent=t?"Continuar após a ação →":"Entendi, continuar →";
next.disabled=!!t;
}else{prompt.textContent="Observe a captura e leia a orientação. Em seguida, avance.";next.textContent="Continuar →"}
if(!hasImage){stage.append(make("p","sim-empty","Imagem indisponível. A orientação permanece legível."));next.disabled=false;return}
const photo=make("div","sim-photo"),img=make("img");
img.src=s.image;img.alt="Tela ilustrativa: "+title.textContent;img.width=W;img.height=H;img.loading="eager";
img.addEventListener("error",()=>{photo.replaceChildren(make("p","sim-empty","Imagem indisponível. Continue usando as orientações."));next.disabled=false;message("A captura não carregou; a etapa pode ser avançada.")},{once:true});
photo.append(img);
if(m){
const region=make("div","sim-guided-region");
region.style.left=pct(m.x,W);region.style.top=pct(m.y,H);region.style.width=pct(m.w,W);region.style.height=pct(m.h,H);
photo.append(region);
const badge=make("span","sim-guided-badge",String(markIndex+1));
badge.style.left=pct(Math.max(18,Math.min(W-18,m.x)),W);
badge.style.top=pct(Math.max(18,Math.min(H-18,m.y)),H);
badge.setAttribute("aria-hidden","true");photo.append(badge);
if(t){
const hit=make("button","sim-guided-hit");
hit.type="button";hit.dataset.simAction="hit";hit.setAttribute("aria-label","Selecionar marcação "+(markIndex+1)+": "+(m.label||s.title));
hit.style.left=pct(m.x,W);hit.style.top=pct(m.y,H);hit.style.width=pct(m.w,W);hit.style.height=pct(m.h,H);
photo.append(hit);
}
}
stage.append(photo);
}
function advance(){if(done)return;const marks=current().marks;if(markIndex+1<Math.max(1,marks.length))markIndex++;else{stepIndex++;markIndex=0}render()}
root.addEventListener("click",event=>{
const el=event.target instanceof Element?event.target:null;if(!el)return;
const action=el.closest("[data-sim-action]")?.getAttribute("data-sim-action");
if(action==="repeat"){stepIndex=0;markIndex=0;render();return}
if(action==="back"){if(done){stepIndex=steps.length-1;markIndex=Math.max(0,current().marks.length-1)}else if(markIndex>0)markIndex--;else if(stepIndex>0){stepIndex--;markIndex=Math.max(0,current().marks.length-1)}render();return}
if(action==="next"){if(!next.disabled)advance();return}
if(action==="hit"&&!satisfied){satisfied=true;el.disabled=true;el.classList.add("sim-hit-correct");next.disabled=false;next.textContent="Próxima indicação →";message("Correto. Leia a orientação e avance quando estiver pronto.","correct");return}
if(el.closest(".sim-photo")&&actTarget()&&!satisfied)message("Observe a marcação numerada e selecione a área destacada.","incorrect");
});
progress.setAttribute("aria-valuemax",String(steps.length));
root.classList.add("sim-ready");render();
})();