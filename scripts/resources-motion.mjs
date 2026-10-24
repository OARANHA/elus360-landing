/* Progressive enhancement for the Recursos chapters with Motion's DOM API. */
import { animate } from 'motion/mini';

const section = document.getElementById('recursos');
if (section) {
  const stages = [...section.querySelectorAll('.resource-stage')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();

  function run(element, keyframes, options) {
    const control = animate(element, keyframes, options);
    running.add(control);
    control.finished.then(() => running.delete(control), () => running.delete(control));
    return control;
  }

  function reveal(stage) {
    stage.classList.add('is-inview');
    if (reduced.matches || document.hidden) return;
    run(stage, { opacity: [0, 1], transform: ['translateY(46px)', 'translateY(0px)'] },
      { duration: .8, ease: [.18, .74, .28, 1] });
    const pieces = [stage.querySelector('.resource-stage-heading'), ...stage.querySelectorAll('.resource-capability')];
    pieces.forEach((piece, index) => run(piece,
      { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
      { duration: .55, delay: .16 + index * .09, ease: 'easeOut' }));
  }

  function stopMotion() {
    running.forEach(control => control.cancel());
    running.clear();
    stages.forEach(stage => stage.classList.add('is-inview'));
  }

  section.classList.add('has-resource-motion');
  if (!('IntersectionObserver' in window) || reduced.matches) {
    stages.forEach(stage => stage.classList.add('is-inview'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });
    stages.forEach(stage => observer.observe(stage));
  }

  stages.forEach(stage => {
    const shell = stage.querySelector('.resource-stage-shell');
    if (!shell) return;
    let hover;
    shell.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || reduced.matches) return;
      hover?.cancel();
      hover = run(shell, { transform: ['translateY(0px)', 'translateY(-5px)'] },
        { duration: .3, ease: 'easeOut', fill: 'forwards' });
    });
    shell.addEventListener('pointerleave', () => {
      if (reduced.matches) return;
      hover?.cancel();
      hover = run(shell, { transform: ['translateY(-5px)', 'translateY(0px)'] },
        { duration: .3, ease: 'easeOut', fill: 'forwards' });
    });
  });
  reduced.addEventListener?.('change', event => { if (event.matches) stopMotion(); });
}
