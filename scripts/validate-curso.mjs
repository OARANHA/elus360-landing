import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const course = JSON.parse(readFileSync(new URL("../lib/curso-publico.json", import.meta.url), "utf8"));
const modules = course.groups.flatMap((g) => g.modules);
const lessons = modules.flatMap((m) => m.lessons);
const source = readFileSync(new URL("../app/curso/route.ts", import.meta.url), "utf8");

assert.equal(modules.length, 35, "Somente 35 módulos do curso público");
assert.equal(lessons.length, 173, "Somente 173 aulas do curso público");
assert.equal(course.segments.length, 10, "10 segmentos fictícios");
assert.equal(course.segments.flatMap((s) => s.journeys).length, 30, "30 jornadas fictícias");

const restricted = new Set(["webhooks", "api-tokens", "trunk-sip", "servidor-mcp-externo", "extensoes", "dados-externos"]);
const removedSteps = new Set([
  "agentes--identidade-e-inteligencia--p2",
  "agentes--instrucoes-e-capacidades--p2",
  "agentes--bastidores-e-abas--p4",
  "agentes--bastidores-e-abas--p7",
  "casos--conversar-sobre-o-caso--p2",
  "casos--conversar-sobre-o-caso--p3",
]);
const hiddenScreenshots = new Set(["agentes--conhecendo-os-agentes--p1","agentes--conhecendo-os-agentes--p2","agentes--conhecendo-os-agentes--p4","agentes--menu-do-cartao--p1","agentes--menu-do-cartao--p2","agentes--menu-do-cartao--p3"]);
const seenHidden = new Set();
const paths = new Set();
let annotatedCaptures = 0, totalAnnotations = 0;
let clickableSteps = 0, lessonsWithPractice = 0;
const checkAnnotations = (item, key) => {
  assert(Array.isArray(item.marks), "Sem campo marks em " + key);
  if (!item.image) {
    assert.equal(item.marks.length, 0, "Etapa sem imagem não deve ter marcações: " + key);
    return;
  }
  assert(item.marks.length > 0, "Imagem sem marcações: " + key);
  annotatedCaptures++;
  for (const mark of item.marks) {
    assert(["caixa", "seta", "numero"].includes(mark.type), "Tipo de marcação inválido: " + key);
    assert(typeof mark.label === "string" && mark.label.trim(), "Legenda vazia: " + key);
    for (const k of ["x", "y", "w", "h"]) assert(Number.isFinite(mark[k]), "Coordenada inválida: " + key);
    assert(mark.x >= 0 && mark.y >= 0 && mark.w > 0 && mark.h > 0, "Caixa negativa: " + key);
    assert(mark.x + mark.w <= 1440 && mark.y + mark.h <= 900, "Caixa fora de 1440x900: " + key);
    totalAnnotations++;
  }
};
const lessonKeys = new Set();
for (const module of modules) {
  assert(!module.id.startsWith("admin-"), "Nenhum módulo de /admin");
  assert(!restricted.has(module.id), "Nenhuma integração avançada sem validação");
  for (const lesson of module.lessons) {
    let lessonClickable = 0;
    const lessonKey = module.id + "/" + lesson.id;
    assert(!lessonKeys.has(lessonKey), "Aula duplicada " + lessonKey);
    lessonKeys.add(lessonKey);
    for (const step of lesson.steps) {
      assert(!removedSteps.has(module.id + "--" + lesson.id + "--" + step.id), "Passo de provedor IA proibido");
      const imageKey = module.id + "--" + lesson.id + "--" + step.id;
      checkAnnotations(step, imageKey);
      const target = step.target;
      assert(target === null || typeof target === "object", "Target inválido: " + imageKey);
      if (target !== null) {
        assert(!!step.image, "Não simular captura restrita: " + imageKey);
        for (const coordinate of ["x", "y", "w", "h"])
          assert(Number.isFinite(target[coordinate]), "Coordenada interativa inválida: " + imageKey);
        assert(target.x >= 0 && target.y >= 0 && target.w > 0 && target.h > 0, "Área de clique negativa: " + imageKey);
        assert(target.x + target.w <= 1440 && target.y + target.h <= 900, "Clique fora da tela: " + imageKey);
        clickableSteps++;
        lessonClickable++;
      }
      if (!step.image) {
        assert(hiddenScreenshots.has(imageKey), "Imagem vazia sem revisão: " + imageKey);
        seenHidden.add(imageKey);
        continue;
      }
      assert(!hiddenScreenshots.has(imageKey), "Imagem sensível reapareceu: " + imageKey);
      assert(!paths.has(step.image), "Imagem duplicada " + step.image);
      assert(/^\/curso\/capturas\/[a-z0-9-]+_elus\.png$/i.test(step.image), "Caminho inválido " + step.image);
      paths.add(step.image);
    }
    if (lessonClickable > 0) lessonsWithPractice++;
  }
}
for (const segment of course.segments) {
  for (const journey of segment.journeys) {
    for (const scene of journey.scenes) {
      checkAnnotations(scene, segment.id + "--" + journey.id + "--" + scene.id);
      assert(!paths.has(scene.image), "Imagem de jornada duplicada " + scene.image);
      assert(/^\/curso\/capturas\/[a-z0-9-]+_elus\.png$/i.test(scene.image), "Caminho inválido " + scene.image);
      paths.add(scene.image);
    }
  }
}
assert.equal(seenHidden.size, 6, "Seis capturas retidas");
assert.equal(paths.size, 838, "838 imagens aprovadas com sufixo _elus");
assert.equal(annotatedCaptures, 838, "Todas as fotos públicas têm marcações");
assert.equal(totalAnnotations, 1546, "Geometria didática preservada nas 838 imagens");
assert.equal(clickableSteps, 234, "234 alvos de prática do HTML original");
assert.equal(lessonsWithPractice, 128, "128 aulas possuem interação de clique");
assert(source.includes('data-sim-root'), "Simulador não montado na rota");
assert(source.includes('mode=simular'), "Link do modo Simular ausente");
assert(source.includes('simulator.js'), "Código do simulador não carregado");
assert(source.includes('type="application/json"'), "Dados de exercício não estão inertes");

assert(!/\btenants?\b|\/admin\//i.test(JSON.stringify(course)), "Nenhuma referência interna a tenants ou /admin");
assert(!/<(?:video|iframe)[\s>]/i.test(source), "Aulas sem vídeo ou embeds");
assert(!/youtube|vimeo/i.test(source), "Sem integração de players");
assert(!/admin\/|tenants|platform.admin/i.test(source), "Sem área de administração interna");
console.log("CURSO_ELUS360_CONTRACT_GREEN: módulos=35 aulas=173 jornadas=30 imagens=838 anotações=1546 cliques=234 aulas-praticas=128 admin=0 vídeos=0");
