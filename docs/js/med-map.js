/* Patty Passport — shared Mediterranean map: one illustrated basin (blue
   sea, warm land, drawn coastline) plus the interactive 21-country node
   layer, used identically by the home page and the route-map page so
   the two can never drift apart. Node positions are approximate,
   stylised placements that keep each country's real relative position
   (west/east, north/south, island vs mainland) — not a survey-accurate
   coastline — drawn entirely in CSS-paintable SVG shapes, no photography
   and no third-party map data. */
(function () {
  var SEA = "#2b76c9";
  var LAND = "#e8dcc6";
  var LAND_LINE = "#1b1a19";

  /* Percent-of-viewBox positions (viewBox is 0 0 100 100, so these are
     also valid CSS left/top percentages for the absolutely-positioned
     node layer) — kept as the single shared source for both pages. */
  var POS = {
    esp: [7, 36], mar: [9, 76], dza: [26, 82], fra: [19, 15],
    mco: [26, 24], ita: [33, 32], tun: [40, 72], mlt: [39, 55],
    svn: [38, 9], hrv: [45, 17], bih: [47, 28], mne: [51, 35],
    alb: [54, 43], lby: [55, 82], grc: [60, 33], tur: [74, 14],
    cyp: [80, 44], egy: [76, 78], lbn: [88, 38], syr: [90, 26],
    pse: [87, 50]
  };

  /* Land blobs: soft irregular polygons approximating each coastal mass
     (Iberia, Maghreb, the French/Italian/Balkan/Anatolian north shore,
     the Levant) plus a few small islands (Malta, Cyprus, Crete-ish),
     all in the same warm fill so overlaps read as one continuous mass
     with no visible seams. Drawn with a dark coastline stroke so the
     land/sea boundary is always legible, not just implied by color. */
  var LAND_PATHS = [
    /* Iberia (west) */
    "M-4,18 L18,10 Q26,18 22,30 L20,46 Q14,58 2,54 L-4,46 Z",
    /* Maghreb / N. Africa south shore, Morocco through Libya */
    "M-4,64 L14,62 Q30,66 34,72 L48,70 Q60,74 66,84 L64,104 L-4,104 Z",
    /* France + Monaco + N. Italy top */
    "M8,-4 L34,-4 Q40,6 36,16 L26,22 Q18,20 14,12 Z",
    /* Italy boot + Sicily gesture */
    "M28,18 Q36,16 40,24 L42,44 Q38,54 30,52 Q26,44 28,34 Z",
    /* Slovenia/Croatia/Bosnia/Montenegro/Albania — Balkan west coast arc */
    "M34,-4 L62,-4 Q66,10 58,18 Q56,26 60,32 Q54,42 46,46 Q40,40 42,30 Q36,26 34,16 Z",
    /* Greece + Aegean gesture (mainland + a scatter of island blobs) */
    "M52,20 Q62,18 66,28 L64,42 Q58,48 52,44 Q48,34 52,28 Z",
    /* Türkiye (Anatolia, north-east shore) */
    "M62,-4 L92,-4 L92,24 Q84,30 76,26 Q66,22 62,12 Z",
    /* Levant east shore — Syria/Lebanon/Palestine */
    "M82,-4 L104,-4 L104,60 L86,60 Q78,50 82,38 Q78,28 82,18 Z",
    /* Egypt (south-east shore) */
    "M64,66 L104,66 L104,104 L64,104 Q60,86 64,66 Z"
  ];

  var ISLANDS = [
    { cx: 39, cy: 55, rx: 2.6, ry: 1.7 },  /* Malta */
    { cx: 80, cy: 44, rx: 2.4, ry: 2.2 },  /* Cyprus */
    { cx: 60, cy: 44, rx: 3.4, ry: 1.3, rot: -8 } /* Crete-ish, south of Greece */
  ];

  function background() {
    var landPaths = LAND_PATHS.map(function (d) {
      return '<path d="' + d + '" fill="' + LAND + '" stroke="' + LAND_LINE + '" stroke-width="0.6" stroke-linejoin="round"/>';
    }).join("");
    var islands = ISLANDS.map(function (isl) {
      return '<ellipse cx="' + isl.cx + '" cy="' + isl.cy + '" rx="' + isl.rx + '" ry="' + isl.ry + '" fill="' + LAND + '" stroke="' + LAND_LINE + '" stroke-width="0.5"' + (isl.rot ? ' transform="rotate(' + isl.rot + ' ' + isl.cx + ' ' + isl.cy + ')"' : '') + '/>';
    }).join("");
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">'
      + '<rect width="100" height="100" fill="' + SEA + '"/>'
      + '<g opacity="0.9">' + landPaths + islands + '</g>'
      + '<rect width="100" height="100" fill="none" stroke="' + LAND_LINE + '" stroke-width="0.8"/>'
      + '</svg>';
  }

  window.PP_MED_MAP = { POS: POS, background: background };
})();
