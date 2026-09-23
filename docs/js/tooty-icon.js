/* Patty Passport — shared Patty Tooty mascot glyph.
   A small vector burger-character face — bun dome with three staggered
   sesame dots along its rim, exactly one pair of round eyes lower on the
   face, and an open mouth with a tongue sticking out — replacing every
   plain "PT" text marker and every ad-hoc hand-drawn avatar across the
   site. The sesame dots are deliberately smaller, more numerous (three,
   not two) and placed hard against the dome's top rim, well clear of the
   eyes both vertically and horizontally, so they read as bun texture and
   never as a second pair of eyes. Monochrome ink linework (plus the
   brand red for the tongue) so it reads at any of the badge's existing
   sizes/colors without needing its own background — drop it straight
   into the existing yellow/circle badge markup in place of the old "PT"
   text or bespoke avatar markup.

   Both buns are drawn the same way: an outlined dome (fill:none), so
   whatever background the icon sits on shows through as the bun color,
   plus one interior contour stroke for texture. Earlier the lower bun's
   contour line was mistakenly given a solid fill instead of being a
   second stroked path, which turned the whole lower bun into a black
   blob — fixed below by matching the upper bun's fill:none treatment
   and drawing the contour as its own thin stroke. The whole glyph is
   also recentered in the 24x24 viewBox (equal ~1.25px top/bottom margin)
   since it previously sat low, reading as slightly off-center. */
(function () {
  function icon(size, ink, tongue) {
    var s = size || 18;
    var c = ink || "#1b1a19";
    var t = tongue || "#ec3013";
    var small = s < 22; // simplify interior detail at small render sizes so lines don't merge
    var lowerBunContour = small ? "" : '<path d="M5.6,20.3 Q12,23.0 18.4,20.3" fill="none" stroke="' + c + '" stroke-width="1.3" stroke-linecap="round"/>';
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:none">'
      + '<path d="M3.3,9.45 Q3.3,1.25 12,1.25 Q20.7,1.25 20.7,9.45 Z" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/>'
      + '<circle cx="7" cy="3.85" r="0.62" fill="' + c + '"/>'
      + '<circle cx="12" cy="2.85" r="0.58" fill="' + c + '"/>'
      + '<circle cx="17" cy="4.05" r="0.62" fill="' + c + '"/>'
      + '<circle cx="8.4" cy="10.85" r="1.7" fill="' + c + '"/>'
      + '<circle cx="15.6" cy="10.85" r="1.7" fill="' + c + '"/>'
      + '<ellipse cx="12" cy="14.85" rx="4.2" ry="2.3" fill="' + c + '"/>'
      + '<ellipse cx="12" cy="16.1" rx="2.6" ry="1.7" fill="' + t + '"/>'
      + '<path d="M3.3,18.25 Q3.3,22.75 12,22.75 Q20.7,22.75 20.7,18.25 Z" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/>'
      + lowerBunContour
      + '</svg>';
  }

  /* "Complete brand variant" — the mascot plus a small "21" passport stamp
     riding its bottom-right corner, for spots that want the full brand
     mark rather than the bare face (positioning-map marker, hero/logo
     uses). Returned as a small relatively-positioned wrapper so the badge
     can overlap the glyph without needing a second, larger viewBox. */
  function iconWithStamp(size, ink, tongue, stampBg, stampFg) {
    var s = size || 40;
    var c = ink || "#1b1a19";
    var badgeSize = Math.max(12, Math.round(s * 0.44));
    var bg = stampBg || "#f2b30c";
    var fg = stampFg || c;
    return '<span style="position:relative;display:inline-flex;flex:none;width:' + s + 'px;height:' + s + 'px">'
      + icon(s, c, tongue)
      + '<span style="position:absolute;right:-2px;bottom:-2px;width:' + badgeSize + 'px;height:' + badgeSize + 'px;border-radius:50%;background:' + bg + ';border:1.5px solid ' + c + ';display:flex;align-items:center;justify-content:center;font:800 ' + Math.max(6, Math.round(badgeSize * 0.42)) + 'px/1 \'Archivo\',sans-serif;color:' + fg + '">21</span>'
      + '</span>';
  }

  window.PP_TOOTY_ICON = icon;
  window.PP_TOOTY_ICON_STAMPED = iconWithStamp;
})();
