/* Patty Passport — shared scroll-reveal engine.
   Replaces every page's old one-shot "opacity 0 -> 1, never reset" reveal
   logic. Uses IntersectionObserver so elements animate in EVERY time they
   enter the viewport, and reset when they leave — so scrolling back up
   re-plays the animation on the way past, matching the original design's
   feeling of continuous movement instead of a page that "uses up" its
   animations on first load.

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

  function bindGeneric(el) {
    if (el._ppRvBound) return;
    el._ppRvBound = true;
    var dir = el.getAttribute("data-rv") || "up";
    var delay = parseInt(el.getAttribute("data-rv-d") || "0", 10);
    el.style.transition = "opacity .7s cubic-bezier(.2,.8,.25,1) " + delay + "ms, transform .8s cubic-bezier(.2,.85,.25,1) " + delay + "ms";
    el.style.opacity = "0";
    el.style.transform = RV_FROM[dir] || RV_FROM.up;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = RV_TO[dir] || "none";
        } else {
          el.style.opacity = "0";
          el.style.transform = RV_FROM[dir] || RV_FROM.up;
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
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
    function setState(visible) {
      spans.forEach(function (s) {
        s.style.opacity = visible ? "1" : "0";
        s.style.transform = visible ? "none" : "translateY(.4em)";
      });
    }
    setState(false);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { setState(entry.isIntersecting); });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
  }

  function init(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll("[data-rv]"), bindGeneric);
    Array.prototype.forEach.call(scope.querySelectorAll("[data-word-group]"), bindWordGroup);
  }

  window.PP_REVEAL = { init: init, wordify: wordify };
})();
