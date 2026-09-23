/* Patty Passport — dedicated route-soundtrack experience: choose a route,
   then open any of its destinations for that country's own soundtrack
   card. Home's soundtrack strip (js/index.js) is a short teaser that
   links here with the route key as the hash; this page also accepts a
   country code hash (e.g. from a future country-page link) and resolves
   it to that country's route. */
(function () {
  var INK = "#1b1a19", CREAM = "#f7f3ec";

  var CH_ORDER = ["LEV", "AEG", "IBL", "ADR", "NAF"];

  var state = { route: "ALL", highlight: null, view: "all" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function libraryByCode() {
    var D = window.PP_DATA;
    var out = {};
    (D && D.MUSIC_LIBRARY || []).forEach(function (t) { out[t.code] = t; });
    return out;
  }

  // Shared playback-order helper: takes the library and hands back tracks
  // round-robin across the five routes (one Levant, one Aegean, one
  // Iberian/Balearic, one Adriatic, one North African, then repeat)
  // instead of playing an entire route back to back before moving on —
  // so a future "play the Mediterranean" queue samples the whole map early
  // rather than sitting in one route for a long stretch. Only tracks with
  // a real `src` are ever included; this activates on its own as more
  // tracks go live, with nothing invented ahead of time. Exposed on
  // window so any other page (destination.js route soundtrack module,
  // a future nav queue) can build the same order from the same library
  // instead of re-implementing it.
  function interleaveQueue(lib, routeKeys) {
    var keys = routeKeys && routeKeys.length ? routeKeys : CH_ORDER;
    var byRoute = {};
    keys.forEach(function (k) { byRoute[k] = []; });
    Object.keys(lib).forEach(function (code) {
      var t = lib[code];
      if (t && t.src && byRoute[t.route]) byRoute[t.route].push(t);
    });
    keys.forEach(function (k) { byRoute[k].sort(function (a, b) { return a.code < b.code ? -1 : 1; }); });
    var queue = [], more = true;
    while (more) {
      more = false;
      keys.forEach(function (k) {
        if (byRoute[k].length) { queue.push(byRoute[k].shift()); more = true; }
      });
    }
    return queue;
  }

  function readyTracks(lib) { return Object.keys(lib).map(function (c) { return lib[c]; }).filter(function (t) { return t && t.src; }); }
  function pendingTracks(lib) { return Object.keys(lib).map(function (c) { return lib[c]; }).filter(function (t) { return t && !t.src; }); }

  window.PP_SOUNDTRACKS = { interleaveQueue: interleaveQueue, readyTracks: readyTracks, pendingTracks: pendingTracks };

  function vinyl(fg) {
    return '<span class="pp-st-vinyl" style="display:block;width:52px;height:52px;border-radius:50%;background:repeating-radial-gradient(circle,' + fg + ' 0 2px,transparent 2px 5px);position:relative;flex:none">'
      + '<span style="position:absolute;inset:0;margin:auto;width:14px;height:14px;border-radius:50%;background:' + fg + '"></span></span>';
  }

  // Every card reads from window.PP_DATA.MUSIC_LIBRARY — the same source
  // destination.js's country-profile soundtrack module and the nav's
  // now-playing label use, so a track added there later shows up here
  // automatically. Only the one row with a real `src` (lbn today) gets a
  // working play button, wired to the same shared player the nav music
  // toggle controls — not a separate fake player.
  function countryCard(c, route, lib) {
    var hi = state.highlight === c.code;
    var t = lib[c.code];
    var title = t ? t.title : c.name + " — soundtrack coming soon";
    var meta = t ? [t.genre, t.city].filter(Boolean).join(" · ") : "";
    var desc = t ? t.desc : "A destination soundtrack card, coming soon.";
    var playable = t && t.src;
    var actionHtml = playable
      ? '<button type="button" data-play-track="' + esc(c.code) + '" style="display:inline-flex;align-items:center;gap:6px;padding:8px 10px;background:rgba(0,0,0,.22);border:1.5px solid currentColor;color:inherit;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.08em;cursor:pointer" data-hover="background:rgba(0,0,0,.4)">▶ Play preview</button>'
      : '<span aria-disabled="true" style="display:inline-flex;align-items:center;gap:6px;padding:8px 10px;background:rgba(0,0,0,.18);border:1.5px dashed currentColor;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.08em;opacity:.85">▶ Coming soon</span>';
    return '<a href="#' + c.code + '" data-country-card="' + c.code + '" class="pp-st-card' + (hi ? " pp-rm-highlight" : "") + '" style="display:flex;flex-direction:column;gap:12px;padding:18px;background:' + route.bg + ';color:' + route.fg + ';border:2px solid #1b1a19;text-decoration:none;min-height:190px" data-hover="filter:brightness(1.05)">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      + '<div>' + window.PP_FLAGS.render(c.code, 26, { stroke: route.fg }) + '<div style="font:800 16px/1.15 \'Archivo\',sans-serif;letter-spacing:-.01em;margin-top:8px">' + esc(c.name) + '</div></div>'
      + vinyl(route.fg)
      + '</div>'
      + '<div style="flex:1;display:flex;flex-direction:column;gap:4px">'
      + '<div style="font:800 13.5px/1.3 \'Archivo\',sans-serif">' + esc(title) + '</div>'
      + (meta ? '<div style="font:700 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;opacity:.7">' + esc(meta) + '</div>' : "")
      + '<p style="font:400 11.5px/1.5 \'Archivo\',sans-serif;margin:6px 0 0;opacity:.9">' + esc(desc) + '</p>'
      + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">' + actionHtml
      + '<span style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em">' + esc(c.stamp) + '</span>'
      + '</div></a>';
  }

  function render() {
    var data = window.PP_DATA;
    if (!data) return;
    var countries = data.COUNTRIES, routes = data.ROUTES;
    var act = state.route;

    var legendKeys = ["ALL"].concat(CH_ORDER);
    document.getElementById("st-legend").innerHTML = legendKeys.map(function (k) {
      var label = k === "ALL" ? "All routes" : routes[k].name;
      var count = k === "ALL" ? countries.length : countries.filter(function (c) { return c.routeKey === k; }).length;
      var dot = k === "ALL" ? "#f2b30c" : routes[k].bg;
      var active = act === k;
      return '<button type="button" data-route="' + k + '" style="display:inline-flex;align-items:center;gap:9px;padding:10px 13px;background:' + (active ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (active ? CREAM : "#1b1a19") + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">'
        + '<span style="width:9px;height:9px;background:' + dot + ';display:block"></span>' + esc(label) + '<span style="opacity:.6">' + count + '</span></button>';
    }).join("");

    var lib = libraryByCode();
    var ready = readyTracks(lib), pending = pendingTracks(lib);
    var viewTabs = [
      { key: "all", label: "All tracks", count: ready.length + pending.length },
      { key: "ready", label: "View saved songs", count: ready.length },
      { key: "pending", label: "Songs being prepared", count: pending.length }
    ];
    document.getElementById("st-view-tabs").innerHTML = viewTabs.map(function (v) {
      var on = state.view === v.key;
      return '<button type="button" data-view="' + v.key + '" style="padding:9px 12px;background:' + (on ? "#f2b30c" : "transparent") + ';border:2px solid #1b1a19;color:#1b1a19;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c">' + esc(v.label) + ' <span style="opacity:.65">' + v.count + '</span></button>';
    }).join("");

    var queueHtml = "";
    if (state.view === "ready") {
      var queue = interleaveQueue(lib, act === "ALL" ? null : [act]);
      queueHtml = queue.length
        ? '<div data-rv="up" style="margin-bottom:26px;border:2px solid #1b1a19;background:#fff;padding:16px">'
        + '<div style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#605d5d;margin-bottom:11px">Suggested queue · one route in, one route out</div>'
        + '<ol style="display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none">' + queue.map(function (t, i) {
          return '<li><a href="#' + esc(t.code) + '" style="display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1.5px solid #1b1a19;text-decoration:none;color:#1b1a19;font:700 11px/1 \'Archivo\',sans-serif" data-hover="background:#f2b30c">'
            + '<span style="opacity:.55">' + (i + 1) + '</span>' + esc(t.title) + '</a></li>';
        }).join("") + '</ol></div>'
        : '<p data-rv="up" style="margin:0 0 26px;font:400 13px/1.6 \'Archivo\',sans-serif;color:#605d5d">No saved songs on this route yet — check back as more tracks are approved.</p>';
    } else if (state.view === "pending") {
      queueHtml = '<p data-rv="up" style="margin:0 0 26px;font:400 13px/1.6 \'Archivo\',sans-serif;color:#605d5d;max-width:64ch">These destinations have a soundtrack slot reserved but no track approved yet — nothing is invented ahead of time. Cards below show what\'s coming, not what\'s playable.</p>';
    }

    var chapters = CH_ORDER.filter(function (k) { return act === "ALL" || act === k; });
    document.getElementById("st-routes").innerHTML = queueHtml + chapters.map(function (key, idx) {
      var route = routes[key];
      var stops = countries.filter(function (c) {
        if (c.routeKey !== key) return false;
        if (state.view === "ready") return !!(lib[c.code] && lib[c.code].src);
        if (state.view === "pending") return !(lib[c.code] && lib[c.code].src);
        return true;
      });
      if (!stops.length) return "";
      return '<div data-rv="up" style="' + (idx > 0 ? "margin-top:34px;" : "") + '">'
        + '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:16px"><span style="padding:6px 10px;background:' + route.bg + ';color:' + route.fg + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em">' + esc(route.name.toUpperCase()) + ' ROUTE</span><span style="font:600 11px/1 \'Archivo\',sans-serif;color:#7d7979">' + stops.length + ' destinations</span></div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px">' + stops.map(function (c) { return countryCard(c, route, lib); }).join("") + '</div>'
        + '</div>';
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll("#st-legend [data-route]"), function (btn) {
      btn.addEventListener("click", function () { state.route = btn.getAttribute("data-route"); render(); });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#st-view-tabs [data-view]"), function (btn) {
      btn.addEventListener("click", function () { state.view = btn.getAttribute("data-view"); render(); });
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-play-track]"), function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.PP_MUSIC) window.PP_MUSIC.toggle(true);
      });
    });

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  function applyHash() {
    var h = (location.hash || "").replace("#", "");
    var data = window.PP_DATA;
    if (!data) { render(); return; }
    var isRoute = CH_ORDER.indexOf(h.toUpperCase()) !== -1;
    var country = data.COUNTRIES.find(function (c) { return c.code === h.toLowerCase(); });
    if (isRoute) { state.route = h.toUpperCase(); state.highlight = null; }
    else if (country) { state.route = country.routeKey; state.highlight = country.code; }
    render();
    if (country) {
      setTimeout(function () {
        var target = document.querySelector('[data-country-card="' + country.code + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    }
  }

  window.PP_READY(function () {
    if (window.PP_DATA) { applyHash(); } else {
      render();
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); applyHash(); } }, 60);
    }
    window.addEventListener("hashchange", applyHash);
    if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("hashchange", applyHash); });
  });
})();
