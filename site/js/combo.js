/* Patty Passport — shared "Make it a Combo" modal (js/menu.js and
   js/destination.js both open it for a burger item). Self-mounting like
   js/bag.js: builds its own root + injects the keyframes it needs, so no
   page markup has to carry a placeholder, and it survives client-side
   navigation via router.js's SHARED_SCRIPTS list. Combo tiers and prices
   come straight from window.PP_DATA.COMBOS/UPGRADES — nothing here is a
   second copy of a price. */
(function () {
  var INK = "#1b1a19", CREAM = "#f7f3ec", RED = "#ec3013";
  // Which two (or, for salad, one) named entries in window.PP_DATA.COMBOS
  // apply to each menu-item kind, and which "tier" slot each sits in. A
  // burger's two tiers are genuinely two different combos (Quick Bite vs
  // Full Buffet); fries only has one menu item today but two approved
  // combo prices (Regular €6 vs Loaded €7), so that same two-tier picker
  // doubles as "how much fries" instead of "how much food"; salad has
  // just the one approved combo, so only the "full" tier is offered.
  var TIER_COMBO_NAMES = {
    veg: { quick: "Veg Quick Bite", full: "Veg Full Buffet" },
    chicken: { quick: "Chicken Quick Bite", full: "Chicken Full Buffet" },
    beef: { quick: "Beef Quick Bite", full: "Beef Full Buffet" },
    fries: { quick: "Regular Fries Combo", full: "Loaded Fries Combo" },
    salad: { full: "Salad Combo" }
  };

  var state = { open: false, item: null, country: null, route: null, tier: "quick", drink: "soft", alcohol: false, hot: false };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function eur(n) { return "€" + Number(n).toFixed(2).replace(/\.00$/, ".0"); }

  function ensureStyle() {
    if (document.getElementById("pp-combo-style")) return;
    var s = document.createElement("style");
    s.id = "pp-combo-style";
    s.textContent = "@keyframes ppComboFade{from{opacity:0}to{opacity:1}}@keyframes ppComboLand{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}";
    document.head.appendChild(s);
  }

  function findCombo(tier) {
    var D = window.PP_DATA;
    if (!D || !state.item) return null;
    var names = TIER_COMBO_NAMES[state.item.kind];
    var name = names && names[tier];
    if (!name) return null;
    return D.COMBOS.filter(function (c) { return c.name === name; })[0] || null;
  }

  function total() {
    var combo = findCombo(state.tier);
    var t = combo ? combo.price : 0;
    if (state.alcohol) t += 2.5;
    if (state.hot) t += 2.0;
    return t;
  }

  function render() {
    var root = document.getElementById("pp-combo-modal-root");
    if (!root) return;
    if (!state.open || !state.item) { root.innerHTML = ""; return; }

    var quick = findCombo("quick"), full = findCombo("full");
    var tierBtn = function (key, combo) {
      if (!combo) return "";
      var on = state.tier === key;
      return '<button type="button" data-combo-tier="' + key + '" style="text-align:left;padding:14px 15px;background:' + (on ? INK : "#fff") + ';color:' + (on ? CREAM : INK) + ';border:2px solid #1b1a19;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="font:800 14px/1 \'Archivo\',sans-serif">' + esc(combo.name) + '</span><span style="font:800 15px/1 \'Archivo\',sans-serif">' + eur(combo.price) + '</span></div>'
        + '<div style="font:400 11.5px/1.4 \'Archivo\',sans-serif;opacity:.8;margin-top:5px">' + esc(combo.contents) + '</div></button>';
    };

    var drinkRadio = function (key, label) {
      var on = state.drink === key && !state.alcohol;
      return '<label style="display:flex;align-items:center;gap:8px;padding:9px 0;cursor:pointer' + (state.alcohol ? ";opacity:.4" : "") + '"><input type="radio" name="combo-drink" data-combo-drink="' + key + '" ' + (on ? "checked" : "") + (state.alcohol ? " disabled" : "") + ' style="width:16px;height:16px;accent-color:#ec3013"><span style="font:600 13px/1.3 \'Archivo\',sans-serif">' + esc(label) + ' <span style="opacity:.6;font-weight:400">(included)</span></span></label>';
    };

    var body = '<div style="padding:24px 22px 26px">'
      + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979;margin-bottom:6px">Make it a combo</div>'
      + '<h2 style="font:800 26px/1.05 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:0 0 4px">' + esc(state.item.name) + '</h2>'
      + '<div style="font:600 12px/1.4 \'Archivo\',sans-serif;color:#605d5d;margin-bottom:20px">' + esc(state.country ? state.country.name : "") + (state.route ? " · " + esc(state.route.name) + " route" : "") + '</div>'
      + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:10px">' + (quick && full ? "Choose your combo" : "This combo") + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">' + tierBtn("quick", quick) + tierBtn("full", full) + '</div>'
      + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#605d5d;margin-bottom:6px">Included drink</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:4px 22px;margin-bottom:14px">' + drinkRadio("soft", "Soft drink") + drinkRadio("cold", "Cold country drink") + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:2px;border-top:2px solid rgba(27,26,25,.16);padding-top:12px;margin-bottom:22px">'
      + '<label style="display:flex;align-items:center;gap:9px;padding:6px 0;cursor:pointer"><input type="checkbox" data-combo-alcohol ' + (state.alcohol ? "checked" : "") + ' style="width:16px;height:16px;accent-color:#ec3013"><span style="font:600 13px/1.3 \'Archivo\',sans-serif">Swap to the alcoholic country drink <span style="color:#ae1800">+€2.50</span></span></label>'
      + '<label style="display:flex;align-items:center;gap:9px;padding:6px 0;cursor:pointer"><input type="checkbox" data-combo-hot ' + (state.hot ? "checked" : "") + ' style="width:16px;height:16px;accent-color:#ec3013"><span style="font:600 13px/1.3 \'Archivo\',sans-serif">Add a hot drink <span style="color:#ae1800">+€2.00</span></span></label>'
      + '</div>'
      + '<button type="button" data-combo-add style="display:flex;align-items:center;width:100%;padding:16px 18px;background:#ec3013;border:0;color:#fff;font:800 14.5px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#1b1a19"><span>Add combo to bag</span><span style="margin-left:auto">' + eur(total()) + '</span></button>'
      + '<p style="font:400 10.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin:12px 0 0">Prices include VAT.</p>'
      + '</div>';

    root.innerHTML = '<div style="position:fixed;inset:0;z-index:150;display:flex;align-items:center;justify-content:center;padding:24px;animation:ppComboFade .2s ease both">'
      + '<div data-combo-close style="position:absolute;inset:0;background:rgba(27,26,25,.7)"></div>'
      + '<div style="position:relative;width:min(480px,100%);max-height:88vh;overflow-y:auto;background:#f7f3ec;border:2px solid #1b1a19;box-shadow:18px 18px 0 rgba(27,26,25,.4);animation:ppComboLand .3s cubic-bezier(.2,.85,.25,1) both">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#1b1a19;color:#f7f3ec;position:sticky;top:0">'
      + '<span style="display:flex;align-items:center;gap:9px;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase"><span style="width:7px;height:7px;background:#f2b30c;animation:ppNavBlink 1.3s steps(1) infinite"></span>Combo builder</span>'
      + '<button type="button" data-combo-close style="background:transparent;border:2px solid rgba(247,243,236,.5);color:#f7f3ec;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;padding:8px 11px;cursor:pointer" data-hover="background:#ec3013;border-color:#ec3013">CLOSE ✕</button>'
      + '</div>' + body + '</div></div>';

    if (window.initHoverStyles) window.initHoverStyles(root);
  }

  function openFor(item, country, route) {
    var tiers = TIER_COMBO_NAMES[item.kind];
    if (!tiers) return;
    state.open = true; state.item = item; state.country = country || null; state.route = route || null;
    state.tier = tiers.quick ? "quick" : "full"; state.drink = "soft"; state.alcohol = false; state.hot = false;
    render();
  }
  function close() { state.open = false; render(); }

  function onClick(e) {
    var openBtn = e.target.closest("[data-combo-open]");
    if (openBtn) {
      var item = { name: openBtn.getAttribute("data-combo-open"), kind: openBtn.getAttribute("data-combo-kind"), price: parseFloat(openBtn.getAttribute("data-combo-price")) || 0 };
      var country = openBtn.getAttribute("data-combo-country") ? { code: openBtn.getAttribute("data-combo-country"), name: openBtn.getAttribute("data-combo-country-name") } : null;
      var route = openBtn.getAttribute("data-combo-route") ? { name: openBtn.getAttribute("data-combo-route") } : null;
      openFor(item, country, route);
      return;
    }
    if (e.target.closest("[data-combo-close]")) { close(); return; }
    var tierBtn = e.target.closest("[data-combo-tier]");
    if (tierBtn) { state.tier = tierBtn.getAttribute("data-combo-tier"); render(); return; }
    var addBtn = e.target.closest("[data-combo-add]");
    if (addBtn) {
      var combo = findCombo(state.tier);
      if (!combo) return;
      var drinkLabel = state.alcohol ? "Alcoholic upgrade" : (state.drink === "cold" ? "Cold drink" : "Soft drink");
      var metaBits = [combo.group === "Quick Bite" ? "Quick Bite" : "Full Experience", drinkLabel];
      if (state.hot) metaBits.push("+ Hot drink");
      window.PP_BAG.add({
        kind: "combo",
        name: state.item.name + " — " + (state.tier === "quick" ? "Quick Bite" : "Full Experience"),
        price: total(),
        countryCode: state.country ? state.country.code : "",
        countryName: state.country ? state.country.name : "",
        routeName: state.route ? state.route.name : "",
        meta: metaBits.join(" · ")
      });
      close();
    }
  }

  function onChange(e) {
    if (e.target.matches("[data-combo-drink]")) { state.drink = e.target.getAttribute("data-combo-drink"); render(); }
    if (e.target.matches("[data-combo-alcohol]")) { state.alcohol = e.target.checked; render(); }
    if (e.target.matches("[data-combo-hot]")) { state.hot = e.target.checked; render(); }
  }

  function mount() {
    if (document.getElementById("pp-combo-modal-root")) return;
    ensureStyle();
    var root = document.createElement("div");
    root.id = "pp-combo-modal-root";
    document.body.appendChild(root);
    document.body.addEventListener("click", onClick);
    document.body.addEventListener("change", onChange);
    window.addEventListener("keydown", function (e) { if (e.key === "Escape" && state.open) close(); });
  }

  window.PP_READY(function () { mount(); });
})();
