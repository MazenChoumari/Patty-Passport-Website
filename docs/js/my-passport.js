/* Patty Passport — My Passport page, ported from My-Passport.dc.html's
   x-dc template + Component logic. "Creating an account" / "logging in"
   goes through window.PP_AUTH (js/auth.js) — a demo-only adapter that
   stores one account as plain JSON in this browser's localStorage, with
   no server, no password check and no real authentication. It persists
   across reloads (so a stamp spread survives a refresh) but is honestly
   labeled as a demo everywhere it's shown. Bookings/avatar stay
   in-memory mock state; only the account + stamp spread persist. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var LADDER_COLORS = [[YEL, INK], [BLU, "#fff"], [INK, CREAM], [RED, "#fff"]];

  var MOCK_BOOKINGS = [
    { time: "25 SEP", what: "Lebanon · MED-12", detail: "Table 4 · 4 adults, 2 kids · 20:30" },
    { time: "11 OCT", what: "Morocco · MED-55", detail: "Table 9 · 2 travellers · 19:30" }
  ];

  var ROUTE_ORDER = ["LEV", "AEG", "IBL", "ADR", "NAF"];

  var state = {
    modal: null, mode: "create", formError: null,
    user: null, avatarUrl: null, formType: "explorer",
    stamps: [],
    // Stamp-spread controls: filter by route, free-text search, and a
    // single "armed" cell awaiting a second click before a stamp is
    // actually removed (added stamps apply instantly — only removing an
    // already-earned stamp needs the confirm step).
    stampFilter: "ALL", stampSearch: "", pendingRemove: null
  };

  function syncFromAuth() {
    var rec = window.PP_AUTH && window.PP_AUTH.current();
    state.user = rec;
    state.stamps = rec && Array.isArray(rec.stamps) ? rec.stamps : [];
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function modalHtml() {
    if (!state.modal) return "";
    var create = state.mode === "create";
    var title = create ? "Create your Patty Passport" : "Welcome back, traveller";
    var line = create
      ? "One book, twenty-one stamps, four reward gates. Free — the paper copy is handed over at the desk."
      : "Sign in to see your stamps, rewards and upcoming departures.";
    var cta = create ? "Create my Patty Passport" : "Log in";
    var switchLabel = create ? "Already have a passport? Log in instead" : "No passport yet? Create one instead";

    var typePicker = "";
    if (create && window.PP_DATA) {
      var types = window.PP_DATA.PASSPORT_TYPES;
      typePicker = '<div style="margin-bottom:18px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Passport type</span>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px">' + Object.keys(types).map(function (key) {
          var on = state.formType === key;
          var iconHtml = window.PP_ICON ? window.PP_ICON("passport" + key.charAt(0).toUpperCase() + key.slice(1), 18, "currentColor") : "";
          return '<button type="button" data-form-type="' + key + '" aria-pressed="' + (on ? "true" : "false") + '" style="display:inline-flex;align-items:center;gap:8px;padding:9px 13px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + iconHtml + types[key].name + '</button>';
        }).join("") + '</div>'
        + '<p style="font:400 11.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:8px 0 0">' + esc(types[state.formType].tagline) + '</p>'
        + '</div>';
    }

    var fields = create
      ? typePicker
        + '<label style="display:block;margin-bottom:16px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Name</span>'
        + '<input id="mp-f-name" type="text" placeholder="Your name" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>'
        + '<label style="display:block;margin-bottom:6px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Email</span>'
        + '<input id="mp-f-email" type="email" placeholder="you@example.com" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>'
      : '<label style="display:block;margin-bottom:6px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Email</span>'
        + '<input id="mp-f-email" type="email" placeholder="you@example.com" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>';

    var errorHtml = state.formError
      ? '<p style="font:700 12px/1.5 \'Archivo\',sans-serif;color:#ae1800;margin:0 0 14px;padding:9px 12px;border:1.5px solid #ae1800;background:rgba(174,24,0,.08)">' + esc(state.formError) + '</p>'
      : "";

    return '<div style="position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;padding:24px;animation:ppFade .2s ease both">'
      + '<div id="mp-modal-scrim" style="position:absolute;inset:0;background:rgba(27,26,25,.68)"></div>'
      + '<div style="position:relative;width:min(460px,100%);background:#f7f3ec;border:2px solid #1b1a19;box-shadow:18px 18px 0 rgba(27,26,25,.4);animation:ppLand .32s cubic-bezier(.2,.85,.25,1) both">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#1b1a19;color:#f7f3ec">'
      + '<span style="display:flex;align-items:center;gap:9px;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase"><span style="width:7px;height:7px;background:#f2b30c;animation:ppBlink 1.3s steps(1) infinite"></span>Passport desk</span>'
      + '<button type="button" id="mp-modal-close" style="background:transparent;border:2px solid rgba(247,243,236,.5);color:#f7f3ec;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;padding:8px 11px;cursor:pointer" data-hover="background:#ec3013;border-color:#ec3013">CLOSE ✕</button>'
      + '</div>'
      + '<div style="padding:26px 22px 24px">'
      + '<h2 style="font:800 30px/1 \'Archivo\',sans-serif;letter-spacing:-.035em;margin:0 0 8px">' + esc(title) + '</h2>'
      + '<p style="font:400 13.5px/1.55 \'Archivo\',sans-serif;color:#605d5d;margin:0 0 22px">' + esc(line) + '</p>'
      + errorHtml
      + '<form id="mp-modal-form">' + fields
      + '<button type="submit" style="display:inline-flex;align-items:center;width:100%;margin-top:6px;padding:16px 18px;background:#ec3013;border:0;color:#fff;font:800 14.5px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#1b1a19">' + esc(cta) + '<span style="margin-left:auto">→</span></button>'
      + '</form>'
      + '<button type="button" id="mp-modal-switch" style="display:block;width:100%;margin-top:14px;background:transparent;border:0;color:#ae1800;font:600 12.5px/1.4 \'Archivo\',sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer">' + esc(switchLabel) + '</button>'
      + '<p style="font:400 11px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:16px 0 0">Demo account — stored only as plain data in this browser’s local storage, not on a server, with no password check. Not a real, secure account: don’t use a real password here.</p>'
      + '</div></div></div>';
  }

  function loggedOutHtml() {
    if (state.user) return "";
    return '<section style="position:relative;background:#f7f3ec;border-bottom:2px solid #1b1a19;overflow:hidden">'
      + '<div style="position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(236,48,19,.1) 1px,transparent 1px);background-size:98px 100%"></div>'
      + '<div class="pp-2col" style="position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr)">'
      + '<div style="padding:58px 44px 54px;border-right:2px solid #1b1a19">'
      + '<div style="display:inline-flex;align-items:center;gap:9px;background:#ec3013;color:#fff;padding:7px 12px;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;margin-bottom:22px">'
      + '<span style="width:7px;height:7px;background:#f2b30c;animation:ppBlink 1.3s steps(1) infinite"></span>My passport · sign in</div>'
      + '<h1 style="font:800 clamp(40px,5.8vw,88px)/.9 \'Archivo\',sans-serif;letter-spacing:-.045em;margin:0 0 18px;max-width:14ch">YOUR BOOK IS WAITING AT THE DESK.</h1>'
      + '<p style="font:400 clamp(15px,1.2vw,17.5px)/1.55 \'Archivo\',sans-serif;color:#444141;max-width:52ch;margin:0 0 28px">Create a Patty Passport to see the stamps you\'ve collected, what the next reward unlocks, and the routes you have booked. Free, and the paper book comes with it at check-in.</p>'
      + '<div style="display:flex;flex-wrap:wrap;gap:12px">'
      + '<button type="button" id="mp-open-create" style="display:inline-flex;align-items:center;min-width:260px;padding:17px 20px;background:#ec3013;border:0;color:#fff;font:800 15px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#1b1a19">Create my Patty Passport<span style="margin-left:auto">→</span></button>'
      + '<button type="button" id="mp-open-login" style="display:inline-flex;align-items:center;min-width:200px;padding:17px 20px;border:2px solid #1b1a19;background:transparent;color:#1b1a19;font:800 15px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c">Log in<span style="margin-left:auto">→</span></button>'
      + '</div></div>'
      + '<div style="position:relative;min-height:420px;background:#2b76c9">'
      + '<div class="pp-placeholder" style="position:absolute;inset:0"><span>Open passport booklet with stamps across the spread</span></div>'
      + '<div style="position:absolute;left:0;right:0;bottom:0;padding:13px 18px;background:rgba(27,26,25,.92);color:#f7f3ec;font:600 9.5px/1.5 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;pointer-events:none">21 countries · 4 reward gates · nothing expires</div>'
      + '</div></div></section>';
  }

  function loggedInHtml() {
    if (!state.user) return "";
    var D = window.PP_DATA;
    var countries = D ? D.COUNTRIES : [];
    var passportType = state.user.passportType || "explorer";
    var type = D ? D.PASSPORT_TYPES[passportType] : null;
    var LADDER_DEFS = type ? type.ladder.map(function (r, i) { return [r.stamps, r.title, r.desc].concat(LADDER_COLORS[i] || [INK, CREAM]); }) : [];
    var filled = state.stamps.length;
    var next = LADDER_DEFS.find(function (l) { return filled < l[0]; });
    var memberNo = "0" + (100 + filled * 7);

    var stats = [
      { n: String(filled), label: "Stamps collected", bg: CREAM, fg: INK },
      { n: String(21 - filled), label: "Countries to go", bg: "#e7e3dc", fg: INK },
      { n: next ? String(next[0] - filled) : "0", label: next ? "Stamps to the next reward" : "Book complete", bg: YEL, fg: INK },
      { n: String(LADDER_DEFS.filter(function (l) { return filled >= l[0]; }).length), label: "Rewards unlocked", bg: RED, fg: "#fff" }
    ];

    var statsHtml = stats.map(function (s) {
      return '<div style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + s.bg + ';color:' + s.fg + ';padding:20px 18px 22px">'
        + '<div style="font:800 34px/1 \'Archivo\',sans-serif;letter-spacing:-.035em">' + s.n + '</div>'
        + '<div style="font:600 9.5px/1.45 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-top:8px;opacity:.78">' + s.label + '</div></div>';
    }).join("");

    var filterKeys = ["ALL"].concat(ROUTE_ORDER);
    var filterBarHtml = '<div role="group" aria-label="Filter by route" style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px">' + filterKeys.map(function (k) {
      var label = k === "ALL" ? "All routes" : (D.ROUTES[k] ? D.ROUTES[k].name : k);
      var active = state.stampFilter === k;
      return '<button type="button" data-stamp-filter="' + k + '" aria-pressed="' + (active ? "true" : "false") + '" style="padding:7px 11px;background:' + (active ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (active ? CREAM : INK) + ';font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + esc(label) + '</button>';
    }).join("") + '</div>';

    var clearLabel = state.stampFilter === "ALL" ? "Clear all stamps" : "Clear " + (D.ROUTES[state.stampFilter] ? D.ROUTES[state.stampFilter].name : "route") + " stamps";
    var actionBarHtml = '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px">'
      + '<label style="flex:1;min-width:170px">'
      + '<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Search countries</span>'
      + '<input type="search" id="mp-stamp-search" value="' + esc(state.stampSearch) + '" placeholder="Search a country…" style="width:100%;padding:9px 11px;border:2px solid #1b1a19;background:#fff;font:600 12px/1.3 \'Archivo\',sans-serif;color:#1b1a19;outline:none" /></label>'
      + '<button type="button" id="mp-stamp-select-all" style="padding:9px 12px;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap" data-hover="background:#1b1a19;color:#fff">Select all 21</button>'
      + '<button type="button" id="mp-stamp-clear-route" style="padding:9px 12px;background:transparent;border:2px solid #ae1800;color:#ae1800;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap" data-hover="background:#ae1800;color:#fff">' + esc(clearLabel) + '</button>'
      + '</div>';

    var q = state.stampSearch.trim().toLowerCase();
    var visibleCountries = countries.filter(function (c) {
      if (state.stampFilter !== "ALL" && c.routeKey !== state.stampFilter) return false;
      if (q && c.name.toLowerCase().indexOf(q) === -1 && c.code.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    var cellsHtml = !visibleCountries.length
      ? '<div style="grid-column:1/-1;padding:24px;text-align:center;background:#efece6;font:600 12px/1.5 \'Archivo\',sans-serif;color:#7d7979">No countries match that search.</div>'
      : visibleCountries.map(function (c) {
        var on = state.stamps.indexOf(c.code) > -1;
        var confirming = state.pendingRemove === c.code;
        var bg = confirming ? "#fff" : (on ? CREAM : "#efece6");
        if (confirming) {
          return '<div class="mp-cell" data-code="' + c.code + '" style="position:relative;background:' + bg + ';color:' + INK + ';aspect-ratio:1/1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:6px;padding:8px;border:2px solid #ae1800;text-align:center">'
            + '<span style="font:700 10px/1.3 \'Archivo\',sans-serif">Remove ' + esc(c.name) + ' stamp?</span>'
            + '<span style="display:flex;gap:6px">'
            + '<button type="button" data-confirm-remove="' + c.code + '" style="padding:5px 9px;background:#ae1800;color:#fff;border:0;font:800 9px/1 \'Archivo\',sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer" data-hover="background:#7a1200">Remove</button>'
            + '<button type="button" data-cancel-remove="' + c.code + '" style="padding:5px 9px;background:transparent;color:' + INK + ';border:1.5px solid #1b1a19;font:800 9px/1 \'Archivo\',sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer" data-hover="background:#1b1a19;color:#fff">Cancel</button>'
            + '</span></div>';
        }
        return '<button type="button" class="mp-cell" data-stamp-toggle="' + c.code + '" aria-pressed="' + (on ? "true" : "false") + '" style="position:relative;background:' + bg + ';color:' + INK + ';aspect-ratio:1/1;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;padding:9px;border:0;cursor:pointer;text-align:left" data-hover="background:#f2b30c;color:#1b1a19">'
          + '<span style="font:800 14px/1 \'Archivo\',sans-serif">' + c.code.toUpperCase() + '</span>'
          + '<span style="font:400 8.5px/1.2 \'Archivo\',sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.72">' + esc(c.name) + '</span>'
          + (on ? '<span style="position:absolute;top:8px;right:8px;width:40px;height:40px;border:2.5px solid #ec3013;color:#ec3013;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif;transform:rotate(-10deg)">' + c.stamp + '</span>' : "")
          + '</button>';
      }).join("");

    var ladderHtml = LADDER_DEFS.map(function (l) {
      var done = filled >= l[0];
      return '<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:2px solid rgba(27,26,25,.18)">'
        + '<span style="width:46px;height:46px;flex:none;background:' + l[3] + ';color:' + l[4] + ';display:flex;align-items:center;justify-content:center;font:800 17px/1 \'Archivo\',sans-serif">' + l[0] + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 15px/1.15 \'Archivo\',sans-serif">' + esc(l[1]) + '</span>'
        + '<span style="display:block;font:400 11.5px/1.4 \'Archivo\',sans-serif;color:#605d5d;margin-top:3px">' + esc(l[2]) + '</span></span>'
        + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.13em;text-transform:uppercase;color:' + (done ? "#ae1800" : "#7d7979") + ';white-space:nowrap">' + (done ? "Unlocked" : (l[0] - filled) + " to go") + '</span></div>';
    }).join("");

    var bookingsHtml = MOCK_BOOKINGS.map(function (b) {
      return '<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid rgba(247,243,236,.22)">'
        + '<span style="font:800 13px/1 \'Archivo\',sans-serif;color:#f2b30c;width:70px;flex:none">' + b.time + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 14px/1.15 \'Archivo\',sans-serif">' + esc(b.what) + '</span>'
        + '<span style="display:block;font:400 11.5px/1.4 \'Archivo\',sans-serif;color:#bab6b6;margin-top:3px">' + esc(b.detail) + '</span></span></div>';
    }).join("");

    var avatarInner = state.avatarUrl
      ? '<img src="' + state.avatarUrl + '" alt="Your passport photo" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />'
      : '<div class="pp-placeholder" style="position:absolute;inset:0;padding:4px"><span>Your passport photo</span></div>';

    return '<section style="background:#f7f3ec;border-bottom:2px solid #1b1a19;padding:44px 0 50px">'
      + '<div style="max-width:1340px;margin:0 auto;padding:0 32px">'
      + '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:20px;margin-bottom:32px">'
      + '<span style="position:relative;width:86px;height:86px;flex:none;border:2px solid #1b1a19">' + avatarInner
      + '<button type="button" id="mp-avatar-btn" title="Upload passport photo" style="position:absolute;right:-6px;bottom:-6px;width:28px;height:28px;border:2px solid #1b1a19;background:#f2b30c;color:#1b1a19;font:800 13px/1 \'Archivo\',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center" data-hover="background:#ec3013;color:#fff">+</button>'
      + '<input type="file" id="mp-avatar-input" accept="image/*" style="display:none" />'
      + '</span>'
      + '<span style="flex:1;min-width:200px">'
      + '<span style="display:flex;align-items:center;gap:7px;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d7979;margin-bottom:8px">' + (window.PP_ICON ? window.PP_ICON("passport" + passportType.charAt(0).toUpperCase() + passportType.slice(1), 15, "#7d7979") : "") + esc(type ? type.name : "Explorer") + ' Passport · PP-2026-' + memberNo + '</span>'
      + '<span style="display:block;font:800 clamp(30px,4vw,56px)/.95 \'Archivo\',sans-serif;letter-spacing:-.04em">' + esc(state.user.name.toUpperCase()) + '</span></span>'
      + '<span style="display:flex;flex-wrap:wrap;gap:10px">'
      + '<a href="booking.html" style="display:inline-flex;align-items:center;padding:14px 17px;background:#ec3013;color:#fff;text-decoration:none;font:800 13px/1.1 \'Archivo\',sans-serif" data-hover="background:#1b1a19">Book the next route<span style="margin-left:12px">→</span></a>'
      + '<button type="button" id="mp-logout" style="padding:14px 17px;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:800 13px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c">Log out</button>'
      + '</span></div>'

      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));border-top:2px solid #1b1a19;border-left:2px solid #1b1a19;margin-bottom:34px">' + statsHtml + '</div>'

      + '<div class="pp-2col" style="display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:36px;align-items:start">'
      + '<div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px">'
      + '<h2 style="font:800 clamp(22px,2.6vw,34px)/1 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:0">YOUR STAMP SPREAD</h2>'
      + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">Tap to add · tap again to remove</span></div>'
      + filterBarHtml + actionBarHtml
      + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:2px;background:rgba(27,26,25,.35);border:2px solid #1b1a19">' + cellsHtml + '</div>'
      + '</div>'

      + '<div>'
      + '<h2 style="font:800 clamp(22px,2.6vw,34px)/1 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:0 0 14px">REWARDS</h2>'
      + '<div style="border:2px solid #1b1a19;background:#fff">' + ladderHtml + '</div>'

      + '<h2 style="font:800 clamp(22px,2.6vw,34px)/1 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:28px 0 14px">UPCOMING</h2>'
      + '<div style="border:2px solid #1b1a19;background:#1b1a19;color:#f7f3ec">' + bookingsHtml
      + '<div style="padding:14px 16px"><a href="booking.html" style="display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:12px 14px;background:#f2b30c;color:#1b1a19;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase" data-hover="background:#ec3013;color:#fff">Add a departure<span>→</span></a></div>'
      + '</div></div>'
      + '</div></div></section>';
  }

  function render() {
    var root = document.getElementById("mp-app");
    if (!root) return;
    // Every state change re-renders the whole panel via innerHTML, which
    // would normally steal focus/cursor position out of the search box
    // on every keystroke — capture and restore it around the rebuild so
    // typing a search term stays uninterrupted.
    var active = document.activeElement;
    var refocusId = active && active.id === "mp-stamp-search" ? active.id : null;
    var selStart = refocusId ? active.selectionStart : null;
    var selEnd = refocusId ? active.selectionEnd : null;
    root.innerHTML = modalHtml() + loggedOutHtml() + loggedInHtml();
    wireEvents(root);
    if (window.initHoverStyles) window.initHoverStyles(root);
    if (refocusId) {
      var el = document.getElementById(refocusId);
      if (el) {
        el.focus();
        if (selStart != null && el.setSelectionRange) el.setSelectionRange(selStart, selEnd);
      }
    }
  }

  function wireEvents(root) {
    var scrim = root.querySelector("#mp-modal-scrim");
    var closeBtn = root.querySelector("#mp-modal-close");
    var switchBtn = root.querySelector("#mp-modal-switch");
    var form = root.querySelector("#mp-modal-form");
    if (scrim) scrim.addEventListener("click", function () { state.modal = null; render(); });
    if (closeBtn) closeBtn.addEventListener("click", function () { state.modal = null; render(); });
    if (switchBtn) switchBtn.addEventListener("click", function () { state.mode = state.mode === "create" ? "login" : "create"; state.formError = null; render(); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-form-type]"), function (btn) {
      btn.addEventListener("click", function () { state.formType = btn.getAttribute("data-form-type"); render(); });
    });
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var create = state.mode === "create";
      var nameInput = root.querySelector("#mp-f-name");
      var emailInput = root.querySelector("#mp-f-email");
      var email = emailInput ? emailInput.value.trim() : "";
      state.formError = null;
      if (create) {
        var name = nameInput ? nameInput.value.trim() : "";
        if (!name && email) name = email.split("@")[0];
        window.PP_AUTH.signUp({ name: name || "Traveller", email: email, passportType: state.formType, stamps: [] });
        syncFromAuth();
        state.modal = null;
      } else {
        var rec = window.PP_AUTH.logIn(email);
        if (!rec) {
          state.formError = "No demo passport found on this browser for that email — this only resumes an account created on this device. Create one instead?";
        } else {
          syncFromAuth();
          state.modal = null;
        }
      }
      render();
    });

    var openCreate = root.querySelector("#mp-open-create");
    var openLogin = root.querySelector("#mp-open-login");
    if (openCreate) openCreate.addEventListener("click", function () { state.modal = true; state.mode = "create"; state.formError = null; render(); });
    if (openLogin) openLogin.addEventListener("click", function () { state.modal = true; state.mode = "login"; state.formError = null; render(); });

    var logout = root.querySelector("#mp-logout");
    if (logout) logout.addEventListener("click", function () {
      window.PP_AUTH.logOut();
      syncFromAuth();
      state.modal = null;
      render();
    });

    var avatarBtn = root.querySelector("#mp-avatar-btn");
    var avatarInput = root.querySelector("#mp-avatar-input");
    if (avatarBtn && avatarInput) {
      avatarBtn.addEventListener("click", function () { avatarInput.click(); });
      avatarInput.addEventListener("change", function () {
        var file = avatarInput.files && avatarInput.files[0];
        if (!file) return;
        if (state.avatarUrl) URL.revokeObjectURL(state.avatarUrl);
        state.avatarUrl = URL.createObjectURL(file);
        render();
      });
    }

    Array.prototype.forEach.call(root.querySelectorAll("[data-stamp-filter]"), function (btn) {
      btn.addEventListener("click", function () {
        state.stampFilter = btn.getAttribute("data-stamp-filter");
        state.pendingRemove = null;
        render();
      });
    });

    var search = root.querySelector("#mp-stamp-search");
    if (search) search.addEventListener("input", function () {
      state.stampSearch = search.value;
      state.pendingRemove = null;
      render();
    });

    var selectAll = root.querySelector("#mp-stamp-select-all");
    if (selectAll) selectAll.addEventListener("click", function () {
      var D = window.PP_DATA;
      if (!D) return;
      state.stamps = D.COUNTRIES.map(function (c) { return c.code; });
      window.PP_AUTH.update({ stamps: state.stamps });
      render();
    });

    var clearRoute = root.querySelector("#mp-stamp-clear-route");
    if (clearRoute) clearRoute.addEventListener("click", function () {
      var D = window.PP_DATA;
      if (!D) return;
      if (state.stampFilter === "ALL") {
        state.stamps = [];
      } else {
        var routeCodes = D.COUNTRIES.filter(function (c) { return c.routeKey === state.stampFilter; }).map(function (c) { return c.code; });
        state.stamps = state.stamps.filter(function (code) { return routeCodes.indexOf(code) === -1; });
      }
      state.pendingRemove = null;
      window.PP_AUTH.update({ stamps: state.stamps });
      render();
    });

    // Adding a stamp applies instantly (harmless, additive); removing an
    // already-earned one arms a confirm step on that cell first instead
    // of removing on the same click, so a stray tap can't erase a real
    // stamp — the second click (or Cancel) resolves it.
    Array.prototype.forEach.call(root.querySelectorAll("[data-stamp-toggle]"), function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-stamp-toggle");
        if (state.stamps.indexOf(code) > -1) {
          state.pendingRemove = code;
          render();
          return;
        }
        state.stamps.push(code);
        window.PP_AUTH.update({ stamps: state.stamps });
        render();
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-confirm-remove]"), function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-confirm-remove");
        var i = state.stamps.indexOf(code);
        if (i > -1) state.stamps.splice(i, 1);
        state.pendingRemove = null;
        window.PP_AUTH.update({ stamps: state.stamps });
        render();
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-cancel-remove]"), function (btn) {
      btn.addEventListener("click", function () { state.pendingRemove = null; render(); });
    });
  }

  window.PP_READY(function () {
    syncFromAuth();
    if ((location.hash || "").toLowerCase() === "#join" && !state.user) { state.modal = true; state.mode = "create"; }
    function onKeydown(e) {
      if (e.key !== "Escape") return;
      if (state.modal) { state.modal = null; render(); }
      else if (state.pendingRemove) { state.pendingRemove = null; render(); }
    }
    document.addEventListener("keydown", onKeydown);
    if (window.PP_TRACK) window.PP_TRACK(function () { document.removeEventListener("keydown", onKeydown); });
    // Stay in sync with the account even if it changes from another open
    // tab (sign out there, a stamp added there) — re-syncs and re-renders
    // this page live instead of only reflecting whatever was true when
    // this page first loaded.
    if (window.PP_AUTH) {
      var offAuth = window.PP_AUTH.onChange(function () { syncFromAuth(); render(); });
      if (window.PP_TRACK) window.PP_TRACK(offAuth);
    }
    render();
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    }
  });
})();
