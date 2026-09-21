/* Patty Passport — shared scroll-reveal engine.
   Animates elements in as they enter the viewport and resets them when they
   leave, so scrolling back up re-plays the animation — matching the
   original design's feeling of continuous movement instead of a page that
   "uses up" its animations on first load.

   Visibility is recomputed from getBoundingClientRect() on every scroll/
   resize (rAF-throttled) and once right after init(), rather than relying
   only on IntersectionObserver threshold-crossing events. A big instant
   jump — SPA nav-return, a hash deep-link's scrollIntoView, browser
   back/forward scroll restoration — can move an element straight from
   "below the fold" to "above the fold" without the browser ever rendering
   an intermediate frame where it crosses the threshold, so an
   IntersectionObserver never fires for it and it stays stuck at
   opacity:0 forever. Recomputing from the actual rect on every scroll/
   resize event (which always fires, jump or not) makes that impossible:
   the element's true on-screen state is never more than one frame stale.

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
  var THRESHOLD = 0.12, BOTTOM_MARGIN_RATIO = 0.06;

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
    generic.push({ el: el, dir: dir });
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
    wordGroups.push({ el: el, spans: spans });
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

  var ticking = false;
  function sync() {
    ticking = false;
    generic.forEach(function (entry) { setGenericState(entry, isVisible(entry.el)); });
    wordGroups.forEach(function (entry) { setWordGroupState(entry, isVisible(entry.el)); });
  }
  function requestSync() {
    if (REDUCED || ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  }

  if (!REDUCED) {
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
  }

  function init(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll("[data-rv]"), bindGeneric);
    Array.prototype.forEach.call(scope.querySelectorAll("[data-word-group]"), bindWordGroup);
    requestSync();
  }

  window.PP_REVEAL = { init: init, wordify: wordify };
})();
