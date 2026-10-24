import { animate } from 'motion/mini';

const section = document.getElementById('agentes');
if (section) {
  const flow = section.querySelector('.agent-flow-shell');
  const cards = [...section.querySelectorAll('.flow-card')];
  const learning = [...section.querySelectorAll('.learning-step')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    flow?.classList.add('is-flow-ready');
    if (reduced.matches) return;
    cards.forEach((card, index) => animate(card,
      { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
      { duration: .55, delay: .12 + index * .11, ease: 'easeOut' }));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        reveal();
        observer.disconnect();
      }
    }, { threshold: .08 });
    observer.observe(section);
  } else reveal();

  section.addEventListener('elus:learning-step', event => {
    if (reduced.matches) return;
    const selected = learning[event.detail.index]?.querySelector('.learning-step-copy');
    if (selected) animate(selected,
      { opacity: [.7, 1], transform: ['translateY(8px)', 'translateY(0px)'] },
      { duration: .42, ease: 'easeOut' });
  });
}
