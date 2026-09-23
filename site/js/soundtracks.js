/* Patty Passport — dedicated route-soundtrack experience: choose a route,
   then open any of its destinations for that country's own soundtrack
   card. Home's soundtrack strip (js/index.js) is a short teaser that
   links here with the route key as the hash; this page also accepts a
   country code hash (e.g. from a future country-page link) and resolves
   it to that country's route. */
(function () {
  var INK = "#1b1a19", CREAM = "#f7f3ec";

  var CH_ORDER = ["LEV", "AEG", "IBL", "ADR", "NAF"];

  /* Short, real musical-tradition cues per country — no invented song or
     artist names, consistent with the site's honest "playlist coming
     soon" framing used elsewhere. */
  var MUSIC = {
    lbn: "Oud taqsim and tarab strings — the sound of a long Beirut dinner.",
    syr: "Qanun and muwashshah vocals from Damascus courtyard evenings.",
    pse: "Mijwiz reed and dabke percussion — line-dance energy at the table.",
    tur: "Bağlama strings and Aegean folk — a coastline caravan sound.",
    cyp: "Laouto and island ballads carried on sea wind.",
    grc: "Bouzouki and rebetiko soul — harbour tavern energy.",
    ita: "Mandolin and cinematic strings — a late Roman trattoria mood.",
    esp: "Flamenco guitar and hand-clap rhythm, late into the night.",
    fra: "Riviera jazz manouche — café strings after the sun goes down.",
    mco: "Cabaret piano and brass — a polished Mediterranean nightclub feel.",
    mlt: "Għana folk singing — call-and-response voices over harbour air.",
    svn: "Alpine folk strings drifting down from the Karst hills.",
    hrv: "Klapa harmony singing — close, unaccompanied harbour voices.",
    bih: "Sevdalinka strings — slow, aching mountain-town ballads.",
    mne: "Gusle and epic sung verse from the mountain interior.",
    alb: "Layered polyphonic harmony carried from village to village.",
    egy: "Oud and tabla — classic Cairo orchestral warmth.",
    lby: "Amazigh frame-drum rhythm from the coastal highlands.",
    tun: "Malouf strings — Andalusian-rooted courtyard music.",
    dza: "Raï vocals and modern Maghrebi pulse.",
    mar: "Gnawa hand-drums and iron castanets — trance rhythm from Essaouira."
  };

  var state = { route: "ALL", highlight: null };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function vinyl(fg) {
    return '<span class="pp-st-vinyl" style="display:block;width:52px;height:52px;border-radius:50%;background:repeating-radial-gradient(circle,' + fg + ' 0 2px,transparent 2px 5px);position:relative;flex:none">'
      + '<span style="position:absolute;inset:0;margin:auto;width:14px;height:14px;border-radius:50%;background:' + fg + '"></span></span>';
  }

  function countryCard(c, route) {
    var hi = state.highlight === c.code;
    var line = MUSIC[c.code] || "A destination soundtrack card, coming soon.";
    return '<a href="#' + c.code + '" data-country-card="' + c.code + '" class="pp-st-card' + (hi ? " pp-rm-highlight" : "") + '" style="display:flex;flex-direction:column;gap:12px;padding:18px;background:' + route.bg + ';color:' + route.fg + ';border:2px solid #1b1a19;text-decoration:none;min-height:190px" data-hover="filter:brightness(1.05)">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      + '<div>' + window.PP_FLAGS.render(c.code, 26, { stroke: route.fg }) + '<div style="font:800 16px/1.15 \'Archivo\',sans-serif;letter-spacing:-.01em;margin-top:8px">' + esc(c.name) + '</div></div>'
      + vinyl(route.fg)
      + '</div>'
      + '<p style="font:600 12px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.92;flex:1">' + esc(line) + '</p>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">'
      + '<span aria-disabled="true" style="display:inline-flex;align-items:center;gap:6px;padding:8px 10px;background:rgba(0,0,0,.18);border:1.5px dashed currentColor;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.08em;opacity:.85">▶ Coming soon</span>'
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

    var chapters = CH_ORDER.filter(function (k) { return act === "ALL" || act === k; });
    document.getElementById("st-routes").innerHTML = chapters.map(function (key, idx) {
      var route = routes[key];
      var stops = countries.filter(function (c) { return c.routeKey === key; });
      return '<div data-rv="up" style="' + (idx > 0 ? "margin-top:34px;" : "") + '">'
        + '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:16px"><span style="padding:6px 10px;background:' + route.bg + ';color:' + route.fg + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em">' + esc(route.name.toUpperCase()) + ' ROUTE</span><span style="font:600 11px/1 \'Archivo\',sans-serif;color:#7d7979">' + stops.length + ' destinations</span></div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px">' + stops.map(function (c) { return countryCard(c, route); }).join("") + '</div>'
        + '</div>';
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll("#st-legend [data-route]"), function (btn) {
      btn.addEventListener("click", function () { state.route = btn.getAttribute("data-route"); render(); });
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
