/* Patty Passport — traveling bag (front-end only, session state).
   Self-mounting like js/patty-tooty-widget.js: no placeholder div needed,
   builds its own fixed icon + slide-out panel once and stays alive across
   every client-side page change (this file is in router.js's
   SHARED_SCRIPTS, so it is never re-injected/re-run on navigation — the
   bag's contents persist for the whole visit and are lost on a real
   refresh, which the panel says outright).

   Integration contract for other page scripts: render a button with
   data-bag-add plus data-bag-kind/name/price/country/country-name/route/
   meta, and this file's single delegated click listener adds it — no
   other script needs to call window.PP_BAG directly. Composed items (the
   Junior Explorers kids combo, where a burger/side/dessert are chosen
   first) call window.PP_BAG.add(...) directly instead, since the picked
   items aren't known until the guest has clicked. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";
  var items = [];
  var open = false;

  function eur(n) { return "€" + Number(n).toFixed(2).replace(/\.00$/, ".0"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function uid() { return "b" + Math.random().toString(36).slice(2, 9); }

  function add(entry) {
    var existing = items.filter(function (x) {
      return x.kind === entry.kind && x.name === entry.name && x.countryCode === entry.countryCode && x.meta === entry.meta;
    })[0];
    if (existing) { existing.qty += 1; } else {
      entry.id = uid(); entry.qty = 1; items.push(entry);
    }
    open = true;
    render();
  }
  function removeItem(id) { items = items.filter(function (x) { return x.id !== id; }); render(); }
  function setQty(id, qty) {
    var it = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === id) it = items[i]; }
    if (!it) return;
    if (qty <= 0) return removeItem(id);
    it.qty = qty;
    render();
  }
  function count() { return items.reduce(function (a, x) { return a + x.qty; }, 0); }
  function total() { return items.reduce(function (a, x) { return a + x.qty * x.price; }, 0); }
  function clearAll() { items = []; render(); }

  function groupByCountry() {
    var groups = [], byKey = {};
    items.forEach(function (it) {
      var key = (it.countryName || "Other") + "|" + it.routeName;
      if (!byKey[key]) { byKey[key] = { countryName: it.countryName, routeName: it.routeName, items: [] }; groups.push(byKey[key]); }
      byKey[key].items.push(it);
    });
    return groups;
  }

  function renderIcon() {
    var root = document.getElementById("pp-bag-root");
    if (!root) return;
    var c = count();
    root.innerHTML = '<button type="button" id="pp-bag-toggle" aria-label="' + (open ? "Close" : "Open") + ' your bag, ' + c + ' item' + (c === 1 ? "" : "s") + '" style="position:relative;width:54px;height:54px;border-radius:50%;background:' + INK + ';border:2px solid ' + CREAM + ';color:' + CREAM + ';display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.32)">'
      + '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z" stroke="' + CREAM + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="' + CREAM + '" stroke-width="1.8" stroke-linecap="round"/></svg>'
      + (c > 0 ? '<span style="position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:' + RED + ';color:#fff;font:800 11px/20px \'Archivo\',sans-serif;text-align:center">' + c + '</span>' : "")
      + '</button>';
  }

  function ticketCard(it) {
    var kidsTag = it.kind === "kids" ? '<span style="padding:3px 7px;background:' + YEL + ';color:' + INK + ';font:800 8px/1 \'Archivo\',sans-serif;letter-spacing:.1em;text-transform:uppercase">Junior ticket</span>' : "";
    return '<div style="border:2px solid ' + (it.kind === "kids" ? YEL : INK) + ';background:#fff;padding:13px 14px;display:flex;flex-direction:column;gap:6px;margin-bottom:10px">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      + '<div><div style="font:800 14px/1.2 \'Archivo\',sans-serif">' + esc(it.name) + '</div>'
      + (it.meta ? '<div style="font:400 11px/1.4 \'Archivo\',sans-serif;color:#605d5d;margin-top:2px">' + esc(it.meta) + '</div>' : "")
      + '</div>'
      + '<button type="button" data-bag-remove="' + it.id + '" aria-label="Remove ' + esc(it.name) + '" style="flex:none;width:22px;height:22px;border:1px solid rgba(27,26,25,.3);background:transparent;color:#605d5d;cursor:pointer;font:600 12px/1 \'Archivo\',sans-serif">✕</button>'
      + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:6px;border-top:1px dashed rgba(27,26,25,.3)">'
      + kidsTag
      + '<div style="margin-left:auto;display:flex;align-items:center;gap:8px">'
      + '<button type="button" data-bag-qty="' + it.id + '" data-bag-delta="-1" style="width:22px;height:22px;border:1px solid #1b1a19;background:#fff;cursor:pointer;font:800 12px/1 \'Archivo\',sans-serif">−</button>'
      + '<span style="min-width:16px;text-align:center;font:800 12px/1 \'Archivo\',sans-serif">' + it.qty + '</span>'
      + '<button type="button" data-bag-qty="' + it.id + '" data-bag-delta="1" style="width:22px;height:22px;border:1px solid #1b1a19;background:#fff;cursor:pointer;font:800 12px/1 \'Archivo\',sans-serif">+</button>'
      + '</div>'
      + '<span style="font:800 13px/1 \'Archivo\',sans-serif">' + eur(it.price * it.qty) + '</span>'
      + '</div></div>';
  }

  function renderPanel() {
    var root = document.getElementById("pp-bag-panel-root");
    if (!root) return;
    if (!open) { root.innerHTML = ""; return; }
    var groups = groupByCountry();
    var body = items.length
      ? groups.map(function (g) {
          return '<div style="margin-bottom:18px">'
            + '<div style="font:800 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ae1800;margin-bottom:9px">' + esc(g.countryName) + (g.routeName ? ' · ' + esc(g.routeName) : "") + '</div>'
            + g.items.map(ticketCard).join("")
            + '</div>';
        }).join("")
      : '<div style="padding:30px 0;text-align:center;font:600 13px/1.5 \'Archivo\',sans-serif;color:#7d7979">Your bag is empty.<br>Add a dish from any destination, the menu or the Junior Explorers page.</div>';

    root.innerHTML = '<div style="position:fixed;inset:0;z-index:198;display:flex;justify-content:flex-end">'
      + '<div data-bag-close style="position:absolute;inset:0;background:rgba(27,26,25,.6)"></div>'
      + '<div role="dialog" aria-label="Your bag" style="position:relative;width:min(400px,100%);height:100%;background:#f7f3ec;border-left:2px solid #1b1a19;display:flex;flex-direction:column;overflow:hidden">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:#1b1a19;color:#f7f3ec">'
      + '<span style="font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase">Your bag · ' + count() + '</span>'
      + '<button type="button" data-bag-close style="background:transparent;border:2px solid rgba(247,243,236,.5);color:#f7f3ec;font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.12em;padding:7px 10px;cursor:pointer">CLOSE ✕</button>'
      + '</div>'
      + '<div style="flex:1;overflow-y:auto;padding:18px">' + body + '</div>'
      + '<div style="padding:16px 18px 20px;border-top:2px solid #1b1a19;background:#fff">'
      + '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px"><span style="font:600 10px/1 \'Archivo\',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#605d5d">Total</span><span style="font:800 22px/1 \'Archivo\',sans-serif;letter-spacing:-.02em">' + eur(total()) + '</span></div>'
      + '<div style="font:600 10.5px/1.5 \'Archivo\',sans-serif;color:#ae1800;margin-bottom:12px">Delivery is currently unavailable — dine-in only, confirmed at the desk or by booking a table.</div>'
      + '<a href="booking.html" style="display:flex;align-items:center;width:100%;padding:14px 16px;background:#ec3013;color:#fff;text-decoration:none;font:800 13px/1.1 \'Archivo\',sans-serif;margin-bottom:8px" data-hover="background:#1b1a19">Book a table for this order<span style="margin-left:auto">→</span></a>'
      + (items.length ? '<button type="button" data-bag-clear style="width:100%;padding:10px;background:transparent;border:2px solid rgba(27,26,25,.25);color:#605d5d;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.08em;cursor:pointer">Clear bag</button>' : "")
      + '<div style="font:400 10.5px/1.5 \'Archivo\',sans-serif;color:#7d7979;margin-top:10px">This is a front-end preview for this visit only — it is not a live order and won’t be saved after you refresh or leave the site.</div>'
      + '</div></div></div>';
  }

  function render() { renderIcon(); renderPanel(); }

  function onClick(e) {
    var addBtn = e.target.closest("[data-bag-add]");
    if (addBtn) {
      var price = parseFloat(addBtn.getAttribute("data-bag-price")) || 0;
      add({
        kind: addBtn.getAttribute("data-bag-kind") || "adult",
        name: addBtn.getAttribute("data-bag-name") || "Item",
        price: price,
        countryCode: addBtn.getAttribute("data-bag-country") || "",
        countryName: addBtn.getAttribute("data-bag-country-name") || "",
        routeName: addBtn.getAttribute("data-bag-route") || "",
        meta: addBtn.getAttribute("data-bag-meta") || ""
      });
      return;
    }
    var toggle = e.target.closest("#pp-bag-toggle");
    if (toggle) { open = !open; render(); return; }
    var close = e.target.closest("[data-bag-close]");
    if (close) { open = false; render(); return; }
    var clearBtn = e.target.closest("[data-bag-clear]");
    if (clearBtn) { clearAll(); return; }
    var rmBtn = e.target.closest("[data-bag-remove]");
    if (rmBtn) { removeItem(rmBtn.getAttribute("data-bag-remove")); return; }
    var qtyBtn = e.target.closest("[data-bag-qty]");
    if (qtyBtn) {
      var id = qtyBtn.getAttribute("data-bag-qty"), delta = parseInt(qtyBtn.getAttribute("data-bag-delta"), 10);
      var current = 0;
      for (var i = 0; i < items.length; i++) { if (items[i].id === id) current = items[i].qty; }
      setQty(id, current + delta);
    }
  }
  function onKeydown(e) { if (e.key === "Escape" && open) { open = false; render(); } }

  function mount() {
    if (document.getElementById("pp-bag-root")) return;
    var iconRoot = document.createElement("div");
    iconRoot.id = "pp-bag-root";
    iconRoot.style.cssText = "position:fixed;left:18px;bottom:18px;z-index:199;";
    document.body.appendChild(iconRoot);
    var panelRoot = document.createElement("div");
    panelRoot.id = "pp-bag-panel-root";
    document.body.appendChild(panelRoot);
    document.body.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeydown);
    render();
  }

  window.PP_BAG = {
    add: add, remove: removeItem, setQty: setQty, clear: clearAll,
    count: count, total: total,
    items: function () { return items.slice(); }
  };

  window.PP_READY(function () { mount(); });
})();
