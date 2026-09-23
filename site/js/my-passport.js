/* Patty Passport — My Passport page, ported from My-Passport.dc.html's
   x-dc template + Component logic. Front-end mock only: "creating an
   account" / "logging in" just flips local state.user, nothing is sent
   anywhere and nothing persists across a reload. Stamps, photo, and
   bookings are all in-memory mock state seeded from window.PP_DATA. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var LADDER_COLORS = [[YEL, INK], [YEL, INK], [INK, CREAM], [RED, "#fff"]];

  var MOCK_BOOKINGS = [
    { time: "25 SEP", what: "Lebanon · MED-12", detail: "Table 4 · 4 adults, 2 kids · 20:30" },
    { time: "11 OCT", what: "Morocco · MED-55", detail: "Table 9 · 2 travellers · 19:30" }
  ];

  var state = {
    modal: null, mode: "create",
    user: null, avatarUrl: null, formType: "explorer",
    // mock "already collected" stamps, seeded with real country codes from PP_DATA
    stamps: ["lbn", "grc", "esp", "mar", "tur", "ita"]
  };

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
          return '<button type="button" data-form-type="' + key + '" style="padding:9px 13px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + types[key].name + '</button>';
        }).join("") + '</div>'
        + '<p style="font:400 11.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:8px 0 0">' + esc(types[state.formType].tagline) + '</p>'
        + '</div>';
    }

    var fields = create
      ? typePicker
        + '<label style="display:block;margin-bottom:16px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Name</span>'
        + '<input id="mp-f-name" type="text" placeholder="Your name" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>'
        + '<label style="display:block;margin-bottom:16px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Email</span>'
        + '<input id="mp-f-email" type="email" placeholder="you@example.com" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>'
        + '<label style="display:block;margin-bottom:16px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">PIN</span>'
        + '<input id="mp-f-pin" type="password" placeholder="4-digit PIN" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>'
      : '<label style="display:block;margin-bottom:16px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Email</span>'
        + '<input id="mp-f-email" type="email" placeholder="you@example.com" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>'
        + '<label style="display:block;margin-bottom:16px">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">PIN</span>'
        + '<input id="mp-f-pin" type="password" placeholder="4-digit PIN" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>';

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
      + '<form id="mp-modal-form">' + fields
      + '<button type="submit" style="display:inline-flex;align-items:center;width:100%;margin-top:6px;padding:16px 18px;background:#ec3013;border:0;color:#fff;font:800 14.5px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#1b1a19">' + esc(cta) + '<span style="margin-left:auto">→</span></button>'
      + '</form>'
      + '<button type="button" id="mp-modal-switch" style="display:block;width:100%;margin-top:14px;background:transparent;border:0;color:#ae1800;font:600 12.5px/1.4 \'Archivo\',sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer">' + esc(switchLabel) + '</button>'
      + '<p style="font:400 11px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:16px 0 0">Front-end demo — no account is created and nothing is stored on a server.</p>'
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

    var cellsHtml = countries.map(function (c) {
      var on = state.stamps.indexOf(c.code) > -1;
      var bg = on ? CREAM : "#efece6";
      return '<button type="button" class="mp-cell" data-code="' + c.code + '" style="position:relative;background:' + bg + ';color:' + INK + ';aspect-ratio:1/1;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;padding:9px;border:0;cursor:pointer;text-align:left" data-hover="background:#f2b30c;color:#1b1a19">'
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
      + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d7979;margin-bottom:8px">' + esc(type ? type.name : "Explorer") + ' Passport · PP-2026-' + memberNo + '</span>'
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
      + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">Tap a country to add or remove a stamp</span></div>'
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
    root.innerHTML = modalHtml() + loggedOutHtml() + loggedInHtml();
    wireEvents(root);
    if (window.initHoverStyles) window.initHoverStyles(root);
  }

  function wireEvents(root) {
    var scrim = root.querySelector("#mp-modal-scrim");
    var closeBtn = root.querySelector("#mp-modal-close");
    var switchBtn = root.querySelector("#mp-modal-switch");
    var form = root.querySelector("#mp-modal-form");
    if (scrim) scrim.addEventListener("click", function () { state.modal = null; render(); });
    if (closeBtn) closeBtn.addEventListener("click", function () { state.modal = null; render(); });
    if (switchBtn) switchBtn.addEventListener("click", function () { state.mode = state.mode === "create" ? "login" : "create"; render(); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-form-type]"), function (btn) {
      btn.addEventListener("click", function () { state.formType = btn.getAttribute("data-form-type"); render(); });
    });
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var create = state.mode === "create";
      var nameInput = root.querySelector("#mp-f-name");
      var emailInput = root.querySelector("#mp-f-email");
      var name = create && nameInput ? nameInput.value.trim() : "";
      if (!name && emailInput && emailInput.value) name = emailInput.value.split("@")[0];
      state.user = { name: name || "Traveller", passportType: create ? state.formType : (state.user ? state.user.passportType : "explorer") || "explorer" };
      state.modal = null;
      render();
    });

    var openCreate = root.querySelector("#mp-open-create");
    var openLogin = root.querySelector("#mp-open-login");
    if (openCreate) openCreate.addEventListener("click", function () { state.modal = true; state.mode = "create"; render(); });
    if (openLogin) openLogin.addEventListener("click", function () { state.modal = true; state.mode = "login"; render(); });

    var logout = root.querySelector("#mp-logout");
    if (logout) logout.addEventListener("click", function () {
      state.user = null; state.modal = null; render();
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

    Array.prototype.forEach.call(root.querySelectorAll(".mp-cell"), function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-code");
        var i = state.stamps.indexOf(code);
        if (i > -1) state.stamps.splice(i, 1); else state.stamps.push(code);
        render();
      });
    });
  }

  window.PP_READY(function () {
    if ((location.hash || "").toLowerCase() === "#join") { state.modal = true; state.mode = "create"; }
    function onKeydown(e) { if (e.key === "Escape" && state.modal) { state.modal = null; render(); } }
    document.addEventListener("keydown", onKeydown);
    if (window.PP_TRACK) window.PP_TRACK(function () { document.removeEventListener("keydown", onKeydown); });
    render();
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    }
  });
})();
