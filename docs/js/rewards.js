/* Patty Passport — rewards / passport stamp ladder page, ported from
   Rewards.dc.html's x-dc template + Component logic. The ladder, steps
   and passport-type tiers below are marketing info and stay browsable
   by anyone. "Your spread" — the actual 21-cell stamp grid and stamp
   count — is real data from window.PP_AUTH (js/auth.js): signed out it
   shows a locked/empty state with a sign-in prompt instead of a public
   +/- stepper or preset buttons a visitor could use to fake a stamp
   count; signed in it reads the account's real stamps. Stamps are only
   ever added/removed from My Passport (task 137), never from here. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var C = [
    ["lbn", "LBN", "Lebanon"], ["syr", "SYR", "Syria"], ["pse", "PSE", "Palestine"], ["tur", "TUR", "Türkiye"],
    ["cyp", "CYP", "Cyprus"], ["grc", "GRC", "Greece"], ["ita", "ITA", "Italy"], ["esp", "ESP", "Spain"],
    ["fra", "FRA", "France"], ["mco", "MCO", "Monaco"], ["mlt", "MLT", "Malta"], ["svn", "SVN", "Slovenia"],
    ["hrv", "HRV", "Croatia"], ["bih", "BIH", "Bosnia"], ["mne", "MNE", "Montenegro"], ["alb", "ALB", "Albania"],
    ["egy", "EGY", "Egypt"], ["lby", "LBY", "Libya"], ["tun", "TUN", "Tunisia"], ["dza", "DZA", "Algeria"], ["mar", "MAR", "Morocco"]
  ];
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

  var state = { passportType: "explorer" };

  // Pulls real signed-in data every render instead of caching it in
  // `state`, so a sign-in/out or a stamp change from another tab (via
  // PP_AUTH.onChange, wired below) is always reflected immediately.
  function authedStamps() {
    var user = window.PP_AUTH && window.PP_AUTH.current();
    return user && Array.isArray(user.stamps) ? user.stamps : null;
  }

  function render() {
    var D = window.PP_DATA;
    if (!D) return;
    var user = window.PP_AUTH && window.PP_AUTH.current();
    var stamps = authedStamps();
    var signedIn = !!user;
    if (signedIn && user.passportType) state.passportType = user.passportType;
    var f = signedIn ? stamps.length : 0;
    var type = D.PASSPORT_TYPES[state.passportType];
    var ladder = type.ladder;
    var label = f + "/21";
    document.getElementById("rw-hero-label").textContent = label;

    var next = ladder.filter(function (r) { return r.stamps > f; })[0];
    var finalTitle = ladder[ladder.length - 1].title;
    var progressLine = !signedIn
      ? "Sign in to track real progress toward " + finalTitle.toLowerCase()
      : next
        ? (next.stamps - f) + " more stamps to " + next.title.toLowerCase() + " · " + (21 - f) + " to " + finalTitle.toLowerCase()
        : "Book complete — " + finalTitle.toLowerCase() + " is yours";
    document.getElementById("rw-progress-line").textContent = progressLine;

    document.getElementById("rw-type-tabs").innerHTML = Object.keys(D.PASSPORT_TYPES).map(function (key) {
      var t = D.PASSPORT_TYPES[key];
      var on = state.passportType === key;
      var iconHtml = window.PP_ICON ? window.PP_ICON("passport" + key.charAt(0).toUpperCase() + key.slice(1), 16, "currentColor") : "";
      return '<button type="button" data-passport-type="' + key + '" aria-pressed="' + (on ? "true" : "false") + '" style="display:inline-flex;align-items:center;gap:8px;padding:10px 14px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? "#f7f3ec" : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + iconHtml + t.name + '</button>';
    }).join("");
    document.getElementById("rw-type-tagline").textContent = type.tagline;

    // "Your spread" tag + gate note: signed in shows a live pill and a
    // link to manage stamps at My Passport (the only place stamps are
    // ever added/removed); signed out shows a sign-in prompt instead of
    // a public stepper anyone could use to fake a stamp count.
    var tagEl = document.getElementById("rw-spread-tag");
    if (tagEl) {
      tagEl.innerHTML = signedIn
        ? '<span style="display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border:2px solid #f2b30c;color:#f2b30c;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase"><span style="width:6px;height:6px;background:#f2b30c;border-radius:50%"></span>Live from your account</span>'
        : '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">Not signed in</span>';
    }
    var gateEl = document.getElementById("rw-gate-note");
    if (gateEl) {
      gateEl.innerHTML = signedIn
        ? '<a href="my-passport.html" style="display:inline-flex;align-items:center;gap:8px;color:#f2b30c;text-decoration:none;font:700 12.5px/1.4 \'Archivo\',sans-serif" data-hover="color:#fff">Manage stamps in My Passport<span>→</span></a>'
        : '<div style="border:2px solid #f7f3ec;padding:16px 18px;display:flex;flex-wrap:wrap;align-items:center;gap:14px;justify-content:space-between">'
          + '<span style="font:400 13px/1.5 \'Archivo\',sans-serif;color:#bab6b6;max-width:46ch">Sign in to see your real stamp spread here — the grid below is empty until then. Stamps are only ever added at the table, never from a public control on this page.</span>'
          + '<a href="my-passport.html#join" style="flex:none;display:inline-flex;align-items:center;padding:12px 16px;background:#f2b30c;color:#1b1a19;text-decoration:none;font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase" data-hover="background:#fff">Sign in<span style="margin-left:10px">→</span></a>'
          + '</div>';
    }

    document.getElementById("rw-cells").innerHTML = C.map(function (c, i) {
      var stamped = signedIn && stamps.indexOf(c[0]) > -1;
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

    renderFinalCallBoard(D);

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  // Real Europe/Madrid open/closed state from the same hours shown on
  // Our Story — no fabricated countdown, just today's actual weekday
  // window. HOURS[0] = weekdays, HOURS[1] = weekends & holidays.
  function deskStatus(D) {
    if (!D || !D.HOURS) return null;
    var fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" });
    var parts = fmt.formatToParts(new Date());
    var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ""; };
    var weekday = get("weekday");
    var minutes = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
    var isWeekend = weekday === "Sat" || weekday === "Sun";
    var range = isWeekend ? D.HOURS[1] : D.HOURS[0];
    var m = range.time.match(/(\d{2}):(\d{2}).*?(\d{2}):(\d{2})/);
    if (!m) return null;
    var openMin = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    var closeRaw = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
    var closeMin = closeRaw === 0 ? 24 * 60 : closeRaw;
    return { open: minutes >= openMin && minutes < closeMin, days: range.days, hours: range.time };
  }

  var ROUTE_ORDER = ["LEV", "AEG", "IBL", "ADR", "NAF"];
  function renderFinalCallBoard(D) {
    var statusEl = document.getElementById("rw-desk-status");
    var status = deskStatus(D);
    if (statusEl) {
      statusEl.textContent = status ? (status.open ? "Desk open now" : "Desk closed now") : "";
      statusEl.style.display = status ? "inline-flex" : "none";
      statusEl.title = status ? status.days + " · " + status.hours : "";
    }

    // A continuously-scrolling departures board: all five routes, each
    // row a solid block in its own route color (not just a small dot)
    // so it reads clearly against this section's red backdrop, looping
    // top-to-bottom forever. The route list is rendered twice back to
    // back and the CSS animation (ppDepartScroll, in rewards.html)
    // translates the track up by exactly one copy's height, so the
    // loop point is seamless — pausable on hover/focus for anyone who
    // wants to actually read one and click through.
    var board = document.getElementById("rw-departures-track");
    if (!board) return;
    var ROW_H = 44;
    function rows() {
      return ROUTE_ORDER.map(function (key) {
        var route = D.ROUTES[key];
        var count = D.COUNTRIES.filter(function (c) { return c.routeKey === key; }).length;
        return '<a href="route-map.html" style="display:flex;align-items:center;gap:12px;height:' + ROW_H + 'px;padding:0 15px;text-decoration:none;color:' + route.fg + ';background:' + route.bg + ';border-top:1px solid rgba(27,26,25,.2)" data-hover="filter:brightness(1.08)">'
          + '<span style="flex:1;min-width:0"><span style="display:block;font:800 13px/1.2 \'Archivo\',sans-serif">' + esc(route.name) + ' route</span>'
          + '<span style="display:block;font:400 10px/1.3 \'Archivo\',sans-serif;opacity:.8">' + count + ' destinations · stamp available</span></span>'
          + '<span style="font:800 11px/1 \'Archivo\',sans-serif">→</span></a>';
      }).join("");
    }
    board.innerHTML = rows() + rows();
  }

  window.PP_READY(function () {
    function onTypeClick(e) {
      var btn = e.target.closest("[data-passport-type]");
      if (!btn) return;
      state.passportType = btn.getAttribute("data-passport-type");
      render();
    }
    document.body.addEventListener("click", onTypeClick);
    if (window.PP_AUTH) {
      var offAuth = window.PP_AUTH.onChange(render);
      if (window.PP_TRACK) window.PP_TRACK(offAuth);
    }
    if (window.PP_TRACK) window.PP_TRACK(function () { document.body.removeEventListener("click", onTypeClick); });
    var deskTimer = setInterval(function () { if (window.PP_DATA) renderFinalCallBoard(window.PP_DATA); }, 60000);
    if (window.PP_TRACK) window.PP_TRACK(function () { clearInterval(deskTimer); });
    render();
  });
})();
