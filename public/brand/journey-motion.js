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
  var office = stage.querySelector('.cinestory-office');
  var orbit = stage.querySelector('.cinestory-orbit');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var gsap = window.gsap || null;
  var index = 0;
  var timeline = null;
  var ambient = null;
  var ambientTargets = [];
  var entrances = [];
  var started = false;
  var inView = false;
  var manualPause = false;
  var manualSelection = false;

  if (tabs.length !== 3 || panels.length !== 3 || arts.length !== 3 || !replay || meters.some(function (meter) { return !meter; })) return;

  function stopAmbient() {
    if (!ambient) return;
    ambient.kill();
    ambient = null;
    if (gsap && ambientTargets.length) gsap.set(ambientTargets, { clearProps: 'transform' });
    ambientTargets = [];
  }

  function resetOffice() {
    if (gsap && office) gsap.set(office, { clearProps: 'transform' });
  }

  function stopEntrances() {
    entrances.forEach(function (tween) { tween.kill(); });
    entrances = [];
  }

  function startAmbient(sceneIndex) {
    stopAmbient();
    if (!gsap || reduced.matches) return;
    var image = arts[sceneIndex].querySelector('img');
    ambient = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    if (sceneIndex === 0 && image) {
      ambientTargets.push(image);
      ambient.to(image, { y: -7, duration: 1.35, ease: 'sine.inOut' });
    } else if (sceneIndex === 1) {
      ambientTargets.push(arts[sceneIndex]);
      ambient.to(arts[sceneIndex], { y: -8, duration: 1.45, ease: 'sine.inOut' });
      if (orbit) {
        ambientTargets.push(orbit);
        ambient.to(orbit, { rotation: 12, duration: 6.5, ease: 'sine.inOut' }, 0);
      }
    } else if (image) {
      ambientTargets.push(image);
      ambient.to(image, { y: -4, scale: 1.018, duration: 1.55, ease: 'sine.inOut' });
    }
    syncPlayback();
  }

  function applyScene(next, animate) {
    if (next < 0 || next >= panels.length) return;
    var previous = index;
    var leaving = [panels[previous], arts[previous]];
    var entering = [panels[next], arts[next]];
    stopEntrances();
    stopAmbient();
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
      var panelEntrance = gsap.fromTo(panels[next], { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: .58, ease: 'expo.out',
        onComplete: function () { gsap.set(panels[next], {clearProps:'opacity,transform'}); }
      });
      var entrance = next === 0
        ? { x: -82, y: 14, rotation: -2.2, scale: .93, clipPath: 'inset(8% 54% 8% 0 round 20px)' }
        : next === 1
          ? { x: 0, y: 32, rotation: -4.5, scale: .76, clipPath: 'inset(10% 10% 10% 10% round 50%)' }
          : { x: 88, y: -10, rotation: 2.4, scale: .92, clipPath: 'inset(4% 0 4% 56% round 20px)' };
      var artEntrance = gsap.fromTo(arts[next], { opacity: 0, ...entrance }, {
        opacity: 1, x: 0, y: 0, rotation: 0, scale: 1,
        clipPath: 'inset(0% 0% 0% 0% round 20px)',
        duration: next === 1 ? .82 : .72,
        ease: next === 1 ? 'back.out(1.12)' : 'power4.out',
        onComplete: function () {
          gsap.set(arts[next], {clearProps:'opacity,transform,clipPath'});
          startAmbient(next);
        }
      });
      entrances = [panelEntrance, artEntrance];
    } else if (animate) {
      startAmbient(next);
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
      // Once the story starts in view, keep its short sequence moving even if
      // the browser temporarily hides the tab. The browser can throttle rAF;
      // the scene itself must not remain stuck on a partially filled meter.
      if (!inView || manualPause || reduced.matches || manualSelection) timeline.pause();
      else if (timeline.progress() < .999) timeline.play();
    }
    if (ambient) {
      if (!inView || document.hidden || manualPause || reduced.matches) ambient.pause();
      else ambient.play();
    }
    entrances.forEach(function (tween) {
      if (!inView || document.hidden || manualPause || reduced.matches) tween.pause();
      else tween.play();
    });
    updateButton();
  }

  function startSequence() {
    if (reduced.matches || !gsap) return;
    if (timeline) timeline.kill();
    resetOffice();
    started = true;
    manualPause = false;
    manualSelection = false;
    applyScene(0, false);
    setMeters(0);
    timeline = gsap.timeline({ paused: true, onComplete: updateButton });
    if (office) timeline.fromTo(office, { scale: 1.035, xPercent: -1.2 }, { scale: 1, xPercent: 0, duration: 7.6, ease: 'sine.inOut' }, 0);
    applyScene(0, true);
    timeline.to(meters[0], { scaleX: 1, duration: 2.45, ease: 'none' }, 0);
    timeline.call(function () { applyScene(1, true); }, null, 2.45);
    timeline.to(meters[1], { scaleX: 1, duration: 2.55, ease: 'none' }, 2.45);
    timeline.call(function () { applyScene(2, true); }, null, 5.0);
    timeline.to(meters[2], { scaleX: 1, duration: 2.6, ease: 'none' }, 5.0);
    timeline.eventCallback('onComplete', function () { stopAmbient(); resetOffice(); updateButton(); });
    syncPlayback();
  }

  function selectManually(next) {
    if (timeline) { timeline.kill(); timeline = null; }
    stopAmbient();
    resetOffice();
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
    resetOffice();
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
