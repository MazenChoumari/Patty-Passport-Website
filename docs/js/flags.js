/* Patty Passport — shared flag renderer.
   Small, sharp, vector-only flag glyphs for all 21 destinations, built from
   plain rects/polygons/circles (no photography, no emoji, no third-party
   image assets) so every flag is crisp at any size and never drifts from a
   single 3:2 source of truth. Complex coats of arms (Slovenia, Croatia,
   Montenegro, Albania, Spain, Egypt) are intentionally simplified to their
   correct field colors and stripe layout rather than guessed in detail —
   accurate colors and proportions, no invented heraldry. */
(function () {
  function star(cx, cy, rOuter, rInner, rotDeg) {
    var pts = [];
    var rot = ((rotDeg || -90) * Math.PI) / 180;
    for (var i = 0; i < 10; i++) {
      var r = i % 2 === 0 ? rOuter : rInner;
      var a = rot + (i * Math.PI) / 5;
      pts.push((cx + r * Math.cos(a)).toFixed(3) + "," + (cy + r * Math.sin(a)).toFixed(3));
    }
    return pts.join(" ");
  }

  function crescent(cx, cy, r, punchDx, color, bg) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '"/>'
      + '<circle cx="' + (cx + punchDx) + '" cy="' + cy + '" r="' + (r * 0.8) + '" fill="' + bg + '"/>';
  }

  function stripesH(colors) {
    var n = colors.length, h = 2 / n, out = "";
    colors.forEach(function (c, i) { out += '<rect y="' + (i * h) + '" width="3" height="' + h + '" fill="' + c + '"/>'; });
    return out;
  }
  function stripesV(colors) {
    var n = colors.length, w = 3 / n, out = "";
    colors.forEach(function (c, i) { out += '<rect x="' + (i * w) + '" width="' + w + '" height="2" fill="' + c + '"/>'; });
    return out;
  }

  var FLAGS = {
    lbn: function () {
      return '<rect width="3" height="0.5" fill="#c8102e"/><rect y="0.5" width="3" height="1" fill="#fff"/><rect y="1.5" width="3" height="0.5" fill="#c8102e"/>'
        + '<rect x="1.44" y="0.78" width="0.12" height="0.42" fill="#00703c"/>'
        + '<path d="M1.5,0.68 L1.72,1.08 L1.28,1.08 Z" fill="#00703c"/>'
        + '<path d="M1.5,0.85 L1.78,1.18 L1.22,1.18 Z" fill="#00703c"/>';
    },
    syr: function () {
      var s = '<rect y="0" width="3" height="0.667" fill="#ce1126"/><rect y="0.667" width="3" height="0.667" fill="#fff"/><rect y="1.333" width="3" height="0.667" fill="#000"/>';
      s += '<polygon points="' + star(1.15, 1, 0.14, 0.055) + '" fill="#007a3d"/>';
      s += '<polygon points="' + star(1.85, 1, 0.14, 0.055) + '" fill="#007a3d"/>';
      return s;
    },
    pse: function () {
      return '<rect y="0" width="3" height="0.667" fill="#000"/><rect y="0.667" width="3" height="0.667" fill="#fff"/><rect y="1.333" width="3" height="0.667" fill="#007a3d"/>'
        + '<path d="M0,0 L1.3,1 L0,2 Z" fill="#ce1126"/>';
    },
    tur: function () {
      return '<rect width="3" height="2" fill="#e30a17"/>' + crescent(1.15, 1, 0.5, 0.14, "#fff", "#e30a17") + '<polygon points="' + star(1.65, 1, 0.16, 0.065) + '" fill="#fff"/>';
    },
    cyp: function () {
      return '<rect width="3" height="2" fill="#fff"/>'
        + '<path d="M1.05,0.9 L1.35,0.75 L1.7,0.8 L1.95,0.95 L1.85,1.05 L1.9,1.15 L1.6,1.1 L1.35,1.15 L1.1,1.05 Z" fill="#c96a2e"/>'
        + '<path d="M1.25,1.35 Q1.4,1.25 1.5,1.35" stroke="#5a8a3c" stroke-width="0.05" fill="none"/>'
        + '<path d="M1.5,1.35 Q1.6,1.25 1.75,1.35" stroke="#5a8a3c" stroke-width="0.05" fill="none"/>';
    },
    grc: function () {
      var n = 9, h = 2 / n, s = "";
      for (var i = 0; i < n; i++) s += '<rect y="' + (i * h) + '" width="3" height="' + h + '" fill="' + (i % 2 === 0 ? "#0d5eaf" : "#fff") + '"/>';
      s += '<rect width="1.2" height="' + (h * 5) + '" fill="#0d5eaf"/>';
      s += '<rect x="0.5" y="0" width="0.2" height="' + (h * 5) + '" fill="#fff"/>';
      s += '<rect x="0" y="' + (h * 2.4) + '" width="1.2" height="0.2" fill="#fff"/>';
      return s;
    },
    ita: function () { return stripesV(["#008C45", "#fff", "#CD212A"]); },
    esp: function () { return '<rect width="3" height="0.5" fill="#AA151B"/><rect y="0.5" width="3" height="1" fill="#F1BF00"/><rect y="1.5" width="3" height="0.5" fill="#AA151B"/>'; },
    fra: function () { return stripesV(["#0055A4", "#fff", "#EF4135"]); },
    mco: function () { return '<rect width="3" height="1" fill="#CE1126"/><rect y="1" width="3" height="1" fill="#fff"/>'; },
    mlt: function () {
      return '<rect width="1.5" height="2" fill="#fff"/><rect x="1.5" width="1.5" height="2" fill="#CF142B"/>'
        + '<rect x="0.16" y="0.16" width="0.5" height="0.5" fill="none" stroke="#CF142B" stroke-width="0.05"/>'
        + '<rect x="0.34" y="0.19" width="0.14" height="0.44" fill="#9a9a9a"/>'
        + '<rect x="0.19" y="0.34" width="0.44" height="0.14" fill="#9a9a9a"/>';
    },
    svn: function () { return stripesH(["#fff", "#005CA9", "#ED1C24"]); },
    hrv: function () {
      var s = stripesH(["#FF0000", "#fff", "#171796"]);
      s += '<g>';
      for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) s += '<rect x="' + (1.275 + c * 0.09) + '" y="' + (0.775 + r * 0.09) + '" width="0.09" height="0.09" fill="' + ((r + c) % 2 === 0 ? "#FF0000" : "#fff") + '"/>';
      s += '</g>';
      return s;
    },
    bih: function () {
      var s = '<rect width="3" height="2" fill="#002395"/><path d="M0,0 L1.1,0 L3,2 L1.9,2 Z" fill="#FECB00"/>';
      for (var i = 0; i < 6; i++) s += '<polygon points="' + star(0.85 + i * 0.34, 0.28 + i * 0.34, 0.075, 0.03) + '" fill="#fff"/>';
      return s;
    },
    mne: function () {
      return '<rect width="3" height="2" fill="#C40308"/><rect x="0.09" y="0.09" width="2.82" height="1.82" fill="none" stroke="#D4AF37" stroke-width="0.18"/>'
        + '<circle cx="1.5" cy="1" r="0.42" fill="none" stroke="#D4AF37" stroke-width="0.06"/><circle cx="1.5" cy="1" r="0.16" fill="#D4AF37"/>';
    },
    alb: function () {
      return '<rect width="3" height="2" fill="#E41E20"/><circle cx="1.5" cy="1" r="0.32" fill="none" stroke="#000" stroke-width="0.07"/><circle cx="1.5" cy="1" r="0.09" fill="#000"/>';
    },
    egy: function () {
      var s = stripesH(["#CE1126", "#fff", "#000"]);
      s += '<circle cx="1.5" cy="1" r="0.22" fill="none" stroke="#C09300" stroke-width="0.05"/><circle cx="1.5" cy="1" r="0.07" fill="#C09300"/>';
      return s;
    },
    lby: function () {
      var s = '<rect y="0" width="3" height="0.5" fill="#E70013"/><rect y="0.5" width="3" height="1" fill="#000"/><rect y="1.5" width="3" height="0.5" fill="#239E46"/>';
      s += crescent(1.35, 1, 0.34, 0.1, "#fff", "#000") + '<polygon points="' + star(1.78, 1, 0.13, 0.05) + '" fill="#fff"/>';
      return s;
    },
    tun: function () {
      var s = '<rect width="3" height="2" fill="#E70013"/><circle cx="1.5" cy="1" r="0.55" fill="#fff"/>';
      s += crescent(1.42, 1, 0.32, 0.1, "#E70013", "#fff") + '<polygon points="' + star(1.72, 1, 0.14, 0.055) + '" fill="#E70013"/>';
      return s;
    },
    dza: function () {
      var s = '<rect width="1.5" height="2" fill="#006233"/><rect x="1.5" width="1.5" height="2" fill="#fff"/>';
      s += crescent(1.35, 1, 0.36, 0.11, "#E70013", "#fff") + '<polygon points="' + star(1.5, 1, 0.15, 0.06) + '" fill="#E70013"/>';
      return s;
    },
    mar: function () {
      return '<rect width="3" height="2" fill="#C1272D"/><polygon points="' + star(1.5, 1, 0.32, 0.13) + '" fill="none" stroke="#006233" stroke-width="0.06"/>';
    }
  };

  function inner(code) {
    var f = FLAGS[code];
    return f ? f() : '<rect width="3" height="2" fill="#e7e3dc"/>';
  }

  function render(code, size, opts) {
    opts = opts || {};
    var w = size || 26, h = Math.round(w * 2 / 3);
    var stroke = opts.stroke || "#1b1a19";
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 3 2" style="display:block;flex:none" aria-label="' + code.toUpperCase() + ' flag" role="img">'
      + '<rect width="3" height="2" fill="#fff"/>'
      + inner(code)
      + '<rect x="0.03" y="0.03" width="2.94" height="1.94" fill="none" stroke="' + stroke + '" stroke-width="0.07"/>'
      + '</svg>';
  }

  window.PP_FLAGS = { render: render };
})();
