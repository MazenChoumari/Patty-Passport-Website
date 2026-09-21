/* Patty Passport — Mediterranean route map, ported from Route-Map.dc.html's
   x-dc template + Component logic. Legend/nodes/chapters are driven from
   window.PP_DATA.COUNTRIES + ROUTES; only each node's map (x, y) position is
   page-local layout data with no home in the shared data model.

   Deep-link handling: destination.html links here as route-map.html#<code>
   (its "See the route map" button). On load we read location.hash, find the
   matching country, isolate its route on the map and glow-highlight both its
   node and its stop card, then scroll it into view. No hash / an unknown
   code falls back to the default, unhighlighted, all-routes view. */
(function () {
  var INK = "#1b1a19", CREAM = "#f7f3ec";

  // Chapter copy — descriptive text the data model doesn't carry; colors are
  // still read live from PP_DATA.ROUTES so they can never drift from the
  // rest of the site's route palette.
  var CH_COPY = {
    LEV: { num: "01", kicker: "Chapter one", blurb: "Cedar mountains, ancient ports, caravan kitchens and the table traditions of the eastern Mediterranean.", list: "Three destinations: Lebanon, Syria and Palestine." },
    AEG: { num: "02", kicker: "Chapter two", blurb: "Bronze Age islands, imperial straits, olive groves and charcoal cooking across the sea-crossroads between Europe and Asia.", list: "Three destinations: Türkiye, Cyprus and Greece." },
    IBL: { num: "03", kicker: "Chapter three", blurb: "Roman roads, medieval ports, Mediterranean agriculture and long-table cultures shaped by wheat, wine, olive oil and late evenings.", list: "Five destinations: Italy, Spain, France, Monaco and Malta." },
    ADR: { num: "04", kicker: "Chapter four", blurb: "Venetian harbours, mountain interiors, Slavic traditions and a coast where stone, salt and smoke meet.", list: "Five destinations: Slovenia, Croatia, Bosnia & Herzegovina, Montenegro and Albania." },
    NAF: { num: "05", kicker: "Chapter five", blurb: "River civilizations, Punic ports, Amazigh mountains, Saharan trade and spice-rich kitchens facing the southern shore.", list: "Five destinations: Egypt, Libya, Tunisia, Algeria and Morocco." }
  };
  var CH_ORDER = ["LEV", "AEG", "IBL", "ADR", "NAF"];

  // Map layout — (x%, y%) position of each country's node on the basin plate.
  var POS = {
    esp: ["7%", "36%"], mar: ["9%", "76%"], dza: ["26%", "82%"], fra: ["19%", "15%"],
    mco: ["26%", "24%"], ita: ["33%", "32%"], tun: ["40%", "72%"], mlt: ["39%", "55%"],
    svn: ["38%", "9%"], hrv: ["45%", "17%"], bih: ["47%", "28%"], mne: ["51%", "35%"],
    alb: ["54%", "43%"], lby: ["55%", "82%"], grc: ["60%", "33%"], tur: ["74%", "14%"],
    cyp: ["80%", "44%"], egy: ["76%", "78%"], lbn: ["88%", "38%"], syr: ["90%", "26%"],
    pse: ["87%", "50%"]
  };

  var state = { route: "ALL", highlightCode: null };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function readHashCode() {
    var h = (location.hash || "").replace("#", "").toLowerCase();
    var data = window.PP_DATA;
    if (data && h && data.COUNTRIES.some(function (c) { return c.code === h; })) return h;
    return null;
  }

  function render() {
    var data = window.PP_DATA;
    if (!data) return;
    var countries = data.COUNTRIES;
    var routes = data.ROUTES;
    var act = state.route;
    var hi = state.highlightCode;

    var legendKeys = ["ALL"].concat(CH_ORDER);
    document.getElementById("rm-legend").innerHTML = legendKeys.map(function (k) {
      var label = k === "ALL" ? "All routes" : routes[k].name;
      var count = k === "ALL" ? countries.length : countries.filter(function (c) { return c.routeKey === k; }).length;
      var dot = k === "ALL" ? "#f2b30c" : routes[k].bg;
      var active = act === k;
      var bg = active ? INK : "transparent";
      var fg = active ? CREAM : "#fff";
      return '<button type="button" data-route="' + k + '" style="display:inline-flex;align-items:center;gap:9px;padding:10px 13px;background:' + bg + ';border:2px solid #1b1a19;color:' + fg + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">'
        + '<span style="width:9px;height:9px;background:' + dot + ';display:block"></span>' + esc(label) + '<span style="opacity:.6">' + count + '</span></button>';
    }).join("");

    document.getElementById("rm-active-label").textContent = act === "ALL" ? "All five routes shown" : routes[act].name.toUpperCase() + " ROUTE ISOLATED";

    document.getElementById("rm-nodes").innerHTML = countries.map(function (c, i) {
      var ch = routes[c.routeKey];
      var pos = POS[c.code] || ["50%", "50%"];
      var on = act === "ALL" || act === c.routeKey;
      var sway = (4 + (i % 5) * 0.6).toFixed(1) + "s";
      var highlighted = hi === c.code;
      return '<a href="destination.html#' + c.code + '" data-node="' + c.code + '" style="position:absolute;left:' + pos[0] + ';top:' + pos[1] + ';transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:flex-start;gap:5px;text-decoration:none;opacity:' + (on ? "1" : "0.22") + ';transition:opacity .3s ease">'
        + '<span class="' + (highlighted ? "pp-rm-highlight" : "") + '" style="display:flex;align-items:center;gap:7px;padding:6px 9px;background:' + ch.bg + ';color:' + ch.fg + ';border:2px solid #1b1a19;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;white-space:nowrap;animation:ppSway ' + sway + ' ease-in-out infinite">' + esc(c.code.toUpperCase()) + '<span style="font:600 8.5px/1;letter-spacing:.14em;opacity:.75">' + esc(c.med) + '</span></span>'
        + '<span style="font:800 13px/1 \'Archivo\',sans-serif;letter-spacing:-.01em;color:#fff;text-shadow:0 1px 0 rgba(27,26,25,.6)">' + esc(c.name) + '</span></a>';
    }).join("");

    var chapters = CH_ORDER.filter(function (k) { return act === "ALL" || act === k; });
    document.getElementById("rm-chapters").innerHTML = chapters.map(function (key) {
      var route = routes[key];
      var copy = CH_COPY[key];
      var stops = countries.filter(function (c) { return c.routeKey === key; });
      var meds = stops.map(function (s) { return s.med; });
      var meta = stops.length + " destinations · gates " + meds[0] + "—" + meds[meds.length - 1];
      var stopsHtml = stops.map(function (s) {
        var highlighted = hi === s.code;
        return '<a href="destination.html#' + s.code + '" data-stop="' + s.code + '" class="' + (highlighted ? "pp-rm-highlight" : "") + '" style="padding:22px 20px 24px;border-right:1px solid rgba(27,26,25,.28);border-bottom:1px solid rgba(27,26,25,.28);text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:8px;min-height:200px;transition:background .2s ease" data-hover="background:#1b1a19;color:#f7f3ec">'
          + '<span style="display:flex;align-items:center;justify-content:space-between;gap:8px">'
          + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.65">' + esc(s.med) + '</span>'
          + window.PP_FLAGS.render(s.code, 22, { stroke: "currentColor" })
          + '</span>'
          + '<span style="font:800 21px/1.02 \'Archivo\',sans-serif;letter-spacing:-.025em">' + esc(s.name.toUpperCase()) + '</span>'
          + '<span style="font:700 12.5px/1.4 \'Archivo\',sans-serif;opacity:.9">' + esc(s.identity) + '</span>'
          + '<span style="font:400 11.5px/1.45 \'Archivo\',sans-serif;opacity:.75">' + esc(s.cardIntro || s.intro) + '</span>'
          + '<span style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em">' + s.stamp + '<span>→</span></span></a>';
      }).join("");
      return '<div data-rv="up" class="pp-2col" style="display:grid;grid-template-columns:minmax(0,.42fr) minmax(0,1fr);border-top:2px solid #1b1a19;background:' + route.bg + ';color:' + route.fg + '">'
        + '<div style="padding:34px 32px 36px;border-right:2px solid rgba(27,26,25,.35)">'
        + '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:12px">'
        + '<span style="font:800 40px/1 \'Archivo\',sans-serif;letter-spacing:-.04em;opacity:.3">' + copy.num + '</span>'
        + '<span style="font:600 10px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase">' + copy.kicker + '</span></div>'
        + '<h3 style="font:800 clamp(26px,3vw,42px)/.98 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:0 0 12px">' + esc(route.name.toUpperCase()) + ' ROUTE</h3>'
        + '<p style="font:700 14px/1.55 \'Archivo\',sans-serif;margin:0 0 10px;opacity:.92;max-width:42ch">' + esc(copy.blurb) + '</p>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;margin:0 0 18px;opacity:.78;max-width:42ch">' + esc(copy.list) + '</p>'
        + '<div style="font:600 9.5px/1.6 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.75">' + esc(meta) + '</div></div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr))">' + stopsHtml + '</div></div>';
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll("#rm-legend [data-route]"), function (btn) {
      btn.addEventListener("click", function () { state.route = btn.getAttribute("data-route"); render(); });
    });

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  function applyHash() {
    var code = readHashCode();
    state.highlightCode = code;
    if (code) {
      var country = window.PP_DATA.COUNTRIES.find(function (c) { return c.code === code; });
      if (country) state.route = country.routeKey;
    }
    render();
    if (code) {
      setTimeout(function () {
        var target = document.querySelector('[data-node="' + code + '"]') || document.querySelector('[data-stop="' + code + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    }
  }

  window.PP_READY(function () {
    if (window.PP_DATA) {
      applyHash();
    } else {
      render();
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); applyHash(); } }, 60);
    }
    window.addEventListener("hashchange", applyHash);
    if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("hashchange", applyHash); });
  });
})();
