/* Patty Passport — Our Story & Team page, ported from Our-Story.dc.html's
   x-dc template + Component logic. Static copy is rendered once; the
   "Leave a Review" widget keeps its reviews in an in-memory array only
   (front-end only, per master brief §5.6 — no backend). */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // ── static reference data (mirrors renderVals() in the prototype) ──
  var words = [
    ["LEBANON", "Marhaba"], ["SYRIA", "Ahlan wa sahlan"], ["PALESTINE", "Ahlan"], ["TÜRKIYE", "Hoş geldiniz"],
    ["CYPRUS", "Kalos irthate"], ["GREECE", "Kalós irthate"], ["ITALY", "Benvenuti"], ["SPAIN", "Bienvenidos"],
    ["FRANCE", "Bienvenue"], ["MONACO", "Benvenue"], ["MALTA", "Merħba"], ["SLOVENIA", "Dobrodošli"],
    ["CROATIA", "Dobro došli"], ["BOSNIA", "Dobro došli"], ["MONTENEGRO", "Dobrodošli"], ["ALBANIA", "Mirë se vini"],
    ["EGYPT", "Ahlan bik"], ["LIBYA", "Marhaban bik"], ["TUNISIA", "Ahlan wa sahlan"], ["ALGERIA", "Marhaba"], ["MOROCCO", "Marhaba"]
  ].map(function (w) { return { name: w[0], word: w[1] }; });
  var tickerRows = words.concat(words);

  var values = [
    ["01", "No house style", "We don't have a signature sauce that goes on everything. Each country cooks the way that country cooks.", CREAM, INK],
    ["02", "Identity over trivia", "Not flags and fun facts. The line that actually defines a place, and the plate that proves it.", YEL, INK],
    ["03", "Everyone travels", "Halal across every route, a vegetarian headline in all twenty-one, kosher-style on request, allergens printed.", RED, "#fff"],
    ["04", "Paper over apps", "The passport is a real book. No download, no account, no points expiring quietly in the background.", BLU, "#fff"],
    ["05", "The room is the story", "Zones, boards, tickets, stamps, playlists. If it doesn't help the table travel, it doesn't go in.", "#e7e3dc", INK]
  ].map(function (v, i) { return { n: v[0], title: v[1], line: v[2], bg: v[3], fg: v[4], delay: i * 70 }; });

  var timeline = [
    ["2022", "A kitchen argument", "A Lebanese cook and a Spanish cook spent a shift disagreeing about garlic. Both were right. That was the idea."],
    ["2023", "Twenty-one plates", "Eighteen months developing one signature burger per Mediterranean country, tested on people from each of them."],
    ["2024", "The passport", "The loyalty book replaced a points card in testing and doubled second visits within a month."],
    ["2025", "Building the terminal", "Leganés site secured; five route zones, the check-in desk and the departures board designed as one system."],
    ["2026", "Gate one opens", "240 seats, twenty-one destinations in rotation, and the first stamps in circulation."]
  ].map(function (t, i) { return { year: t[0], title: t[1], line: t[2], delay: i * 70 }; });

  var mood = [
    ["Terminal, not theme park", "Airport clarity — boards, gates, tickets — without a single costume.", "#ae1800"],
    ["Loud where it matters", "Zones have their own soundtrack; the room between them stays conversational.", INK],
    ["Print you keep", "Boarding passes, booklets, postcards. Most guests leave holding something.", "#ae1800"],
    ["Warm, not precious", "Long tables, big portions, crew who talk to you. Nothing is plated with tweezers.", INK]
  ].map(function (m, i) { return { label: m[0], line: m[1], color: m[2], delay: i * 65 }; });

  // Founders — per master brief §5.6 (no numbers/prices on this page).
  var founders = [
    {
      name: "Mazen Chouamri", role: "Co-Founder & Global Journeys Lead", bg: CREAM, fg: INK, tag: "FOUNDER 01",
      bio: "Mazen runs an electronics company operating in Spain and the UAE, selling internationally in wholesale and retail. He brings global trade, logistics and customer-service experience to Patty Passport.",
      facts: [["Focus", "Routes & supply"], ["Background", "Trade · logistics"], ["Based", "Madrid"]],
      slot: "Portrait of Mazen Chouamri — founder headshot (to be supplied)"
    },
    {
      name: "Ahmed Al Moutaz", role: "Co-Founder & Retail Experience Lead", bg: YEL, fg: INK, tag: "FOUNDER 02",
      bio: "Ahmed owns retail stores operating in Spain, with deep experience in high-street customers, visual merchandising and day-to-day retail operations. He brings the real-world retail and hospitality perspective Patty Passport needs to work in practice.",
      facts: [["Focus", "Guest experience"], ["Background", "Retail · operations"], ["Based", "Madrid"]],
      slot: "Portrait of Ahmed Al Moutaz — founder headshot (to be supplied)"
    }
  ].map(function (f, i) { f.slotId = "st-founder-" + i; f.delay = i * 90; return f; });

  // Crew role archetypes (unnamed) — the five on-route jobs.
  var crew = [
    ["Route Host", "RH", "Greets the table, reads the route, and decides where you're flying tonight.", YEL, INK, "Route host welcoming guests at the door"],
    ["Passport Desk", "PD", "Prints the boarding ticket, stamps the book, tracks the ladder.", RED, "#fff", "Crew member stamping a passport at the desk"],
    ["Destination Guide", "DG", "Knows the country — the dish, the phrase, the story behind the plate.", BLU, "#fff", "Guide explaining a country card to guests"],
    ["Kitchen Crew", "KC", "Cooks twenty-one countries without flattening any of them.", CREAM, INK, "Kitchen crew grilling at the pass"],
    ["Table Captain", "TC", "Runs the service, the birthday games and the final stamp.", "#e7e3dc", INK, "Table captain serving a full family table"]
  ].map(function (c, i) { return { role: c[0], code: c[1], line: c[2], bg: c[3], fg: c[4], slot: c[5], slotId: "st-crew-" + i, delay: i * 70 }; });

  // Named team roster — master brief §5.6. First four carry the brief's
  // example guest review verbatim; the last four ship with no seed review
  // (front-end only — filled in live via "Leave a Review").
  var TAG_COLORS = [RED, BLU, "#1f7a3d", YEL];
  var TEAM = [
    { name: "George Ammar", role: "Journey Crew · Server", nationality: "Lebanese / Spanish",
      bio: "Runs the floor on the busiest routes and never lets a table feel rushed between courses.",
      reviews: ["George made our trip to Greece unforgettable. He explained the destination card so well and made our kids feel at home."] },
    { name: "Lucía Fernández", role: "Check-In Host", nationality: "Spanish",
      bio: "The first face at the desk — reads a party in seconds and picks the right first destination for them.",
      reviews: ["Lucía greeted us with such warmth. She helped us choose Lebanon as our first destination and walked our child through the passport stamps."] },
    { name: "Marco Rossi", role: "Flavor Control · Kitchen", nationality: "Italian",
      bio: "Holds every country's plate to the same standard: nothing leaves the pass unless it tastes like the place it's from.",
      reviews: ["Marco's attention to detail made our Italian burger taste like a real piazza moment."] },
    { name: "Yasmin Haddad", role: "Kids & Destinations Guide", nationality: "Lebanese",
      bio: "Turns the passport into a game for younger guests — flags, phrases and a stamp they actually want to earn.",
      reviews: ["Yasmin ran an amazing activity for our kids, teaching them about flags and flavors."] },
    { name: "Nikos Papadopoulos", role: "Route Crew · Server", nationality: "Greek",
      bio: "Keeps the Aegean route moving and always has a story about the dish that's about to land.",
      reviews: [] },
    { name: "Alicia Morales", role: "Events & Birthdays Coordinator", nationality: "Spanish",
      bio: "Plans the birthdays and group journeys, from the first booking call to the final candle.",
      reviews: [] },
    { name: "Omar El Tayar", role: "Drinks & Destinations", nationality: "Egyptian",
      bio: "Runs the drinks pass across all twenty-one countries and knows which cooler pairs with which route.",
      reviews: [] },
    { name: "Sofia Costa", role: "Pastry & Desserts", nationality: "Portuguese / Moroccan",
      bio: "Closes every table's journey with the country's dessert — and keeps the sweet stamp worth waiting for.",
      reviews: [] }
  ].map(function (t, i) {
    t.slotId = "st-team-" + i;
    t.delay = (i % 4) * 70;
    t.tag = TAG_COLORS[i % TAG_COLORS.length];
    return t;
  });

  var hours = (window.PP_DATA && window.PP_DATA.HOURS) || [
    { days: "Monday — Friday", time: "10:00 — 22:00" },
    { days: "Weekends & holidays", time: "10:00 — 00:00" }
  ];

  // ── review widget state (front-end only, per master brief §5.6) ──
  var state = { selectedIdx: 0 };

  function renderTicker() {
    document.getElementById("st-ticker").innerHTML = tickerRows.map(function (t) {
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px 24px;border-right:1px solid rgba(247,243,236,.22);white-space:nowrap">'
        + '<span style="font:800 14px/1 \'Archivo\',sans-serif">' + esc(t.name) + '</span>'
        + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;color:#7d7979">' + esc(t.word) + '</span></div>';
    }).join("");
  }

  function renderValues() {
    document.getElementById("st-values").innerHTML = values.map(function (v) {
      return '<div data-rv="up" data-rv-d="' + v.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + v.bg + ';color:' + v.fg + ';padding:24px 20px 26px;display:flex;flex-direction:column;gap:12px;min-height:240px">'
        + '<span style="font:800 40px/1 \'Archivo\',sans-serif;letter-spacing:-.04em;opacity:.35">' + v.n + '</span>'
        + '<h3 style="font:800 21px/1.04 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(v.title) + '</h3>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.86">' + esc(v.line) + '</p></div>';
    }).join("");
  }

  function renderTimeline() {
    document.getElementById("st-timeline").innerHTML = timeline.map(function (t) {
      return '<div data-rv="up" data-rv-d="' + t.delay + '" style="display:flex;gap:16px;padding:17px 0;border-bottom:2px solid rgba(27,26,25,.22)">'
        + '<span style="width:56px;flex:none;font:800 14px/1.2 \'Archivo\',sans-serif;color:#ae1800">' + esc(t.year) + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 16px/1.2 \'Archivo\',sans-serif;margin-bottom:5px">' + esc(t.title) + '</span>'
        + '<span style="display:block;font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(t.line) + '</span></span></div>';
    }).join("");
  }

  function renderMood() {
    document.getElementById("st-mood").innerHTML = mood.map(function (m) {
      return '<div data-rv="up" data-rv-d="' + m.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;padding:18px 16px 20px;display:flex;flex-direction:column;gap:8px;min-height:160px">'
        + '<span style="font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:' + m.color + '">' + esc(m.label) + '</span>'
        + '<span style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(m.line) + '</span></div>';
    }).join("");
  }

  function renderFounders() {
    document.getElementById("st-founders").innerHTML = founders.map(function (f) {
      return '<div data-rv="up" data-rv-d="' + f.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + f.bg + ';color:' + f.fg + ';display:flex;flex-direction:column">'
        + '<div style="position:relative;height:330px;border-bottom:2px solid #1b1a19">'
        + '<div class="pp-placeholder" id="' + f.slotId + '" style="position:absolute;inset:0"><span>' + esc(f.slot) + '</span></div>'
        + '<span style="position:absolute;left:0;top:0;padding:7px 11px;background:#1b1a19;color:#f7f3ec;font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;pointer-events:none">' + f.tag + '</span></div>'
        + '<div style="padding:24px 22px 26px;display:flex;flex-direction:column;gap:12px;flex:1">'
        + '<h3 style="font:800 clamp(24px,2.6vw,34px)/1 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:0">' + esc(f.name) + '</h3>'
        + '<div style="font:800 12px/1.3 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.8">' + esc(f.role) + '</div>'
        + '<p style="font:400 14px/1.6 \'Archivo\',sans-serif;margin:0;opacity:.88">' + esc(f.bio) + '</p>'
        + '<div style="margin-top:auto;display:flex;flex-direction:column;border-top:2px solid currentColor">'
        + f.facts.map(function (x) {
            return '<span style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid currentColor;font:600 10px/1.4 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.85">' + esc(x[0]) + '<span style="font:800 11px/1 \'Archivo\',sans-serif;text-align:right">' + esc(x[1]) + '</span></span>';
          }).join("")
        + '</div></div></div>';
    }).join("");
  }

  function renderHours() {
    document.getElementById("st-hours").innerHTML = hours.map(function (h) {
      return '<div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:14px;padding:20px 22px;border-bottom:2px solid rgba(27,26,25,.2)">'
        + '<span style="font:800 17px/1.2 \'Archivo\',sans-serif;letter-spacing:-.015em">' + esc(h.days) + '</span>'
        + '<span style="font:800 26px/1 \'Archivo\',sans-serif;letter-spacing:-.03em;color:#ae1800">' + esc(h.time) + '</span></div>';
    }).join("");
  }

  function renderCrew() {
    document.getElementById("st-crew").innerHTML = crew.map(function (c) {
      return '<div data-rv="up" data-rv-d="' + c.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;color:#1b1a19;display:flex;flex-direction:column">'
        + '<div style="position:relative;height:200px;border-bottom:2px solid #1b1a19">'
        + '<div class="pp-placeholder" id="' + c.slotId + '" style="position:absolute;inset:0"><span>' + esc(c.slot) + '</span></div>'
        + '<span style="position:absolute;right:0;bottom:0;padding:6px 9px;background:' + c.bg + ';color:' + c.fg + ';font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;pointer-events:none">' + c.code + '</span></div>'
        + '<div style="padding:18px 16px 20px;display:flex;flex-direction:column;gap:9px;flex:1">'
        + '<h3 style="font:800 19px/1.05 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(c.role) + '</h3>'
        + '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(c.line) + '</p></div></div>';
    }).join("");
  }

  function renderTeam() {
    document.getElementById("st-team").innerHTML = TEAM.map(function (t, i) {
      var reviewsHtml = t.reviews.length
        ? t.reviews.map(function (r) {
            var text = typeof r === "string" ? r : r.text;
            var author = typeof r === "string" ? "" : (r.author || "");
            return '<div style="padding:11px 0;border-bottom:1px solid rgba(27,26,25,.14);font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#444141">'
              + '“' + esc(text) + '”' + (author ? '<span style="display:block;margin-top:4px;font:600 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7d7979">— ' + esc(author) + '</span>' : '') + '</div>';
          }).join("")
        : '<div style="padding:11px 0;font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;font-style:italic">No reviews yet — be the first to leave one.</div>';

      return '<div data-rv="up" data-rv-d="' + t.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;display:flex;flex-direction:column">'
        + '<div style="position:relative;height:220px;border-bottom:2px solid #1b1a19">'
        + '<div class="pp-placeholder" id="' + t.slotId + '" style="position:absolute;inset:0"><span>Portrait of ' + esc(t.name) + ' — ' + esc(t.role) + ' headshot (to be supplied)</span></div>'
        + '<span style="position:absolute;left:0;top:0;padding:6px 10px;background:' + t.tag + ';color:#fff;font:800 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;pointer-events:none">' + esc(t.nationality) + '</span></div>'
        + '<div style="padding:18px 18px 20px;display:flex;flex-direction:column;gap:9px;flex:1">'
        + '<h3 style="font:800 19px/1.1 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(t.name) + '</h3>'
        + '<div style="font:800 10.5px/1.3 \'Archivo\',sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#ae1800">' + esc(t.role) + '</div>'
        + '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(t.bio) + '</p>'
        + '<div data-team-reviews="' + i + '" style="margin-top:6px;border-top:2px solid rgba(27,26,25,.16)">' + reviewsHtml + '</div>'
        + '<button type="button" class="st-leave-review" data-idx="' + i + '" style="margin-top:auto;align-self:flex-start;padding:10px 14px;border:2px solid #1b1a19;background:transparent;color:#1b1a19;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#1b1a19;color:#f7f3ec">Leave a review</button>'
        + '</div></div>';
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll(".st-leave-review"), function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        state.selectedIdx = idx;
        var select = document.getElementById("st-review-select");
        if (select) select.value = String(idx);
        var form = document.getElementById("st-review-form");
        if (form) {
          form.scrollIntoView({ behavior: "smooth", block: "center" });
          var text = document.getElementById("st-review-text");
          if (text) text.focus();
        }
      });
    });
  }

  function renderReviewSelect() {
    var select = document.getElementById("st-review-select");
    if (!select) return;
    select.innerHTML = TEAM.map(function (t, i) {
      return '<option value="' + i + '">' + esc(t.name) + ' — ' + esc(t.role) + '</option>';
    }).join("");
    select.value = String(state.selectedIdx);
  }

  function bindReviewForm() {
    var form = document.getElementById("st-review-form");
    var status = document.getElementById("st-review-status");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var select = document.getElementById("st-review-select");
      var nameEl = document.getElementById("st-review-name");
      var textEl = document.getElementById("st-review-text");
      var idx = parseInt(select.value, 10);
      var text = (textEl.value || "").trim();
      var author = (nameEl.value || "").trim();
      if (!text || !TEAM[idx]) {
        status.textContent = "Write a few words before posting.";
        return;
      }
      TEAM[idx].reviews.unshift({ text: text, author: author });
      state.selectedIdx = idx;
      textEl.value = "";
      nameEl.value = "";
      status.textContent = "Thanks — your review for " + TEAM[idx].name + " has been added below.";
      renderTeam();
      renderReviewSelect();
      var card = document.querySelector('[data-team-reviews="' + idx + '"]');
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function render() {
    renderTicker();
    renderValues();
    renderTimeline();
    renderMood();
    renderFounders();
    renderHours();
    renderCrew();
    renderTeam();
    renderReviewSelect();
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  window.PP_READY(function () {
    render();
    bindReviewForm();
  });
})();
