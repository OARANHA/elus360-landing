/**
 * Auditoria SOMENTE LEITURA do curso público ELUS360 contra uma fonte Git
 * OARANHA/elus360 já clonada e resolvida para um SHA completo.
 *
 * Mantém editorial, jornadas, screenshots, estados e módulos privados intactos.
 * O resultado lista diferenças por IDs/campos, não contém textos de alunos,
 * contas, credenciais, fotos nem conteúdo integral das lições.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SHA = /^[0-9a-f]{40}$/;
const SLUG = /^[a-z0-9-]+$/;
const norm = (s) => String(s ?? "").normalize("NFC").replace(/\s+/g, " ").trim();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJSON(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function asList(value, label) {
  assert(Array.isArray(value), `${label}: array ausente`);
  return value;
}

function same(a, b) {
  return norm(a) === norm(b);
}

function uniqueById(entries, label) {
  const map = new Map();
  for (const item of asList(entries, label)) {
    assert(item && typeof item === "object" && typeof item.id === "string" && SLUG.test(item.id),
      `${label}: id inválido`);
    assert(!map.has(item.id), `${label}: id duplicado ${item.id}`);
    map.set(item.id, item);
  }
  return map;
}

export function auditCourse({ curriculum, readSourceModule, sourceSha, siteSha }) {
  assert(SHA.test(sourceSha), "SHA da fonte CRM inválido (40 hex)");
  assert(SHA.test(siteSha), "SHA da fonte site inválido (40 hex)");
  const groups = asList(curriculum?.groups, "groups");
  const publicModules = groups.flatMap((g) => asList(g.modules, "modules"));
  const byModule = uniqueById(publicModules, "módulos públicos");
  const results = [];
  let unchanged = 0, changed = 0, absent = 0, lessonsMissing = 0;
  for (const [id, shown] of byModule) {
    const source = readSourceModule(id);
    if (!source) {
      absent++;
      results.push({ id, status: "fonte_ausente", fields: ["modulo"] });
      continue;
    }
    assert(source.id === id, `id divergente no módulo ${id}`);
    const sourceLessons = uniqueById(source.licoes, `lições CRM ${id}`);
    const publicLessons = uniqueById(shown.lessons, `lições públicas ${id}`);
    const reasons = new Set();
    if (!same(source.titulo, shown.title)) reasons.add("titulo_modulo");
    if (!same(source.resumo, shown.summary)) reasons.add("resumo_modulo");
    for (const [lessonId, lesson] of publicLessons) {
      const from = sourceLessons.get(lessonId);
      if (!from) {
        lessonsMissing++;
        reasons.add("licao_sem_correspondencia");
        continue;
      }
      if (!same(from.titulo, lesson.title) || !same(from.objetivo, lesson.objective)) reasons.add("texto_licao");
      const sourceSteps = uniqueById(from.passos, `passos CRM ${id}/${lessonId}`);
      const publicSteps = uniqueById(lesson.steps, `passos públicos ${id}/${lessonId}`);
      for (const [stepId, step] of publicSteps) {
        const sourceStep = sourceSteps.get(stepId);
        if (!sourceStep) { reasons.add("passo_sem_correspondencia"); continue; }
        if (!same(sourceStep.titulo, step.title) ||
            !same(sourceStep.texto, step.text) ||
            !same(sourceStep.dica, step.tip)) reasons.add("texto_passo");
      }
      if (sourceSteps.size !== publicSteps.size) reasons.add("quantidade_passos");
    }
    if (publicLessons.size !== sourceLessons.size) reasons.add("quantidade_licoes");
    const fields = [...reasons].sort();
    if (fields.length) changed++; else unchanged++;
    results.push({ id, status: fields.length ? "revisao_candidata" : "texto_equivalente", fields });
  }
  assert(results.length > 0, "nenhum módulo público para auditar");
  return {
    schema: 1,
    kind: "auditoria_read_only_nao_publicacao",
    site_commit: siteSha,
    crm_commit: sourceSha,
    site_catalog_source_version: curriculum.sourceVersion ?? null,
    public_modules: results.length,
    equivalent_modules: unchanged,
    candidate_modules: changed,
    missing_source_modules: absent,
    lessons_missing_in_source: lessonsMissing,
    candidates: results.filter((r) => r.status !== "texto_equivalente"),
    warnings: [
      "Comparação textual por ID: não comprova comportamento, permissão, screenshot ou publicação.",
      "Diferenças podem ser curadoria legítima; revisão humana é obrigatória antes de alterar o site.",
      "Nunca adicionar módulos CRM ausentes do currículo público nem copiar imagens automaticamente.",
      "Commit do site aqui é o checkout auditado, não o SHA de deploy confirmado.",
    ],
  };
}

export function auditFromDirectory({ siteRoot, crmRoot, sourceSha, siteSha }) {
  const curriculum = readJSON(path.join(siteRoot, "lib/curso-publico.json"));
  const lessonRoot = path.resolve(crmRoot, "curso/licoes");
  const names = new Set(readdirSync(lessonRoot).filter((f) => /^[a-z0-9-]+\.json$/.test(f)));
  const readSourceModule = (id) => names.has(`${id}.json`) ? readJSON(path.join(lessonRoot, `${id}.json`)) : null;
  return auditCourse({ curriculum, readSourceModule, sourceSha, siteSha });
}

const isEntrypoint = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isEntrypoint) {
  try {
    const [crmRoot, sourceSha, siteSha, destination] = process.argv.slice(2);
    assert(crmRoot && sourceSha && siteSha && destination, "uso: node scripts/auditar-curso-fonte.mjs <crm-clone> <crm-SHA> <site-SHA> <destino.json>");
    const report = auditFromDirectory({ siteRoot: process.cwd(), crmRoot, sourceSha, siteSha });
    writeFileSync(destination, JSON.stringify(report, null, 2) + "\n", { flag: "wx", mode: 0o600 });
    process.stdout.write(JSON.stringify({
      crm_commit: report.crm_commit,
      site_commit: report.site_commit,
      public_modules: report.public_modules,
      candidate_modules: report.candidate_modules,
      missing_source_modules: report.missing_source_modules,
      report_written: true,
      publication_changed: false,
    }) + "\n");
  } catch (error) {
    process.stderr.write(`Auditoria recusada: ${error instanceof Error ? error.message : "erro desconhecido"}\n`);
    process.exitCode = 1;
  }
}
