/* Decorative circuit lines and flow entrances; content is readable without JS. */
import { animate } from 'motion/mini';

const section = document.getElementById('agentes');
if (section) {
  const flow = section.querySelector('.agent-flow-shell');
  const cards = [...section.querySelectorAll('.flow-card')];
  const wires = [...section.querySelectorAll('.agents-wire')];
  const dot = section.querySelector('.agent-line-dot');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let loops = [];
  let revealed = false;
  let inView = false;

  function stop() {
    loops.forEach(control => control.cancel());
    loops = [];
    if (dot) dot.style.opacity = '0';
  }

  function start() {
    if (!inView || reduced.matches || document.hidden || loops.length) return;
    wires.forEach((wire, index) => loops.push(animate(wire,
      { strokeDashoffset: ['0px', '-184px'] },
      { duration: 4.7 + index * .65, ease: 'linear', repeat: Infinity })));
    if (dot && window.innerWidth > 760) {
      dot.style.opacity = '.9';
      loops.push(animate(dot, { left: ['0%', '100%'] },
        { duration: 5.5, ease: 'linear', repeat: Infinity }));
    }
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    flow?.classList.add('is-flow-ready');
    if (reduced.matches || document.hidden) return;
    cards.forEach((card, index) => animate(card,
      { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
      { duration: .55, delay: .12 + index * .11, ease: 'easeOut' }));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      if (inView) { reveal(); start(); }
      else stop();
    }, { threshold: .08 });
    observer.observe(section);
  } else { inView = true; reveal(); start(); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  reduced.addEventListener?.('change', event => { if (event.matches) stop(); else start(); });
}
