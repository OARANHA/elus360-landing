import { animate } from 'motion/mini';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sections = document.querySelectorAll('#diferenciais, #para-quem');

if (sections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const section = entry.target;
      section.classList.add('is-market-visible');

      if (!reduceMotion.matches && !section.dataset.motionPlayed) {
        section.dataset.motionPlayed = 'true';
        const cards = section.querySelectorAll('.d-card, .w-card');
        cards.forEach((card, index) => {
          animate(card, { opacity: [0.72, 1], y: [16, 0] }, {
            duration: 0.48,
            delay: Math.min(index * 0.055, 0.28),
            easing: [0.22, 1, 0.36, 1],
          });
        });
      }

      observer.unobserve(section);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('.w-card').forEach((card) => {
  const art = card.querySelector('.w-card-art');
  if (!art || reduceMotion.matches) return;

  card.addEventListener('pointerenter', () => {
    if (reduceMotion.matches) return;
    animate(art, { scale: 1.035 }, { duration: 0.28, easing: 'ease-out' });
  });
  card.addEventListener('pointerleave', () => {
    if (reduceMotion.matches) return;
    animate(art, { scale: 1 }, { duration: 0.32, easing: 'ease-out' });
  });
});
const heroPreview = document.querySelector(".hero-preview");
if (heroPreview) {
  if (!("IntersectionObserver" in window)) { heroPreview.dataset.motionState = "concluído"; } else {
  let entered = false;
  let entryAnimation;
  const setState = (state) => { heroPreview.dataset.motionState = state; };
  const reduceMotionChange = () => { if (!reduceMotion.matches) return; entryAnimation?.cancel(); setState("concluído"); };
  reduceMotion.addEventListener?.("change", reduceMotionChange);
  const heroObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting) || entered) return;
    entered = true; heroObserver.disconnect();
    if (reduceMotion.matches || !heroPreview.animate) { setState("concluído"); return; }
    setState("transição");
    entryAnimation = heroPreview.animate([{ opacity: 0.84, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
    entryAnimation.finished.then(() => setState("concluído")).catch(() => {});
  }, { threshold: 0.18 });
  if (reduceMotion.matches) setState("concluído");
  heroObserver.observe(heroPreview);
  }
}
