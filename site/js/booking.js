/* Patty Passport — booking / "Reserve Your Flight" page, ported from
   Booking.dc.html's x-dc template + Component logic. Front-end demo only
   (master brief Section 0.1): nothing is charged or sent, the "reservation"
   is held in in-memory state and rendered as a printed-boarding-pass-style
   confirmation ticket. Reads window.PP_DATA (js/data.js) for routes,
   countries and opening hours, and pre-selects a destination from the URL
   hash (e.g. booking.html#lbn) the same way destination.html does.

   Booking type drives everything below it: which fields show, which days
   and times are actually offered, and what the ticket preview says. The
   six group-booking types reuse the exact prices/minimums/inclusions
   already published on events.html's package cards and Country Night
   section — nothing here invents a new number. Native <select>/<input>
   controls throughout (not custom chip buttons) so the console works
   with a keyboard or a screen reader the same way any ordinary form does. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", INK = "#1b1a19", CREAM = "#f7f3ec";
  var WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function isoToday() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function parseIso(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  function isWeekend(dateObj) {
    var day = dateObj.getDay();
    return day === 0 || day === 6;
  }
  /* Business hours (master brief §3): weekdays 10:00-22:00, weekends &
     holidays 10:00-00:00. No public-holiday calendar is wired up yet, so
     "holiday" support means: swap a specific date to weekend hours by
     adding its ISO string to HOLIDAYS below. */
  var HOLIDAYS = [];
  function rangeFor(dateObj) {
    if (!dateObj) return { start: 10 * 60, end: 22 * 60, label: "Weekday · 10:00–22:00", weekend: false };
    var iso = dateObj.getFullYear() + "-" + String(dateObj.getMonth() + 1).padStart(2, "0") + "-" + String(dateObj.getDate()).padStart(2, "0");
    var weekend = isWeekend(dateObj) || HOLIDAYS.indexOf(iso) > -1;
    return weekend
      ? { start: 10 * 60, end: 24 * 60, label: "Weekend & holiday hours · 10:00–00:00", weekend: true }
      : { start: 10 * 60, end: 22 * 60, label: "Weekday hours · 10:00–22:00", weekend: false };
  }
  function fmtTime(mins) {
    var h = Math.floor(mins / 60) % 24, m = mins % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }
  /* Every 30 minutes, last seating slot left 30 min before closing — then
     narrowed further by the booking type's own time-of-day rule, if any
     (a School Journey only ever runs weekday mornings; a Team Departure
     only ever runs evenings). */
  function slotsFor(dateObj, timeRule) {
    var r = rangeFor(dateObj);
    var start = r.start, end = r.end;
    if (timeRule === "morning") end = Math.min(end, 12 * 60 + 30);
    if (timeRule === "evening") start = Math.max(start, 18 * 60);
    var out = [];
    for (var t = start; t <= end - 30; t += 30) out.push(fmtTime(t));
    return out;
  }
  function fmtDateLong(dateObj) {
    if (!dateObj) return "";
    return WEEKDAY_NAMES[dateObj.getDay()] + " " + dateObj.getDate() + " " + MONTH_NAMES[dateObj.getMonth()] + " " + dateObj.getFullYear();
  }

  // Eight booking types. The six group types reuse the exact copy/prices
  // already published elsewhere (events.js PACKAGES + events.html's
  // Country Night section) so nothing here is a new invented figure.
  var TYPES = [
    { key: "table", label: "Table reservation", guestLabel: "Travellers", guestMin: 1, guestMax: 24, guestDefault: 4,
      dayRule: "any", timeRule: "any",
      note: "A regular table, any route, any day, no minimum." },
    { key: "little_explorer", label: "Little Explorer Birthday (kids, weekday)", guestLabel: "Children", guestMin: 8, guestMax: 40, guestDefault: 10,
      dayRule: "weekday", timeRule: "any", extraField: "birthdayName", extraLabel: "Birthday child's name",
      price: "€18 per child", note: "Kids burger, fries, drink, mini dessert · two hours in the play zone · three sticker stamps per child · goodie bag at the gate. Minimum 8 children, weekday journeys only." },
    { key: "world_explorer", label: "World Explorer Birthday (kids, weekend)", guestLabel: "Children", guestMin: 10, guestMax: 60, guestDefault: 12,
      dayRule: "weekend", timeRule: "any", extraField: "birthdayName", extraLabel: "Birthday child's name",
      price: "€22 per child", note: "Full country combo for the birthday child · crew host and destination games · zone dressed for the chosen country. Minimum 10 children, weekends only." },
    { key: "family_reunion", label: "Family Reunion", guestLabel: "Guests", guestMin: 10, guestMax: 80, guestDefault: 12,
      dayRule: "any", timeRule: "any",
      price: "€29 per guest", note: "Signature plate per guest, any destination · shared mezze landing · Family Passport with pooled stamps. Minimum 10 guests." },
    { key: "school_journey", label: "School Journey", guestLabel: "Pupils", guestMin: 15, guestMax: 120, guestDefault: 20,
      dayRule: "weekday", timeRule: "morning", extraField: "orgName", extraLabel: "School / group name",
      price: "€14 per pupil", note: "Destination guide leads the session · country booklet per pupil · junior combo and one stamp · teacher table free. Minimum 15 pupils, weekday mornings only." },
    { key: "team_departure", label: "Team Departure (corporate)", guestLabel: "Guests", guestMin: 12, guestMax: 40, guestDefault: 15,
      dayRule: "any", timeRule: "evening", extraField: "orgName", extraLabel: "Company name",
      price: "€34 per guest", note: "Private zone for up to 40 · three-destination tasting flight · route host and soundtrack · Explorer Passport per guest. Minimum 12 guests, evenings only." },
    { key: "country_night", label: "Country Night group menu", tiers: true,
      dayRule: "any", timeRule: "any",
      note: "Choose any one destination. Adult buffets: vegetarian €24, chicken €25, beef €26. Kids bundle €15. A €80–120 hall fee books the zone fully private (on top of food/drink); otherwise a €400+ group minimum applies." },
    { key: "enquiry", label: "Something else / general enquiry", freeform: true,
      note: "Not sure which type fits, or planning something not listed here? Tell the desk what you have in mind." }
  ];
  function typeByKey(k) { return TYPES.filter(function (t) { return t.key === k; })[0] || TYPES[0]; }

  var TIER_PRICES = { veg: 24, chicken: 25, beef: 26, kids: 15 };

  var state = {
    type: "table", route: "LEV", country: "lbn", time: "20:30", guests: 4,
    passenger: "", contact: "", date: isoToday(), booked: null,
    extra: { birthdayName: "", orgName: "", message: "" },
    tiers: { veg: 0, chicken: 0, beef: 0, kids: 0 }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function applyHash() {
    var D = window.PP_DATA;
    if (!D) return;
    var h = (location.hash || "").replace("#", "").toLowerCase();
    var c = D.COUNTRIES.find(function (x) { return x.code === h; });
    if (c) { state.country = c.code; state.route = c.routeKey; }
  }

  // Whether the currently-chosen date actually satisfies the type's
  // weekday/weekend rule — checked as a real constraint (surfaced as an
  // inline warning and a disabled Reserve button), not silently
  // overridden out from under the visitor's own date choice.
  function dayRuleOk(type, dateObj) {
    if (!dateObj || type.dayRule === "any") return true;
    var weekend = isWeekend(dateObj);
    return type.dayRule === "weekend" ? weekend : !weekend;
  }
  function dayRuleLabel(type) {
    if (type.dayRule === "weekend") return "Weekends only";
    if (type.dayRule === "weekday") return "Weekdays only";
    return "";
  }

  function render() {
    var D = window.PP_DATA;
    var countries = D ? D.COUNTRIES : [];
    var type = typeByKey(state.type);
    var inRoute = countries.filter(function (c) { return c.routeKey === state.route; });
    var sel = countries.find(function (c) { return c.code === state.country; }) || inRoute[0] || null;
    var b = state.booked;
    var routeName = sel && D ? D.ROUTES[sel.routeKey].name : "—";
    var dateObj = parseIso(state.date);
    var dayOk = dayRuleOk(type, dateObj);

    document.getElementById("bk-hours").innerHTML = (D ? D.HOURS : []).map(function (h) {
      return '<span style="display:block">' + esc(h.days) + ' · ' + esc(h.time) + '</span>';
    }).join("");
    document.getElementById("bk-step-label").textContent = b ? "Boarding pass issued" : type.label;

    document.getElementById("bk-console-body").innerHTML = consoleBodyHtml(D, type, countries, inRoute, sel, dateObj, dayOk);
    bindConsoleEvents(D, type);
    updateSummary();

    // Ticket / empty state
    if (b) {
      var ref = "PP-" + (b.code || "GEN").toUpperCase() + "-2026";
      var rows = b.freeform
        ? [
            { k: "Enquiry type", v: "GENERAL" },
            { k: "Contact", v: (state.passenger || "GUEST").toUpperCase() },
            { k: "Reach at", v: state.contact || "—" }
          ]
        : [
            { k: "Booking type", v: b.typeLabel.toUpperCase() },
            { k: "Destination", v: b.country.toUpperCase() },
            { k: "Route", v: b.med + " · " + b.route },
            { k: "Lead name", v: (state.passenger || "GUEST").toUpperCase() },
            { k: "Departure", v: b.dateLabel + " · " + b.time },
            { k: b.tiers ? "Party" : "Seat", v: b.tiers ? b.tiersLine : "TABLE " + b.table + " · " + b.guests + " covers" }
          ];
      document.getElementById("bk-ticket").innerHTML =
        '<div style="border:2px solid #1b1a19;background:#f7f3ec;box-shadow:14px 14px 0 rgba(27,26,25,.2);animation:ppLand .5s cubic-bezier(.2,.85,.25,1) both">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;padding:13px 18px;background:#ec3013;color:#fff">'
        + '<span style="font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.1em">PATTY PASSPORT ROUTES</span>'
        + '<span style="font:600 10px/1 \'Archivo\',sans-serif;letter-spacing:.16em">' + ref + '</span></div>'
        + '<div style="padding:20px 18px 8px">'
        + rows.map(function (r) {
          return '<div style="display:grid;grid-template-columns:104px 1fr;gap:12px;padding:9px 0;border-bottom:1px solid rgba(27,26,25,.18)">'
            + '<span style="font:600 10px/1.3 \'Archivo\',sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#7d7979">' + esc(r.k) + '</span>'
            + '<span style="font:800 15px/1.15 \'Archivo\',sans-serif;letter-spacing:-.01em">' + esc(r.v) + '</span></div>';
        }).join("")
        + '</div>'
        + '<div style="margin:10px 0 0;border-top:2px dashed rgba(27,26,25,.45)"></div>'
        + '<div style="padding:16px 18px 20px;display:flex;align-items:flex-end;justify-content:space-between;gap:16px">'
        + '<div style="flex:1"><div style="font:600 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979;margin-bottom:7px">Boarding number</div>'
        + '<div style="height:44px;background:repeating-linear-gradient(90deg,#1b1a19 0 2px,transparent 2px 5px,#1b1a19 5px 9px,transparent 9px 13px)"></div></div>'
        + '<div style="width:92px;height:92px;flex:none;border:3px solid #ec3013;color:#ec3013;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:ppStamp .6s cubic-bezier(.2,1.1,.3,1) both">'
        + '<span style="font:800 20px/1 \'Archivo\',sans-serif">' + esc(b.stamp || "OK") + '</span>'
        + '<span style="font:600 8px/1.4 \'Archivo\',sans-serif;letter-spacing:.14em">' + esc((b.country || "ENQUIRY").toUpperCase()) + '</span></div></div>'
        + '<div style="border-top:2px solid #1b1a19;padding:14px 18px;display:flex;flex-wrap:wrap;gap:10px">'
        + (b.code ? '<a href="destination.html#' + b.code + '" style="flex:1;display:inline-flex;align-items:center;justify-content:space-between;min-width:170px;padding:12px 14px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase" data-hover="background:#ec3013">Read the destination<span>→</span></a>' : '')
        + '<button type="button" id="bk-reset" style="flex:1;min-width:150px;padding:12px 14px;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c">Book another</button></div>'
        + '</div>';
      document.getElementById("bk-empty").innerHTML = "";
      var resetBtn = document.getElementById("bk-reset");
      if (resetBtn) resetBtn.onclick = function () { state.booked = null; render(); };
    } else {
      document.getElementById("bk-ticket").innerHTML = "";
      document.getElementById("bk-empty").innerHTML =
        '<div style="border:2px dashed rgba(27,26,25,.4);padding:30px 24px;min-height:340px;display:flex;flex-direction:column;justify-content:center;gap:14px;text-align:left">'
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d7979">Your boarding pass</span>'
        + '<span style="font:800 26px/1.05 \'Archivo\',sans-serif;letter-spacing:-.03em;color:#605d5d">It prints here once you reserve.</span>'
        + '<span style="font:400 13.5px/1.55 \'Archivo\',sans-serif;color:#7d7979">Pick a booking type on the console. Front-end demo — nothing is charged and nothing is sent.</span></div>';
    }

    if (window.initHoverStyles) window.initHoverStyles(document.body);
  }

  // Recomputes the summary line + Reserve/Enquiry button's enabled state
  // from current `state` alone — called after every full render() and
  // also directly from the guest-count/tier number inputs' oninput
  // handlers, since those intentionally skip a full re-render (to avoid
  // yanking focus out of the field being typed in) but still need the
  // gating to reflect the value the visitor just typed, live.
  function updateSummary() {
    var D = window.PP_DATA;
    if (!D) return;
    var type = typeByKey(state.type);
    var reserveBtn = document.getElementById("bk-reserve");
    var reserveLabel = document.getElementById("bk-reserve-label");
    var summaryEl = document.getElementById("bk-summary-line");
    if (!reserveBtn || !summaryEl) return;

    if (type.freeform) {
      summaryEl.textContent = "General enquiry — the desk will follow up by email or phone.";
      reserveBtn.disabled = false;
      reserveBtn.style.opacity = "1";
      reserveBtn.style.cursor = "pointer";
      reserveLabel.textContent = "Send Enquiry";
      return;
    }

    var countries = D.COUNTRIES;
    var inRoute = countries.filter(function (c) { return c.routeKey === state.route; });
    var sel = countries.find(function (c) { return c.code === state.country; }) || inRoute[0] || null;
    var routeName = sel ? D.ROUTES[sel.routeKey].name : "—";
    var dateObj = parseIso(state.date);
    var dayOk = dayRuleOk(type, dateObj);
    var dateLabel = dateObj ? fmtDateLong(dateObj) : state.date;
    var guestsForSummary = type.tiers
      ? (state.tiers.veg + state.tiers.chicken + state.tiers.beef + state.tiers.kids)
      : state.guests;

    reserveLabel.textContent = "Reserve Your Flight";
    var blockers = [];
    if (!sel) blockers.push("choose a destination");
    if (!dayOk) blockers.push(dayRuleLabel(type).toLowerCase());
    if (type.tiers && guestsForSummary < 1) blockers.push("add at least one guest to a menu tier");
    var ok = blockers.length === 0;
    summaryEl.textContent = ok
      ? (type.tiers ? "Country Night · " + (sel ? sel.name : "any destination") : (sel ? sel.name : "—")) + " · " + routeName + " Route · " + dateLabel + " at " + state.time + " · " + guestsForSummary + (type.guestLabel ? " " + type.guestLabel.toLowerCase() : " guests")
      : "Can't reserve yet — " + blockers.join(", ") + ".";
    reserveBtn.disabled = !ok;
    reserveBtn.style.opacity = ok ? "1" : ".45";
    reserveBtn.style.cursor = ok ? "pointer" : "not-allowed";
  }

  function selectStyle() {
    return 'width:100%;background:#1b1a19;border:0;border-bottom:2px solid #f2b30c;color:#f7f3ec;font:800 15px/1.3 \'Archivo\',sans-serif;padding:8px 0;outline:none;appearance:none;-webkit-appearance:none';
  }
  function inputStyle() {
    return 'width:100%;background:transparent;border:0;border-bottom:2px solid #f2b30c;color:#f7f3ec;font:800 17px/1.2 \'Archivo\',sans-serif;padding:0 0 8px;outline:none';
  }
  function labelCap(text) {
    return '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#bab6b6;margin-bottom:10px">' + esc(text) + '</span>';
  }

  function consoleBodyHtml(D, type, countries, inRoute, sel, dateObj, dayOk) {
    if (!D) return "";
    var html = '<div style="padding:20px 20px 4px">';

    html += '<label style="display:block;margin-bottom:20px">' + labelCap("What are you booking?")
      + '<select id="bk-type" style="' + selectStyle() + '">' + TYPES.map(function (t) {
        return '<option value="' + t.key + '"' + (t.key === type.key ? " selected" : "") + '>' + esc(t.label) + '</option>';
      }).join("") + '</select></label>';
    html += '<p style="font:400 12.5px/1.55 \'Archivo\',sans-serif;color:#bab6b6;margin:-8px 0 22px;max-width:60ch">' + esc(type.note) + (type.price ? ' <strong style="color:#f2b30c">' + esc(type.price) + '</strong>' : '') + '</p>';

    if (!type.freeform) {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;margin-bottom:22px">';
      html += '<label>' + labelCap("Route") + '<select id="bk-route" style="' + selectStyle() + '">' + Object.keys(D.ROUTES).map(function (k) {
        return '<option value="' + k + '"' + (k === state.route ? " selected" : "") + '>' + esc(D.ROUTES[k].name) + '</option>';
      }).join("") + '</select></label>';
      html += '<label>' + labelCap("Destination") + '<select id="bk-country" style="' + selectStyle() + '">' + inRoute.map(function (c) {
        return '<option value="' + c.code + '"' + (sel && c.code === sel.code ? " selected" : "") + '>' + esc(c.name) + '</option>';
      }).join("") + '</select></label>';
      html += '</div>';

      var dayNote = dayRuleLabel(type);
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;margin-bottom:8px">';
      html += '<label>' + labelCap("Date") + '<input type="date" id="bk-date" min="' + isoToday() + '" value="' + esc(state.date) + '" style="' + inputStyle() + ';color-scheme:dark" /></label>';
      var slots = slotsFor(dateObj, type.timeRule);
      if (slots.indexOf(state.time) === -1) state.time = slots.length ? slots[Math.min(slots.length - 1, Math.floor(slots.length / 2))] : "";
      html += '<label>' + labelCap("Departure time") + '<select id="bk-time" style="' + selectStyle() + '"' + (!slots.length ? " disabled" : "") + '>' + (slots.length ? slots.map(function (t) {
        return '<option value="' + t + '"' + (t === state.time ? " selected" : "") + '>' + t + '</option>';
      }).join("") : '<option>No slots this day</option>') + '</select></label>';
      html += '</div>';
      var range = rangeFor(dateObj);
      html += '<p style="font:600 10.5px/1.5 \'Archivo\',sans-serif;letter-spacing:.08em;color:' + (dayOk ? "#f2b30c" : "#ec3013") + ';margin:0 0 22px">' + esc(range.label) + (dayNote ? " · " + esc(dayNote) : "") + (!dayOk ? " — pick a date that fits this booking type" : "") + '</p>';
    }

    html += '</div>';

    // Bottom field grid: passenger/contact always; guests OR tier counts;
    // the type's one extra field (birthday child's name / org name); a
    // free-text message box only for the general-enquiry type.
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));border-top:2px solid rgba(247,243,236,.3)">';
    html += fieldCell(type.freeform ? "Your name" : "Lead booker name", '<input type="text" id="bk-passenger" placeholder="Who to ask for" value="' + esc(state.passenger) + '" style="' + inputStyle() + '" />');
    html += fieldCell("Email or phone", '<input type="text" id="bk-contact" placeholder="How we confirm" value="' + esc(state.contact) + '" style="' + inputStyle() + '" />');

    if (type.tiers) {
      html += fieldCell("Vegetarian buffet (€24/adult)", '<input type="number" id="bk-tier-veg" min="0" max="200" value="' + state.tiers.veg + '" style="' + inputStyle() + '" />');
      html += fieldCell("Chicken buffet (€25/adult)", '<input type="number" id="bk-tier-chicken" min="0" max="200" value="' + state.tiers.chicken + '" style="' + inputStyle() + '" />');
      html += fieldCell("Beef buffet (€26/adult)", '<input type="number" id="bk-tier-beef" min="0" max="200" value="' + state.tiers.beef + '" style="' + inputStyle() + '" />');
      html += fieldCell("Kids bundle (€15/child)", '<input type="number" id="bk-tier-kids" min="0" max="200" value="' + state.tiers.kids + '" style="' + inputStyle() + '" />');
    } else if (!type.freeform) {
      html += fieldCell(type.guestLabel, '<input type="number" id="bk-guests" min="' + type.guestMin + '" max="' + type.guestMax + '" value="' + state.guests + '" style="' + inputStyle() + '" />');
    }

    if (type.extraField) {
      html += fieldCell(type.extraLabel, '<input type="text" id="bk-extra" value="' + esc(state.extra[type.extraField] || "") + '" style="' + inputStyle() + '" />');
    }

    if (type.freeform) {
      html += fieldCell("What are you planning?", '<textarea id="bk-message" rows="2" placeholder="Tell the desk what you have in mind" style="' + inputStyle() + ';resize:vertical;font:400 13px/1.5 \'Archivo\',sans-serif">' + esc(state.extra.message || "") + '</textarea>');
    }

    html += '</div>';
    return html;
  }

  function fieldCell(label, controlHtml) {
    return '<label style="display:block;padding:18px 20px;border-right:2px solid rgba(247,243,236,.22);border-bottom:1px solid rgba(247,243,236,.22)">' + labelCap(label) + controlHtml + '</label>';
  }

  function bindConsoleEvents(D, type) {
    var typeSel = document.getElementById("bk-type");
    if (typeSel) typeSel.onchange = function () {
      state.type = typeSel.value;
      state.booked = null;
      var nt = typeByKey(state.type);
      if (nt.guestDefault) state.guests = nt.guestDefault;
      render();
    };

    var routeSel = document.getElementById("bk-route");
    if (routeSel) routeSel.onchange = function () {
      var k = routeSel.value;
      var first = D.COUNTRIES.find(function (c) { return c.routeKey === k; });
      state.route = k;
      state.country = first ? first.code : state.country;
      state.booked = null;
      render();
    };
    var countrySel = document.getElementById("bk-country");
    if (countrySel) countrySel.onchange = function () { state.country = countrySel.value; state.booked = null; render(); };
    var timeSel = document.getElementById("bk-time");
    if (timeSel) timeSel.onchange = function () { state.time = timeSel.value; state.booked = null; render(); };
    var dateEl = document.getElementById("bk-date");
    if (dateEl) dateEl.onchange = function () { state.date = dateEl.value; state.booked = null; render(); };

    var passengerEl = document.getElementById("bk-passenger");
    if (passengerEl) passengerEl.oninput = function (e) { state.passenger = e.target.value; };
    var contactEl = document.getElementById("bk-contact");
    if (contactEl) contactEl.oninput = function (e) { state.contact = e.target.value; };
    var guestsEl = document.getElementById("bk-guests");
    if (guestsEl) guestsEl.oninput = function (e) { state.guests = Math.max(type.guestMin, Math.min(type.guestMax, parseInt(e.target.value, 10) || type.guestMin)); updateSummary(); };
    var extraEl = document.getElementById("bk-extra");
    if (extraEl && type.extraField) extraEl.oninput = function (e) { state.extra[type.extraField] = e.target.value; };
    var messageEl = document.getElementById("bk-message");
    if (messageEl) messageEl.oninput = function (e) { state.extra.message = e.target.value; };

    ["veg", "chicken", "beef", "kids"].forEach(function (k) {
      var el = document.getElementById("bk-tier-" + k);
      if (el) el.oninput = function (e) { state.tiers[k] = Math.max(0, parseInt(e.target.value, 10) || 0); updateSummary(); };
    });

    document.getElementById("bk-reserve").onclick = function () {
      var type = typeByKey(state.type);
      var D2 = window.PP_DATA;
      var countries = D2 ? D2.COUNTRIES : [];
      var inRoute = countries.filter(function (c) { return c.routeKey === state.route; });
      var sel = countries.find(function (c) { return c.code === state.country; }) || inRoute[0] || null;
      var routeName = sel && D2 ? D2.ROUTES[sel.routeKey].name : "—";
      var dateObj = parseIso(state.date);
      var dateLabel = dateObj ? fmtDateLong(dateObj) : state.date;

      if (type.freeform) {
        state.booked = { freeform: true, typeLabel: type.label };
      } else {
        if (!sel) return;
        if (!dayRuleOk(type, dateObj)) return;
        var guests = type.tiers ? (state.tiers.veg + state.tiers.chicken + state.tiers.beef + state.tiers.kids) : state.guests;
        if (type.tiers && guests < 1) return;
        var tiersLine = type.tiers
          ? [["Veg", state.tiers.veg], ["Chicken", state.tiers.chicken], ["Beef", state.tiers.beef], ["Kids", state.tiers.kids]]
              .filter(function (r) { return r[1] > 0; }).map(function (r) { return r[1] + " " + r[0]; }).join(" · ")
          : "";
        state.booked = {
          typeLabel: type.label, country: sel.name, med: sel.med, route: routeName, stamp: sel.stamp,
          code: sel.code, table: 1 + Math.floor(Math.random() * 24),
          guests: guests, tiers: type.tiers, tiersLine: tiersLine,
          dateLabel: dateLabel, time: state.time
        };
      }
      render();
      var ticket = document.getElementById("bk-ticket");
      if (ticket) ticket.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  }

  window.PP_READY(function () {
    applyHash();
    render();
    function onHashChange() { applyHash(); render(); }
    window.addEventListener("hashchange", onHashChange);
    if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("hashchange", onHashChange); });
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); applyHash(); render(); } }, 60);
    }
  });
})();
