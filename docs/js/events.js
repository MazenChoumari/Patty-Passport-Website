/* Patty Passport — Events & Birthdays page, ported from Events.dc.html's
   x-dc template + Component logic into plain JS. State is limited to the
   occasion picker and the mock enquiry-form submission (front-end only,
   nothing is sent — see master brief Section 0.1). */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var state = { occasion: "Birthday", package: null };

  var FACTS = [
    ["8—120", "Guests per departure", YEL],
    ["21", "Destinations to charter", CREAM],
    ["2h", "Standard gate slot", CREAM],
    ["1", "Crew host per group", RED]
  ].map(function (f, i) { return { n: f[0], label: f[1], color: f[2], delay: String(i * 70) }; });

  var PACKAGES = [
    ["Little Explorer Birthday", "€18", "per child", "Weekday journeys for younger crews — short, loud, and finished before bedtime.",
      ["Kids burger, fries, drink, mini dessert", "Two hours in the play zone", "Three sticker stamps per child", "Goodie bag at the gate", "Minimum 8 children"], CREAM, INK, "Children at a birthday table with passports"],
    ["World Explorer Birthday", "€22", "per child", "The weekend version: full country combo for the birthday child and a crew host running the games.",
      ["Full country combo for the birthday child", "Crew host and destination games", "Zone dressed for the chosen country", "Name on the departures board", "Minimum 10 children"], YEL, INK, "Crew host running games at a kids party"],
    ["Family Reunion", "€29", "per guest", "One route, one long table, three generations and a shared Family Passport.",
      ["Signature plate per guest, any destination", "Shared mezze landing on arrival", "Family Passport with pooled stamps", "Printed boarding passes per seat", "Minimum 10 guests"], RED, "#fff", "Multi-generation family at a long dressed table"],
    ["School Journey", "€14", "per pupil", "A guided lesson disguised as lunch — geography, language and food of one country.",
      ["Destination guide leads the session", "Country booklet per pupil", "Junior combo and one stamp", "Teacher table included free", "Weekday mornings, min. 15 pupils"], BLU, "#fff", "School group with route booklets at the tables"],
    ["Team Departure", "€34", "per guest", "Company dinners that aren't another set menu — a route, a host and something to talk about.",
      ["Private zone for up to 40", "Three-destination tasting flight", "Route host and soundtrack", "Explorer Passport per guest", "Evenings, min. 12 guests"], "#e7e3dc", INK, "Company group dinner in a dressed private zone"]
  ].map(function (p, i) {
    return {
      name: p[0], price: p[1], line: p[3], bg: p[5], fg: p[6],
      kicker: p[2].toUpperCase(), includes: p[4],
      slotId: "ev-pkg-" + i, slot: p[7], delay: String(i * 70)
    };
  });

  var UPCOMING = [
    { key: "dabke", month: "October", date: "2026-10-16T19:30:00", route: "LEV", routeName: "Levant",
      title: "Levant Dabke Night", line: "The whole room links arms and joins the line — live percussion, a packed floor, a night that refuses to sit still.",
      fact: "Dabke is a communal line dance from the Levant, tied to weddings, celebrations and group energy — in Palestine it's recognised on UNESCO's list of intangible cultural heritage.",
      tiers: [["Entry only", "€10"], ["Set menu", "€24"], ["Premium set", "€29"]],
      setLine: "Set menu: 1 drink, 1 burger, fries, dessert." },
    { key: "harbour", month: "November", date: "2026-11-13T19:30:00", route: "ADR", routeName: "Adriatic",
      title: "Adriatic Harbour Songs", line: "Candlelight, close harmony and a harbour hush — the kind of night that makes the whole table stop talking to listen.",
      fact: "Klapa — close-harmony singing carried down the Adriatic coast — is recognised by UNESCO as intangible cultural heritage.",
      tiers: [["Entry only", "€12"], ["Dinner menu", "€27"]],
      setLine: "Dinner menu: drink, burger, fries, dessert." },
    { key: "tribute", month: "December", date: "2026-12-19T20:00:00", route: null, routeName: "Tribute night",
      title: "King of Pop Tribute Night", line: "Full choreography, the hits, the moonwalk — an electric, sold-out-feeling night built entirely around the legend's music. Tribute performance only; no official affiliation.",
      fact: "Staged as a respectful tribute only, with no official affiliation — including a nod to the 1992 Heal the World Foundation's humanitarian legacy.",
      tiers: [["Entry only", "€15"], ["Set menu", "€25"], ["Premium seating", "€35"]],
      setLine: "Set menu: entry, drink, burger, fries, dessert." },
    { key: "aegean", month: "January", date: "2027-01-22T19:30:00", route: "AEG", routeName: "Aegean",
      title: "Aegean After Dark", line: "Rebetiko strings, island night air and the first big route night of the new year — this one fills fast.",
      fact: "Rebetiko — Greece's rebel folk music — is recognised by UNESCO as intangible cultural heritage.",
      tiers: [["Entry only", "€10"], ["Dinner menu", "€26"]],
      setLine: "Dinner menu: drink, burger, fries, dessert." }
  ];

  function countdownParts(target) {
    var ms = target.getTime() - Date.now();
    if (ms <= 0) return null;
    var totalMin = Math.floor(ms / 60000);
    var d = Math.floor(totalMin / 1440);
    var h = Math.floor((totalMin % 1440) / 60);
    var m = totalMin % 60;
    return { d: d, h: h, m: m };
  }

  function renderUpcoming() {
    var el = document.getElementById("ev-upcoming");
    if (!el) return;
    var D = window.PP_DATA;
    var routes = D ? D.ROUTES : {};
    var soonestKey = UPCOMING.filter(function (e) { return countdownParts(new Date(e.date)); })
      .sort(function (a, b) { return new Date(a.date) - new Date(b.date); })[0];
    soonestKey = soonestKey ? soonestKey.key : null;

    el.innerHTML = UPCOMING.map(function (e, i) {
      var target = new Date(e.date);
      var parts = countdownParts(target);
      var route = e.route && routes[e.route] ? routes[e.route] : { bg: INK, fg: CREAM };
      var isNext = e.key === soonestKey;
      var dateLabel = target.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
      var tiersHtml = e.tiers.map(function (t) {
        return '<span style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid rgba(27,26,25,.14)"><span style="font:600 11.5px/1.3 \'Archivo\',sans-serif;opacity:.85">' + esc(t[0]) + '</span><span style="font:800 13px/1 \'Archivo\',sans-serif">' + esc(t[1]) + '</span></span>';
      }).join("");
      var countdownHtml = parts
        ? '<div data-countdown="' + e.key + '" style="font:800 13px/1 \'Archivo\',sans-serif;letter-spacing:.02em">Departs in ' + parts.d + 'd · ' + String(parts.h).padStart(2, "0") + 'h · ' + String(parts.m).padStart(2, "0") + 'm</div>'
        : '<div style="font:800 13px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;opacity:.6">Departed</div>';
      // Poster strip: big departure date + a performance-motif mark
      // (vinyl disc for the three music nights, a medal/spotlight mark
      // for the tribute) instead of the card opening straight into text
      // — a mood visual without inventing a photo of an event that
      // hasn't happened yet.
      var posterMark = e.key === "tribute"
        ? (window.PP_ICON ? window.PP_ICON("medal", 40, route.fg) : "")
        : '<span style="display:block;width:46px;height:46px;flex:none;border-radius:50%;background:repeating-radial-gradient(circle,' + route.fg + ' 0 2px,transparent 2px 5px);position:relative"><span style="position:absolute;inset:0;margin:auto;width:12px;height:12px;border-radius:50%;background:' + route.fg + '"></span></span>';
      var posterHtml = '<div style="position:relative;margin:-22px -20px 4px;padding:18px 20px 16px;background:rgba(0,0,0,.16);display:flex;align-items:center;justify-content:space-between;gap:12px">'
        + '<span><span style="display:block;font:800 34px/1 \'Archivo\',sans-serif;letter-spacing:-.03em">' + target.getDate() + '</span><span style="display:block;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase;opacity:.75">' + target.toLocaleDateString("en-GB", { month: "short" }) + '</span></span>'
        + posterMark
        + '</div>';
      return '<div data-rv="up" data-rv-d="' + (i * 70) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + route.bg + ';color:' + route.fg + ';padding:22px 20px 24px;display:flex;flex-direction:column;gap:11px;position:relative' + (parts ? "" : ";opacity:.6") + '">'
        + (isNext ? '<span style="position:absolute;right:0;top:0;padding:5px 9px;background:#1b1a19;color:#f2b30c;font:800 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;z-index:1">NEXT UP</span>' : "")
        + posterHtml
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.75">' + esc(e.month) + ' · ' + esc(dateLabel) + '</span>'
        + '<h3 style="font:800 22px/1.05 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(e.title) + '</h3>'
        + '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.9">' + esc(e.line) + '</p>'
        + '<div style="display:flex;flex-direction:column;margin-top:2px">' + tiersHtml + '</div>'
        + '<p style="font:400 11px/1.4 \'Archivo\',sans-serif;margin:0;opacity:.7">' + esc(e.setLine) + '</p>'
        + '<p style="font:400 11.5px/1.5 \'Archivo\',sans-serif;font-style:italic;margin:0;opacity:.85;border-top:1px solid rgba(27,26,25,.14);padding-top:10px">' + esc(e.fact) + '</p>'
        + countdownHtml
        + '<a href="#enquiry" data-enquire-pkg="' + esc(e.title) + '" style="margin-top:auto;padding-top:6px;display:inline-flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase" data-hover="background:#ec3013">Reserve a seat<span>→</span></a>'
        + '</div>';
    }).join("");

    Array.prototype.forEach.call(el.querySelectorAll("[data-enquire-pkg]"), function (a) {
      a.addEventListener("click", function () {
        state.package = a.getAttribute("data-enquire-pkg");
        renderPackageContext();
      });
    });
  }

  var countdownTimer = null;
  function tickCountdowns() {
    var changed = false;
    UPCOMING.forEach(function (e) {
      var el = document.querySelector('[data-countdown="' + e.key + '"]');
      if (!el) return;
      var parts = countdownParts(new Date(e.date));
      if (!parts) { changed = true; return; }
      el.textContent = "Departs in " + parts.d + "d · " + String(parts.h).padStart(2, "0") + "h · " + String(parts.m).padStart(2, "0") + "m";
    });
    if (changed) renderUpcoming();
  }
  function initCountdowns() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(tickCountdowns, 30000);
    if (window.PP_TRACK) window.PP_TRACK(function () { clearInterval(countdownTimer); });
  }

  var TIMELINE = [
    ["19:00", "Check-in at the desk", "Guests collect boarding passes printed with their names and the destination."],
    ["19:15", "Gate announcement", "The departures board calls your group; the zone lights change to the route colour."],
    ["19:30", "Landing plates", "Mezze or shared starters from the chosen country arrive at the centre of the table."],
    ["20:00", "The main route", "Signature plates per guest, with the destination guide explaining what's in front of them."],
    ["21:00", "Games and the soundtrack", "Crew host runs the route games; the playlist switches to the destination."],
    ["21:30", "Stamps and the send-off", "Everyone's passport gets stamped, the cake lands, the board says arrived."]
  ].map(function (t, i) { return { time: t[0], title: t[1], line: t[2], delay: String(i * 60) }; });

  var PROPS = [
    ["INVITATION PASS", "2%", "2%", "210px", CREAM, INK, "-5deg", "11s", "0s", "118px", "Printed boarding-pass invitation with guest name", "14px 14px 0 rgba(27,26,25,.3)"],
    ["ZONE DRESSING", "48%", "16%", "204px", "#fff", INK, "4deg", "13s", ".6s", "128px", "Zone dressed in the destination's colours", "-12px 14px 0 rgba(27,26,25,.28)"],
    ["GROUP STAMP SHEET", "6%", "50%", "196px", RED, "#fff", "6deg", "10s", ".3s", "112px", "Sheet of stamps for the whole group", "12px 12px 0 rgba(27,26,25,.3)"],
    ["CAKE ARRIVAL", "50%", "64%", "192px", INK, CREAM, "-7deg", "12s", "1s", "104px", "Destination cake arriving at the table", "-12px 12px 0 rgba(27,26,25,.28)"]
  ].map(function (p, i) {
    return { label: p[0], x: p[1], y: p[2], w: p[3], bg: p[4], fg: p[5], r: p[6], dur: p[7], delay: p[8], h: p[9], note: p[10], shadow: p[11], slotId: "ev-prop-" + i };
  });

  var FIELD_IDS = {
    name: "ev-f-name", email: "ev-f-email", phone: "ev-f-phone",
    date: "ev-f-date", time: "ev-f-time", adults: "ev-f-adults", children: "ev-f-children",
    dest: "ev-f-dest", food: "ev-f-food", notes: "ev-f-notes"
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function fieldsData() {
    return [
      { id: FIELD_IDS.name, label: "Full name *", ph: "Who's organising", type: "text" },
      { id: FIELD_IDS.email, label: "Email *", ph: "you@example.com", type: "email" },
      { id: FIELD_IDS.phone, label: "Phone", ph: "Optional", type: "tel" },
      { id: FIELD_IDS.date, label: "Preferred date *", ph: "Fri 25 Sep 2026", type: "text" },
      { id: FIELD_IDS.time, label: "Preferred time *", ph: "e.g. 19:30", type: "text" },
      { id: FIELD_IDS.adults, label: "Adults *", ph: "e.g. 14", type: "number" },
      { id: FIELD_IDS.children, label: "Children", ph: "e.g. 6", type: "number" },
      { id: FIELD_IDS.dest, label: "Route or country interest", ph: "Lebanon · MED-12, or let us pick", type: "text" },
      { id: FIELD_IDS.food, label: "Food preferences & allergies", ph: "Halal, vegetarian, nut allergy…", type: "text", full: true },
      { id: FIELD_IDS.notes, label: "Message / notes", ph: "Anything else the crew should know", type: "textarea", full: true }
    ];
  }

  function renderFacts() {
    document.getElementById("ev-facts").innerHTML = FACTS.map(function (f) {
      return '<div data-rv="up" data-rv-d="' + f.delay + '" style="padding:24px 26px 26px;border-right:1px solid rgba(247,243,236,.22)">'
        + '<div style="font:800 34px/1 \'Archivo\',sans-serif;letter-spacing:-.035em;color:' + f.color + '">' + f.n + '</div>'
        + '<div style="font:600 9.5px/1.45 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#bab6b6;margin-top:8px">' + f.label + '</div></div>';
    }).join("");
  }

  function renderPackages() {
    document.getElementById("ev-packages").innerHTML = PACKAGES.map(function (p) {
      return '<div data-rv="up" data-rv-d="' + p.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + p.bg + ';color:' + p.fg + ';display:flex;flex-direction:column">'
        + '<div style="position:relative;height:190px;border-bottom:2px solid #1b1a19">'
        + '<div class="pp-placeholder" id="' + p.slotId + '" style="position:absolute;inset:0"><span>' + esc(p.slot) + '</span></div>'
        + '<span style="position:absolute;left:0;top:0;padding:7px 10px;background:#1b1a19;color:#f7f3ec;font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;pointer-events:none">' + esc(p.kicker) + '</span></div>'
        + '<div style="padding:22px 20px 24px;display:flex;flex-direction:column;gap:13px;flex:1">'
        + '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">'
        + '<h3 style="font:800 23px/1.02 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(p.name) + '</h3>'
        + '<span style="font:800 24px/1 \'Archivo\',sans-serif;letter-spacing:-.03em">' + p.price + '</span></div>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.85">' + esc(p.line) + '</p>'
        + '<div style="display:flex;flex-direction:column;border-top:2px solid currentColor">'
        + p.includes.map(function (i) {
          return '<span style="display:flex;align-items:flex-start;gap:9px;padding:9px 0;border-bottom:1px solid currentColor;font:400 12.5px/1.4 \'Archivo\',sans-serif;opacity:.9">'
            + '<span style="width:7px;height:7px;flex:none;background:currentColor;margin-top:5px"></span>' + esc(i) + '</span>';
        }).join("")
        + '</div>'
        + '<a href="#enquiry" data-enquire-pkg="' + esc(p.name) + '" style="margin-top:auto;display:inline-flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 11.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase" data-hover="background:#ec3013">Enquire<span>→</span></a>'
        + '</div></div>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#ev-packages [data-enquire-pkg]"), function (a) {
      a.addEventListener("click", function () {
        state.package = a.getAttribute("data-enquire-pkg");
        renderPackageContext();
      });
    });
  }

  function renderTimeline() {
    document.getElementById("ev-timeline").innerHTML = TIMELINE.map(function (t) {
      return '<div data-rv="up" data-rv-d="' + t.delay + '" style="display:flex;gap:16px;padding:15px 0;border-bottom:2px solid rgba(27,26,25,.28)">'
        + '<span style="font:800 15px/1 \'Archivo\',sans-serif;letter-spacing:.02em;width:58px;flex:none;color:#ae1800">' + t.time + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 15.5px/1.2 \'Archivo\',sans-serif;margin-bottom:4px">' + esc(t.title) + '</span>'
        + '<span style="display:block;font:400 12.5px/1.5 \'Archivo\',sans-serif;opacity:.78">' + esc(t.line) + '</span></span></div>';
    }).join("");
  }

  function renderProps() {
    document.getElementById("ev-props").innerHTML = PROPS.map(function (p) {
      return '<div style="position:absolute;left:' + p.x + ';top:' + p.y + ';width:' + p.w + ';background:' + p.bg + ';color:' + p.fg + ';border:2px solid #1b1a19;box-shadow:' + p.shadow + ';transform:rotate(' + p.r + ');--r:' + p.r + ';animation:ppDrift ' + p.dur + ' ease-in-out ' + p.delay + ' infinite;padding:12px">'
        + '<div style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:9px">' + p.label + '</div>'
        + '<div style="position:relative;height:' + p.h + '">'
        + '<div class="pp-placeholder" id="' + p.slotId + '" style="position:absolute;inset:0"><span>' + esc(p.note) + '</span></div>'
        + '</div></div>';
    }).join("");
  }

  function renderFields() {
    document.getElementById("ev-fields").innerHTML = fieldsData().map(function (f) {
      var control = f.type === "textarea"
        ? '<textarea id="' + f.id + '" rows="2" placeholder="' + esc(f.ph) + '" style="width:100%;background:transparent;border:0;border-bottom:2px solid #f2b30c;color:#f7f3ec;font:600 14px/1.4 \'Archivo\',sans-serif;padding:0 0 8px;outline:none;resize:vertical" data-field></textarea>'
        : '<input type="' + f.type + '" id="' + f.id + '" placeholder="' + esc(f.ph) + '"' + (f.type === "number" ? ' min="0" step="1"' : '') + ' style="width:100%;background:transparent;border:0;border-bottom:2px solid #f2b30c;color:#f7f3ec;font:800 16px/1.2 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" data-field />';
      return '<label style="display:block;padding:18px 20px;border-right:2px solid rgba(247,243,236,.22);border-bottom:1px solid rgba(247,243,236,.22);' + (f.full ? "grid-column:1/-1" : "") + '">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#bab6b6;margin-bottom:10px">' + esc(f.label) + '</span>'
        + control
        + '<span data-field-error style="display:none;color:#ec3013;font:600 10.5px/1.4 \'Archivo\',sans-serif;margin-top:6px"></span></label>';
    }).join("");
  }

  function renderPackageContext() {
    var el = document.getElementById("ev-pkg-context");
    if (!el) return;
    if (state.package) {
      el.style.display = "flex";
      el.innerHTML = '<span>Enquiring about: <strong>' + esc(state.package) + '</strong></span>'
        + '<button type="button" id="ev-pkg-clear" style="background:transparent;border:0;color:#f2b30c;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;text-decoration:underline">Clear</button>';
      var clearBtn = document.getElementById("ev-pkg-clear");
      if (clearBtn) clearBtn.addEventListener("click", function () { state.package = null; render(); });
    } else {
      el.style.display = "none";
      el.innerHTML = "";
    }
  }

  function renderOccasions() {
    var labels = ["Birthday", "Family", "School", "Team", "Something else"];
    document.getElementById("ev-occasions").innerHTML = labels.map(function (label) {
      var on = state.occasion === label;
      return '<button type="button" data-occ="' + esc(label) + '" style="padding:10px 13px;background:' + (on ? YEL : "transparent") + ';border:2px solid ' + (on ? YEL : "rgba(247,243,236,.55)") + ';color:' + (on ? INK : CREAM) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + esc(label) + '</button>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#ev-occasions [data-occ]"), function (btn) {
      btn.addEventListener("click", function () {
        state.occasion = btn.getAttribute("data-occ");
        render();
      });
    });
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldEl(id) { return document.getElementById(id); }
  function fieldLabel(id) { var el = fieldEl(id); return el && el.closest("label"); }
  function setFieldError(id, msg) {
    var label = fieldLabel(id);
    if (!label) return;
    var input = fieldEl(id);
    var err = label.querySelector("[data-field-error]");
    if (msg) {
      input.style.borderBottomColor = "#ec3013";
      if (err) { err.textContent = msg; err.style.display = "block"; }
    } else {
      input.style.borderBottomColor = "#f2b30c";
      if (err) { err.style.display = "none"; err.textContent = ""; }
    }
  }

  function renderSubmit() {
    var btn = document.getElementById("ev-submit");
    btn.onclick = function () {
      var name = (fieldEl(FIELD_IDS.name).value || "").trim();
      var email = (fieldEl(FIELD_IDS.email).value || "").trim();
      var phone = (fieldEl(FIELD_IDS.phone).value || "").trim();
      var date = (fieldEl(FIELD_IDS.date).value || "").trim();
      var time = (fieldEl(FIELD_IDS.time).value || "").trim();
      var adultsRaw = (fieldEl(FIELD_IDS.adults).value || "").trim();
      var childrenRaw = (fieldEl(FIELD_IDS.children).value || "").trim();
      var dest = (fieldEl(FIELD_IDS.dest).value || "").trim();
      var food = (fieldEl(FIELD_IDS.food).value || "").trim();
      var notes = (fieldEl(FIELD_IDS.notes).value || "").trim();

      [FIELD_IDS.name, FIELD_IDS.email, FIELD_IDS.date, FIELD_IDS.time, FIELD_IDS.adults].forEach(function (id) { setFieldError(id, ""); });

      var errors = [];
      if (!name) { errors.push("Add your name."); setFieldError(FIELD_IDS.name, "Required"); }
      if (!email) { errors.push("Add an email so the crew can confirm."); setFieldError(FIELD_IDS.email, "Required"); }
      else if (!EMAIL_RE.test(email)) { errors.push("That email address doesn't look right."); setFieldError(FIELD_IDS.email, "Check this address"); }
      if (!date) { errors.push("Add a preferred date."); setFieldError(FIELD_IDS.date, "Required"); }
      if (!time) { errors.push("Add a preferred time."); setFieldError(FIELD_IDS.time, "Required"); }
      var adults = adultsRaw === "" ? NaN : parseInt(adultsRaw, 10);
      var children = childrenRaw === "" ? 0 : parseInt(childrenRaw, 10);
      if (adultsRaw === "" || isNaN(adults) || adults < 0) { errors.push("Adults must be a number (0 or more)."); setFieldError(FIELD_IDS.adults, "Required"); }
      else if (children < 0 || isNaN(children)) { errors.push("Children must be a number (0 or more)."); }
      else if (adults + children < 1) { errors.push("Add at least one guest."); setFieldError(FIELD_IDS.adults, "At least 1 guest total"); }

      var fb = document.getElementById("ev-feedback");
      fb.style.display = "block";
      if (errors.length) {
        fb.style.background = "rgba(236,48,19,.12)";
        fb.style.color = "#ec3013";
        fb.innerHTML = '<strong style="display:block;margin-bottom:6px">Please fix the following:</strong><ul style="margin:0;padding-left:18px">' + errors.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>";
        return;
      }

      var totalGuests = adults + children;
      var guestLine = adults + " adult" + (adults === 1 ? "" : "s") + (children ? ", " + children + " child" + (children === 1 ? "" : "ren") : "");
      var ref = "PP-EV-" + Math.floor(1000 + Math.random() * 9000);
      fb.style.background = "rgba(242,179,12,.12)";
      fb.style.color = "#f2b30c";
      fb.innerHTML = '<strong style="display:block;margin-bottom:6px">Flight plan filed — reference ' + esc(ref) + '</strong>'
        + '<span style="display:block;color:#f7f3ec;opacity:.9">' + esc(name) + (state.package ? " · " + esc(state.package) : " · " + esc(state.occasion))
        + " · " + esc(guestLine) + " (" + totalGuests + " total)"
        + " · " + esc(date) + " at " + esc(time)
        + (dest ? " · " + esc(dest) : "")
        + (food ? " · " + esc(food) : "")
        + (notes ? " · “" + esc(notes) + "”" : "") + "</span>"
        + '<span style="display:block;margin-top:8px">We’ll confirm at ' + esc(email) + (phone ? " or " + esc(phone) : "") + ' within one working day.</span>'
        + '<span style="display:block;margin-top:4px;color:#bab6b6;font:400 11.5px/1.5 \'Archivo\',sans-serif">Front-end demo — this form does not send anything yet. Prefer email right now? Write to <a href="mailto:events@pattypassport.com" style="color:#f2b30c">events@pattypassport.com</a>.</span>';
    };
  }

  function render() {
    renderFacts();
    renderUpcoming();
    initCountdowns();
    renderPackages();
    renderTimeline();
    renderProps();
    renderFields();
    renderPackageContext();
    renderOccasions();
    renderSubmit();
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  window.PP_READY(render);
})();
