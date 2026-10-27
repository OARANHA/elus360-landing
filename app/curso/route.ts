import curriculum from "../../lib/curso-publico.json";

type Step = { id: string; title: string; text: string; tip: string; image: string; labels: string[] };
type Lesson = { id: string; title: string; objective: string; steps: Step[]; hasRevision: boolean };
type Module = { id: string; title: string; summary: string; lessons: Lesson[] };
type Group = { name: string; modules: Module[] };
type Scene = { id: string; title: string; customer: string; operation: string; value: string; image: string };
type Journey = { id: string; title: string; context: string; outcome: string; note: string; scenes: Scene[] };
type Segment = { id: string; title: string; summary: string; journeys: Journey[] };
const course = curriculum as unknown as { sourceVersion: string; groups: Group[]; segments: Segment[] };
const modules = course.groups.flatMap((group) => group.modules);
const allLessons = modules.flatMap((module) => module.lessons.map((lesson) => ({ module, lesson })));
const imgPath = (value: string) => value.startsWith("/curso/capturas/") && /_elus\.png$/i.test(value) ? value : "";
const esc = (value: unknown): string => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
const lessonHref = (module: Module, lesson: Lesson): string => "/curso?m=" + encodeURIComponent(module.id) + "&a=" + encodeURIComponent(lesson.id);
const moduleHref = (module: Module): string => "/curso?m=" + encodeURIComponent(module.id);
const journeyHref = (segment: Segment, journey: Journey): string => "/curso?segment=" + encodeURIComponent(segment.id) + "&journey=" + encodeURIComponent(journey.id);
const short = (s: string) => s.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const attributes = (s: string) => esc(short(s));

function screenshot(src: string, label: string, notes: string[] = []): string {
  if (!imgPath(src)) return "";
  return '<figure class="course-shot" data-image-figure>' +
    '<div class="shot-window"><div class="shot-top"><span></span><span></span><span></span><b>ELUS360 · Demonstração</b></div>' +
    '<img src="' + esc(src) + '" width="1440" height="900" loading="lazy" decoding="async" alt="' + esc(label) + '" data-shot>' +
    '<div class="shot-missing" role="note">Imagem ELUS360 aguardando envio.<small>O conteúdo escrito desta etapa continua disponível.</small></div></div>' +
    '<figcaption><span>' + esc(label) + '</span><button type="button" class="zoom-btn" data-zoom="' + esc(src) + '" data-label="' + esc(label) + '">Ampliar imagem <span aria-hidden="true">↗</span></button></figcaption>' +
    (notes.length ? '<ul class="shot-labels" aria-label="Pontos de atenção">' + notes.map((note) => '<li>' + esc(note) + '</li>').join("") + '</ul>' : "") +
    '</figure>';
}

function navigation(currentModule?: Module, currentLesson?: Lesson): string {
  return '<aside class="curriculum-aside" id="ementa" aria-label="Programa do curso">' +
    '<div class="aside-top"><p class="eyebrow">SEU GUIA DE APRENDIZAGEM</p><h2>Explore os módulos</h2>' +
    '<p>35 módulos · 173 aulas</p>' +
    '<label class="search-box" for="course-search"><span aria-hidden="true">⌕</span><span class="sr-only">Buscar aulas</span>' +
    '<input id="course-search" type="search" placeholder="Buscar assunto ou aula…" autocomplete="off"></label>' +
    '<p id="search-feedback" class="search-feedback" aria-live="polite"></p></div>' +
    '<nav aria-label="Módulos e aulas do curso">' +
    course.groups.map((group) => '<section class="aside-group"><h3>' + esc(group.name) + '</h3>' +
      group.modules.map((module) => '<details class="aside-module" data-module-filter ' + (module.id === currentModule?.id ? "open" : "") + '>' +
        '<summary><span>' + esc(module.title) + '</span><small>' + module.lessons.length + '</small></summary>' +
        '<ul>' + module.lessons.map((lesson) => '<li data-lesson-filter data-search="' + attributes(module.title + " " + lesson.title + " " + lesson.objective) + '">' +
          '<a href="' + lessonHref(module, lesson) + '" ' + (module.id === currentModule?.id && lesson.id === currentLesson?.id ? 'aria-current="page"' : "") +
          '><span class="done-dot" data-done-for="' + esc(module.id + "/" + lesson.id) + '" aria-hidden="true"></span>' +
          '<span>' + esc(lesson.title) + '</span></a></li>').join("") + '</ul></details>').join("") +
    '</section>').join("") + '</nav></aside>';
}

