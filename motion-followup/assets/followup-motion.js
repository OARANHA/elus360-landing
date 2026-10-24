/* ELUS 360 · shared deterministic HyperFrames timeline. GSAP is vendored locally. */
(function (global) {
  'use strict';
  global.createElusFollowupTimeline = function (stage) {
    var mascot = stage.querySelector('.followup-mascot-anchor');
    var center = mascot.getBoundingClientRect();
    var timeline = global.gsap.timeline({paused:true});
    timeline.from(mascot, {opacity:0, y:22, scale:.92, duration:.8, ease:'power3.out'}, .15);
    stage.querySelectorAll('.elus-emission').forEach(function (panel, index) {
      var box = panel.getBoundingClientRect();
      timeline.from(panel, {
        x:center.left+center.width/2-box.left-box.width/2,
        y:center.top+center.height*.48-box.top-box.height/2,
        scale:.12, opacity:0, rotation:index===0?-6:6,
        transformOrigin:'50% 50%', duration:1.45,
        ease:index===0?'expo.out':'power4.out'
      }, Number(panel.dataset.emissionDelay));
    });
    stage.querySelectorAll('.followup-connections path').forEach(function (path,index) {
      timeline.from(path, {strokeDashoffset:1, opacity:0, duration:1.2, ease:'sine.out'}, .65+index*.7);
    });
    return timeline;
  };
})(window);
