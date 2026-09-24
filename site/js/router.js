/* Patty Passport — client-side navigation shell.

   The site is a set of plain static HTML pages, but a real full-page
   reload destroys everything in the document, including the YouTube
   player behind the nav's music toggle — so music restarted from zero
   on every click to another page. This router intercepts clicks on
   ordinary internal <a href="whatever.html"> links and, instead of a
   real navigation, fetches the target page and swaps only its unique
   content (the #pp-view element) into the current document. The nav,
   footer, music player, hover/reveal engines and the Patty Tooty
   widget are never torn down, so anything living outside #pp-view
   (the nav's rotation timer, the hidden YouTube iframe, its playback
   state) simply keeps running across "page" changes.

   Every page still works exactly as before when loaded directly /
   hard-refreshed / opened from a search engine — this only changes
   what happens after the page is already open and a link inside it is
   clicked. Any failure (bad response, unrecognized page shape) falls
   back to a real navigation, so this can never leave someone stuck.

   Shared scripts (already resident in the page, holding state that
   must survive) are never re-run. Only the target page's own
   page-specific script (whatever <script src="js/*.js"> isn't in the
   shared list below) is re-injected after the swap, so its render
   logic runs again against the freshly swapped-in markup. */
(function () {
  if (window.__ppRouterInit) return;
  window.__ppRouterInit = true;

  var SHARED_SCRIPTS = [
    "js/data.js", "js/flags.js", "js/tooty-icon.js", "js/ui-icons.js", "js/med-map.js", "js/hover.js", "js/reveal.js", "js/music.js", "js/auth.js",
    "js/nav.js", "js/footer.js", "js/bag.js", "js/combo.js", "js/patty-tooty-widget.js", "js/router.js"
  ];

  /* Ready-guard used by every page-specific script (and the shared ones
     that touch the DOM): DOMContentLoaded only ever fires once per real
     document load, so a script re-injected later — after a swap, or a
     shared script loaded lazily to cover a gap — must run immediately
     if the document is already parsed instead of waiting for an event
     that has already happened and will never happen again. */
  window.PP_READY = function (fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  /* Per-page cleanup registry: a page-specific script that binds a
     window/document-level listener or interval (one that would
     otherwise outlive its own markup once we swap it away) registers
     a teardown via PP_TRACK. The router runs every pending teardown
     right before swapping to the next page. */
  var pageCleanups = [];
  window.PP_TRACK = function (fn) { pageCleanups.push(fn); };
  function clearPageCleanups() {
    pageCleanups.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } });
    pageCleanups = [];
  }

  function loadedScriptSrcs() {
    var out = {};
    Array.prototype.forEach.call(document.querySelectorAll("script[src]"), function (s) {
      out[stripQuery(s.getAttribute("src"))] = true;
    });
    return out;
  }

  // Script/style URLs carry a ?v= cache-busting query string (bumped on
  // deploy so a returning browser can't keep serving a stale cached copy
  // of a file that just changed) — compare by path only so that string
  // never has to be kept in sync with SHARED_SCRIPTS by hand.
  function stripQuery(src) { return src ? src.split("?")[0] : src; }

  function injectScript(src) {
    var s = document.createElement("script");
    // Dynamically-created <script src> elements default to async=true —
    // they'd execute in whichever order their network fetch happens to
    // finish, not the order they were inserted. A page like our-story.html
    // or crew.html ships its shared data file (crew-data.js) before its
    // own render script (our-story.js/crew.js) specifically so the render
    // script can read window.PP_CREW_DATA at top level; async=false keeps
    // that same in-order guarantee for scripts re-injected after a swap.
    s.async = false;
    s.src = src;
    document.body.appendChild(s);
  }

  function extractActive(html) {
    var m = html.match(/window\.PP_ACTIVE\s*=\s*"([^"]*)"/);
    return m ? m[1] : "";
  }

  // A page can ship more than one page-specific script (our-story.html and
  // crew.html both load js/crew-data.js before their own render script) —
  // every non-shared script needs to be re-injected after a swap, in
  // document order, not just the last one.
  function extractPageScripts(doc) {
    var found = [];
    Array.prototype.forEach.call(doc.querySelectorAll("script[src]"), function (s) {
      var src = s.getAttribute("src");
      if (src && SHARED_SCRIPTS.indexOf(stripQuery(src)) === -1) found.push(src);
    });
    return found;
  }

  function isRoutable(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== "" && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    if (a.origin !== location.origin) return false;
    if (!/\.html$/.test(a.pathname)) return false;
    return true;
  }

  var navSeq = 0;

  function swapIn(doc, html, url) {
    var view = document.getElementById("pp-view");
    var newView = doc.getElementById("pp-view");
    if (!view || !newView) return false;

    clearPageCleanups();
    view.innerHTML = newView.innerHTML;
    document.title = doc.title;

    /* Each page's own <style id="pp-page-style"> block lives before
       #pp-view (so it still works on a hard reload / direct load), which
       means a soft swap here never touches it by default — the incoming
       page's CSS (card padding, section layout, everything authored as
       page-local rules) would silently never apply after an in-app nav
       click, only ever after a real reload. Sync its text content in
       manually alongside the view swap so both paths render identically. */
    var oldStyle = document.getElementById("pp-page-style");
    var newStyle = doc.getElementById("pp-page-style");
    if (oldStyle) oldStyle.textContent = newStyle ? newStyle.textContent : "";

    if (window.PP_NAV) window.PP_NAV.setActive(extractActive(html));

    var present = loadedScriptSrcs();
    Array.prototype.forEach.call(doc.querySelectorAll("script[src]"), function (s) {
      var src = s.getAttribute("src");
      var path = stripQuery(src);
      if (path === "js/router.js" || SHARED_SCRIPTS.indexOf(path) === -1) return;
      if (!present[path]) injectScript(src);
    });

    extractPageScripts(doc).forEach(function (src) { injectScript(src); });

    if (window.initHoverStyles) window.initHoverStyles(view);
    if (window.PP_REVEAL) window.PP_REVEAL.init(view);
    if (window.PP_TOOTY_WIDGET) window.PP_TOOTY_WIDGET.setVisible(!view.querySelector("#pt-thread"));
    return true;
  }

  function navigate(url, push) {
    var target = new URL(url, location.href);
    var mySeq = ++navSeq;
    fetch(target.pathname + target.search, { credentials: "same-origin" })
      .then(function (r) { if (!r.ok) throw new Error("bad response"); return r.text(); })
      .then(function (html) {
        if (mySeq !== navSeq) return;
        var doc = new DOMParser().parseFromString(html, "text/html");
        if (push) history.pushState({ ppRoute: true }, "", target.pathname + target.search + target.hash);
        var ok = swapIn(doc, html, url);
        if (!ok) { location.href = url; return; }
        if (target.hash) {
          var el = document.querySelector(target.hash);
          if (el) el.scrollIntoView({ block: "start" });
          else window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }
      })
      .catch(function () { if (mySeq === navSeq) location.href = url; });
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || !isRoutable(a)) return;

    // Any internal link tap closes the "All pages" drawer immediately —
    // regardless of which branch below runs — so it can never survive
    // onto the next page still open/stale (js/nav.js owns the actual
    // open/closed state; this is a no-op if it was already closed).
    if (window.PP_NAV) window.PP_NAV.closeMenu();

    var samePage = a.pathname === location.pathname;
    if (samePage && a.hash) {
      // In-page hash navigation (events.html#enquiry, legal.html#faq).
      // Native browser handling (CSS scroll-behavior:smooth on <html>)
      // is trusted for this on most pages, but on a long, element-heavy
      // page it can visibly fall short of the target and just stop
      // there — reproduced directly on events.html's "Enquire" links,
      // which landed hundreds of pixels short of the actual form
      // (looking like the click opened an earlier section instead).
      // Drive it ourselves so it's never at the mercy of that: smooth
      // for the normal short hop, then a corrective instant snap if a
      // check shortly after shows we didn't actually get there.
      var target = document.querySelector(a.hash);
      if (!target) return; // no matching id: let native no-op behavior run
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href"));
      // Offset by the fixed nav bar's real height so its target's own
      // heading doesn't land hidden underneath it — the bar wraps to a
      // second row under ~760px, so this is measured live, not assumed.
      function navOffset() {
        var bar = document.querySelector("[data-nav-root]");
        return (bar ? bar.offsetHeight : 0) + 12;
      }
      function scrollToTarget(behavior) {
        var top = target.getBoundingClientRect().top + window.scrollY - navOffset();
        window.scrollTo({ top: top, behavior: behavior });
      }
      scrollToTarget("smooth");
      setTimeout(function () {
        var rect = target.getBoundingClientRect();
        if (Math.abs(rect.top - navOffset()) > 24) scrollToTarget("auto");
      }, 900);
      return;
    }

    e.preventDefault();
    // Same page, no hash (e.g. re-tapping "Home" while already home, or a
    // second tap on a drawer link before it had a chance to close): a real
    // <a> click here would still force a full reload even though nothing
    // needs to change, which is exactly the "second tap reloads the page"
    // bug — resetting the persistent music player. Just stop here.
    if (samePage) return;

    navigate(a.href, true);
  });

  window.addEventListener("popstate", function () {
    if (window.PP_NAV) window.PP_NAV.closeMenu();
    navigate(location.href, false);
  });
})();