function modulesCatalog(): string {
  return course.groups.map((group) => '<section class="catalog-group" aria-labelledby="group-' + esc(group.name.replaceAll(" ", "-")) + '">' +
    '<div class="group-heading"><span class="group-stripe"></span><h3 id="group-' + esc(group.name.replaceAll(" ", "-")) + '">' + esc(group.name) + '</h3><span>' + group.modules.length + ' módulos</span></div>' +
    '<div class="module-grid">' + group.modules.map((module) => '<a class="module-card" href="' + moduleHref(module) + '" data-catalog-filter data-search="' + attributes(module.title + " " + module.summary + " " + module.lessons.map(l => l.title).join(" ")) + '">' +
      '<div class="module-icon" aria-hidden="true">↗</div><div><h4>' + esc(module.title) + '</h4><p>' + esc(module.summary) + '</p></div>' +
      '<div class="module-bottom"><span>' + module.lessons.length + ' aulas</span><b>Explorar <span aria-hidden="true">→</span></b></div></a>').join("") + '</div></section>').join("");
}

function catalogView(): string {
  return '<section class="course-hero" aria-labelledby="course-title"><div class="hero-noise" aria-hidden="true"></div>' +
    '<div class="hero-layout"><div class="hero-copy"><p class="hero-kicker"><span class="live-dot"></span> ACADEMIA ELUS360 · CURSO GRATUITO</p>' +
    '<h1 id="course-title">Domine a operação.<br><em>Destrave seu potencial.</em></h1>' +
    '<p>Aprenda a organizar seus clientes, atender melhor e colocar o CRM e a inteligência artificial para trabalhar com você. Um guia prático, com aulas em texto e capturas de cada tela.</p>' +
    '<div class="hero-actions"><a class="button button-light" href="#grade">Explorar aulas <span aria-hidden="true">↗</span></a>' +
    '<a class="button button-outline" href="/#contato">Falar com a ELUS360</a></div>' +
    '<p class="hero-aside">Estude no seu ritmo. Sem vídeos e sem precisar criar uma conta para ler.</p></div>' +
    '<div class="hero-visual" aria-hidden="true"><div class="hero-ambient"></div>' +
    '<div class="mini-label"><span>✦</span> APRENDIZAGEM APLICADA</div>' +
    '<div class="hero-demo-card"><div class="demo-top"><span>ELUS<span class="demo-360">360</span></span><i>Guia de uso</i></div>' +
    '<div class="demo-content"><div class="demo-left"><b>Trilha de aprendizagem</b><span class="demo-active">01 <strong>Atendimento</strong></span><span>02 <strong>CRM</strong></span><span>03 <strong>Agentes de IA</strong></span><span>04 <strong>Automação</strong></span></div>' +
    '<div class="demo-right"><span>PRÓXIMA CONQUISTA</span><b>Seu atendimento,<br>sob controle.</b><div class="demo-line"></div><div class="demo-line small"></div><div class="demo-pill">Comece pelas bases <span>↗</span></div></div></div></div>' +
    '<div class="floating-chip"><span aria-hidden="true">✧</span> Conteúdo visual + prática</div></div></div>' +
    '<div class="hero-stats"><span><b>35</b> módulos práticos</span><span><b>173</b> aulas em texto</span><span><b>30</b> jornadas ilustrativas</span></div></section>' +
    '<section class="catalog" id="grade" aria-labelledby="grade-title"><div class="section-head"><p class="eyebrow">A JORNADA COMEÇA AQUI</p>' +
    '<h2 id="grade-title">Tudo o que você precisa<br>para usar melhor o ELUS360.</h2>' +
    '<p>Escolha um módulo ou siga uma aula de cada vez. O curso ensina os recursos disponíveis na experiência do cliente — sem configurações internas da plataforma.</p></div>' +
    modulesCatalog() + '</section>' +
    '<section class="segment-section" id="jornadas" aria-labelledby="jornadas-title"><p class="eyebrow">DO CONTEÚDO À PRÁTICA</p>' +
    '<h2 id="jornadas-title">Veja o ELUS360 em ação</h2>' +
    '<p>Exemplos fictícios de atendimento em segmentos diferentes, com leitura guiada por cenas e imagens.</p><div class="segment-grid">' +
    course.segments.map((segment) => '<article class="segment-card"><div class="segment-number">' + String(course.segments.indexOf(segment) + 1).padStart(2, "0") + '</div><h3>' + esc(segment.title) + '</h3>' +
      '<p>' + esc(segment.summary) + '</p><ul>' + segment.journeys.map((journey) => '<li><a href="' + journeyHref(segment, journey) + '">' + esc(journey.title) + ' <span aria-hidden="true">↗</span></a></li>').join("") + '</ul></article>').join("") +
    '</div></section>' +
    '<section class="course-faq" aria-labelledby="faq-course"><h2 id="faq-course">Dúvidas rápidas</h2><details><summary>O curso é gratuito?</summary><p>Sim. O acesso ao conteúdo desta página é gratuito.</p></details>' +
    '<details><summary>Preciso assistir a vídeos?</summary><p>Não. Todas as aulas são apresentadas em texto, com imagens ilustrativas das telas.</p></details>' +
    '<details><summary>Vou aprender a configurar os modelos de IA?</summary><p>Não. A ELUS360 gerencia os provedores, modelos e credenciais de IA. Aqui você aprende a usar as funcionalidades disponibilizadas para sua empresa.</p></details>' +
    '<details><summary>O curso oferece certificado?</summary><p>Não há emissão de certificado nesta versão do curso.</p></details></section>';
}

