/* Patty Passport — booking / "Reserve Your Flight" page, ported from
   Booking.dc.html's x-dc template + Component logic. Front-end demo only
   (master brief Section 0.1): nothing is charged or sent, the "reservation"
   is held in in-memory state and rendered as a printed-boarding-pass-style
   confirmation ticket. Reads window.PP_DATA (js/data.js) for routes,
   countries and opening hours, and pre-selects a destination from the URL
   hash (e.g. booking.html#lbn) the same way destination.html does. */
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
    if (!dateObj) return { start: 10 * 60, end: 22 * 60, label: "Weekday · 10:00–22:00" };
    var iso = dateObj.getFullYear() + "-" + String(dateObj.getMonth() + 1).padStart(2, "0") + "-" + String(dateObj.getDate()).padStart(2, "0");
    var weekend = isWeekend(dateObj) || HOLIDAYS.indexOf(iso) > -1;
    return weekend
      ? { start: 10 * 60, end: 24 * 60, label: "Weekend & holiday hours · 10:00–00:00" }
      : { start: 10 * 60, end: 22 * 60, label: "Weekday hours · 10:00–22:00" };
  }
  function fmtTime(mins) {
    var h = Math.floor(mins / 60) % 24, m = mins % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }
  /* Every 30 minutes, last seating slot left 30 min before closing. */
  function slotsFor(dateObj) {
    var r = rangeFor(dateObj);
    var out = [];
    for (var t = r.start; t <= r.end - 30; t += 30) out.push(fmtTime(t));
    return out;
  }
  function fmtDateLong(dateObj) {
    if (!dateObj) return "";
    return WEEKDAY_NAMES[dateObj.getDay()] + " " + dateObj.getDate() + " " + MONTH_NAMES[dateObj.getMonth()] + " " + dateObj.getFullYear();
  }

  var state = {
    route: "LEV", country: "lbn", time: "20:30", guests: 4,
    passenger: "", contact: "", date: isoToday(), booked: null
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function applyHash() {
    var D = window.PP_DATA;
    if (!D) return;
    var h = (location.hash || "").replace("#", "").toLowerCase();
    var c = D.COUNTRIES.find(function (x) { return x.code === h; });
    if (c) { state.country = c.code; state.route = c.routeKey; }
  }

  function render() {
    var D = window.PP_DATA;
    var countries = D ? D.COUNTRIES : [];
    var inRoute = countries.filter(function (c) { return c.routeKey === state.route; });
    var sel = countries.find(function (c) { return c.code === state.country; }) || inRoute[0] || null;
    var b = state.booked;
    var routeName = sel && D ? D.ROUTES[sel.routeKey].name : "—";

    // Hours
    document.getElementById("bk-hours").innerHTML = (D ? D.HOURS : []).map(function (h) {
      return '<span style="display:block">' + esc(h.days) + ' · ' + esc(h.time) + '</span>';
    }).join("");

    document.getElementById("bk-step-label").textContent = b ? "Boarding pass issued" : "Step 1 of 2";

    // Route chips
    document.getElementById("bk-route-chips").innerHTML = (D ? Object.keys(D.ROUTES) : []).map(function (k) {
      var on = state.route === k;
      return '<button type="button" data-route="' + k + '" style="padding:11px 14px;background:' + (on ? YEL : "transparent") + ';border:2px solid ' + (on ? YEL : "rgba(247,243,236,.55)") + ';color:' + (on ? INK : CREAM) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + esc(D.ROUTES[k].name) + '</button>';
    }).join("");

    // Country chips
    document.getElementById("bk-country-chips").innerHTML = inRoute.map(function (c) {
      var on = state.country === c.code;
      return '<button type="button" data-country="' + c.code + '" style="display:inline-flex;align-items:center;gap:8px;padding:10px 12px;background:' + (on ? RED : "transparent") + ';border:2px solid ' + (on ? RED : "rgba(247,243,236,.4)") + ';color:' + (on ? "#fff" : CREAM) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.06em;cursor:pointer" data-hover="background:#ec3013;border-color:#ec3013;color:#fff">' + esc(c.name) + '<span style="font:600 9px/1;letter-spacing:.14em;opacity:.7">' + esc(c.med) + '</span></button>';
    }).join("");

    // Time chips — generated from the selected date's weekday/weekend hours
    var dateObj = parseIso(state.date);
    var range = rangeFor(dateObj);
    var slots = slotsFor(dateObj);
    if (slots.indexOf(state.time) === -1) state.time = slots[Math.min(slots.length - 1, Math.floor(slots.length / 2))];
    document.getElementById("bk-hours-note").textContent = range.label;
    document.getElementById("bk-time-chips").innerHTML = slots.map(function (t) {
      var on = state.time === t;
      return '<button type="button" data-time="' + t + '" style="padding:10px 13px;background:' + (on ? YEL : "transparent") + ';border:2px solid ' + (on ? YEL : "rgba(247,243,236,.4)") + ';color:' + (on ? INK : CREAM) + ';font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.04em;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + t + '</button>';
    }).join("");

    // Text inputs (keep values in sync without clobbering focus/cursor)
    var passengerEl = document.getElementById("bk-passenger");
    if (passengerEl.value !== state.passenger) passengerEl.value = state.passenger;
    var dateEl = document.getElementById("bk-date");
    if (dateEl.value !== state.date) dateEl.value = state.date;
    dateEl.min = isoToday();
    var contactEl = document.getElementById("bk-contact");
    if (contactEl.value !== state.contact) contactEl.value = state.contact;

    document.getElementById("bk-guest-label").textContent = state.guests + (state.guests === 1 ? " traveller" : " travellers");

    var dateLabel = dateObj ? fmtDateLong(dateObj) : state.date;
    document.getElementById("bk-summary-line").textContent = sel
      ? sel.name + " · " + routeName + " Route · " + dateLabel + " at " + state.time + " · " + state.guests + " travelling"
      : "Choose a route to begin";

    // Ticket / empty state
    if (b) {
      var ref = "PP-" + b.code.toUpperCase() + "-2026";
      var rows = [
        { k: "Destination", v: b.country.toUpperCase() },
        { k: "Route", v: b.med + " · " + b.route },
        { k: "Passenger", v: (state.passenger || "GUEST").toUpperCase() },
        { k: "Departure", v: dateLabel + " · " + state.time },
        { k: "Seat", v: "TABLE " + b.table + " · " + state.guests + " covers" },
        { k: "Gate", v: b.route + " Route" }
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
        + '<span style="font:800 20px/1 \'Archivo\',sans-serif">' + esc(b.stamp) + '</span>'
        + '<span style="font:600 8px/1.4 \'Archivo\',sans-serif;letter-spacing:.14em">' + esc(b.country.toUpperCase()) + '</span></div></div>'
        + '<div style="border-top:2px solid #1b1a19;padding:14px 18px;display:flex;flex-wrap:wrap;gap:10px">'
        + '<a href="destination.html#' + b.code + '" style="flex:1;display:inline-flex;align-items:center;justify-content:space-between;min-width:170px;padding:12px 14px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase" data-hover="background:#ec3013">Read the destination<span>→</span></a>'
        + '<button type="button" id="bk-reset" style="flex:1;min-width:150px;padding:12px 14px;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c">Book another</button></div>'
        + '</div>';
      document.getElementById("bk-empty").innerHTML = "";
    } else {
      document.getElementById("bk-ticket").innerHTML = "";
      document.getElementById("bk-empty").innerHTML =
        '<div style="border:2px dashed rgba(27,26,25,.4);padding:30px 24px;min-height:340px;display:flex;flex-direction:column;justify-content:center;gap:14px;text-align:left">'
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d7979">Your boarding pass</span>'
        + '<span style="font:800 26px/1.05 \'Archivo\',sans-serif;letter-spacing:-.03em;color:#605d5d">It prints here once you reserve.</span>'
        + '<span style="font:400 13.5px/1.55 \'Archivo\',sans-serif;color:#7d7979">Pick a route, a country and a time on the console. Front-end demo — nothing is charged and nothing is sent.</span></div>';
    }

    bindEvents(sel, routeName);
    if (window.initHoverStyles) window.initHoverStyles(document.body);
  }

  function bindEvents(sel, routeName) {
    var D = window.PP_DATA;

    Array.prototype.forEach.call(document.querySelectorAll("#bk-route-chips [data-route]"), function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-route");
        var first = D.COUNTRIES.find(function (c) { return c.routeKey === k; });
        state.route = k;
        state.country = first ? first.code : state.country;
        state.booked = null;
        render();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#bk-country-chips [data-country]"), function (btn) {
      btn.addEventListener("click", function () {
        state.country = btn.getAttribute("data-country");
        state.booked = null;
        render();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#bk-time-chips [data-time]"), function (btn) {
      btn.addEventListener("click", function () {
        state.time = btn.getAttribute("data-time");
        state.booked = null;
        render();
      });
    });

    document.getElementById("bk-passenger").oninput = function (e) { state.passenger = e.target.value; };
    document.getElementById("bk-contact").oninput = function (e) { state.contact = e.target.value; };
    document.getElementById("bk-date").onchange = function (e) { state.date = e.target.value; state.booked = null; render(); };

    document.getElementById("bk-more").onclick = function () { state.guests = Math.min(24, state.guests + 1); state.booked = null; render(); };
    document.getElementById("bk-fewer").onclick = function () { state.guests = Math.max(1, state.guests - 1); state.booked = null; render(); };

    document.getElementById("bk-reserve").onclick = function () {
      if (!sel) return;
      state.booked = {
        country: sel.name, med: sel.med, route: routeName, stamp: sel.stamp,
        code: sel.code, table: 1 + Math.floor(Math.random() * 24)
      };
      render();
      var ticket = document.getElementById("bk-ticket");
      if (ticket) ticket.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    var resetBtn = document.getElementById("bk-reset");
    if (resetBtn) resetBtn.onclick = function () { state.booked = null; render(); };
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
