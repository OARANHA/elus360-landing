/* Small state-change feedback for the readable, scroll-led Problema story. */
import { animate } from 'motion/mini';

const steps = document.querySelector('#problemStory .problem-story-steps');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let running;

if (steps) {
  steps.addEventListener('elus:problem-step', event => {
    running?.cancel();
    if (reduced.matches) return;

    const badge = steps.querySelector(`[data-problem-step="${event.detail.index}"] .problem-step-state`);
    if (!badge) return;

    running = animate(badge, {
      opacity: [0.72, 1],
      transform: ['translateY(3px)', 'translateY(0px)'],
    }, { duration: 0.22, ease: 'easeOut' });
  });

  reduced.addEventListener?.('change', () => {
    running?.cancel();
    running = undefined;
  });
}
