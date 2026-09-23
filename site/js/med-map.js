/* Patty Passport — shared Mediterranean map: node positions AND node
   rendering, the single source of truth used identically by the home
   page and the route-map page so the two can never drift apart. No
   illustrated background here on purpose — both pages currently show a
   plain placeholder box behind these nodes until a real map image is
   supplied; this file owns the node layout and markup.

   Geographic pin vs. label: a node's PIN position (POS below) is always
   the country's real map position and never moves. A small number of
   countries sit close enough to a neighbour that their NAME label would
   otherwise collide with it — for those, LABEL_OFFSET displaces just the
   text (not the pin) by a delta in the same 0–100 percentage space, and
   a thin dashed leader line is drawn from the pin to the displaced label
   so the connection stays legible. Everything here is expressed as plain
   percentages of the map box, so it scales with any container size —
   but because the map boxes on both pages use a fixed pixel height
   across all viewport widths while their width shrinks on narrow
   screens, a percentage offset's horizontal reach shrinks much faster
   than its vertical reach on mobile. LABEL_OFFSET therefore carries a
   separate `mobile` delta that leans on vertical separation instead of
   horizontal, plus an optional `abbrevMobile` shorter label so a long
   country name doesn't overrun the narrower box. */
(function () {
  var POS = {
    esp: [11, 44], mar: [9, 56], dza: [22, 61], fra: [27, 16],
    mco: [35, 26], ita: [40, 36], tun: [37, 61], mlt: [46, 56],
    svn: [40, 8], hrv: [48, 16], bih: [30, 34], mne: [52, 28],
    alb: [42, 46], lby: [54, 72], grc: [56, 42], tur: [65, 27],
    cyp: [66, 48], egy: [70, 74], lbn: [80, 52], syr: [76, 40],
    pse: [73, 64]
  };

  // Bosnia's pin sits close to Italy/Monaco (and, with its long name,
  // reads close to Croatia/Montenegro too); Tunisia's sits close to
  // Malta. Both keep their real pin — only the label is displaced.
  var LABEL_OFFSET = {
    bih: { desktop: [-8, 7], mobile: [-2, 13], abbrevMobile: "Bosnia & Herz." },
    tun: { desktop: [-4, 9], mobile: [-2, 14] }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function isNarrow() { return !!(window.matchMedia && window.matchMedia("(max-width: 640px)").matches); }

  /* Builds one node's markup. Returns { html, leader } — leader is null
     unless this code has a LABEL_OFFSET entry, in which case it's the
     {x1,y1,x2,y2,opacity} the caller collects and passes to
     leaderLinesSvg() once per map, alongside the node html (pin badge +
     name, as either one anchored block or two independently-positioned
     ones joined by that leader line). */
  function renderNode(opts) {
    var pos = POS[opts.code];
    if (!pos) return { html: "", leader: null };
    var offsetDef = LABEL_OFFSET[opts.code];
    var narrow = isNarrow();
    var offset = offsetDef ? (narrow ? offsetDef.mobile : offsetDef.desktop) : null;
    var labelText = (offsetDef && narrow && offsetDef.abbrevMobile) ? offsetDef.abbrevMobile : opts.name;
    var pinLeft = pos[0], pinTop = pos[1];
    var extra = opts.dataNode ? ' data-node="' + esc(opts.code) + '"' : "";

    var badgeHtml = '<span class="pp-map-node-badge' + (opts.highlightClass ? " " + opts.highlightClass : "") + '" style="display:flex;align-items:center;gap:7px;padding:6px 9px;background:' + opts.badgeBg + ';color:' + opts.badgeFg + ';border:2px solid #1b1a19;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.12em;white-space:nowrap;animation:ppSway ' + opts.sway + ' ease-in-out infinite">' + esc(opts.code.toUpperCase()) + '<span class="pp-map-node-sub" style="font:600 8.5px/1;letter-spacing:.14em;opacity:.75">' + esc(opts.med) + '</span></span>';
    var nameStyle = "font:800 13px/1 'Archivo',sans-serif;letter-spacing:-.01em;color:#fff;text-shadow:0 1px 0 rgba(27,26,25,.6);white-space:nowrap";

    if (!offset) {
      var html = '<a href="' + opts.href + '"' + extra + ' aria-label="' + esc(opts.ariaLabel) + '" style="position:absolute;left:' + pinLeft + '%;top:' + pinTop + '%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:flex-start;gap:5px;text-decoration:none;opacity:' + opts.opacity + ';transition:opacity .3s ease;z-index:2">'
        + badgeHtml
        + '<span class="pp-map-node-name" style="' + nameStyle + '">' + esc(opts.name) + '</span></a>';
      return { html: html, leader: null };
    }

    var labelLeft = pinLeft + offset[0], labelTop = pinTop + offset[1];
    var pinHtml = '<a href="' + opts.href + '"' + extra + ' aria-label="' + esc(opts.ariaLabel) + '" style="position:absolute;left:' + pinLeft + '%;top:' + pinTop + '%;transform:translate(-50%,-50%);text-decoration:none;opacity:' + opts.opacity + ';transition:opacity .3s ease;z-index:2">' + badgeHtml + '</a>';
    var labelHtml = '<a href="' + opts.href + '"' + extra + ' aria-label="' + esc(opts.ariaLabel) + '" style="position:absolute;left:' + labelLeft + '%;top:' + labelTop + '%;transform:translate(-50%,-50%);text-decoration:none;opacity:' + opts.opacity + ';transition:opacity .3s ease;z-index:2">'
      + '<span class="pp-map-node-name" style="' + nameStyle + '">' + esc(labelText) + '</span></a>';
    return {
      html: pinHtml + labelHtml,
      leader: { x1: pinLeft, y1: pinTop, x2: labelLeft, y2: labelTop, opacity: opts.opacity }
    };
  }

  /* One shared dashed-line overlay per map, covering every offset node
     at once — cheaper and simpler than a per-node SVG, and since the
     viewBox matches POS's own 0–100 percentage space with
     preserveAspectRatio="none", each line tracks its pin/label pair
     correctly at any container aspect ratio, exactly like the
     percentage-positioned nodes themselves do. */
  function leaderLinesSvg(leaders) {
    if (!leaders || !leaders.length) return "";
    var lines = leaders.map(function (l) {
      return '<line x1="' + l.x1 + '" y1="' + l.y1 + '" x2="' + l.x2 + '" y2="' + l.y2 + '" stroke="rgba(255,255,255,.55)" stroke-width="0.35" stroke-dasharray="1.4,1.1" stroke-linecap="round" vector-effect="non-scaling-stroke" style="opacity:' + l.opacity + ';transition:opacity .3s ease"/>';
    }).join("");
    return '<svg class="pp-map-leader-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1">' + lines + '</svg>';
  }

  window.PP_MED_MAP = { POS: POS, LABEL_OFFSET: LABEL_OFFSET, renderNode: renderNode, leaderLinesSvg: leaderLinesSvg, isNarrow: isNarrow };
})();
