/* Melhorias progressivas: curso e aulas legíveis sem JavaScript. Sem vídeos. */
(() => {
  "use strict";
  document.body.classList.add("js-ready");

  const imageFigures = document.querySelectorAll("[data-image-figure]");
  imageFigures.forEach((figure) => {
    const image = figure.querySelector("[data-shot]");
    if (!image) return;
    const markMissing = () => figure.classList.add("is-missing");
    image.addEventListener("error", markMissing, { once: true });
    if (image.complete && image.naturalWidth === 0) markMissing();
  });

  const dialog = document.getElementById("image-dialog");
  const dialogImage = dialog?.querySelector("img");
  const dialogLabel = dialog?.querySelector("p");
  if (dialog && dialogImage && dialogLabel && typeof dialog.showModal === "function") {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-zoom]") : null;
      if (!target) return;
      const figure = target.closest("[data-image-figure]");
      if (figure?.classList.contains("is-missing")) return;
      const src = target.getAttribute("data-zoom") ?? "";
      if (!/^\/curso\/capturas\/[a-z0-9_-]+_elus\.png$/i.test(src)) return;
      dialogImage.src = src;
      dialogImage.alt = target.getAttribute("data-label") ?? "Captura de tela ELUS360";
      dialogLabel.textContent = dialogImage.alt;
      dialog.showModal();
    });
    dialog.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => dialogImage.removeAttribute("src"));
  }

  const search = document.getElementById("course-search");
  const feedback = document.getElementById("search-feedback");
  if (search) {
    const modules = Array.from(document.querySelectorAll("[data-module-filter]"));
    const initialOpen = new Set(modules.filter((m) => m.open));
    const normalize = (v) => v.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    search.addEventListener("input", () => {
      const query = normalize(search.value.trim());
      let matched = 0;
      modules.forEach((module) => {
        const lessons = Array.from(module.querySelectorAll("[data-lesson-filter]"));
        const moduleName = normalize(module.querySelector("summary")?.textContent ?? "");
        const matchModule = moduleName.includes(query);
        let visible = 0;
        lessons.forEach((lesson) => {
          const text = lesson.getAttribute("data-search") || "";
          const show = !query || matchModule || text.includes(query);
          lesson.hidden = !show;
          if (show) visible++;
        });
        module.hidden = visible === 0;
        if (query && visible) module.open = true;
        if (!query) module.open = initialOpen.has(module);
        matched += visible;
      });
      if (feedback) feedback.textContent = query ? (matched ? matched + " aulas encontradas" : "Nenhuma aula encontrada") : "";
    });
  }

  // Progresso puramente local: nenhum servidor, aluno ou matrícula implícitos.
  const storageKey = "elus360:curso:concluidas:v1";
  let completed;
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    completed = new Set(Array.isArray(parsed) ? parsed.filter(v => typeof v === "string") : []);
  } catch {
    completed = null;
  }
  const paintProgress = () => {
    if (!completed) return;
    document.querySelectorAll("[data-done-for]").forEach((marker) => {
      const done = completed.has(marker.getAttribute("data-done-for"));
      marker.classList.toggle("is-done", done);
      marker.setAttribute("title", done ? "Aula concluída neste navegador" : "Aula não marcada");
    });
    document.querySelectorAll("[data-mark-read]").forEach((button) => {
      const done = completed.has(button.getAttribute("data-mark-read"));
      button.hidden = false;
      button.setAttribute("aria-pressed", String(done));
      button.textContent = done ? "✓ Concluída neste navegador" : "Marcar como concluída";
    });
  };
  paintProgress();
  document.querySelectorAll("[data-mark-read]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!completed) return;
      const id = button.getAttribute("data-mark-read");
      if (!id) return;
      if (completed.has(id)) completed.delete(id);
      else completed.add(id);
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(completed))); }
      catch { completed = null; button.hidden = true; return; }
      paintProgress();
    });
  });
})();
