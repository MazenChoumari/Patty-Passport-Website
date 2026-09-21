/* Patty Passport — shared Patty Tooty mascot glyph.
   A small vector burger-character face (bun dome + sesame dots + eyes +
   smile), replacing the plain "PT" text marker everywhere the mascot
   appears (nav-adjacent bubbles, the floating concierge launcher, and the
   full concierge page). Monochrome ink linework so it reads at any of the
   badge's existing sizes/colors without needing its own background —
   drop it straight into the existing yellow/circle badge markup in place
   of the old "PT" text. */
(function () {
  function icon(size, ink) {
    var s = size || 18;
    var c = ink || "#1b1a19";
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:none">'
      + '<path d="M4.5,10.5 Q4.5,3.4 12,3.4 Q19.5,3.4 19.5,10.5 Z" fill="none" stroke="' + c + '" stroke-width="1.7" stroke-linejoin="round"/>'
      + '<circle cx="9" cy="7" r="0.9" fill="' + c + '"/>'
      + '<circle cx="15" cy="7" r="0.9" fill="' + c + '"/>'
      + '<circle cx="9" cy="12.6" r="1.15" fill="' + c + '"/>'
      + '<circle cx="15" cy="12.6" r="1.15" fill="' + c + '"/>'
      + '<path d="M9,16.3 Q12,18.4 15,16.3" fill="none" stroke="' + c + '" stroke-width="1.5" stroke-linecap="round"/>'
      + '<path d="M4.5,19.6 Q12,22.3 19.5,19.6" fill="none" stroke="' + c + '" stroke-width="1.7" stroke-linecap="round"/>'
      + '</svg>';
  }
  window.PP_TOOTY_ICON = icon;
})();
