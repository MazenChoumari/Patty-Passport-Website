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
    "js/data.js", "js/hover.js", "js/reveal.js", "js/music.js",
    "js/nav.js", "js/footer.js", "js/patty-tooty-widget.js", "js/router.js"
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
      out[s.getAttribute("src")] = true;
    });
    return out;
  }

  function injectScript(src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  }

  function extractActive(html) {
    var m = html.match(/window\.PP_ACTIVE\s*=\s*"([^"]*)"/);
    return m ? m[1] : "";
  }

  function extractPageScript(doc) {
    var found = null;
    Array.prototype.forEach.call(doc.querySelectorAll("script[src]"), function (s) {
      var src = s.getAttribute("src");
      if (src && SHARED_SCRIPTS.indexOf(src) === -1) found = src;
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
    if (window.PP_NAV) window.PP_NAV.setActive(extractActive(html));

    var present = loadedScriptSrcs();
    SHARED_SCRIPTS.forEach(function (src) {
      if (src === "js/router.js") return;
      var needed = doc.querySelector('script[src="' + src + '"]');
      if (needed && !present[src]) injectScript(src);
    });

    var pageScript = extractPageScript(doc);
    if (pageScript) injectScript(pageScript);

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
    if (samePage && a.hash) return; // in-page hash navigation (destination.html#xx, legal.html#faq): let native behavior run

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
