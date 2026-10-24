/* ELUS 360 — a single, accessible commercial follow-up sequence. */
(function () {
  'use strict';
  var stage = document.getElementById('followupStory');
  var control = document.getElementById('followupMotionToggle');
  if (!stage || !control || !window.gsap) return;

  var gsap = window.gsap;
  var media = window.matchMedia('(prefers-reduced-motion: reduce)');
  var inView = false;
  var manualPause = false;
  var timeline = null;
  var animated = [
    '.journey-thread', '.journey-message', '.journey-alert',
    '.journey-mascot', '.journey-brand', '.journey-signal',
    '.journey-actions-overline', '.journey-step', '.journey-outcome'
  ];
  var elements = stage.querySelectorAll(animated.join(','));
  var label = control.querySelector('span');

  function sync() {
    if (!timeline) return;
    var complete = timeline.progress() >= .999;
    if (complete || manualPause || !inView || document.hidden) timeline.pause();
    else timeline.play();
    label.textContent = complete ? 'Rever sequência' : manualPause ? 'Continuar sequência' : 'Pausar sequência';
    control.setAttribute('aria-label', complete ? 'Rever sequência de acompanhamento' : manualPause ? 'Continuar sequência de acompanhamento' : 'Pausar sequência de acompanhamento');
    control.setAttribute('aria-pressed', String(manualPause && !complete));
  }

  function prepare() {
    if (timeline) {
      timeline.kill();
      timeline = null;
      gsap.set(elements, {clearProps:'all'});
    }
    if (media.matches) {
      control.hidden = true;
      control.setAttribute('aria-pressed', 'false');
      return;
    }
    manualPause = false;
    timeline = gsap.timeline({paused:true, defaults:{ease:'power3.out'}, onComplete:sync});
    timeline.addLabel('mensagem', 0);
    timeline.from(stage.querySelector('.journey-thread'), {autoAlpha:0, y:20, duration:.85}, 'mensagem+=.1');
    timeline.from(stage.querySelector('.journey-message'), {autoAlpha:0, x:-16, duration:.65}, 'mensagem+=.65');
    timeline.addLabel('sem-retorno', 1.25);
    timeline.from(stage.querySelector('.journey-alert'), {autoAlpha:0, y:8, duration:.6}, 'sem-retorno');
    timeline.addLabel('elus', 2.05);
    timeline.from(stage.querySelector('.journey-mascot'), {autoAlpha:0, y:20, scale:.92, duration:.95}, 'elus');
    timeline.from(stage.querySelector('.journey-brand'), {autoAlpha:0, y:8, duration:.55}, 'elus+=.42');
    timeline.fromTo(stage.querySelector('.journey-signal'), {x:-40, opacity:0}, {x:74, opacity:.9, duration:1.1, ease:'power2.inOut'}, 'elus+=.7');
    timeline.to(stage.querySelector('.journey-signal'), {opacity:0, duration:.25}, 'elus+=1.75');
    timeline.addLabel('acompanhamento', 3.15);
    timeline.from(stage.querySelector('.journey-actions-overline'), {autoAlpha:0, y:6, duration:.45}, 'acompanhamento');
    timeline.from(stage.querySelectorAll('.journey-step'), {autoAlpha:0, y:16, duration:.7, stagger:.23}, 'acompanhamento+=.18');
    timeline.addLabel('retorno', 4.25);
    timeline.from(stage.querySelector('.journey-outcome'), {autoAlpha:0, y:18, scale:.98, duration:.8, ease:'power4.out'}, 'retorno');
    timeline.to({}, {duration:.45}, 5.15);
    control.hidden = false;
    sync();
  }

  control.addEventListener('click', function () {
    if (!timeline) return;
    if (timeline.progress() >= .999) {
      manualPause = false;
      timeline.restart();
    } else {
      manualPause = !manualPause;
    }
    sync();
  });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      sync();
    }, {threshold:.08, rootMargin:'0px 0px -8% 0px'});
    observer.observe(stage);
  } else {
    inView = true;
  }
  document.addEventListener('visibilitychange', sync);
  if (media.addEventListener) media.addEventListener('change', prepare);
  else if (media.addListener) media.addListener(prepare);
  prepare();
})();
