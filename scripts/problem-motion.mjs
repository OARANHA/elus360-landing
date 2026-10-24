/* Motion's vanilla DOM API adds scene entrances to the scroll-driven story. */
import { animate } from 'motion/mini';

const stage = document.getElementById('followupStory');
if (stage) {
  const panels = [...stage.querySelectorAll('[data-scene]')];
  const arts = [...stage.querySelectorAll('[data-art-scene]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let running = [];

  function enter(index) {
    running.forEach(animation => animation.cancel());
    running = [];
    if (reduced.matches || document.hidden || !panels[index] || !arts[index]) return;
    const direction = index === 0 ? -1 : index === 1 ? 0 : 1;
    const art = arts[index].querySelector('img');
    running.push(animate(panels[index], {
      opacity: [0, 1],
      transform: ['translateY(18px)', 'translateY(0)']
    }, { duration: .55, ease: 'easeOut' }));
    running.push(animate(arts[index], {
      opacity: [0, 1],
      transform: [`translate(${direction * 48}px, 16px) scale(.91)`, 'translate(0, 0) scale(1)']
    }, { duration: .7, ease: 'easeOut' }));
    if (art) running.push(animate(art, {
      transform: ['scale(.94)', 'scale(1)']
    }, { duration: .85, ease: 'easeOut' }));
  }

  stage.classList.add('has-motion-engine');
  stage.addEventListener('elus:scenechange', event => enter(event.detail.index));
  enter([...stage.querySelectorAll('[data-story-tab]')].findIndex(tab => tab.classList.contains('is-active')));
  reduced.addEventListener?.('change', () => running.forEach(animation => animation.cancel()));
}
