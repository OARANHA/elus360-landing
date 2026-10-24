/* ELUS 360 — cinematic, progressive commercial journey. GSAP is local to the app. */
(function () {
  'use strict';
  var stage = document.getElementById('followupStory');
  if (!stage) return;

  var tabs = Array.prototype.slice.call(stage.querySelectorAll('[data-story-tab]'));
  var panels = Array.prototype.slice.call(stage.querySelectorAll('[data-scene]'));
  var arts = Array.prototype.slice.call(stage.querySelectorAll('[data-art-scene]'));
  var meters = tabs.map(function (tab) { return tab.querySelector('.cinestory-meter i'); });
  var replay = document.getElementById('followupMotionToggle');
  var replayLabel = replay && replay.querySelector('span');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var gsap = window.gsap || null;
  var index = 0;
  var timeline = null;
  var started = false;
  var inView = false;
  var manualPause = false;
  var manualSelection = false;

  if (tabs.length !== 3 || panels.length !== 3 || arts.length !== 3 || !replay) return;

  function applyScene(next, animate) {
    if (next < 0 || next >= panels.length) return;
    var previous = index;
    var leaving = [panels[previous], arts[previous]];
    var entering = [panels[next], arts[next]];
    if (gsap) gsap.killTweensOf(leaving.concat(entering));
    if (gsap) gsap.set(leaving.concat(entering), { clearProps: 'all' });
    panels.forEach(function (panel, i) {
      panel.classList.toggle('is-active', i === next);
      panel.setAttribute('aria-hidden', String(i !== next));
    });
    arts.forEach(function (art, i) { art.classList.toggle('is-active', i === next); });
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === next);
      tab.setAttribute('aria-selected', String(i === next));
      tab.tabIndex = i === next ? 0 : -1;
    });
    index = next;
    if (animate && gsap && !reduced.matches) {
      gsap.fromTo(panels[next], { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: .64, ease: 'power3.out',
        onComplete: function () { gsap.set(panels[next], {clearProps:'opacity,transform'}); }
      });
      gsap.fromTo(arts[next], { opacity: 0, y: 14, scale: .97 }, {
        opacity: 1, y: 0, scale: 1, duration: .86, ease: 'power3.out',
        onComplete: function () { gsap.set(arts[next], {clearProps:'opacity,transform'}); }
      });
    }
  }

  function setMeters(active) {
    meters.forEach(function (meter, i) {
      var progress = i < active ? 1 : 0;
      if (gsap) gsap.set(meter, { scaleX: progress });
      else meter.style.transform = 'scaleX(' + progress + ')';
    });
  }

  function updateButton() {
    replay.hidden = reduced.matches || !gsap;
    if (replay.hidden) return;
    var complete = manualSelection || (timeline && timeline.progress() >= .999);
    var label = complete ? 'Rever sequência' : manualPause ? 'Continuar sequência' : 'Pausar sequência';
    replayLabel.textContent = label;
    replay.setAttribute('aria-label', label + ' de acompanhamento');
    replay.setAttribute('aria-pressed', String(manualPause && !complete));
  }

  function syncPlayback() {
    if (timeline) {
      if (!inView || document.hidden || manualPause || reduced.matches || manualSelection) timeline.pause();
      else if (timeline.progress() < .999) timeline.play();
    }
    updateButton();
  }

  function startSequence() {
    if (reduced.matches || !gsap) return;
    if (timeline) timeline.kill();
    started = true;
    manualPause = false;
    manualSelection = false;
    applyScene(0, false);
    setMeters(0);
    timeline = gsap.timeline({ paused: true, onComplete: updateButton });
    timeline.to(meters[0], { scaleX: 1, duration: 3.7, ease: 'none' });
    timeline.call(function () { applyScene(1, true); });
    timeline.to(meters[1], { scaleX: 1, duration: 3.8, ease: 'none' });
    timeline.call(function () { applyScene(2, true); });
    timeline.to(meters[2], { scaleX: 1, duration: 4.0, ease: 'none' });
    syncPlayback();
  }

  function selectManually(next) {
    if (timeline) { timeline.kill(); timeline = null; }
    started = true;
    manualSelection = true;
    manualPause = false;
    applyScene(next, true);
    setMeters(next);
    if (gsap) gsap.set(meters[next], { scaleX: 1 });
    else meters[next].style.transform = 'scaleX(1)';
    updateButton();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectManually(i); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectManually(next);
    });
  });

  replay.addEventListener('click', function () {
    if (reduced.matches || !gsap) return;
    if (timeline && timeline.progress() < .999 && !manualSelection) {
      manualPause = !manualPause;
      syncPlayback();
    } else {
      startSequence();
    }
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !started && !reduced.matches) startSequence();
      syncPlayback();
    }, { threshold: .14 });
    observer.observe(stage);
  } else {
    inView = true;
    if (!reduced.matches) startSequence();
  }

  document.addEventListener('visibilitychange', syncPlayback);
  function onMotionChange() {
    if (timeline) { timeline.kill(); timeline = null; }
    started = false;
    manualPause = false;
    manualSelection = false;
    applyScene(0, false);
    setMeters(0);
    if (!reduced.matches && inView) startSequence();
    updateButton();
  }
  if (reduced.addEventListener) reduced.addEventListener('change', onMotionChange);
  else if (reduced.addListener) reduced.addListener(onMotionChange);
  updateButton();
})();
