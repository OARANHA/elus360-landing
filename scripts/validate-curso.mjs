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
const paths = new Set();
const lessonKeys = new Set();
for (const module of modules) {
  assert(!module.id.startsWith("admin-"), "Nenhum módulo de /admin");
  assert(!restricted.has(module.id), "Nenhuma integração avançada sem validação");
  for (const lesson of module.lessons) {
    const lessonKey = module.id + "/" + lesson.id;
    assert(!lessonKeys.has(lessonKey), "Aula duplicada " + lessonKey);
    lessonKeys.add(lessonKey);
    for (const step of lesson.steps) {
      assert(!removedSteps.has(module.id + "--" + lesson.id + "--" + step.id), "Passo de provedor IA proibido");
      assert(!paths.has(step.image), "Imagem duplicada " + step.image);
      assert(/^\/curso\/capturas\/[a-z0-9-]+_elus\.jpg$/i.test(step.image), "Caminho inválido " + step.image);
      paths.add(step.image);
    }
  }
}
for (const segment of course.segments) {
  for (const journey of segment.journeys) {
    for (const scene of journey.scenes) {
      assert(!paths.has(scene.image), "Imagem de jornada duplicada " + scene.image);
      assert(/^\/curso\/capturas\/[a-z0-9-]+_elus\.jpg$/i.test(scene.image), "Caminho inválido " + scene.image);
      paths.add(scene.image);
    }
  }
}
assert.equal(paths.size, 844, "844 imagens aprovadas com sufixo _elus");
assert(!/\btenants?\b|\/admin\//i.test(JSON.stringify(course)), "Nenhuma referência interna a tenants ou /admin");
assert(!/<(?:video|iframe)[\s>]/i.test(source), "Aulas sem vídeo ou embeds");
assert(!/youtube|vimeo/i.test(source), "Sem integração de players");
assert(!/admin\/|tenants|platform.admin/i.test(source), "Sem área de administração interna");
console.log("CURSO_ELUS360_CONTRACT_GREEN: módulos=35 aulas=173 jornadas=30 imagens=844 admin=0 vídeos=0");
