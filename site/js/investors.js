/* Patty Passport — Investors page, ported from Investors.dc.html's x-dc
   template + Component logic. Every €/m² figure below is computed from
   window.PP_DATA.SCENARIOS / .FUNDING / .OPERATING at render time — none
   of it is a typed literal (master brief §5.7, §7). */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  function m(n) { return "€" + (n / 1000000).toFixed(2) + "m"; }
  function k(n) { return n >= 1000000 ? m(n) : "€" + Math.round(n / 1000) + "k"; }
  function eur0(n) { return "€" + Math.round(n).toLocaleString("en-GB"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var state = {
    scenario: "A1", revCase: "base", p: 0, siteFilter: "ALL",
    form: false, sent: false,
    fName: "", fEmail: "", fPhone: "", fMessage: "",
    fScenario: "A1", fTicket: "€250k – €500k", fStructure: "Equity"
  };

  /* ── product positioning map: Patty Passport only, on a clean axis grid
     (master brief — no outside competitor wall, just the brand's own
     price/quality claim, directly labeled). ── */

  /* ── derive every number the page shows from PP_DATA + current state ── */
  function derive() {
    var D = window.PP_DATA;
    if (!D) return null;
    var S = D.SCENARIOS.find(function (s) { return s.key === state.scenario; }) || D.SCENARIOS[0];
    var O = D.OPERATING;
    var rc = O.revenueCases.find(function (r) { return r.key === state.revCase; }) || O.revenueCases[1];

    var revenue = rc.guests * rc.spend * O.days;
    var food = revenue * O.foodPct, labour = revenue * O.labourPct, marketing = revenue * O.marketingPct;
    var fixed = O.fixedMonthly * 12;
    var profit = revenue - food - labour - marketing - fixed;
    var margin = profit / revenue;
    var roiLow = profit / S.totalHigh, roiHigh = profit / S.totalLow, roiMid = profit / S.mid;
    var paybackMid = S.mid / profit;
    var gapLow = S.totalLow - D.FUNDING.committed, gapHigh = S.totalHigh - D.FUNDING.committed;

    var variablePct = O.foodPct + O.labourPct + O.marketingPct;
    var beMonthly = O.fixedMonthly / (1 - variablePct);
    var beGuestsMonth = beMonthly / rc.spend;
    var beGuestsDay = beGuestsMonth / (O.days / 12);

    var ps = D.SEVEN_PS[state.p] || D.SEVEN_PS[0];
    var siblings = D.SCENARIOS.filter(function (s) { return s.plan === S.plan; });

    return {
      D: D, S: S, O: O, rc: rc, revenue: revenue, food: food, labour: labour, marketing: marketing,
      fixed: fixed, profit: profit, margin: margin, roiLow: roiLow, roiHigh: roiHigh, roiMid: roiMid,
      paybackMid: paybackMid, gapLow: gapLow, gapHigh: gapHigh, variablePct: variablePct,
      beMonthly: beMonthly, beGuestsMonth: beGuestsMonth, beGuestsDay: beGuestsDay,
      ps: ps, siblings: siblings
    };
  }

  /* ── modal ── */
  function renderModal(v) {
    var root = document.getElementById("inv-modal");
    if (!state.form) { root.innerHTML = ""; return; }
    var editing = !state.sent;
    var body;
    if (!editing) {
      var summary = (state.fName || "Thank you") + " — we'll send the deck for " +
        state.fScenario + " (" + state.fTicket + ", " + state.fStructure.toLowerCase() +
        ") to " + (state.fEmail || "the address you gave us") + ". This is a front-end demo, so write to invest@pattypassport.com to reach a human today.";
      body = '<div style="padding:34px 24px 32px">'
        + '<div style="width:78px;height:78px;border:3px solid #ec3013;color:#ec3013;display:flex;align-items:center;justify-content:center;font:800 13px/1 \'Archivo\',sans-serif;transform:rotate(-10deg);margin-bottom:22px">FILED</div>'
        + '<h2 style="font:800 32px/1 \'Archivo\',sans-serif;letter-spacing:-.035em;margin:0 0 10px">Enquiry filed.</h2>'
        + '<p style="font:400 14px/1.6 \'Archivo\',sans-serif;color:#605d5d;margin:0 0 22px">' + esc(summary) + '</p>'
        + '<button type="button" data-act="close-form" style="display:inline-flex;align-items:center;width:100%;padding:15px 18px;background:#1b1a19;border:0;color:#f7f3ec;font:800 14px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#ec3013">Back to the numbers<span style="margin-left:auto">→</span></button>'
        + '</div>';
    } else {
      var fields = [
        ["Name", "fName", "Your name"],
        ["Email", "fEmail", "you@example.com"],
        ["Phone / WhatsApp", "fPhone", "+34 …"]
      ].map(function (f) {
        return '<label style="display:block;margin-bottom:16px">'
          + '<span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">' + f[0] + '</span>'
          + '<input type="text" data-field="' + f[1] + '" value="' + esc(state[f[1]]) + '" placeholder="' + f[2] + '" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 16px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" />'
          + '</label>';
      }).join("");

      var scenarioBtns = v.D.SCENARIOS.map(function (s) {
        var on = state.fScenario === s.key;
        return '<button type="button" data-act="pick-fscenario" data-val="' + s.key + '" style="padding:10px 12px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + s.label.replace("Plan ", "") + ' · ' + s.site + '</button>';
      }).join("");

      var ticketBtns = ["Under €250k", "€250k – €500k", "€500k – €1m", "Over €1m"].map(function (t) {
        var on = state.fTicket === t;
        return '<button type="button" data-act="pick-ticket" data-val="' + esc(t) + '" style="padding:10px 12px;background:' + (on ? BLU : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? "#fff" : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + t + '</button>';
      }).join("");

      var structureBtns = ["Equity", "Loan", "Site JV", "Undecided"].map(function (t) {
        var on = state.fStructure === t;
        return '<button type="button" data-act="pick-structure" data-val="' + t + '" style="padding:10px 12px;background:' + (on ? RED : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? "#fff" : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + t + '</button>';
      }).join("");

      body = '<div style="padding:24px 22px 26px">'
        + '<h2 style="font:800 30px/1 \'Archivo\',sans-serif;letter-spacing:-.035em;margin:0 0 8px">Explore the opportunity</h2>'
        + '<p style="font:400 13.5px/1.55 \'Archivo\',sans-serif;color:#605d5d;margin:0 0 22px">Tell us which scenario interests you and we\'ll send the deck, the model and the site pipeline under NDA.</p>'
        + fields
        + '<div style="margin-bottom:18px"><span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:10px">Scenario of interest</span><div style="display:flex;flex-wrap:wrap;gap:8px">' + scenarioBtns + '</div></div>'
        + '<div style="margin-bottom:18px"><span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:10px">Ticket size</span><div style="display:flex;flex-wrap:wrap;gap:8px">' + ticketBtns + '</div></div>'
        + '<div style="margin-bottom:18px"><span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:10px">Structure</span><div style="display:flex;flex-wrap:wrap;gap:8px">' + structureBtns + '</div></div>'
        + '<label style="display:block;margin-bottom:20px"><span style="display:block;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:8px">Message</span><textarea rows="3" data-field="fMessage" placeholder="Anything you\'d like us to cover first" style="width:100%;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:400 14px/1.5 \'Archivo\',sans-serif;padding:10px 12px;outline:none;resize:vertical">' + esc(state.fMessage) + '</textarea></label>'
        + '<button type="button" data-act="submit-form" style="display:inline-flex;align-items:center;width:100%;padding:16px 18px;background:#ec3013;border:0;color:#fff;font:800 14.5px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#1b1a19">Send the enquiry<span style="margin-left:auto">→</span></button>'
        + '<p style="font:400 11px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:14px 0 0">Front-end demo — nothing is transmitted. Reach us directly at invest@pattypassport.com.</p>'
        + '</div>';
    }

    root.innerHTML = '<div style="position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;padding:24px;animation:ppFade .2s ease both">'
      + '<div data-act="close-form" style="position:absolute;inset:0;background:rgba(27,26,25,.7)"></div>'
      + '<div style="position:relative;width:min(560px,100%);max-height:88vh;overflow-y:auto;background:#f7f3ec;border:2px solid #1b1a19;box-shadow:18px 18px 0 rgba(27,26,25,.4);animation:ppLand .32s cubic-bezier(.2,.85,.25,1) both">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#1b1a19;color:#f7f3ec;position:sticky;top:0">'
      + '<span style="display:flex;align-items:center;gap:9px;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase"><span style="width:7px;height:7px;background:#f2b30c;animation:ppBlink 1.3s steps(1) infinite"></span>Partner enquiry</span>'
      + '<button type="button" data-act="close-form" style="background:transparent;border:2px solid rgba(247,243,236,.5);color:#f7f3ec;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;padding:8px 11px;cursor:pointer" data-hover="background:#ec3013;border-color:#ec3013">CLOSE ✕</button>'
      + '</div>' + body + '</div></div>';
  }

  /* ── headline stats ── */
  function renderHeadline(v) {
    var S = v.S, O = v.O, rc = v.rc;
    var items = [
      ["21", "Destinations on one menu"],
      [S.building.toLocaleString("en-GB") + " m²", "Building in this scenario"],
      [String(O.seats), "Seats at ~" + O.staff + " crew"],
      [k(v.revenue), "Annual revenue · " + rc.label.toLowerCase()],
      ["€" + rc.spend, "Avg. spend target · " + rc.label.toLowerCase()],
      [(rc.guests * O.days).toLocaleString("en-GB"), "Projected annual covers · " + rc.label.toLowerCase()],
      [S.label.replace("Plan ", ""), "Scenario selected"]
    ];
    document.getElementById("inv-headline").innerHTML = items.map(function (h, i) {
      return '<div data-rv="up" data-rv-d="' + (i * 55) + '" style="padding:24px 24px 26px;border-right:2px solid rgba(27,26,25,.3)">'
        + '<div style="font:800 clamp(24px,2.4vw,36px)/1 \'Archivo\',sans-serif;letter-spacing:-.035em">' + esc(h[0]) + '</div>'
        + '<div style="font:600 9.5px/1.45 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-top:8px;opacity:.75">' + esc(h[1]) + '</div></div>';
    }).join("");
  }

  /* ── 7Ps ── */
  function renderPs(v) {
    var D = v.D, ps = v.ps;
    var cardTints = [CREAM, YEL, "#e7e3dc", "#fff"];
    document.getElementById("inv-ps-tabs").innerHTML = D.SEVEN_PS.map(function (p, i) {
      var on = i === state.p;
      return '<button type="button" data-act="pick-ps" data-val="' + i + '" style="display:inline-flex;flex-direction:column;gap:4px;padding:10px 13px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;text-align:left" data-hover="background:#f2b30c;color:#1b1a19">'
        + '<span style="font:600 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.18em;opacity:.7">' + p.id + '</span>' + esc(p.name) + '</button>';
    }).join("");

    document.getElementById("inv-ps-panel").innerHTML =
      '<div class="pp-2col" style="max-width:1340px;margin:0 auto;padding:30px 32px 34px;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:40px;align-items:start">'
      + '<div>'
      + '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:12px">'
      + '<span style="font:800 42px/1 \'Archivo\',sans-serif;letter-spacing:-.04em;color:#f2b30c">' + ps.id + '</span>'
      + '<span style="font:600 10px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#bab6b6">Marketing mix</span></div>'
      + '<h3 style="font:800 clamp(28px,3.4vw,46px)/.98 \'Archivo\',sans-serif;letter-spacing:-.035em;margin:0 0 14px">' + esc(ps.name.toUpperCase()) + '</h3>'
      + '<p style="font:400 15px/1.6 \'Archivo\',sans-serif;color:#bab6b6;margin:0">' + esc(ps.summary) + '</p>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));border-top:2px solid #f7f3ec;border-left:2px solid #f7f3ec">'
      + ps.cards.map(function (c, i) {
        var bg = cardTints[i % 4];
        return '<div style="border-right:2px solid #f7f3ec;border-bottom:2px solid #f7f3ec;padding:20px 18px 22px;background:' + bg + ';color:' + INK + ';display:flex;flex-direction:column;gap:9px;min-height:150px">'
          + '<span style="font:800 16px/1.12 \'Archivo\',sans-serif;letter-spacing:-.02em">' + esc(c.title) + '</span>'
          + '<span style="font:400 12.5px/1.5 \'Archivo\',sans-serif;opacity:.85">' + esc(c.line) + '</span></div>';
      }).join("")
      + '</div></div>';
  }

  /* ── scenario selector / CAPEX / footprint / return ── */
  function renderScenario(v) {
    var D = v.D, S = v.S, rc = v.rc;

    var sites = ["ALL"].concat(Array.from(new Set(D.SCENARIOS.map(function (s) { return s.site; }))));
    document.getElementById("inv-site-filter").innerHTML = sites.map(function (site) {
      var on = state.siteFilter === site;
      var label = site === "ALL" ? "Both sites" : site + " only";
      return '<button type="button" data-act="pick-site" data-val="' + esc(site) + '" style="padding:10px 14px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + esc(label) + '</button>';
    }).join("");

    var shownScenarios = state.siteFilter === "ALL" ? D.SCENARIOS : D.SCENARIOS.filter(function (s) { return s.site === state.siteFilter; });
    document.getElementById("inv-scenario-cards").innerHTML = shownScenarios.map(function (s) {
      var on = s.key === S.key;
      var parking = s.parking[0] === s.parking[1] ? s.parking[0] : s.parking[0] + "–" + s.parking[1];
      return '<button type="button" data-act="pick-scenario" data-val="' + s.key + '" style="border:0;border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + (on ? YEL : CREAM) + ';color:' + INK + ';padding:22px 20px 24px;display:flex;flex-direction:column;gap:10px;min-height:215px;cursor:pointer;text-align:left" data-hover="background:#1b1a19;color:#f7f3ec">'
        + '<span style="display:flex;align-items:center;justify-content:space-between;gap:10px">'
        + '<span style="font:800 22px/1 \'Archivo\',sans-serif;letter-spacing:-.03em">' + s.label + '</span>'
        + '<span style="width:22px;height:22px;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font:800 10px/1 \'Archivo\',sans-serif">' + (on ? "✓" : "") + '</span></span>'
        + '<span style="font:600 9.5px/1.5 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.75">' + s.site + ' · ' + s.plot.toLocaleString("en-GB") + ' m² plot</span>'
        + '<span style="font:400 13px/1.5 \'Archivo\',sans-serif;opacity:.86">' + s.building.toLocaleString("en-GB") + ' m² building · ' + parking + ' parking</span>'
        + '<span style="margin-top:auto"><span style="display:block;font:800 21px/1.05 \'Archivo\',sans-serif;letter-spacing:-.025em">' + m(s.totalLow) + ' – ' + m(s.totalHigh) + '</span>'
        + '<span style="display:block;font:600 9px/1.4 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.7;margin-top:5px">Corrected total investment</span></span></button>';
    }).join("");

    document.getElementById("inv-active-label").textContent = S.label.toUpperCase() + " · " + S.site.toUpperCase();
    document.getElementById("inv-active-note").textContent = S.note;
    document.getElementById("inv-active-range").textContent = m(S.totalLow) + " – " + m(S.totalHigh);
    document.getElementById("inv-capex-rows").innerHTML = S.categories.map(function (c) {
      var range = c.low === c.high ? k(c.low) : k(c.low) + " – " + k(c.high);
      return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(247,243,236,.2)">'
        + '<span style="flex:1"><span style="display:block;font:800 13px/1.2 \'Archivo\',sans-serif">' + esc(c.label) + '</span>'
        + '<span style="display:block;font:400 10.5px/1.4 \'Archivo\',sans-serif;color:#7d7979;margin-top:3px">' + esc(c.note) + '</span></span>'
        + '<span style="font:800 13.5px/1 \'Archivo\',sans-serif;color:#f2b30c;white-space:nowrap">' + range + '</span></div>';
    }).join("");

    document.getElementById("inv-size-toggles").innerHTML = v.siblings.map(function (s) {
      var on = s.key === S.key;
      return '<button type="button" data-act="pick-scenario" data-val="' + s.key + '" style="padding:11px 14px;background:' + (on ? CREAM : "transparent") + ';border:2px solid #f7f3ec;color:' + (on ? INK : CREAM) + ';font:800 11.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + s.building.toLocaleString("en-GB") + ' m² building</button>';
    }).join("");

    var parkingF = S.parking[0] === S.parking[1] ? String(S.parking[0]) : S.parking[0] + "–" + S.parking[1];
    document.getElementById("inv-footprint-rows").innerHTML = [
      ["Plot", S.plot.toLocaleString("en-GB") + " m²"],
      ["Building footprint", S.building.toLocaleString("en-GB") + " m²"],
      ["Left for exterior", (S.plot - S.building).toLocaleString("en-GB") + " m²"],
      ["Parking spaces", parkingF],
      ["Garden / plaza", "~" + S.garden.toLocaleString("en-GB") + " m²"],
      ["Trees & palms", S.trees[0] + "–" + S.trees[1]]
    ].map(function (f) {
      return '<span style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(247,243,236,.2)">'
        + '<span style="font:600 10.5px/1.3 \'Archivo\',sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#bab6b6">' + f[0] + '</span>'
        + '<span style="font:800 15px/1 \'Archivo\',sans-serif;letter-spacing:-.015em;text-align:right">' + f[1] + '</span></span>';
    }).join("");

    document.getElementById("inv-case-name").textContent = rc.label;
    document.getElementById("inv-case-toggles").innerHTML = v.O.revenueCases.map(function (r) {
      var on = r.key === rc.key;
      return '<button type="button" data-act="pick-revcase" data-val="' + r.key + '" style="padding:8px 10px;background:' + (on ? CREAM : "transparent") + ';border:2px solid #f7f3ec;color:' + (on ? INK : CREAM) + ';font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + r.label.replace(" case", "") + '</button>';
    }).join("");

    document.getElementById("inv-annual-profit").textContent = eur0(v.profit);
    document.getElementById("inv-margin-label").textContent = (v.margin * 100).toFixed(0) + "%";
    document.getElementById("inv-margin-bar").style.width = Math.max(4, Math.min(100, v.margin * 100 * 3)).toFixed(0) + "%";
    document.getElementById("inv-return-rows").innerHTML = [
      { label: "ROI at low investment", value: (v.roiHigh * 100).toFixed(1) + "%" },
      { label: "ROI at mid investment", value: (v.roiMid * 100).toFixed(1) + "%" },
      { label: "ROI at high investment", value: (v.roiLow * 100).toFixed(1) + "%" },
      { label: "Payback at mid", value: v.paybackMid.toFixed(1) + " yrs" },
      { label: "Capital gap after founders", value: m(v.gapLow) + " – " + m(v.gapHigh) }
    ].map(function (r) {
      return '<span style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(247,243,236,.2)">'
        + '<span style="font:600 10px/1.3 \'Archivo\',sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#bab6b6">' + r.label + '</span>'
        + '<span style="font:800 15px/1 \'Archivo\',sans-serif;letter-spacing:-.015em">' + r.value + '</span></span>';
    }).join("");
    document.getElementById("inv-return-note").textContent = "Mid investment = " + m(S.mid) + ", the midpoint of this scenario's corrected range. Every figure recalculates when you change scenario or sales case.";
  }

  /* ── product positioning map: a clean crosshair (one vertical axis line,
     one horizontal axis line, drawn in the container's own background —
     see investors.html), with just the Patty Passport marker on it. The
     top/bottom captions around the box already name both spectrums, so
     no extra tick labels are layered on top of the grid to collide with
     them. ── */
  // Illustrative category-level estimates only (see the page's own
  // disclaimer above the map) — not published or verified competitor data.
  var COMPETITORS = [
    ["McDonald's", 10, 90], ["Burger King", 22, 92], ["Carl's Jr", 16, 78],
    ["TGB", 34, 70], ["VICIO", 46, 60], ["Five Guys", 58, 78],
    ["Goiko", 72, 55], ["SteakBurger", 80, 42]
  ];

  // The "complete brand variant" marker: centred Patty Tooty mascot, a
  // visible "21" stamp, yellow marker treatment, and a black terminal-grid
  // motif behind it — distinct enough from the plain competitor dots
  // below not to be mistaken for one, and never the bare/side-facing
  // mascot glyph on its own.
  function pattyPassportMarker(size) {
    var s = size || 52;
    return '<span style="position:relative;width:' + s + 'px;height:' + s + 'px;flex:none;display:flex;align-items:center;justify-content:center;background:#f2b30c;border:2px solid #1b1a19;background-image:repeating-linear-gradient(0deg,rgba(27,26,25,.18) 0 1px,transparent 1px 9px),repeating-linear-gradient(90deg,rgba(27,26,25,.18) 0 1px,transparent 1px 9px)">'
      + (window.PP_TOOTY_ICON_STAMPED ? window.PP_TOOTY_ICON_STAMPED(Math.round(s * 0.6), "#1b1a19", "#ec3013", "#1b1a19", "#f2b30c") : "")
      + '</span>';
  }

  function renderPositioning() {
    var root = document.getElementById("inv-positioning-map");
    if (!root) return;
    var pp = '<div style="position:absolute;left:62%;top:24%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:7px;z-index:2">'
      + pattyPassportMarker(52)
      + '<span style="font:800 11px/1.15 \'Archivo\',sans-serif;color:#f2b30c;white-space:nowrap;text-align:center">PATTY PASSPORT<br><span style="font:600 8.5px/1.3 \'Archivo\',sans-serif;color:#bab6b6;letter-spacing:.06em;text-transform:uppercase">Fair price · high immersion</span></span>'
      + '</div>';
    var competitors = COMPETITORS.map(function (c) {
      return '<div style="position:absolute;left:' + c[1] + '%;top:' + c[2] + '%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:4px">'
        + '<span style="width:8px;height:8px;border-radius:50%;background:rgba(247,243,236,.4);border:1.5px solid rgba(247,243,236,.7)"></span>'
        + '<span style="font:600 8.5px/1.1 \'Archivo\',sans-serif;color:#bab6b6;white-space:nowrap">' + esc(c[0]) + '</span>'
        + '</div>';
    }).join("");
    root.innerHTML = competitors + pp;
  }

  /* ── break-even chart (SVG visuals only — all labels are real HTML text
     below it, so nothing shrinks unreadable on narrow screens) ── */
  function renderBreakevenChart(v) {
    var root = document.getElementById("inv-be-chart");
    if (!root) return;
    var O = v.O, rc = v.rc;
    var monthsPerYear = 12, dayFactor = O.days / monthsPerYear;

    function revMonth(guestsDay, spend) { return guestsDay * spend * dayFactor; }
    function tcMonth(guestsDay, spend) { return O.fixedMonthly + v.variablePct * revMonth(guestsDay, spend); }

    var xMaxCase = Math.max.apply(null, O.revenueCases.map(function (c) { return c.guests; }));
    var xMax = Math.max(xMaxCase, v.beGuestsDay) * 1.18;
    var yMax = Math.max(revMonth(xMax, rc.spend), Math.max.apply(null, O.revenueCases.map(function (c) { return revMonth(c.guests, c.spend); }))) * 1.1;

    var padL = 8, padR = 4, padT = 6, padB = 8, vbW = 100, vbH = 62;
    function sx(g) { return padL + (g / xMax) * (vbW - padL - padR); }
    function sy(rev) { return (vbH - padB) - (rev / yMax) * (vbH - padB - padT); }

    var revLine = "M " + sx(0) + "," + sy(0) + " L " + sx(xMax) + "," + sy(revMonth(xMax, rc.spend));
    var tcLine = "M " + sx(0) + "," + sy(O.fixedMonthly) + " L " + sx(xMax) + "," + sy(tcMonth(xMax, rc.spend));
    var fixedLine = "M " + sx(0) + "," + sy(O.fixedMonthly) + " L " + sx(xMax) + "," + sy(O.fixedMonthly);

    var beX = sx(v.beGuestsDay), beY = sy(v.beMonthly);
    var lossPath = "M " + sx(0) + "," + sy(O.fixedMonthly) + " L " + beX + "," + beY + " L " + sx(0) + "," + sy(0) + " Z";
    var profitPath = "M " + beX + "," + beY + " L " + sx(xMax) + "," + sy(revMonth(xMax, rc.spend)) + " L " + sx(xMax) + "," + sy(tcMonth(xMax, rc.spend)) + " Z";

    var NSS = ' vector-effect="non-scaling-stroke"'; // keeps hairline widths in real screen px at any container size, instead of scaling with the viewBox
    var caseDots = O.revenueCases.map(function (c) {
      var on = c.key === rc.key;
      var cx = sx(c.guests), cy = sy(revMonth(c.guests, c.spend));
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (on ? 0.62 : 0.42) + '" fill="' + (on ? YEL : BLU) + '" stroke="' + INK + '" stroke-width="1"' + NSS + '/>';
    }).join("");

    // Margin of safety: the distance on the x-axis between the break-even
    // point and where the base case actually sits — drawn as its own
    // bracket on the baseline, labelled directly on the chart (not just
    // in the legend/facts list below) so it can't be missed.
    var marginGuests = rc.guests - v.beGuestsDay;
    var marginPct = rc.guests > 0 ? (marginGuests / rc.guests) * 100 : 0;
    var msX1 = sx(v.beGuestsDay), msX2 = sx(rc.guests);
    var msLeft = Math.min(msX1, msX2), msRight = Math.max(msX1, msX2);
    var msY = sy(0);
    var SAFE = "#1f7a3d";
    var marginBracket = msRight - msLeft > 0.3
      ? '<line x1="' + msLeft + '" y1="' + msY + '" x2="' + msRight + '" y2="' + msY + '" stroke="' + SAFE + '" stroke-width="1.3" stroke-linecap="round"' + NSS + '/>'
        + '<line x1="' + msLeft + '" y1="' + (msY - 0.9) + '" x2="' + msLeft + '" y2="' + (msY + 0.9) + '" stroke="' + SAFE + '" stroke-width="1"' + NSS + '/>'
        + '<line x1="' + msRight + '" y1="' + (msY - 0.9) + '" x2="' + msRight + '" y2="' + (msY + 0.9) + '" stroke="' + SAFE + '" stroke-width="1"' + NSS + '/>'
      : "";
    var marginLabelLeft = (msLeft + msRight) / 2;

    // Gridlines are drawn in the SVG (pure geometry, scales cleanly); the
    // tick VALUES are real HTML text positioned over it by percentage, so
    // labels never shrink unreadable on narrow screens the way SVG <text>
    // would. viewBox is 100 wide/vbH tall, so left:x% maps directly to sx,
    // and top:(y/vbH)*100% maps to sy.
    var yTicks = [0, 0.25, 0.5, 0.75, 1].map(function (f) { return f * yMax; });
    var xTicks = [0, 0.25, 0.5, 0.75, 1].map(function (f) { return f * xMax; });
    var xAxisTicks = [0, 0.5, 1].map(function (f) { return f * xMax; });
    var gridLines = yTicks.map(function (val) {
      return '<line x1="' + sx(0) + '" y1="' + sy(val) + '" x2="' + sx(xMax) + '" y2="' + sy(val) + '" stroke="rgba(27,26,25,.12)" stroke-width="1"' + NSS + '/>';
    }).join("") + xTicks.map(function (val) {
      return '<line x1="' + sx(val) + '" y1="' + padT + '" x2="' + sx(val) + '" y2="' + sy(0) + '" stroke="rgba(27,26,25,.12)" stroke-width="1"' + NSS + '/>';
    }).join("");

    var svg = '<svg viewBox="0 0 ' + vbW + ' ' + vbH + '" role="img" aria-label="Break-even chart: revenue and total cost by guests per day, current scenario ' + esc(rc.label) + '" style="display:block;width:100%;height:auto;background:#fff;border:2px solid #1b1a19">'
      + gridLines
      + '<path d="' + lossPath + '" fill="' + RED + '" fill-opacity="0.05"/>'
      + '<path d="' + profitPath + '" fill="' + YEL + '" fill-opacity="0.08"/>'
      + '<path d="' + fixedLine + '" fill="none" stroke="#8a8a8a" stroke-width="1"' + NSS + ' stroke-dasharray="3,3"/>'
      + '<path d="' + tcLine + '" fill="none" stroke="' + RED + '" stroke-width="1.3"' + NSS + ' stroke-opacity="0.8"/>'
      + '<path d="' + revLine + '" fill="none" stroke="' + INK + '" stroke-width="1.8"' + NSS + '/>'
      + '<line x1="' + beX + '" y1="' + beY + '" x2="' + beX + '" y2="' + sy(0) + '" stroke="' + INK + '" stroke-width="1"' + NSS + ' stroke-dasharray="2,2"/>'
      + marginBracket
      + caseDots
      + '<circle cx="' + beX + '" cy="' + beY + '" r="0.9" fill="' + INK + '" stroke="#fff" stroke-width="1.3"' + NSS + '/>'
      + '<line x1="' + sx(0) + '" y1="' + sy(0) + '" x2="' + sx(xMax) + '" y2="' + sy(0) + '" stroke="' + INK + '" stroke-width="1.5"' + NSS + '/>'
      + '<line x1="' + sx(0) + '" y1="' + padT + '" x2="' + sx(0) + '" y2="' + sy(0) + '" stroke="' + INK + '" stroke-width="1.5"' + NSS + '/>'
      + '</svg>';

    var marginLabelTop = (msY / vbH) * 100;
    var marginLabel = msRight - msLeft > 6
      ? '<div style="position:absolute;left:' + marginLabelLeft + '%;top:' + marginLabelTop + '%;transform:translate(-50%,-135%);font:800 8px/1 \'Archivo\',sans-serif;letter-spacing:.04em;color:' + SAFE + ';white-space:nowrap;background:#fff;padding:1px 4px">Margin of safety · ' + marginPct.toFixed(0) + '%</div>'
      : "";

    var yAxisLabels = yTicks.slice().reverse().map(function (val) {
      var topPct = (sy(val) / vbH) * 100;
      return '<span style="position:absolute;left:0;top:' + topPct + '%;transform:translateY(-50%);font:600 8.5px/1 \'Archivo\',sans-serif;color:#8a8a8a;white-space:nowrap">' + k(val) + '</span>';
    }).join("");
    var xAxisLabels = xAxisTicks.map(function (val) {
      var leftPct = sx(val);
      return '<span style="position:absolute;left:' + leftPct + '%;bottom:0;transform:translateX(' + (val === 0 ? "0" : val === xMax ? "-100%" : "-50%") + ');font:600 8.5px/1 \'Archivo\',sans-serif;color:#8a8a8a;white-space:nowrap">' + Math.round(val) + '/day</span>';
    }).join("");
    var svgWithAxes = '<div style="position:relative;padding:0 0 22px 44px">' + svg
      + '<div style="position:absolute;left:0;top:0;width:44px;height:calc(100% - 22px)">' + yAxisLabels + '</div>'
      + '<div style="position:absolute;left:44px;right:0;top:0;bottom:22px">' + marginLabel + '</div>'
      + '<div style="position:absolute;left:44px;right:0;bottom:0;height:20px">' + xAxisLabels + '</div>'
      + '</div>';

    var legend = '<div style="display:flex;flex-wrap:wrap;gap:12px 18px;margin-top:12px;font:600 10px/1.3 \'Archivo\',sans-serif;color:#444141">'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:2px;background:' + INK + ';display:inline-block"></span>Revenue</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:1.5px;background:' + RED + ';display:inline-block;opacity:.85"></span>Total cost</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:0;border-top:1px dashed #a3a3a3;display:inline-block"></span>Fixed cost</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:7px;height:7px;border-radius:50%;background:' + INK + ';display:inline-block"></span>Break-even</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:7px;height:7px;border-radius:50%;background:' + YEL + ';border:1px solid ' + INK + ';display:inline-block"></span>Base case</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:7px;height:7px;border-radius:50%;background:' + BLU + ';display:inline-block"></span>Low / high case</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:2px;background:#1f7a3d;display:inline-block"></span>Margin of safety</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:9px;background:' + RED + ';opacity:.2;display:inline-block"></span>Loss region</span>'
      + '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:9px;background:' + YEL + ';opacity:.25;display:inline-block"></span>Profit region</span>'
      + '</div>';

    var formulas = '<div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(27,26,25,.18);font:400 11.5px/1.6 \'Archivo\',sans-serif;color:#605d5d">'
      + '<strong style="color:' + INK + '">Formulas —</strong> Revenue/month = guests/day × avg. spend × (' + O.days + ' trading days ÷ 12). '
      + 'Total cost/month = fixed overhead + (' + (v.variablePct * 100).toFixed(0) + '% × revenue). '
      + 'Break-even revenue/month = fixed overhead ÷ (1 − ' + (v.variablePct * 100).toFixed(0) + '%).'
      + '</div>';

    var note = '<p style="font:400 11.5px/1.55 \'Archivo\',sans-serif;color:#7d7979;margin:16px 0 0;max-width:70ch">Planning model only. Break-even depends on actual rent, staffing, trading days, mix, taxes, financing and final site design.</p>';

    root.innerHTML = svgWithAxes + legend + formulas + note;

    // Compact break-even table (beside the chart): four grouped blocks —
    // fixed costs, variable costs, output needed, margin of safety —
    // instead of one long flat fact list, so the module reads as a real
    // commercial planning table rather than a sprawling stat dump.
    var tableRoot = document.getElementById("inv-be-table");
    if (!tableRoot) return;
    function group(label, rows) {
      return '<div style="margin-bottom:20px">'
        + '<div style="font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#f2b30c;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(247,243,236,.28)">' + label + '</div>'
        + rows.map(function (r) {
          return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:6px 0">'
            + '<span style="font:400 11px/1.35 \'Archivo\',sans-serif;color:#bab6b6">' + r[0] + '</span>'
            + '<span style="font:800 13.5px/1.15 \'Archivo\',sans-serif;letter-spacing:-.01em;text-align:right;white-space:nowrap">' + r[1] + '</span></div>';
        }).join("")
        + '</div>';
    }
    tableRoot.innerHTML = group("Fixed costs", [
      ["Overhead / month", eur0(O.fixedMonthly)],
      ["Overhead / year", eur0(O.fixedMonthly * 12)]
    ]) + group("Variable costs", [
      ["Food &amp; beverage", (O.foodPct * 100).toFixed(0) + "% of revenue"],
      ["Labour", (O.labourPct * 100).toFixed(0) + "% of revenue"],
      ["Marketing", (O.marketingPct * 100).toFixed(0) + "% of revenue"],
      ["Total variable rate", (v.variablePct * 100).toFixed(0) + "% of revenue"]
    ]) + group("Output needed to break even", [
      ["Revenue / month", eur0(v.beMonthly)],
      ["Guests / day", Math.round(v.beGuestsDay)],
      ["Guests / month", Math.round(v.beGuestsMonth)]
    ]) + group("Margin of safety, " + esc(rc.label.toLowerCase()), [
      ["Guests above break-even", Math.round(marginGuests) + "/day"],
      ["Cushion", marginPct.toFixed(0) + "%"]
    ]);
  }

  /* ── break-even & sales ── */
  function renderBreakeven(v) {
    var O = v.O, rc = v.rc;
    document.getElementById("inv-revenue-cases").innerHTML = O.revenueCases.map(function (r) {
      var on = r.key === rc.key;
      return '<button type="button" data-act="pick-revcase" data-val="' + r.key + '" style="display:grid;grid-template-columns:1.1fr .8fr .8fr 1fr;gap:0;align-items:center;width:100%;padding:15px 16px;border:0;border-bottom:2px solid rgba(27,26,25,.18);background:' + (on ? YEL : "#f7f3ec") + ';color:' + INK + ';cursor:pointer;text-align:left" data-hover="background:#f2b30c;color:#1b1a19">'
        + '<span style="font:800 15px/1.1 \'Archivo\',sans-serif">' + r.label + '</span>'
        + '<span style="font:600 13px/1 \'Archivo\',sans-serif">' + r.guests + '</span>'
        + '<span style="font:600 13px/1 \'Archivo\',sans-serif">€' + r.spend + '</span>'
        + '<span style="font:800 16px/1 \'Archivo\',sans-serif;letter-spacing:-.02em;text-align:right">' + k(r.guests * r.spend * O.days) + '</span></button>';
    }).join("");

    document.getElementById("inv-pl-casename").textContent = rc.label;
    document.getElementById("inv-pl-rows").innerHTML = [
      { label: "Revenue", value: eur0(v.revenue), color: INK },
      { label: "Food & beverage (30%)", value: "−" + eur0(v.food), color: "#ae1800" },
      { label: "Labour (30%)", value: "−" + eur0(v.labour), color: "#ae1800" },
      { label: "Marketing (7%)", value: "−" + eur0(v.marketing), color: "#ae1800" },
      { label: "Fixed overhead", value: "−" + eur0(v.fixed), color: "#ae1800" },
      { label: "Operating profit", value: eur0(v.profit), color: INK }
    ].map(function (p) {
      return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(27,26,25,.18)">'
        + '<span style="font:600 12.5px/1.3 \'Archivo\',sans-serif;color:' + p.color + '">' + p.label + '</span>'
        + '<span style="font:800 14px/1 \'Archivo\',sans-serif;color:' + p.color + '">' + p.value + '</span></div>';
    }).join("");

    var rows = [
      [eur0(v.beMonthly), "Break-even revenue", "Per month, at " + (v.variablePct * 100).toFixed(0) + "% variable cost", CREAM, INK],
      [Math.round(v.beGuestsMonth).toLocaleString("en-GB"), "Guests per month", "At €" + rc.spend + " average spend", YEL, INK],
      [Math.round(v.beGuestsDay) + "/day", "Guests per day", "Against " + rc.guests + " in this sales case", "#e7e3dc", INK],
      [(v.margin * 100).toFixed(0) + "%", "Operating margin", rc.label + ", " + O.days + " trading days", RED, "#fff"]
    ];
    document.getElementById("inv-breakeven").innerHTML = rows.map(function (b, i) {
      return '<div data-rv="up" data-rv-d="' + (i * 60) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + b[3] + ';color:' + b[4] + ';padding:20px 18px 22px;display:flex;flex-direction:column;gap:9px;min-height:170px">'
        + '<span style="font:800 clamp(22px,2.4vw,32px)/1 \'Archivo\',sans-serif;letter-spacing:-.035em">' + b[0] + '</span>'
        + '<span style="font:800 12px/1.2 \'Archivo\',sans-serif">' + b[1] + '</span>'
        + '<span style="font:400 11.5px/1.45 \'Archivo\',sans-serif;opacity:.8">' + b[2] + '</span></div>';
    }).join("");
  }

  /* ── financial assumptions: every figure here is read live from
     PP_DATA.LAND/BUILD_RATE/EXTERIOR/SCENARIOS/OPERATING, never retyped ── */
  function renderAssumptions(v) {
    var D = v.D, O = v.O;
    var landRoot = document.getElementById("inv-assumptions-land");
    if (!landRoot) return;

    landRoot.innerHTML = Object.keys(D.LAND).map(function (planKey) {
      var land = D.LAND[planKey];
      var itemized = land.lines.reduce(function (a, l) { return a + l[1]; }, 0);
      var band = land.low === land.high ? eur0(land.low) : eur0(land.low) + " – " + eur0(land.high);
      return '<div style="border-right:2px solid rgba(247,243,236,.3);border-bottom:2px solid rgba(247,243,236,.3);padding:20px 18px 22px">'
        + '<div style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#f2b30c;margin-bottom:8px">Plan ' + esc(planKey) + ' land · ' + esc(land.name) + '</div>'
        + '<div style="font:800 26px/1 \'Archivo\',sans-serif;letter-spacing:-.02em;margin-bottom:6px">' + eur0(itemized) + '</div>'
        + '<div style="font:600 10.5px/1.4 \'Archivo\',sans-serif;color:#bab6b6;margin-bottom:10px">Itemized total · ' + land.plot.toLocaleString("en-GB") + ' m² plot · used in the scenario range as ' + band + '</div>'
        + '<div style="border-top:1px solid rgba(247,243,236,.22);padding-top:8px;display:flex;flex-direction:column;gap:4px">'
        + land.lines.map(function (l) { return '<span style="display:flex;justify-content:space-between;gap:10px;font:400 11px/1.5 \'Archivo\',sans-serif;color:#bab6b6"><span>' + esc(l[0]) + '</span><span style="color:#f7f3ec">' + eur0(l[1]) + '</span></span>'; }).join("")
        + '</div></div>';
    }).join("");

    var buildRoot = document.getElementById("inv-assumptions-build");
    var sizes = Array.from(new Set(D.SCENARIOS.map(function (s) { return s.building; })));
    buildRoot.innerHTML = [
      ["Building rate", "€" + D.BUILD_RATE.low.toLocaleString("en-GB") + " – €" + D.BUILD_RATE.high.toLocaleString("en-GB") + "/m²", "Turnkey construction, per m²"]
    ].concat(sizes.map(function (sz) {
      return [sz.toLocaleString("en-GB") + " m² building", m(sz * D.BUILD_RATE.low) + " – " + m(sz * D.BUILD_RATE.high), sz.toLocaleString("en-GB") + " m² × rate band"];
    })).concat(Object.keys(D.EXTERIOR).map(function (k2) {
      var ext = D.EXTERIOR[k2];
      return ["Exterior · " + k2, eur0(ext[0]) + " – " + eur0(ext[1]), "Parking, plaza, garden, lighting, sound"];
    })).map(function (row) {
      return '<div style="border-right:2px solid rgba(247,243,236,.3);border-bottom:2px solid rgba(247,243,236,.3);padding:18px 16px 20px;display:flex;flex-direction:column;gap:6px">'
        + '<span style="font:600 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#7d7979">' + esc(row[0]) + '</span>'
        + '<span style="font:800 18px/1.1 \'Archivo\',sans-serif;letter-spacing:-.015em">' + row[1] + '</span>'
        + '<span style="font:400 10.5px/1.4 \'Archivo\',sans-serif;color:#7d7979">' + esc(row[2]) + '</span></div>';
    }).join("");

    var totalsRoot = document.getElementById("inv-assumptions-totals");
    totalsRoot.innerHTML = D.SCENARIOS.map(function (s) {
      return '<div style="border-right:2px solid rgba(247,243,236,.3);border-bottom:2px solid rgba(247,243,236,.3);padding:18px 16px 20px;display:flex;flex-direction:column;gap:6px">'
        + '<span style="font:600 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#7d7979">' + esc(s.label) + ' · ' + esc(s.site) + '</span>'
        + '<span style="font:800 19px/1.1 \'Archivo\',sans-serif;letter-spacing:-.02em;color:#f2b30c">' + m(s.totalLow) + ' – ' + m(s.totalHigh) + '</span>'
        + '<span style="font:400 10.5px/1.4 \'Archivo\',sans-serif;color:#7d7979">' + s.building.toLocaleString("en-GB") + ' m² building</span></div>';
    }).join("");

    var opexRoot = document.getElementById("inv-assumptions-opex");
    opexRoot.innerHTML = [
      ["Labour", (O.labourPct * 100).toFixed(0) + "% of revenue", "Planning range 27–32% of sales"],
      ["Food & beverage", (O.foodPct * 100).toFixed(0) + "% of revenue", "Planning range 28–32% of F&B revenue"],
      ["Marketing", (O.marketingPct * 100).toFixed(0) + "% of revenue", "Planning range 7–8% of gross revenue"],
      ["Base-case annual revenue", eur0(v.revenue), O.revenueCases[1].guests + " guests/day × €" + O.revenueCases[1].spend + " × " + O.days + " days"],
      ["Base-case operating profit", eur0(v.profit), "Revenue less food, labour, marketing and fixed overhead"],
      ["Break-even revenue", eur0(v.beMonthly) + "/month", eur0(v.beMonthly * 12) + "/year"]
    ].map(function (row) {
      return '<div style="border-right:2px solid rgba(247,243,236,.3);border-bottom:2px solid rgba(247,243,236,.3);padding:18px 16px 20px;display:flex;flex-direction:column;gap:6px">'
        + '<span style="font:600 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#7d7979">' + esc(row[0]) + '</span>'
        + '<span style="font:800 18px/1.1 \'Archivo\',sans-serif;letter-spacing:-.015em">' + row[1] + '</span>'
        + '<span style="font:400 10.5px/1.4 \'Archivo\',sans-serif;color:#7d7979">' + esc(row[2]) + '</span></div>';
    }).join("");
  }

  /* ── funding ── */
  function renderFunding(v) {
    var D = v.D, S = v.S;
    var rows = [
      [eur0(D.FUNDING.equity), "Founders' equity", "Mazen €200k + Ahmed €200k", CREAM, INK],
      [eur0(D.FUNDING.loan), "Initial bank loan", "Secured in Phase 1", "#e7e3dc", INK],
      [eur0(D.FUNDING.committed), "Committed today", "Same in all four scenarios", YEL, INK],
      [m(v.gapLow) + " – " + m(v.gapHigh), "Capital gap · " + S.label, "Corrected total less committed capital", INK, CREAM]
    ];
    document.getElementById("inv-funding").innerHTML = rows.map(function (f, i) {
      return '<div data-rv="up" data-rv-d="' + (i * 60) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + f[3] + ';color:' + f[4] + ';padding:22px 20px 24px;display:flex;flex-direction:column;gap:9px;min-height:180px">'
        + '<span style="font:800 clamp(22px,2.4vw,32px)/1 \'Archivo\',sans-serif;letter-spacing:-.035em">' + f[0] + '</span>'
        + '<span style="font:800 13px/1.2 \'Archivo\',sans-serif">' + f[1] + '</span>'
        + '<span style="font:400 12px/1.45 \'Archivo\',sans-serif;opacity:.82">' + f[2] + '</span></div>';
    }).join("");
  }

  /* ── contact facts ── */
  function renderContact(v) {
    var S = v.S;
    var facts = [
      { label: "Scenario shown", value: S.label, color: YEL },
      { label: "Total investment", value: m(S.totalLow) + "–" + m(S.totalHigh), color: CREAM },
      { label: "Capital gap", value: m(v.gapLow) + "–" + m(v.gapHigh), color: CREAM },
      { label: "Annual profit", value: eur0(v.profit), color: YEL },
      { label: "Payback at mid", value: v.paybackMid.toFixed(1) + " yrs", color: RED }
    ];
    document.getElementById("inv-contact-facts").innerHTML = facts.map(function (f) {
      return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding:15px 18px;border-bottom:1px solid rgba(247,243,236,.22)">'
        + '<span style="font:600 10px/1.3 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#bab6b6">' + f.label + '</span>'
        + '<span style="font:800 16px/1 \'Archivo\',sans-serif;letter-spacing:-.015em;color:' + f.color + ';text-align:right">' + f.value + '</span></div>';
    }).join("");
  }

  function render() {
    var v = derive();
    if (!v) return;
    renderModal(v);
    renderHeadline(v);
    renderPs(v);
    renderScenario(v);
    renderBreakeven(v);
    renderBreakevenChart(v);
    renderAssumptions(v);
    renderPositioning();
    renderFunding(v);
    renderContact(v);
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  /* ── event delegation: clicks (act on data-act) and text-field input
     (kept out of render() so typing never loses focus) ── */
  function onClick(e) {
    var el = e.target.closest("[data-act]");
    if (!el) return;
    var act = el.getAttribute("data-act"), val = el.getAttribute("data-val");
    switch (act) {
      case "open-form":
        state.form = true; state.sent = false; state.fScenario = state.scenario;
        render(); break;
      case "close-form":
        state.form = false; state.sent = false; render(); break;
      case "pick-scenario":
        state.scenario = val; render(); break;
      case "pick-site":
        state.siteFilter = val;
        var D0 = window.PP_DATA;
        if (D0 && val !== "ALL") {
          var current = D0.SCENARIOS.find(function (s) { return s.key === state.scenario; });
          if (!current || current.site !== val) {
            var firstMatch = D0.SCENARIOS.find(function (s) { return s.site === val; });
            if (firstMatch) state.scenario = firstMatch.key;
          }
        }
        render(); break;
      case "pick-revcase":
        state.revCase = val; render(); break;
      case "pick-ps":
        state.p = parseInt(val, 10); render(); break;
      case "pick-fscenario":
        state.fScenario = val; render(); break;
      case "pick-ticket":
        state.fTicket = val; render(); break;
      case "pick-structure":
        state.fStructure = val; render(); break;
      case "submit-form":
        state.sent = true; render(); break;
    }
  }
  function onInput(e) {
    var field = e.target.getAttribute && e.target.getAttribute("data-field");
    if (!field) return;
    state[field] = e.target.value;
  }
  function onKeydown(e) {
    if (e.key === "Escape" && state.form) { state.form = false; state.sent = false; render(); }
  }

  window.PP_READY(function () {
    document.body.addEventListener("click", onClick);
    document.body.addEventListener("input", onInput);
    window.addEventListener("keydown", onKeydown);
    if (window.PP_TRACK) window.PP_TRACK(function () {
      document.body.removeEventListener("click", onClick);
      document.body.removeEventListener("input", onInput);
      window.removeEventListener("keydown", onKeydown);
    });
    render();
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    } else {
      window.addEventListener("pp-data-ready", render);
      if (window.PP_TRACK) window.PP_TRACK(function () { window.removeEventListener("pp-data-ready", render); });
    }
  });
})();
