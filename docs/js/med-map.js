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
    esp: [11, 44], mar: [9, 56], dza: [22, 61], fra: [27, 16],
    mco: [35, 26], ita: [40, 36], tun: [37, 61], mlt: [46, 56],
    svn: [40, 8], hrv: [48, 16], bih: [30, 34], mne: [52, 28],
    alb: [42, 46], lby: [54, 72], grc: [56, 42], tur: [65, 27],
    cyp: [66, 48], egy: [70, 74], lbn: [80, 52], syr: [76, 40],
    pse: [73, 64]
  };

  window.PP_MED_MAP = { POS: POS };
})();
