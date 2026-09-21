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
    ["JR", "Junior Passport", "A real book with twenty-one pages and sticker stamps instead of ink — theirs to keep and fill.", CREAM, INK],
    ["RB", "Route booklet", "One spread per route: the map, the flag, the word to learn and a puzzle to finish before food lands.", YEL, INK],
    ["FS", "Flag sticker sheet", "Twenty-one flags. One goes in the book each visit; the rest end up on school folders.", BLU, "#fff"],
    ["PC", "Postcard home", "Written at the table, stamped by the crew, posted by us if they want it sent.", RED, "#fff"],
    ["WD", "Word of the destination", "One phrase in the local language, printed big. Saying it out loud earns the stamp.", CREAM, INK],
    ["TT", "Explorer tote", "For birthdays and school journeys — the whole kit in a bag they carry out themselves.", "#e7e3dc", INK]
  ].map(function (k, i) { return { mark: k[0], title: k[1], line: k[2], bg: k[3], fg: k[4], delay: String(i * 65) }; });

  var ROUTES = [
    ["grc", "GREECE", "Souvlaki, lemon and fries in the bun. No spice, no surprises, nothing green hidden in it.", "Junior souvlaki", YEL, INK, "Kids-sized souvlaki plate"],
    ["ita", "ITALY", "Tomato, basil and cheese — the safest landing on the whole map, and still a real country.", "Mini parmigiana", CREAM, INK, "Kid-sized parmigiana burger"],
    ["lbn", "LEBANON", "Grilled chicken, soft bread, garlic dialled right down for smaller travellers.", "Mini tawouk wrap", RED, "#fff", "Mini chicken tawouk wrap"],
    ["esp", "SPAIN", "Mild beef, sweet pepper, manchego — plus patatas to share across the table.", "Junior Iberian", BLU, "#fff", "Kids Iberian burger with patatas"]
  ].map(function (r, i) {
    return {
      name: r[1], line: r[2], dish: r[3], bg: r[4], fg: r[5],
      tag: "JUNIOR LANE", href: "destination.html#" + r[0],
      slotId: "jr-rt-" + r[0], slot: r[6], delay: String(i * 70)
    };
  });

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
        + '<span style="width:44px;height:44px;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.04em">' + k.mark + '</span>'
        + '<h3 style="font:800 20px/1.05 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0">' + esc(k.title) + '</h3>'
        + '<p style="font:400 13px/1.5 \'Archivo\',sans-serif;margin:0;opacity:.85">' + esc(k.line) + '</p></div>';
    }).join("");
  }

  function renderRoutes() {
    document.getElementById("jr-routes").innerHTML = ROUTES.map(function (r) {
      return '<a href="' + r.href + '" data-rv="up" data-rv-d="' + r.delay + '" style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;background:#f7f3ec;color:#1b1a19;text-decoration:none;display:flex;flex-direction:column">'
        + '<div style="position:relative;height:180px;border-bottom:2px solid #1b1a19">'
        + '<div class="pp-placeholder" id="' + r.slotId + '" style="position:absolute;inset:0"><span>' + esc(r.slot) + '</span></div>'
        + '<span style="position:absolute;left:0;top:0;padding:6px 10px;background:' + r.bg + ';color:' + r.fg + ';font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;pointer-events:none">' + r.tag + '</span></div>'
        + '<div style="padding:18px 17px 20px;display:flex;flex-direction:column;gap:9px;flex:1">'
        + '<h3 style="font:800 21px/1.02 \'Archivo\',sans-serif;letter-spacing:-.025em;margin:0">' + esc(r.name) + '</h3>'
        + '<p style="font:400 12.5px/1.5 \'Archivo\',sans-serif;color:#605d5d;margin:0">' + esc(r.line) + '</p>'
        + '<span style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding-top:11px;border-top:2px solid rgba(27,26,25,.18);font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase">' + esc(r.dish) + '<span>→</span></span></div></a>';
    }).join("");
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

  window.PP_READY(function () {
    renderKit();
    renderKitItems();
    renderRoutes();
    renderLearning();
    renderParents();
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  });
})();
