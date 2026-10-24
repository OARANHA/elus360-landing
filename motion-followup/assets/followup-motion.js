/* ELUS 360 — lead -> stalled conversation -> AI assistance -> scheduled follow-up.
 * Shared deterministic GSAP timeline: site playback and HyperFrames preview. */
(function (global) {
  'use strict';

  global.createElusFollowupTimeline = function (stage) {
    var gsap = global.gsap;
    var lead = stage.querySelector('.followup-contact');
    var mascot = stage.querySelector('.followup-mascot-anchor');
    var resolution = stage.querySelector('.followup-resolution');
    var scene = stage.querySelector('.cinema-followup-scene');
    var svg = stage.querySelector('.followup-connections');
    if (!gsap || !lead || !mascot || !resolution) return null;

    // These decorative elements are never required to understand the story.
    var glow = document.createElement('span');
    glow.className = 'followup-live-glow';
    glow.setAttribute('aria-hidden', 'true');
    mascot.insertBefore(glow, mascot.firstChild);

    var paths = svg ? Array.prototype.slice.call(svg.querySelectorAll('path')) : [];
    var dots = [];
    paths.forEach(function (path) {
      if (!path.getTotalLength || !svg) return;
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '6');
      dot.setAttribute('class', 'followup-flow-dot');
      dot.setAttribute('aria-hidden', 'true');
      svg.appendChild(dot);
      dots.push({ path: path, node: dot, distance: path.getTotalLength() });
    });

    var timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    timeline.addLabel('lead', 0);
    if (scene) timeline.fromTo(scene, { scale: 1.025 }, { scale: 1, duration: 3.4, ease: 'sine.out' }, 0);
    timeline.from(lead, { x: -62, y: 10, scale: .95, autoAlpha: 0, duration: 1.05 }, 'lead+=0.2');
    timeline.addLabel('interruption', 1.35);
    timeline.to(lead, { x: 3, duration: .14, repeat: 1, yoyo: true, ease: 'power2.inOut' }, 'interruption+=0.14');
    timeline.addLabel('elus', 2.2);
    timeline.from(mascot, { y: 36, scale: .87, autoAlpha: 0, rotation: -3, duration: 1.05, ease: 'back.out(1.25)' }, 'elus');
    timeline.fromTo(glow, { autoAlpha: 0, scale: .8 }, { autoAlpha: .85, scale: 1.07, duration: 1.0, ease: 'sine.out' }, 'elus+=0.4');
    timeline.to(glow, { scale: 1.18, autoAlpha: .55, duration: 1.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 'elus+=1.35');
    timeline.to(mascot, { y: -7, duration: .85, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 'elus+=1.45');

    paths.forEach(function (path, i) {
      timeline.fromTo(path, { strokeDashoffset: 1, opacity: .1 }, { strokeDashoffset: 0, opacity: .9, duration: 1.3, ease: 'power2.inOut' }, 3.15 + i * .46);
    });
    dots.forEach(function (item, i) {
      var flight = { progress: 0 };
      timeline.to(flight, {
        progress: 1, duration: 1.15, ease: 'power2.inOut',
        onStart: function () { item.node.style.opacity = '1'; },
        onUpdate: function () {
          var point = item.path.getPointAtLength(flight.progress * item.distance);
          item.node.setAttribute('cx', point.x.toFixed(2));
          item.node.setAttribute('cy', point.y.toFixed(2));
        },
        onComplete: function () { item.node.style.opacity = '0'; }
      }, 3.35 + i * .46);
    });

    timeline.addLabel('followup', 4.65);
    timeline.from(resolution, { x: 64, y: 12, scale: .94, autoAlpha: 0, duration: 1.15, ease: 'power4.out' }, 'followup');
    timeline.fromTo(resolution, { filter: 'brightness(1)' }, { filter: 'brightness(1.08)', duration: .38, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 6.0);
    timeline.to(glow, { autoAlpha: .18, scale: 1, duration: .65, ease: 'sine.out' }, 6.45);
    timeline.to({}, { duration: .6 }, 7.0);
    return timeline;
  };
})(window);