function moduleView(module: Module): string {
  return '<div class="reader-head"><p class="eyebrow">MÓDULO · ' + esc(course.groups.find(g => g.modules.some(m => m.id === module.id))?.name) + '</p>' +
    '<div class="breadcrumbs"><a href="/curso">Curso ELUS360</a><span aria-hidden="true">/</span><span>' + esc(module.title) + '</span></div>' +
    '<h1>' + esc(module.title) + '</h1><p class="reader-lead">' + esc(module.summary) + '</p><div class="reader-meta"><span>' + module.lessons.length + ' aulas</span><span>Leitura + imagens</span><span>Gratuito</span></div></div>' +
    '<section class="module-lesson-list" aria-labelledby="module-list-title"><h2 id="module-list-title">Aulas deste módulo</h2><ol>' +
    module.lessons.map((lesson, i) => '<li><a href="' + lessonHref(module, lesson) + '"><span class="lesson-index">' + String(i + 1).padStart(2, "0") + '</span>' +
      '<span><strong>' + esc(lesson.title) + '</strong><small>' + esc(lesson.objective) + '</small></span><span aria-hidden="true">↗</span></a></li>').join("") + '</ol></section>' +
    '<div class="bottom-nav"><a class="button button-main" href="' + lessonHref(module, module.lessons[0]) + '">Começar este módulo <span aria-hidden="true">→</span></a></div>';
}

