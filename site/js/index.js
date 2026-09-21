/* Patty Passport — Home page interactivity. Drives every dynamic hook left
   in index.html: scroll-reveal (data-rv), word-stagger headlines
   (data-word-group + gh-* ids), background parallax (data-par), the
   data-driven hero prop columns / ticker / identity carousel / culture
   eq bars / passport preview (all sourced from window.PP_DATA), the
   boarding-pass print sequence, the mini Patty Tooty preview, and the
   check-in console's route filter chips. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  /* ── Headline copy for the word-stagger sections ── */
  var HEADLINES = {
    "gh-pass": "PRINTED AT THE DESK. YOURS TO KEEP.",
    "gh-map": "THE MEDITERRANEAN, ONE TERMINAL.",
    "gh-regions": "FIVE ROUTES. TWENTY-ONE DESTINATIONS.",
    "gh-culture": "EVERY ZONE HAS A SOUNDTRACK.",
    "gh-nature": "THE LAND BEHIND EVERY PLATE.",
    "gh-garden": "A GARDEN FOR TWENTY-ONE COUNTRIES.",
    "gh-passport": "FILL THE BOOK. FLY AGAIN.",
    "gh-kit": "SMALL TRAVELLERS GET THE FULL KIT.",
    "gh-adultkit": "GROWN-UPS TRAVEL PROPERLY TOO.",
    "gh-family": "EVERYONE GETS A PASSPORT.",
    "gh-welcome": "THERE'S A LANE FOR EVERYONE.",
    "gh-crew": "MEET THE JOURNEY CREW.",
    "gh-invest": "HELP US FLY THE NEXT ROUTE.",
    "gh-tooty": "NOT SURE WHERE TO HEAD?",
    "gh-checkin": "READY TO CHECK IN?"
  };

  /* Sets each gh-* heading's plain text once; js/reveal.js wordifies it
     into staggered spans and handles the (re-triggering) reveal. */
  function setHeadlineText() {
    Object.keys(HEADLINES).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el._ppTextSet) return;
      el._ppTextSet = true;
      el.textContent = HEADLINES[id];
    });
  }

  /* ── Background parallax circles: data-par="0.12" ── */
  function initParallax() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-par]"));
    if (!els.length) return;
    function tick() {
      els.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-par")) || 0;
        var r = el.parentElement.getBoundingClientRect();
        var center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = (el.style.transform.indexOf("rotate") > -1 ? el.style.transform.replace(/translateY\([^)]*\)\s*/, "") : "") ;
        el.style.transform = "translateY(" + (center * -f * 0.15).toFixed(1) + "px)";
      });
    }
    var raf = null;
    function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = null; tick(); }); }
    window.addEventListener("scroll", onScroll, { passive: true });
    if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("scroll", onScroll); });
    tick();
  }

  function eur(n) { return "€" + n.toFixed(2).replace(/\.00$/, ".0"); }

  /* ── Hero flowing prop columns ── */
  /* Boarding-ticket props for the hero's two flowing columns — ported
     verbatim (kind/code/big/sub/colors/tilt) from the original design's
     propDefs in Patty Passport Home.dc.html, made clickable into the
     matching country page. */
  function renderHeroProps(countries) {
    var byCode = {};
    countries.forEach(function (c) { byCode[c.code] = c; });
    var propDefs = [
      ["Boarding ticket", "MED-12", "LEBANON", "Gate Levant · Table 4", CREAM, INK, "lbn"],
      ["Language card", "MED-23", "Καλώς ήρθατε", "Greece · Kalós irthate", "#fff", INK, "grc"],
      ["Luggage tag", "MED-55", "MAR · 55", "Morocco · N. Africa route", RED, "#fff", "mar"],
      ["Gate call", "MED-32", "ESPAÑA", "Now boarding · Table 11", INK, CREAM, "esp"],
      ["Destination pack", "MED-21", "Hoş geldiniz", "Türkiye · two seas", YEL, INK, "tur"],
      ["Stamp receipt", "MED-31", "ITALIA", "Stamp #07 collected", CREAM, INK, "ita"],
      ["Boarding ticket", "MED-35", "MALTA", "Gate Islands · Table 2", "#fff", INK, "mlt"],
      ["Language card", "MED-43", "Dobro došli", "Bosnia · Adriatic route", YEL, INK, "bih"],
      ["Luggage tag", "MED-51", "EGY · 51", "Egypt · gift of the river", INK, CREAM, "egy"],
      ["Gate call", "MED-42", "HRVATSKA", "Final call · Table 8", BLU, "#fff", "hrv"],
      ["Destination pack", "MED-14", "أهلا وسهلا", "Palestine · Levant route", CREAM, INK, "pse"],
      ["Stamp receipt", "MED-45", "SHQIPËRI", "Stamp #16 collected", RED, "#fff", "alb"]
    ].map(function (p, i) {
      return {
        kind: p[0], code: p[1], big: p[2], sub: p[3], bg: p[4], fg: p[5], href: p[6],
        r: ((i % 2 ? 1 : -1) * (1.5 + (i % 3))) + "deg", dur: (9 + (i % 5)) + "s"
      };
    });
    var half = Math.ceil(propDefs.length / 2);
    var colA = propDefs.slice(0, half), colB = propDefs.slice(half);

    function ticket(p, shadowDir) {
      var country = byCode[p.href];
      var href = country ? "destination.html#" + country.code : "destinations.html";
      return '<a href="' + href + '" style="display:block;text-decoration:none;flex:none;background:' + p.bg + ';color:' + p.fg + ';border:2px solid #1b1a19;box-shadow:' + shadowDir + '8px 8px 0 rgba(27,26,25,.28);transform:rotate(' + p.r + ');--r:' + p.r + ';animation:ppDrift ' + p.dur + ' ease-in-out infinite;padding:12px 13px;cursor:pointer" data-hover="animation-play-state:paused;box-shadow:' + shadowDir + '11px 11px 0 rgba(27,26,25,.4)">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font:800 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.75;margin-bottom:8px"><span>' + p.kind + '</span><span>' + p.code + '</span></div>'
        + '<div style="font:800 19px/1.05 \'Archivo\',sans-serif;letter-spacing:-.02em">' + p.big + '</div>'
        + '<div style="font:600 9px/1.4 \'Archivo\',sans-serif;letter-spacing:.11em;text-transform:uppercase;margin-top:6px;opacity:.8">' + p.sub + '</div>'
        + '<div style="height:13px;margin-top:10px;background:repeating-linear-gradient(90deg,currentColor 0 2px,transparent 2px 5px,currentColor 5px 8px,transparent 8px 12px);opacity:.55"></div>'
        + '</a>';
    }
    var htmlA = colA.map(function (p) { return ticket(p, ""); }).join("");
    var htmlB = colB.map(function (p) { return ticket(p, "-"); }).join("");
    document.getElementById("pp-propsA").innerHTML = htmlA + htmlA;
    document.getElementById("pp-propsB").innerHTML = htmlB + htmlB;
  }

  /* ── Terminal departures ticker ── */
  function renderTicker(countries) {
    var track = document.getElementById("pp-ticker-track");
    var items = countries.map(function (c) {
      return '<span style="display:flex;align-items:center;gap:10px;padding:10px 22px;white-space:nowrap;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.14em">'
        + '<span style="color:#f2b30c">' + c.med + '</span>' + c.name.toUpperCase() + '<span style="color:#605d5d;margin-left:6px">&#9670;</span></span>';
    }).join("");
    track.innerHTML = items + items;
  }

  /* ── Country identity carousel (all 21, duplicated for seamless loop) ── */
  function renderIdentityTrack(countries) {
    var track = document.getElementById("pp-identity-track");
    function card(c) {
      return '<a href="destination.html#' + c.code + '" style="display:flex;flex-direction:column;gap:14px;width:260px;flex:none;padding:26px 22px 24px;border-right:2px solid rgba(247,243,236,.25);text-decoration:none;color:#f7f3ec" data-hover="background:rgba(247,243,236,.06)">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">' + c.stamp + '<span>' + c.med + '</span></div>'
        + '<div style="font:800 26px/1 \'Archivo\',sans-serif;letter-spacing:-.025em">' + c.name.toUpperCase() + '</div>'
        + '<div style="font:400 13px/1.5 \'Archivo\',sans-serif;color:#bab6b6;min-height:40px">' + c.identity + '</div>'
        + '<div style="margin-top:auto;padding-top:12px;border-top:1px solid rgba(247,243,236,.22);display:flex;align-items:center;justify-content:space-between;gap:10px">'
        + '<span style="font:800 13px/1.15 \'Archivo\',sans-serif">' + c.heroItem.name + '</span><span style="font:800 13px/1 \'Archivo\',sans-serif;color:#f2b30c">' + eur(c.heroItem.price) + '</span></div>'
        + '</a>';
    }
    var html = countries.map(card).join("");
    track.innerHTML = html + html;
  }

  /* ── Culture eq bars ── */
  function renderCultureEq() {
    var el = document.getElementById("pp-eqbars-culture");
    el.innerHTML = Array.from({ length: 22 }, function (_, k) {
      var color = k % 4 === 0 ? RED : k % 3 === 0 ? YEL : INK;
      var dur = (0.5 + (k % 6) * 0.14).toFixed(2) + "s";
      var delay = ((k % 7) * 0.08).toFixed(2) + "s";
      return '<span style="flex:1;background:' + color + ';height:30%;animation:ppEq ' + dur + ' ease-in-out ' + delay + ' infinite alternate"></span>';
    }).join("");
  }

  /* ── Passport preview (fixed demo state: 6 of 21 stamped, matches the
     static reward-ladder copy already on the page: "8: 2 TO GO", "21: 15 TO GO") ── */
  /* Garden of Destinations — one native tree per country (brief §5.10),
     plaque colors cycling through the same four-color rotation the
     original design's 8 example plaques used. */
  var TREES = {
    lbn: "Cedar", syr: "Pistachio tree", pse: "Olive tree", tur: "Hazelnut tree",
    cyp: "Carob tree", grc: "Olive tree", ita: "Lemon tree", esp: "Orange tree",
    fra: "Plane tree", mco: "Citrus tree", mlt: "Prickly pear", svn: "Linden tree",
    hrv: "Black pine", bih: "Walnut tree", mne: "Olive tree", alb: "Olive tree",
    egy: "Date palm", lby: "Date palm", tun: "Olive tree", dza: "Date palm", mar: "Orange tree"
  };
  var PLAQUE_COLORS = [
    [YEL, INK], [RED, "#fff"], [BLU, "#fff"], ["#e7e3dc", INK]
  ];
  function renderGardenPlaques(countries) {
    var el = document.getElementById("pp-garden-plaques");
    if (!el) return;
    el.innerHTML = countries.map(function (c, i) {
      var col = PLAQUE_COLORS[i % PLAQUE_COLORS.length];
      var tree = TREES[c.code] || "Olive tree";
      return '<div data-rv="up" data-rv-d="' + ((i % 6) * 60) + '" style="border-right:2px solid rgba(247,243,236,.3);border-bottom:2px solid rgba(247,243,236,.3);padding:20px 18px 22px;background:' + col[0] + ';color:' + col[1] + '">'
        + '<span style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.75">Plaque ' + String(i + 1).padStart(2, "0") + '</span>'
        + '<p style="font:600 15px/1.4 \'Archivo\',sans-serif;margin:8px 0 0">' + tree + ' — dedicated to ' + c.name + '.</p>'
        + '</div>';
    }).join("");
  }

  function renderPassport(countries) {
    var STAMPED = 6;
    document.getElementById("pp-passport-progress").textContent = "Passport spread · " + STAMPED + " of 21";
    var grid = document.getElementById("pp-stamp-grid");
    grid.innerHTML = countries.map(function (c, i) {
      var on = i < STAMPED;
      return '<div style="position:relative;background:#f7f3ec;aspect-ratio:1/1;display:flex;flex-direction:column;justify-content:flex-end;padding:7px">'
        + '<span style="font:800 13px/1 \'Archivo\',sans-serif">' + c.code.toUpperCase() + '</span>'
        + '<span style="font:400 8px/1.2 \'Archivo\',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#7d7979">' + c.name + '</span>'
        + (on ? '<span style="position:absolute;top:6px;right:6px;width:40px;height:40px;border:2.5px solid #ec3013;color:#ec3013;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif;transform:rotate(-10deg)">' + c.stamp + '</span>' : "")
        + '</div>';
    }).join("");
  }

  /* ── Boarding pass print sequence: one-shot reveal when section scrolls into view ── */
  function initBoardingPass() {
    var sec = document.querySelector('[data-pass-sec]');
    if (!sec) return;
    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      var card = document.querySelector('[data-pass-card]');
      var rows = Array.prototype.slice.call(document.querySelectorAll('[data-pass-row]'));
      var bar = document.querySelector('[data-pass-bar]');
      var stamp = document.querySelector('[data-pass-stamp]');
      var hint = document.querySelector('[data-pass-hint]');
      if (card) { card.style.transition = "transform .8s cubic-bezier(.2,.85,.25,1)"; card.style.transform = "translateY(0)"; }
      rows.forEach(function (r, i) {
        setTimeout(function () {
          r.style.transition = "opacity .5s ease";
          r.style.opacity = "1";
        }, 500 + i * 160);
      });
      setTimeout(function () {
        if (bar) { bar.style.transition = "width 1.1s cubic-bezier(.2,.8,.25,1)"; bar.style.width = "100%"; }
      }, 500 + rows.length * 160 + 100);
      setTimeout(function () {
        if (stamp) {
          stamp.style.transition = "opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1)";
          stamp.style.opacity = "1";
          stamp.style.transform = "rotate(-11deg) scale(1)";
        }
        if (hint) hint.textContent = "Printed — PP-LBN-2026";
      }, 500 + rows.length * 160 + 1200);
    }
    function check() {
      var r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.6 && r.bottom > 0) fire();
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    var iv = setInterval(check, 400);
    if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("scroll", check); clearInterval(iv); });
  }

  /* ── Home Mediterranean map: same illustrated basin + the same 21
     country positions as route-map.js (both read window.PP_MED_MAP), so
     the two pages can never show a different map. Unlike the route-map
     page this one has no filter UI — every node is always shown, live-
     linked straight to its destination page. ── */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function renderHomeMap(data) {
    var bg = document.getElementById("home-map-bg");
    var nodesEl = document.getElementById("home-map-nodes");
    if (!bg || !nodesEl || !window.PP_MED_MAP) return;
    bg.innerHTML = window.PP_MED_MAP.background();
    var pos = window.PP_MED_MAP.POS;
    var routes = data.ROUTES;
    nodesEl.innerHTML = data.COUNTRIES.map(function (c, i) {
      var p = pos[c.code] || [50, 50];
      var ch = routes[c.routeKey];
      var sway = (4 + (i % 5) * 0.6).toFixed(1) + "s";
      return '<a href="destination.html#' + c.code + '" aria-label="' + esc(c.name) + ' — ' + esc(ch.name) + ' route" style="position:absolute;left:' + p[0] + '%;top:' + p[1] + '%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:flex-start;gap:5px;text-decoration:none">'
        + '<span class="pp-map-node-badge" style="display:flex;align-items:center;gap:7px;padding:6px 9px;background:' + ch.bg + ';color:' + ch.fg + ';border:2px solid #1b1a19;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;white-space:nowrap;animation:ppSway ' + sway + ' ease-in-out infinite">' + esc(c.code.toUpperCase()) + '<span class="pp-map-node-sub" style="font:600 8.5px/1;letter-spacing:.14em;opacity:.75">' + esc(ch.name) + '</span></span>'
        + '<span class="pp-map-node-name" style="font:800 13px/1 \'Archivo\',sans-serif;letter-spacing:-.01em;color:#fff;text-shadow:0 1px 0 rgba(27,26,25,.6)">' + esc(c.name) + '</span></a>';
    }).join("");
  }

  /* ── Mini Patty Tooty preview ── */
  function initTootyPreview(data) {
    var qEl = document.getElementById("pp-tooty-question");
    var aEl = document.getElementById("pp-tooty-answer");
    var pillsEl = document.getElementById("pp-tooty-pills");
    var chipsEl = document.getElementById("pp-tooty-chips");
    var input = document.querySelector('#tooty input[type="text"]');
    var send = document.querySelector('#tooty button');
    if (!qEl) return;

    if (window.PP_TOOTY_ICON) {
      var headerAvatar = document.getElementById("pp-tooty-avatar-header");
      if (headerAvatar) headerAvatar.innerHTML = window.PP_TOOTY_ICON(24);
      Array.prototype.forEach.call(document.querySelectorAll("#tooty .pp-tooty-avatar"), function (el) {
        el.innerHTML = window.PP_TOOTY_ICON(18);
      });
    }

    var countries = (data && data.COUNTRIES) || [];
    function findByTag(tag) {
      for (var i = 0; i < countries.length; i++) {
        var hit = countries[i].items.find(function (it) { return it.tags.indexOf(tag) > -1 && it.group === "Burgers"; });
        if (hit) return { country: countries[i], item: hit };
      }
      return null;
    }

    var SUGGESTIONS = [
      "We're vegetarian, where should we start?",
      "Something halal and not spicy?",
      "What do kids usually love?",
      "How do the passport stamps work?"
    ];

    function answer(question) {
      var q = question.toLowerCase();
      var pills = [];
      var text;
      if (/vegan|vegetarian|veg\b/.test(q)) {
        var hit = findByTag("Vegetarian");
        text = hit ? "Start with " + hit.country.name + "'s " + hit.item.name + " — a proper vegetarian headline, not a substitution." : "Every one of the 21 countries has a vegetarian headline dish — check the menu.";
        if (hit) pills.push({ label: "Visit " + hit.country.name, href: "destination.html#" + hit.country.code });
      } else if (/halal|spicy|spice/.test(q)) {
        text = "All 21 routes are halal-friendly by default. For something mild, try Lebanon or Greece; for heat, Morocco or Tunisia run spicier.";
        pills.push({ label: "Try Lebanon", href: "destination.html#lbn" }, { label: "Try Morocco", href: "destination.html#mar" });
      } else if (/kid|child/.test(q)) {
        text = "Kids usually land on Lebanon's Shish Tawouk or Italy's Caprese — both mild, familiar shapes with a country twist.";
        pills.push({ label: "Junior Explorers", href: "junior-explorers.html" });
      } else if (/stamp|passport|reward/.test(q)) {
        text = "One stamp per destination. 3 gets a free drink, 5 a free side, 8 a secret burger, and all 21 unlocks the World Traveller buffet.";
        pills.push({ label: "See Rewards", href: "rewards.html" });
      } else {
        text = "Tell me who's at the table — spicy, vegetarian, halal or alcohol-free — and I'll pick the destination.";
        pills.push({ label: "Ask Patty Tooty", href: "patty-tooty.html" });
      }
      qEl.textContent = question;
      aEl.textContent = text;
      pillsEl.innerHTML = pills.map(function (p) {
        return '<a href="' + p.href + '" style="display:inline-flex;align-items:center;gap:6px;padding:8px 11px;background:#f2b30c;color:#1b1a19;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.05em;border:2px solid #1b1a19" data-hover="background:#1b1a19;color:#f7f3ec">' + p.label + ' &#8594;</a>';
      }).join("");
      if (window.initHoverStyles) window.initHoverStyles(pillsEl);
    }

    chipsEl.innerHTML = SUGGESTIONS.map(function (s) {
      return '<button type="button" data-q="' + s.replace(/"/g, "&quot;") + '" style="padding:9px 12px;background:#fff;border:2px solid #1b1a19;color:#1b1a19;font:600 12px/1.3 \'Archivo\',sans-serif;cursor:pointer;text-align:left" data-hover="background:#1b1a19;color:#f7f3ec">' + s + '</button>';
    }).join("");
    if (window.initHoverStyles) window.initHoverStyles(chipsEl);

    chipsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (btn) answer(btn.getAttribute("data-q"));
    });
    function submit() {
      var v = (input.value || "").trim();
      if (!v) return;
      answer(v);
      input.value = "";
    }
    if (send) send.addEventListener("click", submit);
    if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });

    answer("We're 4 adults and 2 kids — one of us is vegetarian, spicy is fine.");
  }

  /* ── Check-in console route filter chips: cosmetic active-state toggle ── */
  function initRouteChips() {
    var group = document.querySelectorAll('#checkin button[type="button"]');
    group.forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.forEach(function (b) { b.style.background = "transparent"; b.style.color = "#f7f3ec"; });
        btn.style.background = "#f2b30c";
        btn.style.color = "#1b1a19";
      });
    });
  }

  /* Only present on a real fresh load of index.html (baked into the HTML,
     never re-added by js/router.js's client-side swap), so a nav click
     back to Home never repeats this pause. Waits two frames so the
     pre-reveal state actually paints before transitioning out of it
     (otherwise some browsers skip straight to the end state), plus a
     short deliberate beat so "shell first" reads as a choreographed
     reveal rather than an imperceptible flicker. */
  function revealShell() {
    if (!document.body.classList.contains("pp-shell-loading")) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(function () { document.body.classList.remove("pp-shell-loading"); }, 220);
      });
    });
  }

  function boot() {
    var data = window.PP_DATA;
    setHeadlineText();
    initParallax();
    initBoardingPass();
    initRouteChips();
    if (data) {
      renderHeroProps(data.COUNTRIES);
      renderTicker(data.COUNTRIES);
      renderIdentityTrack(data.COUNTRIES);
      renderCultureEq();
      renderPassport(data.COUNTRIES);
      renderGardenPlaques(data.COUNTRIES);
      renderHomeMap(data);
      initTootyPreview(data);
      if (window.initHoverStyles) window.initHoverStyles(document.body);
    } else {
      window.addEventListener("pp-data-ready", boot, { once: true });
      if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("pp-data-ready", boot); });
    }
    if (window.PP_REVEAL) window.PP_REVEAL.init();
    revealShell();
  }

  window.PP_READY(boot);
})();
