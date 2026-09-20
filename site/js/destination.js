/* Patty Passport — country destination page, ported from
   Destination-Page.dc.html's x-dc template + Component logic. Single
   template, driven by window.PP_DATA.COUNTRIES and the URL hash (#lbn). */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var KINDS = {
    veg: ["Veg burger", "#1f7a3d"], chicken: ["Chicken burger", "#ae1800"], beef: ["Beef burger", "#ae1800"],
    fries: ["Loaded fries", "#8a6a00"], salad: ["Salad", "#1f7a3d"], cold: ["Cold country drink", "#1d5c9e"],
    alcohol: ["Alcoholic country drink", "#7a2b8a"], hot: ["Hot drink", "#8a4a00"], dessert: ["Dessert", "#ae1800"]
  };
  var TAG_COLORS = {
    "Vegetarian": "#1f7a3d", "Halal-friendly": "#1d5c9e", "No pork": "#605d5d",
    "Contains pork": "#ae1800", "Alcohol-free": "#605d5d", "Contains alcohol": "#7a2b8a", "Contains nuts": "#8a4a00"
  };
  var GROUP_DEFS = [
    ["Burgers", YEL, INK], ["Loaded fries", CREAM, INK], ["Salads", "#e7e3dc", INK],
    ["Drinks", BLU, "#fff"], ["Desserts", RED, "#fff"]
  ];
  function eur(n) { return "€" + n.toFixed(2).replace(/\.00$/, ".0"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function currentCode() {
    var h = (location.hash || "").replace("#", "").toLowerCase();
    var data = window.PP_DATA;
    if (data && h && data.COUNTRIES.some(function (c) { return c.code === h; })) return h;
    return "lbn";
  }

  function render() {
    var data = window.PP_DATA;
    if (!data) return;
    var code = currentCode();
    var countries = data.COUNTRIES;
    var i = countries.findIndex(function (c) { return c.code === code; });
    var d = countries[i];
    var route = data.ROUTES[d.routeKey];

    document.getElementById("dp-route-crumb").textContent = route.name + " Route";
    document.getElementById("dp-name-crumb").textContent = d.name;
    document.getElementById("dp-med-crumb").textContent = d.med;

    // Greeting & language — native script + romanised + English, flag-wave in
    var greetingParts = (d.greeting || "").split(" — ");
    var romanised = greetingParts[0] || "";
    var english = greetingParts[1] || "";
    document.getElementById("dp-greeting").innerHTML =
      '<span style="font-size:30px;line-height:1;display:inline-block;animation:ppFlagWave 2.4s ease-in-out infinite;transform-origin:70% 90%">🏳️</span>'
      + '<span>'
      + '<span style="display:block;font:800 22px/1.2 \'Archivo\',sans-serif;margin-bottom:2px">' + esc(d.nativePhrase) + (d.nativePhrase ? " — " : "") + esc(romanised) + '</span>'
      + '<span style="display:block;font:400 13px/1.5 \'Archivo\',sans-serif;color:#bab6b6">' + esc(english) + '</span>'
      + '</span>'
      + '<span style="margin-left:auto;display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:2px solid ' + route.bg + ';color:' + route.bg + ';font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase">'
      + '<span style="width:7px;height:7px;background:' + route.bg + ';flex:none"></span>You are here — ' + esc(route.name) + ' Route</span>';

    document.getElementById("dp-hero-bg").style.background = route.bg;
    document.getElementById("dp-hero-left").style.color = route.fg;
    document.getElementById("dp-stamp-route").textContent = "Destination " + d.stamp + " · " + route.name + " Route";
    document.getElementById("dp-name-upper").textContent = d.name.toUpperCase();
    document.getElementById("dp-identity").textContent = d.identity;
    document.getElementById("dp-intro").textContent = d.intro;
    document.getElementById("dp-order-link").href = "menu.html";
    document.getElementById("dp-order-link").querySelector("span").textContent = "Order the " + d.heroItem.name.replace(" Burger", "");
    document.getElementById("dp-stamp-link").style.color = route.fg;
    document.getElementById("dp-stamp-link").querySelector("span").textContent = "Collect stamp " + d.stamp;
    document.getElementById("dp-hero-slot").querySelector("span").textContent = d.name + " — its most recognisable street or coast";
    document.getElementById("dp-stamp-badge").textContent = d.stamp;
    document.getElementById("dp-stamp-name").textContent = d.name.toUpperCase();
    document.getElementById("dp-hero-caption").textContent = d.name + " · " + route.name + " Route · gate " + d.med;

    document.getElementById("dp-quickfacts").innerHTML = [
      { label: "Capital", value: d.capital, color: CREAM },
      { label: "People", value: d.population, color: YEL },
      { label: "Water", value: d.sea, color: CREAM },
      { label: "Passport stamp", value: d.stamp, color: RED }
    ].map(function (q, k) {
      return '<div data-rv="up" data-rv-d="' + (k * 70) + '" style="padding:24px 26px 26px;border-right:1px solid rgba(247,243,236,.22)">'
        + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979;margin-bottom:10px">' + esc(q.label) + '</div>'
        + '<div style="font:800 22px/1.08 \'Archivo\',sans-serif;letter-spacing:-.025em;color:' + q.color + '">' + esc(q.value) + '</div></div>';
    }).join("");

    document.getElementById("dp-culture-title").textContent = d.identity.toUpperCase();
    document.getElementById("dp-culture1").textContent = d.culture1;
    document.getElementById("dp-culture2").textContent = d.culture2;
    document.getElementById("dp-phrase").textContent = d.nativePhrase;
    document.getElementById("dp-translit").textContent = d.translit;
    document.getElementById("dp-eqbars").innerHTML = Array.from({ length: 14 }, function (_, k) {
      var color = k % 4 === 0 ? RED : k % 3 === 0 ? YEL : INK;
      var dur = (0.5 + (k % 6) * 0.14).toFixed(2) + "s";
      var delay = ((k % 7) * 0.08).toFixed(2) + "s";
      return '<span style="flex:1;background:' + color + ';height:30%;animation:ppEq ' + dur + ' ease-in-out ' + delay + ' infinite alternate"></span>';
    }).join("");

    document.getElementById("dp-facts").innerHTML = d.facts.map(function (f, k) {
      var bg = [YEL, RED, BLU][k % 3], fg = k === 0 ? INK : "#fff";
      return '<div data-rv="up" data-rv-d="' + (k * 80) + '" style="display:flex;gap:16px;padding:18px 0;border-bottom:2px solid rgba(27,26,25,.2)">'
        + '<span style="width:44px;height:44px;flex:none;background:' + bg + ';color:' + fg + ';display:flex;align-items:center;justify-content:center;font:800 15px/1 \'Archivo\',sans-serif">' + (k + 1) + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 16px/1.2 \'Archivo\',sans-serif;letter-spacing:-.015em;margin-bottom:5px">' + esc(f[0]) + '</span>'
        + '<span style="display:block;font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(f[1]) + '</span></span></div>';
    }).join("");
    document.getElementById("dp-nature-slot").querySelector("span").textContent = d.nature;

    var hero = d.heroItem;
    document.getElementById("dp-dish-slot").querySelector("span").textContent = hero.name + " — plated, close up";
    document.getElementById("dp-dish-name").textContent = hero.name;
    document.getElementById("dp-dish-desc").textContent = hero.desc;
    document.getElementById("dp-dish-price").textContent = eur(hero.price);
    document.getElementById("dp-diet-tags").textContent = hero.tags.join(" · ");
    document.getElementById("dp-pairings").innerHTML = [
      { kind: "Side", name: "Route fries with " + d.identity.split(" ")[0].toLowerCase() + " salt", price: "€4.50" },
      { kind: "Drink", name: "House cooler of " + d.name, price: "€3.80" },
      { kind: "Dessert", name: d.name + " sweet of the week", price: "€5.50" }
    ].map(function (p) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 0;border-bottom:1px solid rgba(247,243,236,.22)">'
        + '<span><span style="display:block;font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979;margin-bottom:5px">' + esc(p.kind) + '</span>'
        + '<span style="display:block;font:800 15px/1.15 \'Archivo\',sans-serif">' + esc(p.name) + '</span></span>'
        + '<span style="font:800 14px/1 \'Archivo\',sans-serif;color:#f2b30c">' + p.price + '</span></div>';
    }).join("");

    document.getElementById("dp-fullcard-kicker").textContent = "The full card · " + d.name;
    document.getElementById("dp-menu-groups").innerHTML = GROUP_DEFS.map(function (g) {
      var items = d.items.filter(function (it) { return it.group === g[0]; });
      if (!items.length) return "";
      return '<div style="border-top:2px solid #1b1a19">'
        + '<div style="padding:14px 32px;background:' + g[1] + ';color:' + g[2] + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;display:flex;justify-content:space-between;gap:14px">'
        + '<span>' + g[0] + '</span><span style="opacity:.7">' + items.length + ' on the card</span></div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));border-left:2px solid #1b1a19">'
        + items.map(function (it) {
          var kind = KINDS[it.kind] || [it.kind, "#605d5d"];
          return '<div style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;padding:18px 17px 20px;display:flex;flex-direction:column;gap:9px;min-height:184px">'
            + '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">'
            + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:' + kind[1] + '">' + kind[0] + '</span>'
            + '<span style="font:800 15px/1 \'Archivo\',sans-serif">' + eur(it.price) + '</span></div>'
            + '<h3 style="font:800 17px/1.12 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(it.name) + '</h3>'
            + '<p style="font:400 12.5px/1.45 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(it.desc) + '</p>'
            + '<div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:5px;padding-top:10px;border-top:2px solid rgba(27,26,25,.16)">'
            + it.tags.map(function (t) { return '<span style="padding:4px 7px;border:2px solid rgba(27,26,25,.28);color:' + (TAG_COLORS[t] || "#605d5d") + ';font:800 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.11em;text-transform:uppercase">' + t + '</span>'; }).join("")
            + '</div></div>';
        }).join("") + '</div></div>';
    }).join("");

    document.getElementById("dp-related-title").textContent = "ALSO ON THE " + route.name.toUpperCase() + " ROUTE";
    var related = countries.filter(function (c) { return c.routeKey === d.routeKey && c.code !== d.code; }).slice(0, 4);
    document.getElementById("dp-related").innerHTML = related.map(function (r, k) {
      return '<a href="destination.html#' + r.code + '" data-rv="up" data-rv-d="' + (k * 70) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;padding:22px 20px 24px;background:#f7f3ec;text-decoration:none;color:#1b1a19;display:flex;flex-direction:column;gap:10px;min-height:190px" data-hover="background:#1b1a19;color:#f7f3ec">'
        + '<span style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.7">' + r.med + '</span>'
        + '<span style="font:800 24px/1.02 \'Archivo\',sans-serif;letter-spacing:-.025em">' + r.name.toUpperCase() + '</span>'
        + '<span style="font:400 13px/1.5 \'Archivo\',sans-serif;opacity:.8">' + esc(r.identity) + '</span>'
        + '<span style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase">' + r.stamp + '<span>→</span></span></a>';
    }).join("");

    document.getElementById("dp-cta-title").textContent = "FLY TO " + d.name.toUpperCase() + " THIS WEEK.";
    document.getElementById("dp-cta-text").textContent = "Book the table, tell the desk the destination, and the boarding pass prints with " + d.med + " on it.";

    if (window.initHoverStyles) window.initHoverStyles(document.body);
    initScrollReveal();
  }

  function initScrollReveal() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-rv]"));
    nodes.forEach(function (el) {
      if (el._ppInit) return;
      el._ppInit = true;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
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
    window.scrollTo({ top: 0 });
    render();
    window.addEventListener("hashchange", function () { window.scrollTo({ top: 0 }); render(); });
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    }
  });
})();
