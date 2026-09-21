/* Patty Passport — Events & Birthdays page, ported from Events.dc.html's
   x-dc template + Component logic into plain JS. State is limited to the
   occasion picker and the mock enquiry-form submission (front-end only,
   nothing is sent — see master brief Section 0.1). */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var state = { occasion: "Birthday" };

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

  var FIELD_IDS = ["ev-f-name", "ev-f-contact", "ev-f-occasion", "ev-f-guests", "ev-f-date", "ev-f-dest"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function fieldsData() {
    return [
      { id: FIELD_IDS[0], label: "Your name", ph: "Who's organising" },
      { id: FIELD_IDS[1], label: "Email or phone", ph: "How we reach you" },
      { id: FIELD_IDS[2], label: "Occasion", ph: state.occasion },
      { id: FIELD_IDS[3], label: "Guests", ph: "e.g. 14 adults, 6 kids" },
      { id: FIELD_IDS[4], label: "Preferred date", ph: "Fri 25 Sep 2026" },
      { id: FIELD_IDS[5], label: "Destination", ph: "Lebanon · MED-12, or let us pick" }
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
        + '<a href="#enquiry" style="margin-top:auto;display:inline-flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 11.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase" data-hover="background:#ec3013">Enquire<span>→</span></a>'
        + '</div></div>';
    }).join("");
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
      return '<label style="display:block;padding:18px 20px;border-right:2px solid rgba(247,243,236,.22);border-bottom:1px solid rgba(247,243,236,.22)">'
        + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#bab6b6;margin-bottom:10px">' + esc(f.label) + '</span>'
        + '<input type="text" id="' + f.id + '" placeholder="' + esc(f.ph) + '" style="width:100%;background:transparent;border:0;border-bottom:2px solid #f2b30c;color:#f7f3ec;font:800 16px/1.2 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" /></label>';
    }).join("");
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

  function renderSubmit() {
    var btn = document.getElementById("ev-submit");
    btn.onclick = function () {
      var name = (document.getElementById(FIELD_IDS[0]).value || "Guest").trim();
      var contact = (document.getElementById(FIELD_IDS[1]).value || "").trim();
      var guests = (document.getElementById(FIELD_IDS[3]).value || "your group").trim();
      var date = (document.getElementById(FIELD_IDS[4]).value || "a date to confirm").trim();
      var dest = (document.getElementById(FIELD_IDS[5]).value || "a destination we'll help pick").trim();
      var fb = document.getElementById("ev-feedback");
      if (!contact) {
        fb.style.display = "block";
        fb.style.color = "#ec3013";
        fb.textContent = "Add an email or phone so the crew can confirm your flight plan.";
        return;
      }
      var ref = "PP-EV-" + Math.floor(1000 + Math.random() * 9000);
      fb.style.display = "block";
      fb.style.color = "#f2b30c";
      fb.textContent = "Flight plan filed, " + name + " — reference " + ref + ". " + state.occasion + " for " + guests + ", " + date + ", " + dest + ". We'll confirm at " + contact + " within one working day. (Front-end demo — nothing was actually sent.)";
    };
  }

  function render() {
    renderFacts();
    renderPackages();
    renderTimeline();
    renderProps();
    renderFields();
    renderOccasions();
    renderSubmit();
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  window.PP_READY(render);
})();
