/* Patty Passport — shared scroll-reveal engine.
   Animates elements in as they enter the viewport and resets them when
   they leave, so scrolling back up re-plays the animation — matching the
   original design's feeling of continuous movement instead of a page
   that "uses up" its animations on first load.

   Two mechanisms, for two different failure modes:

   1. IntersectionObserver drives the normal case (user scrolling,
      including an animated `scroll-behavior:smooth` anchor jump, which
      renders real intermediate frames the observer can see) — cheap,
      native, and never competes with the browser's own scroll/animation
      work on the main thread.

   2. A low-frequency catch-up pass (setInterval, ~4/s) reconciles any
      element IntersectionObserver never fired for: specifically an
      *instant* jump — SPA nav-return, browser back/forward scroll
      restoration — that moves an element straight from off-screen to
      on-screen (or a fast discrete scroll, e.g. a trackpad flick, whose
      sampled frames can step clean over a thin element) without ever
      rendering a frame where it crosses the threshold, so the observer
      has nothing to fire on and the element is stuck at opacity:0.

   An earlier version of this file used only a getBoundingClientRect()
   recompute on every `scroll` event instead of (2). It fixed the same
   stuck-content bug, but running that recompute across every bound
   element on every scroll event was heavy enough to visibly interrupt
   the CSS smooth-scroll animation on a same-page hash link (the browser
   would abandon the in-progress scroll partway to the target). Polling
   at ~250ms instead of on every scroll event keeps the same guarantee —
   nothing stays stuck for more than a quarter-second — without ever
   touching the main thread often enough to fight an active scroll.

   Respects prefers-reduced-motion by skipping the animation and showing
   content immediately.

   Usage: include this script, then call window.PP_REVEAL.init() once
   your page's own text/content is in the DOM (word-group headlines are
   wordified from whatever text they contain at call time). Safe to call
   init() again after injecting new dynamic markup — already-bound
   elements are skipped.

   Markup contract (unchanged from before):
     [data-rv="up|left|right|scale"] [data-rv-d="<ms>"]   generic reveal
     h2[data-word-group] with id                           word-stagger headline
*/
(function () {
  var RV_FROM = {
    up: "translateY(28px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    scale: "translate(-50%,-50%) scale(.88)"
  };
  var RV_TO = {
    up: "none", left: "none", right: "none", scale: "translate(-50%,-50%) scale(1)"
  };
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var THRESHOLD = 0.12, BOTTOM_MARGIN_RATIO = 0.06, POLL_MS = 250;

  var generic = [];   // { el, dir }
  var wordGroups = []; // { el, spans }

  function isVisible(el) {
    var r = el.getBoundingClientRect();
    if (r.height <= 0 && r.width <= 0) return false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var bottomLimit = vh - vh * BOTTOM_MARGIN_RATIO;
    var visibleHeight = Math.min(r.bottom, bottomLimit) - Math.max(r.top, 0);
    if (visibleHeight <= 0) return false;
    return (visibleHeight / r.height) >= THRESHOLD;
  }

  function setGenericState(entry, visible) {
    entry.el.style.opacity = visible ? "1" : "0";
    entry.el.style.transform = visible ? (RV_TO[entry.dir] || "none") : (RV_FROM[entry.dir] || RV_FROM.up);
  }
  function setWordGroupState(entry, visible) {
    entry.spans.forEach(function (s) {
      s.style.opacity = visible ? "1" : "0";
      s.style.transform = visible ? "none" : "translateY(.4em)";
    });
  }

  var io = null;
  function getObserver() {
    if (io) return io;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (ioEntry) {
        var entry = ioEntry.target._ppRvEntry;
        if (!entry) return;
        if (entry.spans) setWordGroupState(entry, ioEntry.isIntersecting);
        else setGenericState(entry, ioEntry.isIntersecting);
      });
    }, { threshold: THRESHOLD, rootMargin: "0px 0px -" + Math.round(BOTTOM_MARGIN_RATIO * 100) + "% 0px" });
    return io;
  }

  function bindGeneric(el) {
    if (el._ppRvBound) return;
    el._ppRvBound = true;
    var dir = el.getAttribute("data-rv") || "up";
    if (REDUCED) {
      el.style.opacity = "1";
      el.style.transform = RV_TO[dir] || "none";
      return;
    }
    var delay = parseInt(el.getAttribute("data-rv-d") || "0", 10);
    el.style.transition = "opacity .7s cubic-bezier(.2,.8,.25,1) " + delay + "ms, transform .8s cubic-bezier(.2,.85,.25,1) " + delay + "ms";
    el.style.opacity = "0";
    el.style.transform = RV_FROM[dir] || RV_FROM.up;
    var entry = { el: el, dir: dir };
    el._ppRvEntry = entry;
    generic.push(entry);
    getObserver().observe(el);
  }

  function wordify(el) {
    if (el._ppRvWords) return el._ppRvWords;
    var text = el.textContent;
    if (!text || !text.trim()) return null;
    var words = text.trim().split(/\s+/);
    el.innerHTML = words.map(function (w, i) {
      return '<span style="display:inline-block;transition:opacity .5s cubic-bezier(.2,.8,.25,1) ' + (i * 0.05) + 's,transform .6s cubic-bezier(.2,.85,.25,1) ' + (i * 0.05) + 's">' + w + (i < words.length - 1 ? "&nbsp;" : "") + '</span>';
    }).join("");
    var spans = Array.prototype.slice.call(el.querySelectorAll("span"));
    el._ppRvWords = spans;
    return spans;
  }

  function bindWordGroup(el) {
    if (el._ppRvBound) return;
    el._ppRvBound = true;
    var spans = wordify(el);
    if (!spans) return;
    if (REDUCED) {
      spans.forEach(function (s) { s.style.opacity = "1"; s.style.transform = "none"; });
      return;
    }
    var entry = { el: el, spans: spans };
    el._ppRvEntry = entry;
    setWordGroupState(entry, false);
    wordGroups.push(entry);
    getObserver().observe(el);
  }

  function poll() {
    generic.forEach(function (entry) {
      var visible = isVisible(entry.el);
      var showing = entry.el.style.opacity !== "0";
      if (visible !== showing) setGenericState(entry, visible);
    });
    wordGroups.forEach(function (entry) {
      var visible = isVisible(entry.el);
      var showing = entry.spans.length && entry.spans[0].style.opacity !== "0";
      if (visible !== showing) setWordGroupState(entry, visible);
    });
  }
  if (!REDUCED) setInterval(poll, POLL_MS);

  function init(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll("[data-rv]"), bindGeneric);
    Array.prototype.forEach.call(scope.querySelectorAll("[data-word-group]"), bindWordGroup);
    if (!REDUCED) poll();
  }

  window.PP_REVEAL = { init: init, wordify: wordify };
})();
