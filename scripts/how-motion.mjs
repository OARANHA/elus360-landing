/* ELUS 360 — seven real scroll stages with Motion's DOM animation API. */
import { animate } from 'motion/mini';

const section = document.getElementById('como-funciona');
if (section) {
  const steps = [...section.querySelectorAll('[data-how-step]')];
  const scenes = [...section.querySelectorAll('[data-how-scene]')];
  const markers = [...section.querySelectorAll('.how-screen-bottom span')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (steps.length === 7 && scenes.length === 7 && markers.length === 7) {
    let active = 0;
    let pending = false;
    let entered = false;
    let running = [];

    function select(index, play) {
      if (active === index && entered) return;
      running.forEach(control => control.cancel());
      running = [];
      active = index;
      entered = true;
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
      markers.forEach((marker, i) => marker.classList.toggle('is-passed', i <= index));
      if (!play || reduced.matches || document.hidden) return;
      const scene = scenes[index];
      const orbit = scene.querySelector('.how-orbit');
      const label = scene.querySelector('.how-scene-inner h4');
      running.push(animate(scene, { opacity: [0, 1] }, { duration: .42, ease: 'easeOut' }));
      if (orbit) running.push(animate(orbit,
        { opacity: [0, 1], transform: ['translateY(24px) scale(.82)', 'translateY(0px) scale(1)'] },
        { duration: .7, ease: [.17, .78, .3, 1] }));
      if (label) running.push(animate(label,
        { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
        { duration: .53, delay: .12, ease: 'easeOut' }));
      running.push(animate(steps[index],
        { transform: ['translateX(0px)', 'translateX(7px)', 'translateX(0px)'] },
        { duration: .55, ease: 'easeOut' }));
    }

    function update() {
      pending = false;
      const viewport = window.innerHeight;
      const visible = section.getBoundingClientRect().top < viewport * .9 && section.getBoundingClientRect().bottom > 0;
      if (!visible) return;
      const threshold = viewport * (window.innerWidth <= 900 ? .72 : .57);
      let index = 0;
      steps.forEach((step, i) => { if (step.getBoundingClientRect().top <= threshold) index = i; });
      select(index, true);
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener?.('change', event => {
      if (event.matches) { running.forEach(control => control.cancel()); running = []; }
      schedule();
    });
    schedule();
  }
}
