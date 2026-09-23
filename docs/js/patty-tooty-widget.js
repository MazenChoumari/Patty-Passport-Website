/* Patty Passport — site-wide "Ask Patty Tooty" floating widget
   (master brief §5.9: "Lives as a chat bubble bottom-right"). Separate
   from the full concierge experience on patty-tooty.html — this is a
   small fixed bottom-right bubble that expands into a minimal scripted
   Q&A (same keyword-matching idea, a lighter copy of it) and deep-links
   to the full page for anything bigger. Self-mounting: builds its own
   DOM, no placeholder div required in the page shell. Safe to include
   on every page; works whether or not js/data.js has loaded yet. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var state = { open: false, messages: [], thinking: false };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function flattenItems() {
    var D = window.PP_DATA;
    if (!D) return [];
    var out = [];
    D.COUNTRIES.forEach(function (c) { c.items.forEach(function (it) { out.push({ country: c, item: it }); }); });
    return out;
  }
  function pickByItemTag(tag) {
    var all = flattenItems().filter(function (x) { return x.item.tags.indexOf(tag) > -1; });
    return all.length ? all[Math.floor(Math.random() * all.length)] : null;
  }
  function pickSpicy() {
    var D = window.PP_DATA;
    if (!D) return null;
    var all = D.COUNTRIES.filter(function (c) { return (c.dietTags || "").toLowerCase().indexOf("spicy") > -1; });
    return all.length ? all[Math.floor(Math.random() * all.length)] : null;
  }
  var COUNTRY_ALIASES = { turkey: "tur", bosnia: "bih" };
  function findCountryByName(t) {
    var D = window.PP_DATA;
    if (!D) return null;
    for (var alias in COUNTRY_ALIASES) {
      if (t.indexOf(alias) > -1) {
        var byAlias = D.COUNTRIES.find(function (c) { return c.code === COUNTRY_ALIASES[alias]; });
        if (byAlias) return byAlias;
      }
    }
    return D.COUNTRIES.find(function (c) { return t.indexOf(c.name.toLowerCase()) > -1; }) || null;
  }

  function answerFor(raw) {
    var t = (raw || "").toLowerCase();
    if (/invest|funding|equity/.test(t)) {
      return { text: "Terminal one is live in Leganés, with a repeatable format for the next four. Full numbers live on the investors page.", pills: [["Investor page", "investors.html"]] };
    }
    if (/spicy|chilli|chili/.test(t)) {
      var sp = pickSpicy();
      return { text: sp ? sp.name + " runs the spiciest lane — try the " + sp.heroItem.name + "." : "Libya, Tunisia and Algeria run the spiciest lanes on the map.", pills: sp ? [["Open " + sp.name, "destination.html#" + sp.code]] : [["Browse destinations", "destinations.html"]] };
    }
    if (/vegan|vegetarian|\bveg\b/.test(t)) {
      var vg = pickByItemTag("Vegetarian");
      return { text: vg ? vg.country.name + "'s " + vg.item.name + " is a great pick — all 21 countries have a vegetarian headline dish." : "All 21 countries have a vegetarian headline dish, not a substitution.", pills: [["Vegetarian menu", "menu.html"]] };
    }
    if (/halal/.test(t)) {
      return { text: "Halal-certified meat runs across every route, no separate menu, no exceptions.", pills: [["Halal plates", "menu.html"]] };
    }
    if (/alcohol.?free|no alcohol|sober/.test(t)) {
      return { text: "Every drink except the one labelled 'alcoholic country drink' per route is alcohol-free by default.", pills: [["Full menu", "menu.html"]] };
    }
    if (/kid|child|birthday|junior/.test(t)) {
      return { text: "Junior explorers travel best on the Aegean and Iberia routes, with a Junior Passport and sticker stamps.", pills: [["Junior explorers", "junior-explorers.html"], ["Events & birthdays", "events.html"]] };
    }
    if (/stamp|reward|passport|ladder/.test(t)) {
      return { text: "3 stamps unlocks a free drink, 5 a free side, 8 the secret destination burger, 21 the World Traveller buffet.", pills: [["Reward ladder", "rewards.html"], ["My passport", "my-passport.html"]] };
    }
    if (/book|table|reserve/.test(t)) {
      return { text: "Booking takes under a minute — route, time, table size.", pills: [["Book a table", "booking.html"]] };
    }
    if (/\bmenu\b|\bdish(es)?\b|\bburger|\bfries\b|food/.test(t)) {
      return { text: "The full menu runs across all 21 destinations — burgers, loaded fries, salads, drinks and desserts, each one specific to its country.", pills: [["Open the menu", "menu.html"]] };
    }
    if (/\broute(s)?\b|route map/.test(t)) {
      return { text: "Five routes cross the map — Levant, Aegean, Iberia & Latin, Adriatic, N. Africa — twenty-one destinations between them.", pills: [["Open the route map", "route-map.html"]] };
    }
    if (/destination|\bcountr(y|ies)\b|where can i go/.test(t)) {
      return { text: "Twenty-one Mediterranean destinations across five routes, from Lebanon and Greece to Spain, Croatia and Morocco.", pills: [["Browse destinations", "destinations.html"]] };
    }
    if (/hour|open|close|location|address|contact|phone|email/.test(t)) {
      var D5 = window.PP_DATA;
      var hours = D5 && D5.HOURS ? D5.HOURS.map(function (h) { return h.days + ": " + h.time; }).join(" · ") : "Mon—Fri 10:00 — 22:00 · Weekends & holidays 10:00 — 00:00";
      return { text: "We're in Leganés, Madrid. " + hours + ".", pills: [["Book a table", "booking.html"]] };
    }
    if (/\bevent|party|celebrat|reunion/.test(t)) {
      return { text: "Events run on any route, from a small birthday to a hundred-plus reunion — the zone gets dressed for whichever country you pick.", pills: [["Event packages", "events.html"]] };
    }
    var namedCountry = findCountryByName(t);
    if (namedCountry) {
      return { text: namedCountry.name + " — " + namedCountry.identity + ". Headline dish: " + namedCountry.heroItem.name + ".", pills: [["Open " + namedCountry.name, "destination.html#" + namedCountry.code]] };
    }
    if (/hi\b|hello|hey/.test(t)) {
      return { text: "Welcome aboard! Ask me about a country, the menu, kids, stamps, booking or investing.", pills: [["Browse destinations", "destinations.html"]] };
    }
    if (/who are you|what are you|your name|about you/.test(t)) {
      return { text: "I'm Patty Tooty — the terminal's travel concierge. Round like a burger bun, headphones always on, sneakers always laced for the next route.", pills: [["Browse destinations", "destinations.html"]] };
    }
    if (/help me (choose|decide|pick)|where (do|should) i start|not sure where|don.t know where|no idea where/.test(t)) {
      return { text: "Start on the Levant Route — Lebanon, stamp #01. Loudest welcome on the sea, and the Shish Tawouk Street Burger is the plate most tables come back for.", pills: [["Open Lebanon", "destination.html#lbn"], ["Route map", "route-map.html"]] };
    }
    return { text: "Still learning that one — try a country name, the menu, routes, hours, kids, stamps, booking or investing, or open the full concierge.", pills: [["Full concierge", "patty-tooty.html"]] };
  }

  var QUICK = [
    ["Pick a destination", "which destination should I try first"],
    ["Vegetarian?", "vegetarian options"],
    ["Halal?", "halal across the table"],
    ["How do stamps work?", "how do passport stamps work"]
  ];

  function bubbleHtml(from, text) {
    if (from === "pt") {
      return '<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:10px">'
        + '<span style="width:22px;height:22px;flex:none;background:' + YEL + ';border:2px solid ' + INK + ';display:flex;align-items:center;justify-content:center">' + window.PP_TOOTY_ICON(15, INK) + '</span>'
        + '<span style="max-width:82%;background:#fff;border:2px solid ' + INK + ';padding:9px 10px;font:400 12.5px/1.45 \'Archivo\',sans-serif">' + text + '</span></div>';
    }
    return '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">'
      + '<span style="max-width:82%;background:' + BLU + ';color:#fff;border:2px solid ' + INK + ';padding:9px 10px;font:400 12.5px/1.45 \'Archivo\',sans-serif">' + text + '</span></div>';
  }

  function pillsHtml(pills) {
    if (!pills || !pills.length) return "";
    return '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 10px 30px">' + pills.map(function (p) {
      return '<a href="' + p[1] + '" style="display:inline-flex;align-items:center;gap:5px;padding:6px 9px;background:' + CREAM + ';color:' + INK + ';border:2px solid ' + INK + ';text-decoration:none;font:800 9px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase" data-hover="background:' + INK + ';color:' + CREAM + '">' + esc(p[0]) + '<span>→</span></a>';
    }).join("") + '</div>';
  }

  function typingBubbleHtml() {
    return '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">'
      + '<span style="width:22px;height:22px;flex:none;background:' + YEL + ';border:2px solid ' + INK + ';display:flex;align-items:center;justify-content:center">' + window.PP_TOOTY_ICON(15, INK) + '</span>'
      + '<span style="display:flex;align-items:center;gap:4px;background:#fff;border:2px solid ' + INK + ';padding:9px 10px">'
      + '<span style="width:5px;height:5px;background:' + INK + ';animation:ptwDots 1.2s ease-in-out infinite"></span>'
      + '<span style="width:5px;height:5px;background:' + INK + ';animation:ptwDots 1.2s ease-in-out .2s infinite"></span>'
      + '<span style="width:5px;height:5px;background:' + INK + ';animation:ptwDots 1.2s ease-in-out .4s infinite"></span></span></div>';
  }

  function panelBodyHtml() {
    var log = state.messages.map(function (m) { return bubbleHtml(m.from, m.text) + (m.pills ? pillsHtml(m.pills) : ""); }).join("") + (state.thinking ? typingBubbleHtml() : "");
    // Same "this is a real conversation now" reaction as the full page:
    // the quick-question chips disappear the moment the user has actually
    // asked something, instead of sitting under the transcript forever.
    var conversationStarted = state.messages.some(function (m) { return m.from === "user"; }) || state.thinking;
    var chipsHtml = conversationStarted ? "" : '<div style="padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:2px solid ' + INK + '">' + QUICK.map(function (q) {
      return '<button type="button" class="ptw-chip" data-q="' + esc(q[1]) + '" style="padding:7px 9px;background:transparent;border:2px solid ' + INK + ';color:' + INK + ';font:600 10.5px/1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:' + YEL + '">' + esc(q[0]) + '</button>';
    }).join("") + '</div>';
    return '<div id="ptw-log" style="padding:12px;max-height:280px;overflow-y:auto;background:repeating-linear-gradient(0deg,rgba(27,26,25,.04) 0 1px,transparent 1px 36px)">' + log + '</div>'
      + chipsHtml
      + '<form id="ptw-form" style="display:flex;align-items:center;gap:8px;border-top:2px solid ' + INK + ';padding:10px 12px">'
      + '<input type="text" id="ptw-input" placeholder="Ask Patty Tooty…" style="flex:1;min-width:0;background:transparent;border:0;border-bottom:2px solid rgba(27,26,25,.3);color:' + INK + ';font:400 12.5px/1.4 \'Archivo\',sans-serif;padding:6px 0;outline:none" />'
      + '<button type="submit" style="padding:9px 11px;background:' + RED + ';border:2px solid ' + INK + ';color:#fff;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:' + INK + '">Send</button>'
      + '</form>'
      + '<div style="padding:9px 12px;border-top:1px solid rgba(27,26,25,.18);text-align:center">'
      + '<a href="patty-tooty.html" style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:' + INK + '">Open full concierge →</a></div>';
  }

  function render() {
    var root = document.getElementById("ptw-root");
    if (!root) return;
    if (!state.open) {
      root.innerHTML = '<button type="button" id="ptw-toggle" aria-label="Ask Patty Tooty" style="display:flex;align-items:center;gap:10px;padding:12px 16px 12px 12px;background:' + INK + ';color:' + CREAM + ';border:2px solid ' + INK + ';border-radius:999px;cursor:pointer;box-shadow:0 8px 22px rgba(27,26,25,.35);font-family:\'Archivo\',system-ui,sans-serif" data-hover="background:' + RED + '">'
        + '<span style="position:relative;width:34px;height:34px;flex:none;background:' + YEL + ';border:2px solid ' + INK + ';border-radius:50%;display:flex;align-items:center;justify-content:center">' + window.PP_TOOTY_ICON(23, INK)
        + '<span style="position:absolute;right:-2px;top:-2px;width:9px;height:9px;background:' + RED + ';border:2px solid ' + CREAM + ';border-radius:50%;animation:ptwBlink 1.3s steps(1) infinite"></span></span>'
        + '<span style="font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.04em;white-space:nowrap">Ask Patty Tooty</span></button>';
      var t = root.querySelector("#ptw-toggle");
      if (t) t.addEventListener("click", function () { open(); });
    } else {
      root.innerHTML = '<div style="width:min(320px,88vw);background:' + CREAM + ';border:2px solid ' + INK + ';box-shadow:0 14px 32px rgba(27,26,25,.4);font-family:\'Archivo\',system-ui,sans-serif">'
        + '<div style="display:flex;align-items:center;gap:10px;padding:11px 12px;background:' + INK + ';color:' + CREAM + '">'
        + '<span style="width:28px;height:28px;flex:none;background:' + YEL + ';border:2px solid ' + INK + ';border-radius:50%;display:flex;align-items:center;justify-content:center">' + window.PP_TOOTY_ICON(19, INK) + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 12.5px/1 \'Archivo\',sans-serif">PATTY TOOTY</span>'
        + '<span style="display:flex;align-items:center;gap:5px;font:600 8px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#bab6b6;margin-top:3px"><span style="width:5px;height:5px;background:' + YEL + ';border-radius:50%;animation:ptwBlink 1.3s steps(1) infinite"></span>Online</span></span>'
        + '<button type="button" id="ptw-close" aria-label="Close" style="background:transparent;border:2px solid rgba(247,243,236,.5);color:' + CREAM + ';font:800 10px/1 \'Archivo\',sans-serif;padding:6px 8px;cursor:pointer" data-hover="background:' + RED + ';border-color:' + RED + '">✕</button>'
        + '</div>'
        + panelBodyHtml()
        + '</div>';

      var closeBtn = root.querySelector("#ptw-close");
      if (closeBtn) closeBtn.addEventListener("click", function () { close(); });

      var form = root.querySelector("#ptw-form");
      var input = root.querySelector("#ptw-input");
      if (input) input.disabled = state.thinking;
      var sendBtn = form ? form.querySelector('button[type="submit"]') : null;
      if (sendBtn) sendBtn.disabled = state.thinking;
      if (form) form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input ? input.value.trim() : "";
        if (!text || state.thinking) return;
        ask(text);
        if (input) input.value = "";
      });

      Array.prototype.forEach.call(root.querySelectorAll(".ptw-chip"), function (btn) {
        btn.addEventListener("click", function () { if (!state.thinking) ask(btn.getAttribute("data-q")); });
      });

      var log = root.querySelector("#ptw-log");
      if (log) log.scrollTop = log.scrollHeight;
    }
    if (window.initHoverStyles) window.initHoverStyles(root);
  }

  function ask(text) {
    state.messages.push({ from: "user", text: esc(text) });
    state.thinking = true;
    render();
    setTimeout(function () {
      var res = answerFor(text);
      state.messages.push({ from: "pt", text: res.text, pills: res.pills });
      state.thinking = false;
      render();
    }, 500 + Math.random() * 400);
  }

  function open() {
    state.open = true;
    if (!state.messages.length) {
      state.messages.push({ from: "pt", text: "Welcome to the terminal! Ask me about a country, the menu, kids, stamps, booking or investing." });
    }
    render();
  }
  function close() { state.open = false; render(); }

  function mount() {
    if (document.getElementById("ptw-root")) return;
    var style = document.createElement("style");
    style.textContent = "@keyframes ptwBlink{0%,55%{opacity:1}56%,100%{opacity:.15}}@keyframes ptwDots{0%,80%,100%{opacity:.2}40%{opacity:1}}";
    document.head.appendChild(style);
    var root = document.createElement("div");
    root.id = "ptw-root";
    root.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:200;";
    document.body.appendChild(root);
    render();
  }

  // The full Ask-Patty-Tooty page renders its own #pt-thread chat, so the
  // floating duplicate stays hidden there. This is a single persistent
  // script (js/router.js never re-runs it across a client-side page
  // change), so instead of only checking once at load, js/router.js calls
  // setVisible() after every swap with whether the new page has #pt-thread.
  window.PP_TOOTY_WIDGET = {
    setVisible: function (visible) {
      if (visible) {
        var root = document.getElementById("ptw-root");
        if (root) root.style.display = "";
        else mount();
      } else {
        var existing = document.getElementById("ptw-root");
        if (existing) existing.style.display = "none";
      }
    }
  };

  window.PP_READY(function () {
    if (!document.getElementById("pt-thread")) mount();
  });
})();