function lessonView(module: Module, lesson: Lesson): string {
  const number = module.lessons.indexOf(lesson) + 1;
  const at = allLessons.findIndex(e => e.module.id === module.id && e.lesson.id === lesson.id);
  const before = allLessons[at - 1], after = allLessons[at + 1];
  return '<div class="reader-head"><div class="breadcrumbs"><a href="/curso">Curso</a><span aria-hidden="true">/</span><a href="' + moduleHref(module) + '">' + esc(module.title) + '</a><span aria-hidden="true">/</span><span>Aula ' + number + '</span></div>' +
    '<p class="eyebrow">AULA ' + String(number).padStart(2, "0") + ' / ' + String(module.lessons.length).padStart(2, "0") + ' · ' + esc(module.title) + '</p><h1>' + esc(lesson.title) + '</h1><p class="reader-lead">' + esc(lesson.objective) + '</p>' +
    '<div class="lesson-toolbar"><span>Guia passo a passo · ' + lesson.steps.length + ' etapas disponíveis</span><button type="button" class="mark-read" data-mark-read="' + esc(module.id + "/" + lesson.id) + '" hidden>Marcar como concluída</button></div></div>' +
    (lesson.hasRevision ? '<div class="revision-note" role="note"><strong>Conteúdo em atualização.</strong> Etapas sobre configuração de provedores e modelos de IA foram retiradas. A ELUS360 gerencia essas configurações; as orientações disponíveis aqui continuam acessíveis.</div>' : "") +
    '<article class="lesson-body">' + lesson.steps.map((step, idx) => '<section class="lesson-step" id="etapa-' + esc(step.id) + '" aria-labelledby="step-title-' + esc(step.id) + '">' +
      '<div class="step-index">' + String(idx + 1).padStart(2, "0") + '</div><div class="step-contents"><h2 id="step-title-' + esc(step.id) + '">' + esc(step.title) + '</h2>' +
      '<p>' + esc(step.text) + '</p>' + (step.tip ? '<aside class="lesson-tip"><strong>Para lembrar</strong><p>' + esc(step.tip) + '</p></aside>' : "") +
      screenshot(step.image, step.title, step.labels) + '</div></section>').join("") + '</article>' +
    '<nav class="bottom-nav" aria-label="Navegar entre aulas">' +
    (before ? '<a class="prev-lesson" href="' + lessonHref(before.module, before.lesson) + '"><small>← Aula anterior</small><b>' + esc(before.lesson.title) + '</b></a>' : '<a class="prev-lesson" href="/curso"><small>← Voltar</small><b>Todos os módulos</b></a>') +
    (after ? '<a class="next-lesson" href="' + lessonHref(after.module, after.lesson) + '"><small>Próxima aula →</small><b>' + esc(after.lesson.title) + '</b></a>' : '<a class="next-lesson" href="/curso"><small>Você chegou ao fim</small><b>Voltar aos módulos →</b></a>') +
    '</nav>';
}

function journeyView(segment: Segment, journey: Journey): string {
  return '<div class="reader-head"><div class="breadcrumbs"><a href="/curso">Curso</a><span aria-hidden="true">/</span><a href="/curso#jornadas">Jornadas</a><span aria-hidden="true">/</span><span>' + esc(segment.title) + '</span></div>' +
    '<p class="eyebrow">EXEMPLO ILUSTRATIVO · ' + esc(segment.title) + '</p><h1>' + esc(journey.title) + '</h1><p class="reader-lead">' + esc(journey.context) + '</p>' +
    '<p class="demo-disclaimer">Simulação fictícia para fins de aprendizagem, não um caso real de cliente nem resultado garantido.</p></div>' +
    '<article class="lesson-body">' + journey.scenes.map((scene, i) => '<section class="lesson-step"><span class="step-index">' + String(i + 1).padStart(2, "0") + '</span><div class="step-contents"><h2>' + esc(scene.title) + '</h2>' +
      '<p>' + esc(scene.customer) + '</p><div class="lesson-tip"><strong>Como a operação funciona</strong><p>' + esc(scene.operation) + '</p></div>' +
      '<p>' + esc(scene.value) + '</p>' + screenshot(scene.image, scene.title) + '</div></section>').join("") +
    '</article><nav class="bottom-nav"><a class="button button-main" href="/curso#jornadas">Explorar outras jornadas <span aria-hidden="true">→</span></a></nav>';
}

