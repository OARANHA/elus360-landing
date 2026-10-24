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
    animate(art, { scale: 1.035 }, { duration: 0.28, easing: 'ease-out' });
  });
  card.addEventListener('pointerleave', () => {
    animate(art, { scale: 1 }, { duration: 0.32, easing: 'ease-out' });
  });
});
