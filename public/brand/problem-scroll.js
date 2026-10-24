/* ELUS 360 — the three follow-up scenes follow the visitor's scroll position. */
(function () {
  'use strict';
  var track = document.getElementById('followupTrack');
  var stage = document.getElementById('followupStory');
  if (!track || !stage) return;

  var tabs = Array.prototype.slice.call(stage.querySelectorAll('[data-story-tab]'));
  var panels = Array.prototype.slice.call(stage.querySelectorAll('[data-scene]'));
  var arts = Array.prototype.slice.call(stage.querySelectorAll('[data-art-scene]'));
  var meters = tabs.map(function (tab) { return tab.querySelector('.cinestory-meter i'); });
  var replay = document.getElementById('followupMotionToggle');
  if (tabs.length !== 3 || panels.length !== 3 || arts.length !== 3 || meters.some(function (meter) { return !meter; })) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = -1;
  var pending = false;
  var progress = 0;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }

  function select(index) {
    if (index === active) return;
    active = index;
    panels.forEach(function (panel, i) {
      panel.classList.toggle('is-active', i === index);
      panel.setAttribute('aria-hidden', String(i !== index));
    });
    arts.forEach(function (art, i) { art.classList.toggle('is-active', i === index); });
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
  }

  function update() {
    pending = false;
    var travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
    progress = clamp(-track.getBoundingClientRect().top / travel);
    select(Math.min(2, Math.floor(progress * 3)));
    meters.forEach(function (meter, i) {
      meter.style.transform = 'scaleX(' + clamp(progress * 3 - i).toFixed(3) + ')';
    });
    stage.style.setProperty('--story-offset', (-progress * 22).toFixed(1) + 'px');
  }

  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(update);
  }

  function goTo(index) {
    var travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
    // Enter the middle of each scene, avoiding the crossfade boundary.
    var target = index === 0 ? 0 : index === 1 ? .5 : .84;
    window.scrollTo({
      top: window.scrollY + track.getBoundingClientRect().top + travel * target,
      behavior: reduced.matches ? 'instant' : 'smooth'
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { goTo(i); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (i + 1) % 3;
      else if (event.key === 'ArrowLeft') next = (i + 2) % 3;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = 2;
      else return;
      event.preventDefault();
      tabs[next].focus();
      goTo(next);
    });
  });

  if (replay) {
    replay.hidden = false;
    replay.querySelector('span').textContent = 'Voltar ao início';
    replay.setAttribute('aria-label', 'Voltar ao início da história comercial');
    replay.addEventListener('click', function () { goTo(0); });
  }

  track.classList.add('is-scroll-ready');
  stage.classList.add('is-scroll-driven');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(stage);
  update();
})();
