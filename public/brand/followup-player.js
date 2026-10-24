/* Live-page playback; capture stays controlled by HyperFrames. */
(function () {
  'use strict';
  var stage = document.querySelector('#problema .cinema-followup');
  var button = document.getElementById('followupMotionToggle');
  if (!stage || !button || !window.gsap || !window.createElusFollowupTimeline) return;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var manual = false, visible = false, timeline, width = 0;
  function refresh() {
    if (!timeline) return;
    button.hidden = reduced.matches;
    if (reduced.matches) { timeline.progress(1).pause(); return; }
    var complete = timeline.progress() >= 1;
    button.setAttribute('aria-pressed',String(manual));
    button.setAttribute('aria-label',complete ? 'Rever animação de acompanhamento' : manual ? 'Reproduzir animação de acompanhamento' : 'Pausar animação de acompanhamento');
    button.querySelector('span').textContent = complete ? 'Rever animação' : manual ? 'Reproduzir animação' : 'Pausar animação';
    if (complete || manual || !visible || document.hidden) timeline.pause();
    else timeline.play();
  }
  function rebuild() {
    var nextWidth = stage.clientWidth;
    if (nextWidth === width && timeline) return;
    width = nextWidth;
    var progress = timeline ? timeline.progress() : 0;
    if (timeline) { timeline.progress(1).kill(); }
    stage.querySelectorAll('.followup-live-glow,.followup-flow-dot').forEach(function(el){el.remove();});
    stage.querySelectorAll('.elus-emission,.followup-mascot-anchor,.followup-connections path,.cinema-followup-scene').forEach(function(el){el.removeAttribute('style');});
    timeline = window.createElusFollowupTimeline(stage);
    timeline.eventCallback('onComplete',refresh);
    window.__timelines = window.__timelines || {};
    window.__timelines.followup = timeline;
    timeline.progress(progress);
    refresh();
  }
  button.addEventListener('click', function () {
    if (timeline && timeline.progress() >= 1) { manual = false; timeline.restart(); }
    else manual = !manual;
    button.setAttribute('aria-pressed', String(manual));
    button.setAttribute('aria-label', manual ? 'Reproduzir animação de acompanhamento' : 'Pausar animação de acompanhamento');
    button.querySelector('span').textContent = manual ? 'Reproduzir animação' : 'Pausar animação';
    refresh();
  });
  // Only prepare when the section approaches the viewport; static content is the fallback.
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries){
      visible = entries[0].isIntersecting;
      if (visible) rebuild();
      refresh();
    }, {threshold:0, rootMargin:'0px 0px 120px 0px'});
    observer.observe(stage);
  } else { visible = true; rebuild(); }
  document.addEventListener('visibilitychange',refresh);
  reduced.addEventListener('change',refresh);
  if ('ResizeObserver' in window) new ResizeObserver(function(){if(timeline)rebuild();}).observe(stage);
})();
