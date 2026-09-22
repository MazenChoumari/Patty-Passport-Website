/* Patty Passport — full crew directory (crew.html). A representative
   staffing model, not a claim of real headcount: the 8 "Featured crew"
   named on our-story.html (with real bios and guest reviews) plus 24
   more names filling out the same 5-route, guest-facing/kitchen-&-ops
   structure, so "View all crew" opens something real instead of a
   dead end. No profile here represents an identifiable real person. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var GROUP = { guest: "Guest-facing", kitchen: "Kitchen & Ops" };
  // The five approved service roles every profile maps to — one per
  // guest-experience function (route floor, front desk, culture/kids
  // guiding, group/event tables) plus one kitchen role.
  var ROLE_GROUP = {
    "Route Host": "guest", "Passport Desk": "guest", "Destination Guide": "guest",
    "Table Captain": "guest", "Kitchen Crew": "kitchen"
  };
  var ROLE_COLOR = {
    "Route Host": BLU, "Passport Desk": YEL, "Destination Guide": "#1f7a3d",
    "Table Captain": "#7a4fae", "Kitchen Crew": RED
  };

  // [name, role, route, line, nationality, featured]
  var CREW_SRC = [
    ["George Ammar", "Route Host", "Levant", "Runs the floor on the busiest routes and never lets a table feel rushed between courses.", "Lebanese / Spanish", true],
    ["Lucía Fernández", "Passport Desk", "All routes", "The first face at the desk — reads a party in seconds and picks the right first destination for them.", "Spanish", true],
    ["Marco Rossi", "Kitchen Crew", "Iberia & Latin", "Holds every country's plate to the same standard: nothing leaves the pass unless it tastes like the place it's from.", "Italian", true],
    ["Yasmin Haddad", "Destination Guide", "Levant", "Turns the passport into a game for younger guests — flags, phrases and a stamp they actually want to earn.", "Lebanese", true],
    ["Nikos Papadopoulos", "Route Host", "Aegean", "Keeps the Aegean route moving and always has a story about the dish that's about to land.", "Greek", true],
    ["Alicia Morales", "Table Captain", "All routes", "Plans the birthdays and group journeys, from the first booking call to the final candle.", "Spanish", true],
    ["Omar El Tayar", "Kitchen Crew", "N. Africa", "Runs the drinks pass across all twenty-one countries and knows which cooler pairs with which route.", "Egyptian", true],
    ["Sofia Costa", "Kitchen Crew", "All routes", "Closes every table's journey with the country's dessert — and keeps the sweet stamp worth waiting for.", "Portuguese / Moroccan", true],

    ["Rami Nasser", "Kitchen Crew", "Levant", "Grew up watching his grandmother stuff vine leaves in Beirut; runs the Levant pass with the same patience.", "Lebanese", false],
    ["Dana Khalil", "Passport Desk", "Levant", "Remembers regulars' routes before they've said a word.", "Syrian", false],
    ["Elena Vasiliou", "Destination Guide", "Aegean", "Explains why Greek olive oil isn't just olive oil, without ever sounding like a lecture.", "Greek", false],
    ["Mert Yildiz", "Kitchen Crew", "Aegean", "Runs the Aegean grill station like a short-order philosopher.", "Turkish", false],
    ["Clara Duarte", "Table Captain", "Iberia & Latin", "Keeps a six-top of extended family fed, happy and never waiting.", "Portuguese", false],
    ["Diego Fernández", "Kitchen Crew", "Iberia & Latin", "Can tell you the story behind every Iberian pour, sober.", "Spanish", false],
    ["Giulia Bianchi", "Kitchen Crew", "Iberia & Latin", "Trained in Naples; treats every gelato scoop like a small ceremony.", "Italian", false],
    ["Ivana Horvat", "Route Host", "Adriatic", "First face of the Adriatic gate — reads a party before they've sat down.", "Croatian", false],
    ["Petar Jovanović", "Kitchen Crew", "Adriatic", "Keeps the grill honest across five very different Balkan plates.", "Montenegrin", false],
    ["Yara Aziz", "Destination Guide", "N. Africa", "Turns Egypt's stamp into the one every kid wants first.", "Egyptian", false],
    ["Karim Belhadj", "Table Captain", "N. Africa", "Books more birthdays than any other route, on purpose.", "Tunisian", false],
    ["Sami Trabelsi", "Kitchen Crew", "N. Africa", "Runs the North Africa pass with the discipline of a spice trader's ledger.", "Tunisian", false],
    ["Noor Haddad", "Passport Desk", "All routes", "Second face at the desk on the busiest nights.", "Palestinian", false],
    ["Hugo Álvarez", "Table Captain", "Iberia & Latin", "Runs the school-journey tables without losing a single booklet.", "Spanish", false],
    ["Mireille Costa", "Table Captain", "All routes", "Plans the group departures that need two zones, not one.", "French", false],
    ["Théo Lambert", "Kitchen Crew", "All routes", "Keeps the alcohol-free list as serious as the wine list.", "French", false],
    ["Aylin Demir", "Destination Guide", "All routes", "Covers for any route's guide on a moment's notice.", "Turkish", false],
    ["Bruno Silva", "Kitchen Crew", "All routes", "Night-shift lead; the pass never slows down on his watch.", "Portuguese", false],
    ["Farah Idris", "Passport Desk", "All routes", "Stamped more junior passports than anyone on the floor.", "Egyptian", false],
    ["Léa Moreau", "Table Captain", "All routes", "Runs the private-zone team departures.", "French", false],
    ["Adrian Kowalski", "Kitchen Crew", "All routes", "Cross-trained on all five route stations.", "Polish", false],
    ["Salma Rahal", "Destination Guide", "All routes", "Wrote half the route booklets the kids use today.", "Algerian", false],
    ["Viktor Petrov", "Kitchen Crew", "Adriatic", "Built the alcohol-free cooler menu from scratch.", "Montenegrin", false],
    ["Nadia Boumediene", "Table Captain", "N. Africa", "Runs corporate team departures without losing the fun.", "Algerian", false]
  ].map(function (c) {
    return { name: c[0], role: c[1], route: c[2], line: c[3], nationality: c[4], featured: c[5], group: ROLE_GROUP[c[1]] || "guest" };
  });

  var state = { q: "", group: "ALL" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    return CREW_SRC.filter(function (c) {
      if (state.group !== "ALL" && c.group !== state.group) return false;
      if (!q) return true;
      return c.name.toLowerCase().indexOf(q) > -1 || c.role.toLowerCase().indexOf(q) > -1 || c.route.toLowerCase().indexOf(q) > -1;
    });
  }

  function renderGroupFilters() {
    var keys = ["ALL", "guest", "kitchen"];
    document.getElementById("cr-group-filters").innerHTML = keys.map(function (k) {
      var label = k === "ALL" ? "All roles" : GROUP[k];
      var active = state.group === k;
      return '<button type="button" data-group="' + k + '" style="padding:10px 13px;background:' + (active ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (active ? CREAM : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + esc(label) + '</button>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#cr-group-filters [data-group]"), function (btn) {
      btn.addEventListener("click", function () { state.group = btn.getAttribute("data-group"); render(); });
    });
  }

  function renderGrid() {
    var list = filtered();
    document.getElementById("cr-count").textContent = list.length + " of " + CREW_SRC.length + " crew shown";
    var grid = document.getElementById("cr-grid");
    var empty = document.getElementById("cr-empty");
    if (!list.length) {
      grid.innerHTML = "";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    grid.innerHTML = list.map(function (c) {
      var color = ROLE_COLOR[c.role] || INK;
      var roleFg = color === YEL ? INK : "#fff";
      return '<div style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#fff;padding:20px 18px 22px;display:flex;flex-direction:column;gap:9px;min-height:190px">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">'
        + '<span style="width:40px;height:40px;flex:none;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font:800 13px/1 \'Archivo\',sans-serif">' + esc(c.name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("")) + '</span>'
        + (c.featured ? '<span style="padding:4px 7px;background:#f2b30c;color:#1b1a19;font:800 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">Featured</span>' : '')
        + '</div>'
        + '<h3 style="font:800 16.5px/1.15 \'Archivo\',sans-serif;letter-spacing:-.01em;margin:0">' + esc(c.name) + '</h3>'
        + '<span style="display:inline-flex;align-self:flex-start;padding:4px 8px;background:' + color + ';color:' + roleFg + ';font:800 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">' + esc(c.role) + '</span>'
        + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7d7979">' + esc(c.route) + ' · ' + esc(c.nationality) + '</div>'
        + '<p style="font:400 12px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(c.line) + '</p>'
        + (c.featured ? '<a href="our-story.html" style="margin-top:auto;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#ae1800">Read bio &amp; reviews →</a>' : '')
        + '</div>';
    }).join("");
    if (window.initHoverStyles) window.initHoverStyles(grid);
  }

  function render() {
    renderGroupFilters();
    renderGrid();
  }

  window.PP_READY(function () {
    render();
    var search = document.getElementById("cr-search");
    if (search) {
      search.addEventListener("input", function () { state.q = search.value; renderGrid(); });
      if (window.PP_TRACK) window.PP_TRACK(function () { search.removeEventListener("input", render); });
    }
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  });
})();
