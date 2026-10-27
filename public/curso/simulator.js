/* Curso ELUS360 — treino local sobre capturas estáticas. Nenhuma chamada ao CRM. */
(() => {
  "use strict";
  const root = document.querySelector("[data-sim-root]");
  const source = document.getElementById("course-sim-data");
  if (!root || !source) return;

  let data;
  try { data = JSON.parse(source.textContent || "{}"); } catch { return; }
  if (!Array.isArray(data.steps) || !data.steps.length || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(data.key || "")) return;

  const $ = (selector) => root.querySelector(selector);
  const stage = $("[data-sim-image]"), title = $("[data-sim-title]"), text = $("[data-sim-text]");
  const tip = $("[data-sim-tip]"), count = $("[data-sim-count]");
  const prompt = $("[data-sim-prompt]"), feedback = $("[data-sim-feedback]");
  const progress = $("[data-sim-progress]"), bar = $("[data-sim-progress-bar]");
  const previous = $('[data-sim-action="back"]'), next = $('[data-sim-action="next"]');
  const restart = $('[data-sim-action="repeat"]'), finished = $("[data-sim-finish]");
  if (![stage,title,text,tip,count,prompt,feedback,progress,bar,previous,next,restart,finished].every(Boolean)) return;

  const W = 1440, H = 900;
  const validImage = (v) => typeof v === "string" && /^\/curso\/capturas\/[a-z0-9-]+_elus\.png$/i.test(v);
  const validTarget = (b) => b && ["x","y","w","h"].every(k => Number.isFinite(b[k]))
    && b.x >= 0 && b.y >= 0 && b.w > 0 && b.h > 0 && b.x + b.w <= W && b.y + b.h <= H;
  const pct = (n, max) => (100 * n / max).toFixed(5) + "%";
  const prefersReducedMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const completionKey = "elus360:curso:concluidas:v1";

  let index = 0, locked = false, timer = null, waitingForTarget = false;
  function message(value, kind = "") { feedback.textContent = value; feedback.dataset.kind = kind; }
  function cancelAdvance() {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    locked = false;
  }
  function saveCompletion() {
    try {
      const raw = JSON.parse(localStorage.getItem(completionKey) || "[]");
      const done = new Set(Array.isArray(raw) ? raw.filter(v => typeof v === "string") : []);
      done.add(data.key);
      localStorage.setItem(completionKey, JSON.stringify([...done]));
      // Atualiza marcadores no índice da aula na mesma página, se presentes.
      document.querySelectorAll("[data-done-for]").forEach(el => {
        if (el.getAttribute("data-done-for") === data.key) el.classList.add("is-done");
      });
    } catch { /* Navegação privada ou storage bloqueado não impedem o exercício. */ }
  }
  function endLesson() {
    cancelAdvance();
    waitingForTarget = false;
    stage.replaceChildren();
    const end = document.createElement("div");
    end.className = "sim-complete-art";
    const check = document.createElement("span");
    check.textContent = "✓"; check.setAttribute("aria-hidden", "true");
    const heading = document.createElement("strong"); heading.textContent = "Prática concluída";
    end.append(check,heading);
    stage.append(end);
    title.textContent = "Você concluiu a prática!";
    text.textContent = "Você percorreu todos os passos ilustrativos. Nenhuma informação do seu CRM foi alterada.";
    tip.hidden = true;
    prompt.textContent = "Você pode repetir o treinamento ou continuar para outra aula.";
    count.textContent = data.steps.length + " de " + data.steps.length + " etapas";
    progress.setAttribute("aria-valuenow", String(data.steps.length));
    bar.style.width = "100%";
    message("Prática concluída com sucesso.", "correct");
    previous.disabled = index <= 0;
    next.hidden = true;
    restart.hidden = false;
    finished.hidden = false;
    saveCompletion();
  }
  function render() {
    cancelAdvance();
    if (index >= data.steps.length) { endLesson(); return; }
    const step = data.steps[index];
    const hasImage = validImage(step.image);
    const hasTarget = hasImage && validTarget(step.target);
    waitingForTarget = hasTarget;
    title.textContent = step.title || "Etapa " + (index + 1);
    text.textContent = step.text || "Observe a captura ilustrativa.";
    count.textContent = "Etapa " + (index + 1) + " de " + data.steps.length;
    progress.setAttribute("aria-valuenow", String(index));
    bar.style.width = (100 * index / data.steps.length) + "%";
    previous.disabled = index === 0;
    next.hidden = false; next.disabled = false;
    restart.hidden = true; finished.hidden = true;
    next.textContent = hasTarget ? "Pular etapa →" : "Continuar →";
    prompt.textContent = hasTarget
      ? "Localize e clique na região que está pulsando na captura."
      : "Observe a tela e clique em Continuar para avançar.";
    message("");
    tip.replaceChildren();
    if (step.tip) {
      const name = document.createElement("strong"); name.textContent = "Dica";
      const body = document.createElement("p"); body.textContent = step.tip;
      tip.append(name, body); tip.hidden = false;
    } else tip.hidden = true;

    stage.replaceChildren();
    if (!hasImage) {
      const empty = document.createElement("p");
      empty.className = "sim-empty";
      empty.textContent = "Captura desta etapa em revisão. Leia o texto acima e continue.";
      stage.append(empty);
      return;
    }
    const photo = document.createElement("div"); photo.className = "sim-photo";
    const image = document.createElement("img"); image.src = step.image;
    image.alt = "Captura para praticar: " + (step.title || "Etapa " + (index + 1));
    image.width = W; image.height = H; image.loading = "eager"; image.decoding = "async";
    image.addEventListener("error", () => {
      waitingForTarget = false;
      photo.replaceChildren();
      const missing = document.createElement("p");
      missing.className = "sim-empty";
      missing.textContent = "A imagem não carregou. Você pode continuar sem penalidade.";
      photo.append(missing);
      prompt.textContent = "Avance para a próxima etapa usando Continuar.";
      next.textContent = "Continuar →";
    }, { once: true });
    photo.append(image);
    if (hasTarget) {
      const target = document.createElement("button");
      target.type = "button";
      target.className = "sim-hitbox";
      target.dataset.simAction = "hit";
      target.setAttribute("aria-label", "Ponto correto: " + (step.title || "Etapa " + (index + 1)));
      target.style.left = pct(step.target.x + step.target.w / 2,W);
      target.style.top = pct(step.target.y + step.target.h / 2,H);
      target.style.width = "max(40px, " + pct(step.target.w + 8,W) + ")";
      target.style.height = "max(40px, " + pct(step.target.h + 8,H) + ")";
      photo.append(target);
      photo.classList.add("is-interactive");
    }
    stage.append(photo);
  }
  function advance() {
    cancelAdvance();
    index++;
    render();
  }
  root.addEventListener("click", event => {
    const clicked = event.target instanceof Element ? event.target : null;
    if (!clicked) return;
    const action = clicked.closest("[data-sim-action]")?.getAttribute("data-sim-action");
    if (action === "back") {
      if (!locked) { index = Math.max(0,index - 1); render(); }
      return;
    }
    if (action === "repeat") { index = 0; render(); return; }
    if (action === "next") { advance(); return; }
    if (action === "hit" && !locked && waitingForTarget) {
      locked = true;
      clicked.disabled = true;
      clicked.classList.add("sim-hit-correct");
      message("Correto! Você encontrou o controle.", "correct");
      if (prefersReducedMotion) {
        // Deixa a pessoa perceber o acerto sem animar ou exigir reação rápida.
        next.hidden = false;
        next.textContent = "Próxima etapa →";
        locked = false;
        waitingForTarget = false;
      } else timer = setTimeout(advance, 650);
      return;
    }
    if (clicked.closest(".sim-photo.is-interactive") && waitingForTarget && !locked) {
      message("Ainda não é aí. Encontre a região destacada.", "incorrect");
      const photo = clicked.closest(".sim-photo");
      if (!prefersReducedMotion && photo) {
        photo.classList.remove("sim-wrong");
        void photo.offsetWidth;
        photo.classList.add("sim-wrong");
      }
    }
  });

  root.classList.add("sim-ready");
  render();
})();