function bottomCta(): string {
  return '<section class="end-cta"><div><p class="eyebrow">PRONTO PARA COLOCAR EM PRÁTICA?</p><h2>Aprender é o começo.<br><em>Evoluir é o próximo passo.</em></h2>' +
    '<p>Conheça como o ELUS360 reúne atendimento, CRM, automações e IA para sua empresa.</p></div>' +
    '<a class="button button-light" href="/#contato">Conversar com a ELUS360 <span aria-hidden="true">↗</span></a></section>';
}

function render(request: Request): string {
  const url = new URL(request.url);
  const module = modules.find(m => m.id === url.searchParams.get("m"));
  const lesson = module?.lessons.find(l => l.id === url.searchParams.get("a"));
  const segment = course.segments.find(s => s.id === url.searchParams.get("segment"));
  const journey = segment?.journeys.find(j => j.id === url.searchParams.get("journey"));
  const current = Boolean(module || journey);
  const title = lesson ? lesson.title + " · " + module?.title : module ? module.title : journey ? journey.title : "Curso gratuito de ELUS360";
  const description = lesson ? lesson.objective : module ? module.summary : journey ? journey.context : "Aprenda a usar o ELUS360: atendimento, CRM, agentes de IA, automações e muito mais. Curso gratuito com aulas em texto e imagens.";
  const canonical = "https://elus360.com.br/curso" + (lesson && module ? "?m=" + encodeURIComponent(module.id) + "&a=" + encodeURIComponent(lesson.id) : module ? "?m=" + encodeURIComponent(module.id) : journey && segment ? "?segment=" + encodeURIComponent(segment.id) + "&journey=" + encodeURIComponent(journey.id) : "");
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="description" content="' + esc(description) + '"><title>' + esc(title) + ' | ELUS360</title><link rel="canonical" href="' + esc(canonical) + '">' +
    '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(title + " | ELUS360") + '">' +
    '<meta property="og:description" content="' + esc(description) + '"><meta name="theme-color" content="#07152e">' +
    '<link rel="icon" href="/brand/elus-vertical.png"><link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">' +
    '<link rel="stylesheet" href="/curso/style.css"><script defer src="/curso/app.js"></script></head><body>' +
    '<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>' +
    '<header class="course-header"><div class="header-inner"><a class="course-brand" href="/" aria-label="ELUS360, voltar ao site comercial">' +
    '<img src="/brand/elus-vertical.png" width="38" height="38" alt=""><span>ELUS<span class="brand-360">360</span></span><small>ACADEMIA</small></a>' +
    '<nav class="header-links" aria-label="Menu principal"><a href="/curso" ' + (!current ? 'aria-current="page"' : "") + '>O curso</a><a href="/curso#grade">Módulos</a><a href="/curso#jornadas">Exemplos</a></nav>' +
    '<div class="header-actions"><a class="header-login" href="https://elus.wandora.com.br/login">Entrar</a><a class="button header-contact" href="/#contato">Falar com a ELUS360 <span aria-hidden="true">↗</span></a></div></div></header>' +
    '<div class="' + (current ? "reading-shell" : "home-shell") + '"><main id="conteudo" class="course-main">' +
    (lesson && module ? lessonView(module, lesson) : module ? moduleView(module) : journey && segment ? journeyView(segment, journey) : catalogView()) +
    (current ? bottomCta() : bottomCta()) + '</main>' +
    (current ? navigation(module, lesson) : "") + '</div>' +
    '<footer class="course-footer"><div><span>ELUS<span class="brand-360">360</span> · Academia</span><p>Conteúdo educativo. As telas e recursos disponíveis podem variar conforme a versão e as permissões da sua empresa.</p></div>' +
    '<nav aria-label="Rodapé"><a href="/">Site comercial</a><a href="/privacidade">Privacidade</a><a href="/#contato">Contato</a></nav></footer>' +
    '<dialog class="image-dialog" id="image-dialog" aria-label="Captura de tela ampliada"><button type="button" data-close-dialog>Fechar ×</button><img alt=""><p></p></dialog>' +
    '</body></html>';
}

export function GET(request: Request): Response {
  return new Response(render(request), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
}
