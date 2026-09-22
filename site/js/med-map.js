/* Patty Passport — shared Mediterranean map positions: the single source
   of truth for where each country's destination node sits, used
   identically by the home page and the route-map page so the two can
   never drift apart. No illustrated background here on purpose — both
   pages currently show a plain placeholder box behind these nodes until
   a real map image is supplied; this file only owns the node layout. */
(function () {
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

  window.PP_MED_MAP = { POS: POS };
})();
