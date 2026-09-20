/* Patty Passport — destinations overview/hub page, ported from
   Destinations.dc.html's x-dc template + Component logic. Grid, ticker and
   route filter are all driven live from window.PP_DATA.COUNTRIES / ROUTES
   so this page can never drift from the per-country pages. */
(function () {
  var INK = "#1b1a19", CREAM = "#f7f3ec";
  var state = { filter: "ALL" };

  function eur(n) { return "€" + n.toFixed(2).replace(/\.00$/, ".0"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function render() {
    var data = window.PP_DATA;
    if (!data) return;
    var countries = data.COUNTRIES;
    var routes = data.ROUTES;
    var f = state.filter;
    var list = f === "ALL" ? countries : countries.filter(function (c) { return c.routeKey === f; });

    // Ticker — every country, twice round, so the marquee loops seamlessly.
    document.getElementById("dst-ticker").innerHTML = countries.concat(countries).map(function (c) {
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 24px;border-right:1px solid rgba(247,243,236,.22);white-space:nowrap">'
        + '<span style="font:800 14px/1 \'Archivo\',sans-serif">' + esc(c.name.toUpperCase()) + '</span>'
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;color:#bab6b6">' + esc(c.med) + '</span></div>';
    }).join("");

    // Route filter buttons — ALL plus every key in PP_DATA.ROUTES.
    var keys = ["ALL"].concat(Object.keys(routes));
    document.getElementById("dst-filters").innerHTML = keys.map(function (k) {
      var label = k === "ALL" ? "All routes" : routes[k].name;
      var count = k === "ALL" ? countries.length : countries.filter(function (c) { return c.routeKey === k; }).length;
      var active = f === k;
      var bg = active ? INK : "transparent";
      var fg = active ? CREAM : INK;
      return '<button type="button" data-filter="' + k + '" style="padding:10px 13px;background:' + bg + ';border:2px solid #1b1a19;color:' + fg + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">'
        + esc(label) + '<span style="margin-left:8px;opacity:.6">' + count + '</span></button>';
    }).join("");

    document.getElementById("dst-result-label").textContent = list.length + " destinations shown";

    // Grid of country cards.
    document.getElementById("dst-grid").innerHTML = list.map(function (c) {
      var route = routes[c.routeKey];
      var greetingParts = (c.greeting || "").split(" — ");
      var english = greetingParts[1] || "";
      return '<a href="destination.html#' + c.code + '" class="pp-dst-card" style="display:flex;flex-direction:column;border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;text-decoration:none;color:#1b1a19;background:#f7f3ec;transition:background .2s ease" data-hover="background:#fff">'
        + '<div style="position:relative;height:210px;border-bottom:2px solid #1b1a19">'
        + '<div class="pp-placeholder" style="position:absolute;inset:0"><span>' + esc(c.name) + ' — street scene or landscape</span></div>'
        + '<span style="position:absolute;left:0;top:0;padding:7px 10px;background:' + route.bg + ';color:' + route.fg + ';font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.16em;pointer-events:none">' + esc(route.name.toUpperCase()) + '</span>'
        + '<span style="position:absolute;right:10px;bottom:10px;width:46px;height:46px;border:2px solid #f7f3ec;background:rgba(27,26,25,.75);color:#f7f3ec;display:flex;align-items:center;justify-content:center;font:800 11px/1 \'Archivo\',sans-serif;transform:rotate(-9deg);pointer-events:none">' + c.stamp + '</span>'
        + '</div>'
        + '<div style="padding:20px 18px 22px;display:flex;flex-direction:column;gap:10px;flex:1">'
        + '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">'
        + '<h3 style="font:800 26px/1 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(c.name.toUpperCase()) + '</h3>'
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;color:#7d7979">' + esc(c.med) + '</span></div>'
        + '<div style="font:800 13.5px/1.3 \'Archivo\',sans-serif;color:#ae1800">' + esc(c.identity) + '</div>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(c.intro) + '</p>'
        + '<div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:12px;border-top:2px solid rgba(27,26,25,.18);font:600 10px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase">'
        + '<span style="color:#605d5d">' + esc(c.heroItem.name) + '</span>'
        + '<span style="display:inline-flex;align-items:center;gap:7px;font:800 11px/1 \'Archivo\',sans-serif;color:#1b1a19">' + eur(c.heroItem.price) + '<span>→</span></span></div>'
        + '</div>'
        + '<div class="pp-dst-greet">'
        + '<svg class="pp-dst-greet-flag" width="26" height="26" viewBox="0 0 24 24">'
        + '<line x1="5" y1="2" x2="5" y2="22" stroke="#f7f3ec" stroke-width="2" stroke-linecap="round"/>'
        + '<path d="M5 3 L20 3 L16 7 L20 11 L5 11 Z" fill="' + route.bg + '" stroke="#f7f3ec" stroke-width="1.6" stroke-linejoin="round"/>'
        + '</svg>'
        + '<span style="font:800 20px/1.15 \'Archivo\',sans-serif;letter-spacing:-.02em">' + esc(c.nativePhrase) + '</span>'
        + '<span style="font:600 10px/1.4 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#bab6b6">' + esc(c.translit) + (english ? " · " + esc(english) : "") + '</span>'
        + '</div>'
        + '</a>';
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll("#dst-filters [data-filter]"), function (btn) {
      btn.addEventListener("click", function () { state.filter = btn.getAttribute("data-filter"); render(); });
    });

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    }
  });
})();
