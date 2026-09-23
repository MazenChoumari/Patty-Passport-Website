/* Patty Passport — Junior Explorers page, ported from
   Junior-Explorers.dc.html's x-dc template + Component logic. Entirely
   static content (no interactive state) — same as the prototype, which had
   no setState calls in this file. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var KIT = [
    ["JUNIOR PASSPORT", "3%", "2%", "206px", CREAM, INK, "-5deg", "10s", "0s", "118px", "Junior passport cover in a child's hands", "14px 14px 0 rgba(27,26,25,.3)"],
    ["ROUTE BOOKLET", "46%", "14%", "220px", "#fff", INK, "4deg", "12s", ".8s", "136px", "Open route booklet, one page per route", "-12px 14px 0 rgba(27,26,25,.28)"],
    ["FLAG STICKERS", "7%", "44%", "194px", BLU, "#fff", "6deg", "11s", ".4s", "114px", "Sheet of 21 flag stickers, half peeled", "12px 12px 0 rgba(27,26,25,.3)"],
    ["EXPLORER TOTE", "50%", "56%", "186px", RED, "#fff", "-7deg", "13s", "1.2s", "108px", "Kids explorer tote bag with contents", "-12px 12px 0 rgba(27,26,25,.3)"],
    ["POSTCARD HOME", "22%", "76%", "202px", "#e7e3dc", INK, "2deg", "9s", ".2s", "90px", "Stamped destination postcard on the table", "12px 12px 0 rgba(27,26,25,.25)"]
  ].map(function (k, i) {
    return { label: k[0], x: k[1], y: k[2], w: k[3], bg: k[4], fg: k[5], r: k[6], dur: k[7], delay: k[8], h: k[9], note: k[10], shadow: k[11], slotId: "jr-kit-" + i };
  });

  var KIT_ITEMS = [
    ["passportJunior", "Junior Passport", "A real book with twenty-one pages and sticker stamps instead of ink — theirs to keep and fill.", CREAM, INK],
    ["booklet", "Route booklet", "One spread per route: the map, the flag, the word to learn and a puzzle to finish before food lands.", YEL, INK],
    ["flagSticker", "Flag sticker sheet", "Twenty-one flags. One goes in the book each visit; the rest end up on school folders.", BLU, "#fff"],
    ["postcard", "Postcard home", "Written at the table, stamped by the crew, posted by us if they want it sent.", RED, "#fff"],
    ["wordBubble", "Word of the destination", "One phrase in the local language, printed big. Saying it out loud earns the stamp.", CREAM, INK],
    ["tote", "Explorer tote", "For birthdays and school journeys — the whole kit in a bag they carry out themselves.", "#e7e3dc", INK]
  ].map(function (k, i) { return { icon: k[0], title: k[1], line: k[2], bg: k[3], fg: k[4], delay: String(i * 65) }; });

  var ROUTE_ORDER = ["LEV", "AEG", "IBL", "ADR", "NAF"];

  var LEARNING = [
    ["21", "Where countries actually are", "The route map is a real map. By the fourth stamp they can point at the Adriatic.", YEL, INK],
    ["AB", "Words in other languages", "One phrase per destination, said out loud at the table to earn the stamp.", RED, "#fff"],
    ["FL", "Flags and what they mean", "The cedar, the crescent, the double eagle — every sticker comes with its one-line story.", BLU, "#fff"],
    ["FD", "That food comes from somewhere", "Harissa is Tunisian. Halloumi is Cypriot. Nothing on the menu is from nowhere.", INK, CREAM],
    ["TR", "How to try something new", "A stamp is a small reason to be brave about an unfamiliar plate.", YEL, INK]
  ].map(function (l, i) { return { mark: l[0], title: l[1], line: l[2], bg: l[3], fg: l[4], delay: String(i * 70) }; });

  var PARENTS = [
    ["Allergy-aware", "Fourteen allergens mapped per dish and printed on the junior boarding pass.", "#ae1800"],
    ["Low-spice by default", "Junior lane plates are built mild; heat arrives on the side, never in the patty.", INK],
    ["High chairs & space", "Buggy parking at the gate, high chairs at every zone, changing table by the desk.", "#ae1800"],
    ["Alcohol-free bar list", "A full list of coolers and mocktails so the whole table drinks the destination.", INK]
  ].map(function (p, i) { return { label: p[0], line: p[1], color: p[2], delay: String(i * 70) }; });

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function renderKit() {
    document.getElementById("jr-kit").innerHTML = KIT.map(function (k) {
      return '<div style="position:absolute;left:' + k.x + ';top:' + k.y + ';width:' + k.w + ';background:' + k.bg + ';color:' + k.fg + ';border:2px solid #1b1a19;box-shadow:' + k.shadow + ';transform:rotate(' + k.r + ');--r:' + k.r + ';animation:ppDrift ' + k.dur + ' ease-in-out ' + k.delay + ' infinite;padding:12px">'
        + '<div style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:9px">' + k.label + '</div>'
        + '<div style="position:relative;height:' + k.h + '">'
        + '<div class="pp-placeholder" id="' + k.slotId + '" style="position:absolute;inset:0"><span>' + esc(k.note) + '</span></div>'
        + '</div></div>';
    }).join("");
  }

  function renderKitItems() {
    document.getElementById("jr-kit-items").innerHTML = KIT_ITEMS.map(function (k) {
      return '<div data-rv="up" data-rv-d="' + k.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:' + k.bg + ';color:' + k.fg + ';padding:22px 20px 24px;display:flex;flex-direction:column;gap:11px;min-height:210px">'
        + '<span style="width:44px;height:44px;border:2px solid currentColor;display:flex;align-items:center;justify-content:center">' + (window.PP_ICON ? window.PP_ICON(k.icon, 24, "currentColor") : "") + '</span>'
        + '<h3 style="font:800 20px/1.05 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(k.title) + '</h3>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.85">' + esc(k.line) + '</p></div>';
    }).join("");
  }

  var KIND_LABEL = { beef: "BEEF", chicken: "CHICKEN", veg: "VEGETARIAN" };
  var KIND_COLOR = { beef: RED, chicken: YEL, veg: "#2f8f4e" };

  function eur(n) { return "€" + n.toFixed(2).replace(/\.00$/, ".00"); }

  // Which burger/side/dessert is currently picked per route — defaults to
  // the first option of each so "Add to bag" always has a valid combo,
  // and clicking a card genuinely changes the selection (fixes the cards
  // being inert/non-clickable).
  var kidsPick = {};
  ROUTE_ORDER.forEach(function (key) { kidsPick[key] = { burger: 0, side: 0, dessert: 0 }; });

  function pickCard(selected, inner, extraStyle) {
    return '<div style="border:2px solid ' + (selected ? "#1b1a19" : "rgba(27,26,25,.18)") + ';background:' + (selected ? "rgba(242,179,12,.16)" : "#fff") + ';padding:12px 13px;display:flex;flex-direction:column;gap:6px;cursor:pointer;position:relative' + (extraStyle || "") + '" tabindex="0" role="button" aria-pressed="' + selected + '">'
      + (selected ? '<span style="position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;background:#1b1a19;color:#fff;display:flex;align-items:center;justify-content:center;font:800 11px/1 \'Archivo\',sans-serif">✓</span>' : "")
      + inner + '</div>';
  }

  function renderKidsMenu() {
    var el = document.getElementById("jr-routes");
    if (!el) return;
    var data = window.PP_DATA;
    if (!data || !data.KIDS_MENU) {
      if (!window.__jrPoll) window.__jrPoll = setInterval(function () { if (window.PP_DATA && window.PP_DATA.KIDS_MENU) { clearInterval(window.__jrPoll); renderKidsMenu(); } }, 60);
      return;
    }
    var price = data.KIDS_COMBO_PRICE;
    el.innerHTML = ROUTE_ORDER.map(function (key, i) {
      var route = data.ROUTES[key];
      var km = data.KIDS_MENU[key];
      var pick = kidsPick[key];
      var burgerCards = km.burgers.map(function (b, bi) {
        var inner = '<span style="display:inline-flex;align-self:flex-start;padding:3px 7px;background:' + KIND_COLOR[b.kind] + ';color:' + (b.kind === "chicken" ? INK : "#fff") + ';font:800 8.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em">' + KIND_LABEL[b.kind] + '</span>'
          + '<strong style="font:800 13.5px/1.2 \'Archivo\',sans-serif">' + esc(b.name) + '</strong>'
          + '<span style="font:400 11.5px/1.4 \'Archivo\',sans-serif;color:#605d5d">' + esc(b.line) + '</span>';
        return '<div data-kid-pick="' + key + '|burger|' + bi + '">' + pickCard(pick.burger === bi, inner) + '</div>';
      }).join("");
      var sideCards = km.sides.map(function (s, si) {
        var inner = '<strong style="display:block;font:800 12.5px/1.2 \'Archivo\',sans-serif">' + esc(s.name) + '</strong>'
          + '<span style="font:400 11px/1.4 \'Archivo\',sans-serif;color:#605d5d">' + esc(s.line) + '</span>';
        return '<div data-kid-pick="' + key + '|side|' + si + '">' + pickCard(pick.side === si, inner) + '</div>';
      }).join("");
      var dessertCards = km.desserts.map(function (d, di) {
        var inner = '<strong style="display:block;font:800 12.5px/1.2 \'Archivo\',sans-serif">' + esc(d.name) + '</strong>'
          + '<span style="font:400 11px/1.4 \'Archivo\',sans-serif;color:#605d5d">' + esc(d.line) + '</span>';
        return '<div data-kid-pick="' + key + '|dessert|' + di + '">' + pickCard(pick.dessert === di, inner) + '</div>';
      }).join("");
      var chosenBurger = km.burgers[pick.burger], chosenSide = km.sides[pick.side], chosenDessert = km.desserts[pick.dessert];
      var meta = chosenBurger.name + " · " + chosenSide.name + " · " + km.drink.name + " · " + chosenDessert.name;
      return '<div data-rv="up" data-rv-d="' + (i * 70) + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;color:#1b1a19;display:flex;flex-direction:column">'
        + '<div style="padding:16px 18px;background:' + route.bg + ';color:' + route.fg + ';display:flex;align-items:center;justify-content:space-between;gap:10px">'
        + '<h3 style="font:800 20px/1.05 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(route.name.toUpperCase()) + '</h3>'
        + '<span style="font:800 15px/1 \'Archivo\',sans-serif">' + eur(price) + '</span></div>'
        + '<div style="padding:16px 18px 20px;display:flex;flex-direction:column;gap:14px">'
        + '<div style="font:600 9.5px/1.5 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#605d5d">Kids Route Combo — ' + eur(price) + ' · tap to pick a burger, a side and a dessert</div>'
        + '<div><span style="display:block;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ae1800;margin-bottom:8px">Choose a burger</span>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">' + burgerCards + '</div></div>'
        + '<div><span style="display:block;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ae1800;margin-bottom:8px">Choose a side</span>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">' + sideCards + '</div></div>'
        + '<div><span style="display:block;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ae1800;margin-bottom:8px">Drink (included)</span>'
        + '<div style="border:2px solid rgba(27,26,25,.18);padding:10px 12px"><strong style="display:block;font:800 12.5px/1.2 \'Archivo\',sans-serif">' + esc(km.drink.name) + '</strong><span style="font:400 11px/1.4 \'Archivo\',sans-serif;color:#605d5d">' + esc(km.drink.line) + '</span></div></div>'
        + '<div><span style="display:block;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ae1800;margin-bottom:8px">Choose a dessert</span>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">' + dessertCards + '</div></div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:7px;padding-top:6px;border-top:2px solid rgba(27,26,25,.18)">'
        + '<span style="padding:4px 8px;border:1px solid #2f8f4e;color:#2f8f4e;font:700 9px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">Vegetarian option available</span>'
        + '<span style="padding:4px 8px;border:1px solid #1b1a19;font:700 9px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">No alcohol on this menu</span>'
        + '<span style="padding:4px 8px;border:1px solid #ae1800;color:#ae1800;font:700 9px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">Full allergen list at the desk</span>'
        + '</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px">'
        + '<button type="button" data-bag-add data-bag-kind="kids" data-bag-name="Junior ' + esc(route.name) + ' Combo" data-bag-price="' + price + '" data-bag-country-name="' + esc(route.name) + ' route" data-bag-route="' + esc(route.name) + '" data-bag-meta="' + esc(meta) + '" style="flex:1 1 200px;display:inline-flex;align-items:center;justify-content:space-between;padding:12px 15px;background:#f2b30c;color:#1b1a19;border:0;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer" data-hover="background:#1b1a19;color:#f7f3ec">+ Add this combo to bag<span>→</span></button>'
        + '<a href="events.html" style="flex:1 1 160px;display:inline-flex;align-items:center;justify-content:space-between;padding:12px 15px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase" data-hover="background:#ec3013">Book this route<span>→</span></a>'
        + '</div>'
        + '</div></div>';
    }).join("");
    if (window.initHoverStyles) window.initHoverStyles(el);
    if (window.PP_REVEAL) window.PP_REVEAL.init(el);
  }

  function renderLearning() {
    document.getElementById("jr-learning").innerHTML = LEARNING.map(function (l) {
      return '<div data-rv="up" data-rv-d="' + l.delay + '" style="display:flex;gap:16px;padding:16px 0;border-bottom:2px solid rgba(27,26,25,.2)">'
        + '<span style="width:44px;height:44px;flex:none;background:' + l.bg + ';color:' + l.fg + ';display:flex;align-items:center;justify-content:center;font:800 13px/1 \'Archivo\',sans-serif">' + l.mark + '</span>'
        + '<span style="flex:1"><span style="display:block;font:800 16px/1.2 \'Archivo\',sans-serif;margin-bottom:4px">' + esc(l.title) + '</span>'
        + '<span style="display:block;font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d">' + esc(l.line) + '</span></span></div>';
    }).join("");
  }

  function renderParents() {
    document.getElementById("jr-parents").innerHTML = PARENTS.map(function (p) {
      return '<div data-rv="up" data-rv-d="' + p.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;padding:20px 18px 22px;display:flex;flex-direction:column;gap:10px;min-height:180px">'
        + '<span style="font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:' + p.color + '">' + esc(p.label) + '</span>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(p.line) + '</p></div>';
    }).join("");
  }

  function applyPick(spec) {
    var parts = spec.split("|");
    kidsPick[parts[0]][parts[1]] = parseInt(parts[2], 10);
    renderKidsMenu();
    if (window.initHoverStyles) window.initHoverStyles(document.getElementById("jr-routes"));
  }

  function initKidsPicker() {
    function onClick(e) {
      var card = e.target.closest("[data-kid-pick]");
      if (!card) return;
      applyPick(card.getAttribute("data-kid-pick"));
    }
    function onKeydown(e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest("[data-kid-pick]");
      if (!card) return;
      e.preventDefault();
      applyPick(card.getAttribute("data-kid-pick"));
    }
    document.body.addEventListener("click", onClick);
    document.body.addEventListener("keydown", onKeydown);
    if (window.PP_TRACK) window.PP_TRACK(function () {
      document.body.removeEventListener("click", onClick);
      document.body.removeEventListener("keydown", onKeydown);
    });
  }

  window.PP_READY(function () {
    renderKit();
    renderKitItems();
    renderKidsMenu();
    renderLearning();
    renderParents();
    initKidsPicker();
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  });
})();
