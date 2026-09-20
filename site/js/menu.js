/* Patty Passport — full menu page, ported from Menu.dc.html's x-dc
   template + Component logic. Every price and every one of the 21
   countries' 11 items is driven live from window.PP_DATA (js/data.js) —
   nothing here is a hard-coded price or a sampled subset of countries. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var KINDS = {
    veg: ["Veg burger", "#1f7a3d"], chicken: ["Chicken burger", "#ae1800"], beef: ["Beef burger", "#ae1800"],
    fries: ["Loaded fries", "#8a6a00"], salad: ["Salad", "#1f7a3d"],
    cold: ["Cold country drink", "#1d5c9e"], alcohol: ["Alcoholic country drink", "#7a2b8a"],
    hot: ["Hot drink", "#8a4a00"], dessert: ["Dessert", "#ae1800"]
  };
  var TAG_COLORS = {
    "Vegetarian": "#1f7a3d", "Halal-friendly": "#1d5c9e", "No pork": "#605d5d",
    "Contains pork": "#ae1800", "Alcohol-free": "#605d5d", "Contains alcohol": "#7a2b8a",
    "Contains nuts": "#8a4a00"
  };
  var R_KEYS = [["ALL", "All"], ["LEV", "Levant"], ["AEG", "Aegean"], ["IBL", "Iberia & Latin"], ["ADR", "Adriatic"], ["NAF", "N. Africa"]];
  var G_KEYS = [["ALL", "All"], ["Burgers", "Burgers"], ["Loaded fries", "Loaded fries"], ["Salads", "Salads"], ["Desserts", "Desserts"], ["Drinks", "Drinks"]];
  var D_KEYS = [["ALL", "All"], ["HAL", "Halal-friendly"], ["VEG", "Vegetarian"], ["NOPORK", "No pork"], ["AF", "Alcohol-free"], ["NUTFREE", "Nut-free"]];

  function eur(n) { return "€" + n.toFixed(2).replace(/\.00$/, ".0"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var state = { route: "ALL", group: "ALL", diet: "ALL" };

  function dietOk(diet, it) {
    if (diet === "ALL") return true;
    if (diet === "VEG") return it.tags.indexOf("Vegetarian") > -1;
    if (diet === "HAL") return it.tags.indexOf("Halal-friendly") > -1;
    if (diet === "NOPORK") return it.tags.indexOf("No pork") > -1;
    if (diet === "AF") return it.tags.indexOf("Alcohol-free") > -1;
    if (diet === "NUTFREE") return it.tags.indexOf("Contains nuts") === -1;
    return true;
  }

  function itemCard(i) {
    var kind = KINDS[i.kind] || [i.kind, "#605d5d"];
    var tagsHtml = i.tags.map(function (t) {
      return '<span style="padding:4px 7px;border:2px solid rgba(27,26,25,.28);color:' + (TAG_COLORS[t] || "#605d5d") + ';font:800 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.11em;text-transform:uppercase">' + esc(t) + '</span>';
    }).join("");
    return '<div style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;padding:18px 17px 20px;display:flex;flex-direction:column;gap:9px;min-height:186px">'
      + '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">'
      + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:' + kind[1] + '">' + esc(kind[0]) + '</span>'
      + '<span style="font:800 15px/1 \'Archivo\',sans-serif;letter-spacing:-.01em">' + eur(i.price) + '</span></div>'
      + '<h3 style="font:800 17px/1.12 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(i.name) + '</h3>'
      + '<p style="font:400 12.5px/1.45 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(i.desc) + '</p>'
      + '<div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:5px;padding-top:10px;border-top:2px solid rgba(27,26,25,.16)">' + tagsHtml + '</div>'
      + '</div>';
  }

  function filterGroup(label, keys, kindKey, current, activeBg, activeFg) {
    var btns = keys.map(function (k) {
      var isActive = current === k[0];
      var bg = isActive ? activeBg : "transparent";
      var fg = isActive ? activeFg : INK;
      return '<button type="button" data-filter="' + kindKey + '" data-value="' + k[0] + '" style="padding:9px 12px;background:' + bg + ';border:2px solid #1b1a19;color:' + fg + ';font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer">' + esc(k[1]) + '</button>';
    }).join("");
    return '<div style="display:flex;flex-wrap:wrap;gap:7px;align-items:center">'
      + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d7979">' + label + '</span>' + btns + '</div>';
  }

  function renderBoard() {
    var D = window.PP_DATA;
    var board = document.getElementById("mn-board");
    if (!D || !board) return;

    var countries = D.COUNTRIES
      .filter(function (c) { return state.route === "ALL" || c.routeKey === state.route; })
      .map(function (c) {
        var items = c.items.filter(function (i) { return (state.group === "ALL" || i.group === state.group) && dietOk(state.diet, i); });
        var r = D.ROUTES[c.routeKey];
        return { c: c, r: r, items: items };
      })
      .filter(function (x) { return x.items.length > 0; });

    var shown = countries.reduce(function (a, x) { return a + x.items.length; }, 0);
    var total = D.COUNTRIES.reduce(function (a, c) { return a + c.items.length; }, 0);

    var filterBar = '<div data-sticky-under-nav="1" style="position:sticky;top:136px;z-index:40;background:#f7f3ec;border-bottom:2px solid #1b1a19;padding:14px 44px;display:flex;flex-wrap:wrap;gap:14px;align-items:center">'
      + filterGroup("Route", R_KEYS, "route", state.route, INK, CREAM)
      + filterGroup("Course", G_KEYS, "group", state.group, RED, "#fff")
      + filterGroup("Diet", D_KEYS, "diet", state.diet, BLU, "#fff")
      + '<span style="margin-left:auto;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">' + shown + ' of ' + total + ' items shown</span>'
      + '</div>';

    var countriesHtml = countries.map(function (x) {
      var c = x.c, r = x.r;
      return '<div style="border-bottom:2px solid #1b1a19">'
        + '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:20px 44px;background:' + r.bg + ';color:' + r.fg + ';border-bottom:2px solid #1b1a19">'
        + '<span style="width:46px;height:46px;flex:none;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font:800 12px/1 \'Archivo\',sans-serif;transform:rotate(-9deg)">' + c.stamp + '</span>'
        + '<span style="flex:1;min-width:200px">'
        + '<span style="display:block;font:800 clamp(24px,2.6vw,36px)/1 \'Archivo\',sans-serif;letter-spacing:-.03em">' + esc(c.name.toUpperCase()) + '</span>'
        + '<span style="display:block;font:600 9.5px/1.5 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.75;margin-top:5px">' + esc(r.name) + ' Route · ' + esc(c.med) + '</span></span>'
        + '<span style="font:400 13px/1.4 \'Archivo\',sans-serif;max-width:46ch;opacity:.9">' + esc(c.greeting) + '</span>'
        + '<a href="destination.html#' + c.code + '" style="display:inline-flex;align-items:center;gap:9px;padding:11px 14px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.13em;text-transform:uppercase" data-hover="background:#ec3013">Country page<span>→</span></a>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));border-left:2px solid #1b1a19">'
        + x.items.map(itemCard).join("")
        + '</div></div>';
    }).join("");

    board.innerHTML = filterBar + countriesHtml;

    if (window.initHoverStyles) window.initHoverStyles(board);
  }

  function renderStatic() {
    var D = window.PP_DATA;
    if (!D) return;

    var total = D.COUNTRIES.reduce(function (a, c) { return a + c.items.length; }, 0);
    var countEl = document.getElementById("mn-item-count");
    if (countEl) countEl.textContent = String(total);

    var heroes = D.COUNTRIES.map(function (c) {
      var hero = c.items.find(function (i) { return i.kind === c.heroKind; }) || c.items[1];
      return { name: hero.name.toUpperCase(), price: eur(hero.price) };
    });
    var tickerRows = heroes.concat(heroes).map(function (t) {
      return '<div style="display:flex;align-items:center;gap:10px;padding:11px 22px;border-right:1px solid rgba(27,26,25,.3);white-space:nowrap;font:800 12px/1 \'Archivo\',sans-serif">' + esc(t.name) + '<span style="font:600 9px/1;letter-spacing:.14em;opacity:.62">' + t.price + '</span></div>';
    }).join("");
    var ticker = document.getElementById("mn-ticker");
    if (ticker) ticker.innerHTML = tickerRows;

    var combosEl = document.getElementById("mn-combos");
    if (combosEl) {
      combosEl.innerHTML = D.COMBOS.map(function (c, i) {
        var bg = c.group === "Full Experience" ? YEL : c.group === "Quick Bite" ? CREAM : "#fff";
        return '<div data-rv="up" data-rv-d="' + (i * 45) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + bg + ';color:' + INK + ';padding:18px 16px 20px;display:flex;flex-direction:column;gap:9px;min-height:165px">'
          + '<span style="font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase;opacity:.7">' + esc(c.group) + '</span>'
          + '<span style="font:800 18px/1.08 \'Archivo\',sans-serif;letter-spacing:-.02em">' + esc(c.name) + '</span>'
          + '<span style="font:400 12px/1.45 \'Archivo\',sans-serif;opacity:.85">' + esc(c.contents) + '</span>'
          + '<span style="margin-top:auto;font:800 24px/1 \'Archivo\',sans-serif;letter-spacing:-.03em">' + eur(c.price) + '</span></div>';
      }).join("");
    }

    var priceGridEl = document.getElementById("mn-price-grid");
    if (priceGridEl) {
      var rows = [
        ["Veg burger", D.PRICES.vegBurger], ["Chicken burger", D.PRICES.chickenBurger], ["Beef burger", D.PRICES.beefBurger],
        ["Regular fries", D.PRICES.regularFries], ["Loaded fries (country signature)", D.PRICES.loadedFries],
        ["Salad (country iconic)", D.PRICES.salad], ["Dessert", D.PRICES.dessert],
        ["Soft drink", D.PRICES.softDrink], ["Cold country drink", D.PRICES.coldDrink],
        ["Local beer", D.PRICES.localBeer], ["Alcoholic country drink", D.PRICES.alcoholDrink],
        ["Hot drink (coffee / tea)", D.PRICES.hotDrink]
      ];
      priceGridEl.innerHTML = rows.map(function (p) {
        return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding:12px 16px;border-bottom:1px solid rgba(27,26,25,.2)">'
          + '<span style="font:600 12.5px/1.3 \'Archivo\',sans-serif">' + esc(p[0]) + '</span>'
          + '<span style="font:800 15px/1 \'Archivo\',sans-serif;color:#ae1800">' + eur(p[1]) + '</span></div>';
      }).join("");
    }

    var upgradesEl = document.getElementById("mn-upgrades");
    if (upgradesEl) {
      upgradesEl.innerHTML = D.UPGRADES.map(function (u) {
        return '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(247,243,236,.22);font:400 12.5px/1.4 \'Archivo\',sans-serif">' + esc(u.name) + '<span style="font:800 13px/1 \'Archivo\',sans-serif;color:#f2b30c;white-space:nowrap">+' + eur(u.price) + '</span></div>';
      }).join("");
    }

    var minSpendEl = document.getElementById("mn-minspend");
    if (minSpendEl) minSpendEl.textContent = "Minimum spend €" + D.MIN_SPEND.adult + " per adult · €" + D.MIN_SPEND.child + " per child";
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
      Array.prototype.slice.call(document.querySelectorAll("[data-rv]")).forEach(function (n) {
        if (!n._ppInit) {
          n._ppInit = true;
          n.style.opacity = "0";
          n.style.transform = "translateY(26px)";
          n.style.transition = "opacity .7s cubic-bezier(.2,.8,.25,1), transform .8s cubic-bezier(.2,.85,.25,1)";
        }
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

  function boot() {
    renderStatic();
    renderBoard();
    initScrollReveal();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var board = document.getElementById("mn-board");
    if (board) {
      board.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        state[btn.getAttribute("data-filter")] = btn.getAttribute("data-value");
        renderBoard();
      });
    }
    if (window.PP_DATA) {
      boot();
    } else {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); boot(); } }, 60);
    }
  });
})();
