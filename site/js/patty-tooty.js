/* Patty Passport — Ask Patty Tooty page, ported from Patty-Tooty.dc.html's
   x-dc template + Component logic. Canned/scripted responses via simple
   keyword matching (master brief §5.9) — no real NLP, no backend. The
   "suggested questions" chips replay a fixed thread (as in the prototype);
   the free-text box below runs a small keyword matcher, including live
   lookups against window.PP_DATA.COUNTRIES[i].items[].tags for
   spicy/veg/halal/alcohol-free preferences. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var THREADS = [
    ["Which destination should I try first?",
     "Start on the Levant Route — Lebanon, stamp #01. Loudest welcome on the sea, and the Shish Tawouk Street Burger is the plate most tables come back for.",
     "If you'd rather start mild, Greece or Italy are the softest landings on the map.",
     [["Open Lebanon", "destination.html#lbn", YEL, INK], ["See the route map", "route-map.html", CREAM, INK], ["Book a table", "booking.html", RED, "#fff"]]],
    ["Show me kid-friendly routes",
     "Junior explorers travel best on the Aegean and Iberia routes — mild grills, lemon and fries. Every child gets a Junior Passport with sticker stamps.",
     "Birthdays add a crew host, the zone dressed for the country and the child's name on the departures board.",
     [["Junior explorers", "junior-explorers.html", YEL, INK], ["Kids journeys", "events.html", BLU, "#fff"], ["Junior lane menu", "menu.html", CREAM, INK]]],
    ["Find me vegetarian options",
     "All twenty-one countries have a vegetarian headline dish — not a substitution. Fourteen run fully vegan, built from the region's own cooking.",
     "Filter the menu by lane and only the plates that qualify stay on the board.",
     [["Vegetarian menu", "menu.html", YEL, INK], ["Cyprus halloumi route", "destination.html#cyp", BLU, "#fff"]]],
    ["I need halal across the whole table",
     "Halal-certified meat runs across every route, with no separate menu and no exceptions. The desk holds the supplier certificates if you'd like to see them.",
     "Levant and North African routes are the strongest starting points for a halal table.",
     [["Halal plates", "menu.html", RED, "#fff"], ["Levant route", "route-map.html", YEL, INK]]],
    ["How do passport rewards work?",
     "Each meal earns one country stamp. Three unlocks a country drink, five a free side, eight the secret destination burger, twenty-one the World Traveller buffet.",
     "Family Passports pool stamps across the table, so groups climb the ladder considerably faster.",
     [["Reward ladder", "rewards.html", RED, "#fff"], ["Start my passport", "my-passport.html#join", CREAM, INK]]],
    ["Help me book a birthday",
     "Weekdays run the Little Explorer journey at €18 a child; weekends the World Explorer at €22 with a crew host, games and the birthday child's name on the board.",
     "Family Reunion covers the grown-up version — one route, one long table, a shared Family Passport.",
     [["Event packages", "events.html", YEL, INK], ["Reserve the table", "booking.html", RED, "#fff"]]],
    ["What's the story behind all this?",
     "Twenty-one Mediterranean countries that share a coastline and agree about almost nothing — including how to cook. We stopped averaging them into one beige menu.",
     "The passport turns that variety into a reason to come back nineteen more times.",
     [["Our story", "our-story.html", BLU, "#fff"], ["All destinations", "destinations.html", CREAM, INK]]],
    ["I'm interested in investing",
     "One terminal operating in Leganés, four cities in the pipeline, and a format that repeats: 240 seats, twenty-one destinations, one reusable content library.",
     "The live unit model, build-out costs and rollout plan are all on the investors page.",
     [["Investor page", "investors.html", RED, "#fff"], ["Email the team", "mailto:invest@pattypassport.com", CREAM, INK]]]
  ];

  var state = { t: 0, custom: null };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---- keyword matcher over window.PP_DATA for the free-text box ---- */
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
  function pickByCountryDiet(word) {
    var D = window.PP_DATA;
    if (!D) return null;
    var all = D.COUNTRIES.filter(function (c) { return (c.dietTags || "").toLowerCase().indexOf(word) > -1; });
    return all.length ? all[Math.floor(Math.random() * all.length)] : null;
  }

  function answerFor(raw) {
    var t = (raw || "").toLowerCase();

    if (/invest|funding|equity|roi|return/.test(t)) {
      return {
        question: raw, answer: "One terminal operating in Leganés, four cities in the pipeline, and a format that repeats: 240 seats, twenty-one destinations, one reusable content library.",
        followUp: "The live unit model, build-out costs and rollout plan are all on the investors page.",
        pills: [["Investor page", "investors.html", RED, "#fff"], ["Email the team", "mailto:invest@pattypassport.com", CREAM, INK]]
      };
    }
    if (/spicy|chilli|chili|hot(?!el)/.test(t)) {
      var spicy = pickByCountryDiet("spicy");
      if (spicy) {
        return {
          question: raw, answer: spicy.name + " runs the spiciest lane on the map — the " + spicy.heroItem.name + " (" + spicy.heroItem.desc + ") is the plate to order.",
          followUp: "Every route lists its heat honestly on the menu card, so nothing spicy sneaks up on you.",
          pills: [["Open " + spicy.name, "destination.html#" + spicy.code, YEL, INK], ["Full menu", "menu.html", CREAM, INK]]
        };
      }
    }
    if (/vegan|vegetarian|\bveg\b|meat.?free|plant.?based/.test(t)) {
      var veg = pickByItemTag("Vegetarian");
      return {
        question: raw,
        answer: veg ? veg.country.name + "'s " + veg.item.name + " (" + veg.item.desc + ") is a good place to start — every one of the 21 countries has its own vegetarian headline dish, not a substitution." : "All twenty-one countries have a vegetarian headline dish — not a substitution.",
        followUp: "Filter the menu by lane and only the plates that qualify stay on the board.",
        pills: [["Vegetarian menu", "menu.html", YEL, INK]].concat(veg ? [["Open " + veg.country.name, "destination.html#" + veg.country.code, BLU, "#fff"]] : [])
      };
    }
    if (/halal/.test(t)) {
      var halal = pickByItemTag("Halal-friendly");
      return {
        question: raw,
        answer: "Halal-certified meat runs across every route, with no separate menu and no exceptions." + (halal ? " " + halal.country.name + "'s " + halal.item.name + " is a solid halal pick tonight." : ""),
        followUp: "Levant and North African routes are the strongest starting points for a halal table.",
        pills: [["Halal plates", "menu.html", RED, "#fff"], ["Levant route", "route-map.html", YEL, INK]]
      };
    }
    if (/alcohol.?free|no alcohol|sober|non.?alcoholic/.test(t)) {
      var af = pickByItemTag("Alcohol-free");
      return {
        question: raw,
        answer: "Every cold drink, hot drink and dessert on the board is alcohol-free by default." + (af ? " " + af.country.name + "'s " + af.item.name + " is a good one to try." : ""),
        followUp: "Only the one labelled 'alcoholic country drink' per route contains alcohol — everything else is naturally clear of it.",
        pills: [["Full menu", "menu.html", CREAM, INK]]
      };
    }
    if (/alcohol|beer|wine|cocktail/.test(t)) {
      var alc = pickByItemTag("Contains alcohol");
      return {
        question: raw,
        answer: alc ? alc.country.name + "'s " + alc.item.name + " is that route's alcoholic pour." : "Each of the 21 routes has one alcoholic country drink on the card.",
        followUp: "Ask for the alcohol-free swap any time — it's a straight substitution, no fuss.",
        pills: [["Full menu", "menu.html", YEL, INK]]
      };
    }
    if (/kid|child|junior|birthday/.test(t)) {
      return {
        question: raw, answer: "Junior explorers travel best on the Aegean and Iberia routes — mild grills, lemon and fries. Every child gets a Junior Passport with sticker stamps.",
        followUp: "Birthdays add a crew host, the zone dressed for the country and the child's name on the departures board.",
        pills: [["Junior explorers", "junior-explorers.html", YEL, INK], ["Kids journeys", "events.html", BLU, "#fff"]]
      };
    }
    if (/stamp|reward|passport|ladder/.test(t)) {
      return {
        question: raw, answer: "Each meal earns one country stamp. Three unlocks a country drink, five a free side, eight the secret destination burger, twenty-one the World Traveller buffet.",
        followUp: "Family Passports pool stamps across the table, so groups climb the ladder considerably faster.",
        pills: [["Reward ladder", "rewards.html", RED, "#fff"], ["Start my passport", "my-passport.html#join", CREAM, INK]]
      };
    }
    if (/book|table|reserve|reservation/.test(t)) {
      return {
        question: raw, answer: "Booking takes under a minute — pick a route, a time, and the size of your table.",
        followUp: "Groups of six or more, or a birthday, are best booked a few days ahead.",
        pills: [["Book a table", "booking.html", RED, "#fff"], ["Events & groups", "events.html", YEL, INK]]
      };
    }
    if (/story|history|why|founder/.test(t)) {
      return {
        question: raw, answer: "Twenty-one Mediterranean countries that share a coastline and agree about almost nothing — including how to cook. We stopped averaging them into one beige menu.",
        followUp: "The passport turns that variety into a reason to come back nineteen more times.",
        pills: [["Our story", "our-story.html", BLU, "#fff"], ["All destinations", "destinations.html", CREAM, INK]]
      };
    }
    if (/hi\b|hello|hey|greetings|good (morning|evening|afternoon)/.test(t)) {
      return {
        question: raw, answer: "Welcome to the terminal! Twenty-one countries are boarding tonight — tell me who's at the table and I'll pick your route.",
        followUp: "Try a preference like spicy, vegetarian, halal or alcohol-free, or ask about stamps, kids, booking or investing.",
        pills: [["Browse destinations", "destinations.html", CREAM, INK], ["Full menu", "menu.html", YEL, INK]]
      };
    }
    return {
      question: raw, answer: "I'm still learning that one, but here's what usually helps — a destination, the menu, or a human at the desk.",
      followUp: "Try asking about spicy, vegetarian, halal or alcohol-free, or about stamps, kids, booking or investing.",
      pills: [["Browse destinations", "destinations.html", CREAM, INK], ["Full menu", "menu.html", YEL, INK], ["Talk to the desk", "booking.html", RED, "#fff"]]
    };
  }

  function skillsHtml() {
    var skills = [
      { label: "Pick a destination", detail: "Reads your table and names the country to start with.", color: "#ae1800" },
      { label: "Find the right dish", detail: "Halal, vegetarian, vegan, allergy-aware or kid-sized.", color: INK },
      { label: "Explain the passport", detail: "Stamps, the ladder and what unlocks next.", color: "#ae1800" },
      { label: "Walk you to the page", detail: "Routes, events, rewards, booking — one tap away.", color: INK }
    ];
    return skills.map(function (s) {
      return '<div style="padding:15px 14px 17px;border-right:2px solid rgba(27,26,25,.22);border-bottom:2px solid rgba(27,26,25,.22)">'
        + '<div style="font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:' + s.color + ';margin-bottom:8px">' + esc(s.label) + '</div>'
        + '<div style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(s.detail) + '</div></div>';
    }).join("");
  }

  function jobsHtml() {
    var jobs = [
      ["DS", "Choose tonight's country", "Tell it who's eating and it narrows twenty-one down to one, with a reason.", "Browse destinations", "destinations.html", CREAM, INK],
      ["MN", "Filter the menu", "Halal, vegetarian, vegan, pescatarian, junior — the board rebuilds around the answer.", "Open the menu", "menu.html", YEL, INK],
      ["KD", "Plan for kids", "Mild routes, junior portions, sticker stamps, and what happens at a birthday.", "Junior explorers", "junior-explorers.html", BLU, "#fff"],
      ["RW", "Explain the rewards", "Which stamp unlocks what, and how pooling works for a family book.", "Reward ladder", "rewards.html", RED, "#fff"],
      ["EV", "Size up a group", "Twelve people or a hundred and twenty — which package and which zone.", "Events & groups", "events.html", "#e7e3dc", INK],
      ["RT", "Read the map", "Which chapter a country belongs to, and what else sits on that route.", "Route map", "route-map.html", CREAM, INK]
    ];
    return jobs.map(function (j, k) {
      return '<a href="' + j[4] + '" data-rv="up" data-rv-d="' + (k * 65) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + j[5] + ';color:' + j[6] + ';padding:22px 20px 24px;display:flex;flex-direction:column;gap:11px;min-height:215px;text-decoration:none;transition:background .2s ease" data-hover="background:#1b1a19;color:#f7f3ec">'
        + '<span style="width:42px;height:42px;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font:800 12px/1 \'Archivo\',sans-serif">' + j[0] + '</span>'
        + '<h3 style="font:800 19px/1.06 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(j[1]) + '</h3>'
        + '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.86">' + esc(j[2]) + '</p>'
        + '<span style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase">' + esc(j[3]) + '<span>→</span></span></a>';
    }).join("");
  }

  function threadHtml(th) {
    var pillsHtml = th.pills.map(function (p) {
      return '<a href="' + p[1] + '" style="display:inline-flex;align-items:center;gap:7px;padding:9px 11px;background:' + p[2] + ';color:' + p[3] + ';border:2px solid #1b1a19;text-decoration:none;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase" data-hover="background:#1b1a19;color:#f7f3ec">' + esc(p[0]) + '<span>→</span></a>';
    }).join("");
    return '<div style="display:flex;gap:11px;align-items:flex-start">'
      + '<span style="width:26px;height:26px;flex:none;background:#f2b30c;border:2px solid #1b1a19;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif">PT</span>'
      + '<span style="max-width:80%;background:#fff;border:2px solid #1b1a19;padding:12px 13px;font:400 13.5px/1.5 \'Archivo\',sans-serif">Welcome to the terminal. Twenty-one countries are boarding tonight — tell me who\'s at the table and I\'ll pick your route.</span></div>'
      + '<div style="display:flex;justify-content:flex-end">'
      + '<span style="max-width:78%;background:#2b76c9;color:#fff;border:2px solid #1b1a19;padding:12px 13px;font:400 13.5px/1.5 \'Archivo\',sans-serif">' + esc(th.question) + '</span></div>'
      + '<div style="display:flex;gap:11px;align-items:flex-start">'
      + '<span style="width:26px;height:26px;flex:none;background:#f2b30c;border:2px solid #1b1a19;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif">PT</span>'
      + '<span style="max-width:86%;display:flex;flex-direction:column;gap:10px">'
      + '<span style="background:#fff;border:2px solid #1b1a19;padding:12px 13px;font:400 13.5px/1.5 \'Archivo\',sans-serif">' + esc(th.answer) + '</span>'
      + '<span style="background:#fff;border:2px solid #1b1a19;padding:12px 13px;font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(th.followUp) + '</span>'
      + '<span style="display:flex;flex-wrap:wrap;gap:7px">' + pillsHtml + '</span></span></div>'
      + '<div style="display:flex;gap:11px;align-items:center;margin-top:auto">'
      + '<span style="width:26px;height:26px;flex:none;background:#f2b30c;border:2px solid #1b1a19;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif">PT</span>'
      + '<span style="display:flex;align-items:center;gap:5px;background:#fff;border:2px solid #1b1a19;padding:12px 13px">'
      + '<span style="width:6px;height:6px;background:#1b1a19;animation:ppDots 1.2s ease-in-out infinite"></span>'
      + '<span style="width:6px;height:6px;background:#1b1a19;animation:ppDots 1.2s ease-in-out .2s infinite"></span>'
      + '<span style="width:6px;height:6px;background:#1b1a19;animation:ppDots 1.2s ease-in-out .4s infinite"></span></span></div>';
  }

  function chipsHtml() {
    var i = state.t % THREADS.length;
    return THREADS.map(function (t, k) {
      var on = !state.custom && k === i;
      return '<button type="button" class="pt-chip" data-i="' + k + '" style="padding:10px 12px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:600 11.5px/1 \'Archivo\',sans-serif;cursor:pointer;text-align:left" data-hover="background:#f2b30c;color:#1b1a19">' + esc(t[0]) + '</button>';
    }).join("");
  }

  function currentThread() {
    if (state.custom) return state.custom;
    var th = THREADS[state.t % THREADS.length];
    return { question: th[0], answer: th[1], followUp: th[2], pills: th[3] };
  }

  function render() {
    var skillsRoot = document.getElementById("pt-skills");
    var jobsRoot = document.getElementById("pt-jobs");
    var threadRoot = document.getElementById("pt-thread");
    var chipsRoot = document.getElementById("pt-chips");
    if (!threadRoot) return;

    if (skillsRoot) skillsRoot.innerHTML = skillsHtml();
    if (jobsRoot) jobsRoot.innerHTML = jobsHtml();
    threadRoot.innerHTML = threadHtml(currentThread());
    if (chipsRoot) chipsRoot.innerHTML = chipsHtml();

    Array.prototype.forEach.call(document.querySelectorAll(".pt-chip"), function (btn) {
      btn.addEventListener("click", function () {
        state.t = parseInt(btn.getAttribute("data-i"), 10) || 0;
        state.custom = null;
        render();
      });
    });

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    initScrollReveal();
  }

  function initScrollReveal() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-rv]"));
    nodes.forEach(function (el) {
      if (el._ppInit) return;
      el._ppInit = true;
      el.style.opacity = "0";
      el.style.transform = "translateY(26px)";
      el.style.transition = "opacity .7s cubic-bezier(.2,.8,.25,1), transform .8s cubic-bezier(.2,.85,.25,1)";
    });
    var check = function () {
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (!n._ppDone && r.top < window.innerHeight * 0.94 && r.bottom > 0) {
          n._ppDone = true;
          setTimeout(function () { n.style.opacity = "1"; n.style.transform = "none"; }, parseInt(n.getAttribute("data-rv-d") || "0", 10));
        }
      });
    };
    check();
    if (!window._ppRevealBound) {
      window._ppRevealBound = true;
      var raf = null;
      window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(function () { raf = null; check(); }); }, { passive: true });
      window.addEventListener("resize", check);
      setInterval(check, 400);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("pt-form");
    var input = document.getElementById("pt-input");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input ? input.value.trim() : "";
      if (!text) return;
      state.custom = answerFor(text);
      if (input) input.value = "";
      render();
    });

    render();
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    }
  });
})();
