import test from "node:test";
import assert from "node:assert/strict";
import { auditCourse } from "../scripts/auditar-curso-fonte.mjs";

const sha = "a".repeat(40);
const site = "b".repeat(40);
function lesson(id = "primeira") {
  return { id, titulo: "Primeira aula", objetivo: "Objetivo", passos: [{ id: "p1", titulo: "Passo", texto: "Texto", dica: "Dica" }] };
}
function curriculum() {
  return {
    sourceVersion: "1.89.0 / 1.88.0",
    groups: [{ name: "CRM", modules: [{
      id: "inbox", title: "Inbox", summary: "Resumo",
      lessons: [{
        id: "primeira", title: "Primeira aula", objective: "Objetivo",
        steps: [{ id: "p1", title: "Passo", text: "Texto", tip: "Dica", image: "/curso/capturas/teste_elus.png" }],
      }],
    }] }],
    segments: [],
  };
}
function original() { return { id: "inbox", titulo: "Inbox", resumo: "Resumo", licoes: [lesson()] }; }
function run(publicCourse = curriculum(), source = original()) {
  return auditCourse({
    curriculum: publicCourse, readSourceModule: (id) => id === "inbox" ? source : null,
    sourceSha: sha, siteSha: site,
  });
}

test("sem mudanças indica equivalência textual sem alegar publicação", () => {
  const r = run();
  assert.equal(r.equivalent_modules, 1);
  assert.equal(r.candidate_modules, 0);
  assert.equal(r.kind, "auditoria_read_only_nao_publicacao");
  assert.equal(r.site_catalog_source_version, "1.89.0 / 1.88.0");
  assert.ok(!JSON.stringify(r).includes("imagem"));
});

test("diferença textual preserva dados editados, sem expor conteúdo no relatório", () => {
  const src = original();
  src.licoes[0].passos[0].texto = "Uma informação privada que não pode entrar no relatório";
  const r = run(curriculum(), src);
  assert.equal(r.candidate_modules, 1);
  assert.deepEqual(r.candidates[0].fields, ["texto_passo"]);
  assert.ok(!JSON.stringify(r).includes("informação privada"));
});

test("módulo público sem correspondente vira bloqueio verificável", () => {
  const r = run(curriculum(), null);
  assert.equal(r.missing_source_modules, 1);
  assert.equal(r.candidates[0].status, "fonte_ausente");
});

test("módulos administrativos da origem nunca são acrescentados ao público", () => {
  const r = run();
  assert.equal(r.public_modules, 1);
  assert.deepEqual(r.candidates, []);
});

test("diferença editorial de quantidade de passos e aulas é sinalizada sem cópia", () => {
  const src = original();
  src.licoes.push(lesson("nova"));
  src.licoes[0].passos.push({ id: "p2", titulo: "Outra etapa", texto: "Texto extra", dica: "" });
  const r = run(curriculum(), src);
  assert.deepEqual(r.candidates[0].fields, ["quantidade_licoes", "quantidade_passos"]);
});

test("SHAs ausentes ou com ref arbitrária recusam a auditoria", () => {
  assert.throws(() => auditCourse({ curriculum: curriculum(), readSourceModule: original, sourceSha: "main", siteSha: site }), /SHA da fonte/);
  assert.throws(() => auditCourse({ curriculum: curriculum(), readSourceModule: original, sourceSha: sha, siteSha: "latest" }), /SHA da fonte site/);
});

test("catálogo público vazio e IDs repetidos falham fechado", () => {
  assert.throws(() => run({ groups: [] }), /nenhum módulo/);
  const same = curriculum();
  same.groups.push({ name: "Duplicado", modules: [same.groups[0].modules[0]] });
  assert.throws(() => run(same), /id duplicado/);
});
