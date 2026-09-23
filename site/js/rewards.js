/* Patty Passport — rewards / passport stamp ladder page, ported from
   Rewards.dc.html's x-dc template + Component logic. Front-end only (no
   backend/login yet per the master brief) — the stamp count is a mock
   "try the progression" demo: a +/- stepper plus a few preset states,
   matching the original prototype's interaction design. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var C = [
    ["lbn", "LBN", "Lebanon"], ["syr", "SYR", "Syria"], ["pse", "PSE", "Palestine"], ["tur", "TUR", "Türkiye"],
    ["cyp", "CYP", "Cyprus"], ["grc", "GRC", "Greece"], ["ita", "ITA", "Italy"], ["esp", "ESP", "Spain"],
    ["fra", "FRA", "France"], ["mco", "MCO", "Monaco"], ["mlt", "MLT", "Malta"], ["svn", "SVN", "Slovenia"],
    ["hrv", "HRV", "Croatia"], ["bih", "BIH", "Bosnia"], ["mne", "MNE", "Montenegro"], ["alb", "ALB", "Albania"],
    ["egy", "EGY", "Egypt"], ["lby", "LBY", "Libya"], ["tun", "TUN", "Tunisia"], ["dza", "DZA", "Algeria"], ["mar", "MAR", "Morocco"]
  ];
  var PRESETS = [0, 3, 5, 8, 21];
  var LADDER_COLORS = [[YEL, INK], [BLU, "#fff"], [INK, CREAM], [RED, "#fff"]];
  var STEPS = [
    ["1", "Ask at the desk", "The book is free with any check-in. Your name goes on page one.", RED, "#fff"],
    ["2", "Pick tonight's country", "Any of twenty-one. The boarding ticket prints with the gate on it.", YEL, INK],
    ["3", "Eat the destination", "The signature plate of that country, cooked the way they cook it.", BLU, "#fff"],
    ["4", "Get stamped", "The crew stamps the page before you leave — one country, one stamp.", INK, CREAM],
    ["5", "Climb the ladder", "Rewards unlock automatically. Nothing expires, nothing resets.", YEL, INK]
  ];
  var TIERS = [
    ["junior", "Ages 4 — 11", "JUNIOR", "JR", CREAM, INK, ["Sticker stamps, colouring route map", "Goodie bag at the third stamp", "Kids combo unlocks every gate"], "Free with a kids combo"],
    ["explorer", "Solo & couples", "EXPLORER", "EX", YEL, INK, ["Full 21-country stamp book", "Ladder from 3 to 21 stamps", "Country booklet each new route"], "Free at check-in"],
    ["family", "Tables of 3+", "FAMILY", "FM", RED, "#fff", ["One book, stamps pooled", "Shared ladder, faster unlocks", "Birthday route night included"], "Free · pools all seats"]
  ];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var state = { filled: 6, passportType: "explorer" };

  function setFilled(n) {
    state.filled = Math.min(21, Math.max(0, n));
    render();
  }

  function render() {
    var D = window.PP_DATA;
    if (!D) return;
    var f = state.filled;
    var type = D.PASSPORT_TYPES[state.passportType];
    var ladder = type.ladder;
    var label = f + "/21";
    document.getElementById("rw-filled-label").textContent = label;
    document.getElementById("rw-hero-label").textContent = label;

    var next = ladder.filter(function (r) { return r.stamps > f; })[0];
    var finalTitle = ladder[ladder.length - 1].title;
    var progressLine = next
      ? (next.stamps - f) + " more stamps to " + next.title.toLowerCase() + " · " + (21 - f) + " to " + finalTitle.toLowerCase()
      : "Book complete — " + finalTitle.toLowerCase() + " is yours";
    document.getElementById("rw-progress-line").textContent = progressLine;

    document.getElementById("rw-type-tabs").innerHTML = Object.keys(D.PASSPORT_TYPES).map(function (key) {
      var t = D.PASSPORT_TYPES[key];
      var on = state.passportType === key;
      return '<button type="button" data-passport-type="' + key + '" style="padding:10px 14px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? "#f7f3ec" : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + t.name + '</button>';
    }).join("");
    document.getElementById("rw-type-tagline").textContent = type.tagline;

    document.getElementById("rw-presets").innerHTML = PRESETS.map(function (n) {
      var active = n === f;
      return '<button type="button" data-preset="' + n + '" style="padding:8px 12px;background:' + (active ? "#ec3013" : "transparent") + ';border:2px solid #f7f3ec;color:' + (active ? "#fff" : "#f7f3ec") + ';font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + n + ' stamps</button>';
    }).join("");

    document.getElementById("rw-cells").innerHTML = C.map(function (c, i) {
      var stamped = i < f;
      var bg = stamped ? CREAM : "rgba(247,243,236,.08)";
      var fg = stamped ? INK : CREAM;
      var mark = "#" + String(i + 1).padStart(2, "0");
      var stampBadge = stamped
        ? '<span style="position:absolute;top:8px;right:8px;width:42px;height:42px;border:2.5px solid #ec3013;color:#ec3013;display:flex;align-items:center;justify-content:center;font:800 9.5px/1 \'Archivo\',sans-serif;transform:rotate(-10deg)">' + mark + '</span>'
        : "";
      return '<a href="destination.html#' + c[0] + '" style="position:relative;background:' + bg + ';aspect-ratio:1/1;display:flex;flex-direction:column;justify-content:flex-end;padding:9px;text-decoration:none;color:' + fg + '" data-hover="background:#ec3013;color:#fff">'
        + '<span style="font:800 15px/1 \'Archivo\',sans-serif">' + c[1] + '</span>'
        + '<span style="font:400 8.5px/1.2 \'Archivo\',sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.7">' + esc(c[2]) + '</span>'
        + stampBadge + '</a>';
    }).join("");

    document.getElementById("rw-ladder").innerHTML = ladder.map(function (l, i) {
      var done = f >= l.stamps;
      var cardBg = done ? "#fff" : CREAM;
      var colors = LADDER_COLORS[i] || [INK, CREAM];
      var stateLabel = done ? "Unlocked" : (l.stamps - f) + " to go";
      var sub = done ? "Claim at the desk" : "Stamp " + l.stamps + " unlocks this";
      return '<div data-rv="up" data-rv-d="' + (i * 70) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + cardBg + ';color:' + INK + ';padding:24px 20px 26px;display:flex;flex-direction:column;gap:13px;min-height:250px">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">'
        + '<span style="width:56px;height:56px;flex:none;background:' + colors[0] + ';color:' + colors[1] + ';display:flex;align-items:center;justify-content:center;font:800 22px/1 \'Archivo\',sans-serif">' + l.stamps + '</span>'
        + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:6px 8px;border:2px solid currentColor;opacity:.85">' + stateLabel + '</span></div>'
        + '<h3 style="font:800 22px/1.03 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(l.title) + '</h3>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.85">' + esc(l.desc) + '</p>'
        + '<span style="margin-top:auto;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.75">' + sub + '</span></div>';
    }).join("");

    document.getElementById("rw-steps").innerHTML = STEPS.map(function (s, i) {
      return '<div data-rv="up" data-rv-d="' + (i * 70) + '" style="display:flex;gap:16px;padding:17px 0;border-bottom:2px solid rgba(27,26,25,.2)">'
        + '<span style="width:42px;height:42px;flex:none;background:' + s[3] + ';color:' + s[4] + ';display:flex;align-items:center;justify-content:center;font:800 15px/1 \'Archivo\',sans-serif">' + s[0] + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 16px/1.2 \'Archivo\',sans-serif;margin-bottom:5px">' + esc(s[1]) + '</span>'
        + '<span style="display:block;font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(s[2]) + '</span></span></div>';
    }).join("");

    document.getElementById("rw-tiers").innerHTML = TIERS.map(function (t, i) {
      var key = t[0], on = state.passportType === key;
      var featuresHtml = t[6].map(function (x) {
        return '<span style="padding:9px 0;border-bottom:1px solid currentColor;font:400 12px/1.4 \'Archivo\',sans-serif;opacity:.9">' + esc(x) + '</span>';
      }).join("");
      return '<button type="button" data-passport-type="' + key + '" data-rv="up" data-rv-d="' + (i * 80) + '" style="text-align:left;cursor:pointer;border:0;border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;outline:' + (on ? "3px solid #f2b30c;outline-offset:-3px" : "none") + ';background:' + t[4] + ';color:' + t[5] + ';padding:20px 18px 22px;display:flex;flex-direction:column;gap:12px;min-height:250px" data-hover="filter:brightness(1.06)">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
        + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.75">' + esc(t[1]) + '</span>'
        + '<span style="width:36px;height:36px;flex:none;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;transform:rotate(-8deg)">' + (window.PP_ICON ? window.PP_ICON("passport" + key.charAt(0).toUpperCase() + key.slice(1), 20, "currentColor") : t[3]) + '</span></div>'
        + '<h3 style="font:800 21px/1 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(t[2]) + '</h3>'
        + '<div style="display:flex;flex-direction:column;border-top:2px solid currentColor">' + featuresHtml + '</div>'
        + '<span style="margin-top:auto;font:800 13px/1 \'Archivo\',sans-serif">' + esc(t[7]) + '</span></button>';
    }).join("");

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  window.PP_READY(function () {
    document.getElementById("rw-more").addEventListener("click", function () { setFilled(state.filled + 1); });
    document.getElementById("rw-less").addEventListener("click", function () { setFilled(state.filled - 1); });
    document.getElementById("rw-presets").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-preset]");
      if (!btn) return;
      setFilled(parseInt(btn.getAttribute("data-preset"), 10));
    });
    function onTypeClick(e) {
      var btn = e.target.closest("[data-passport-type]");
      if (!btn) return;
      state.passportType = btn.getAttribute("data-passport-type");
      render();
    }
    document.body.addEventListener("click", onTypeClick);
    if (window.PP_TRACK) window.PP_TRACK(function () { document.body.removeEventListener("click", onTypeClick); });
    render();
  });
})();
