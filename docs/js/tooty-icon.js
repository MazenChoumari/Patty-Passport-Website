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
   text or bespoke avatar markup. */
(function () {
  function icon(size, ink, tongue) {
    var s = size || 18;
    var c = ink || "#1b1a19";
    var t = tongue || "#ec3013";
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:none">'
      + '<path d="M3.3,10.5 Q3.3,2.3 12,2.3 Q20.7,2.3 20.7,10.5 Z" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/>'
      + '<circle cx="7" cy="4.9" r="0.62" fill="' + c + '"/>'
      + '<circle cx="12" cy="3.9" r="0.58" fill="' + c + '"/>'
      + '<circle cx="17" cy="5.1" r="0.62" fill="' + c + '"/>'
      + '<circle cx="8.4" cy="11.9" r="1.7" fill="' + c + '"/>'
      + '<circle cx="15.6" cy="11.9" r="1.7" fill="' + c + '"/>'
      + '<ellipse cx="12" cy="15.9" rx="4.2" ry="2.3" fill="' + c + '"/>'
      + '<ellipse cx="12" cy="17.15" rx="2.6" ry="1.7" fill="' + t + '"/>'
      + '<path d="M3.3,19.9 Q12,22.9 20.7,19.9" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>'
      + '</svg>';
  }
  window.PP_TOOTY_ICON = icon;
})();
