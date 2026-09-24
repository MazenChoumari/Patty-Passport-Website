/* Patty Passport — full crew directory (crew.html). Reads the shared
   window.PP_CREW_DATA (js/crew-data.js) — the 8 "Featured crew" also
   named on our-story.html (with role bios, and a real front-end review
   box any visitor can post to — no reviews are pre-seeded) plus 24 more
   names filling out the same 5-route, guest-facing/kitchen-&-ops
   structure, so "View all crew" opens something real instead of a dead
   end, and the two pages can never list different people for the same
   name. No profile here represents an identifiable real person. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var GROUP = { guest: "Guest-facing", kitchen: "Kitchen & Ops" };
  // Drawn only from the site's own palette (no invented green/purple) —
  // same mapping as our-story.js's featured-crew role tags.
  var ROLE_COLOR = {
    "Route Host": BLU, "Passport Desk": YEL, "Destination Guide": INK,
    "Table Captain": "#e7e3dc", "Kitchen Crew": RED
  };
  var LIGHT_ROLE_COLORS = [YEL, "#e7e3dc"];
  function roleFg(role) { return LIGHT_ROLE_COLORS.indexOf(ROLE_COLOR[role]) > -1 ? INK : "#fff"; }

  var state = { q: "", group: "ALL" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var all = (window.PP_CREW_DATA && window.PP_CREW_DATA.ALL) || [];
    return all.filter(function (c) {
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
    var total = (window.PP_CREW_DATA && window.PP_CREW_DATA.ALL.length) || 0;
    document.getElementById("cr-count").textContent = list.length + " of " + total + " crew shown";
    var grid = document.getElementById("cr-grid");
    var empty = document.getElementById("cr-empty");
    if (!list.length) {
      grid.innerHTML = "";
      // Distinguish "search found nothing" from "the crew data itself
      // never loaded" (e.g. a script-load failure) — the second case is
      // a real problem, not a normal empty search result, so it needs
      // its own honest message instead of quietly looking like one.
      empty.textContent = total
        ? "No crew match that search."
        : "Crew data failed to load — please refresh the page.";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    grid.innerHTML = list.map(function (c) {
      var color = ROLE_COLOR[c.role] || INK;
      var fg = roleFg(c.role);
      return '<div style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#fff;padding:20px 18px 22px;display:flex;flex-direction:column;gap:9px;min-height:190px">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">'
        + '<span style="width:40px;height:40px;flex:none;background:' + color + ';color:' + fg + ';display:flex;align-items:center;justify-content:center;font:800 13px/1 \'Archivo\',sans-serif">' + esc(c.name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("")) + '</span>'
        + (c.featured ? '<span style="padding:4px 7px;background:#f2b30c;color:#1b1a19;font:800 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">Featured</span>' : '')
        + '</div>'
        + '<h3 style="font:800 16.5px/1.15 \'Archivo\',sans-serif;letter-spacing:-.01em;margin:0">' + esc(c.name) + '</h3>'
        + '<span style="display:inline-flex;align-self:flex-start;padding:4px 8px;background:' + color + ';color:' + fg + ';font:800 9px/1.3 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">' + esc(c.role) + '</span>'
        + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7d7979">' + esc(c.route) + ' · ' + esc(c.nationality) + '</div>'
        + '<p style="font:400 12px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(c.bio) + '</p>'
        + (c.featured ? '<a href="our-story.html" style="margin-top:auto;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#ae1800">Read bio &amp; reviews →</a>' : '')
        + '</div>';
    }).join("");
    if (window.initHoverStyles) window.initHoverStyles(grid);
  }

  // "Who can help with…" — a quick guest-need → role selector sitting
  // above the featured crew's "Back to Our Story" CTA, so that space
  // carries a real interactive element instead of just a paragraph and
  // a button. Reuses window.PP_CREW_DATA.FEATURED rather than a second
  // dataset.
  var HELP_TOPICS = [
    ["Picking a first destination", "Passport Desk"],
    ["Kids & family activities", "Destination Guide"],
    ["Birthdays & group bookings", "Table Captain"],
    ["Dish & route questions", "Route Host"]
  ];
  var helpState = { topic: null };

  function renderHelpButtons() {
    var root = document.getElementById("cr-help-buttons");
    if (!root) return;
    root.innerHTML = HELP_TOPICS.map(function (t) {
      var on = helpState.topic === t[1];
      return '<button type="button" data-help-role="' + esc(t[1]) + '" style="padding:10px 13px;background:' + (on ? "#f2b30c" : "transparent") + ';border:2px solid #f2b30c;color:' + (on ? "#1b1a19" : "#f7f3ec") + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.06em;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">' + esc(t[0]) + '</button>';
    }).join("");
  }

  function renderHelpResult() {
    var root = document.getElementById("cr-help-result");
    if (!root) return;
    if (!helpState.topic) {
      root.innerHTML = '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:0">Pick what you need — we\'ll point you to who\'s on that route.</p>';
      return;
    }
    var featured = (window.PP_CREW_DATA && window.PP_CREW_DATA.FEATURED) || [];
    var matches = featured.filter(function (c) { return c.role === helpState.topic; });
    if (!matches.length) {
      root.innerHTML = '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:0">Ask at the desk — whoever\'s on shift can help with this.</p>';
      return;
    }
    root.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:10px">' + matches.map(function (c) {
      return '<a href="our-story.html" style="display:flex;align-items:center;gap:9px;padding:9px 12px;border:1.5px solid rgba(247,243,236,.3);text-decoration:none;color:#f7f3ec" data-hover="background:rgba(247,243,236,.08)">'
        + '<span style="font:800 12.5px/1 \'Archivo\',sans-serif">' + esc(c.name) + '</span>'
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#7d7979">' + esc(c.route) + '</span></a>';
    }).join("") + '</div>';
  }

  function render() {
    renderGroupFilters();
    renderGrid();
    renderHelpButtons();
    renderHelpResult();
  }

  window.PP_READY(function () {
    render();
    var search = document.getElementById("cr-search");
    if (search) {
      search.addEventListener("input", function () { state.q = search.value; renderGrid(); });
      if (window.PP_TRACK) window.PP_TRACK(function () { search.removeEventListener("input", render); });
    }
    function onHelpClick(e) {
      var btn = e.target.closest("[data-help-role]");
      if (!btn) return;
      var role = btn.getAttribute("data-help-role");
      helpState.topic = helpState.topic === role ? null : role;
      renderHelpButtons();
      renderHelpResult();
      if (window.initHoverStyles) window.initHoverStyles(document.getElementById("cr-help-buttons"));
    }
    document.body.addEventListener("click", onHelpClick);
    if (window.PP_TRACK) window.PP_TRACK(function () { document.body.removeEventListener("click", onHelpClick); });
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  });
})();
