/* Patty Passport — shared flat/geometric UI icon set (window.PP_ICON), used
   wherever the site previously fell back to two-letter initials in a box:
   passport-type badges (rewards.js, my-passport.js), the Junior Explorer
   Kit (junior-explorers.js) and Patty Tooty's capability tiles
   (patty-tooty.js). Built the same way js/flags.js and js/tooty-icon.js
   build theirs — plain SVG paths/shapes on a 0 0 24 24 grid, stroke-based,
   currentColor-friendly — so nothing here depends on an icon font or an
   external asset. Each function takes (size, color) and returns a
   self-contained <svg> string. */
(function () {
  function svg(size, body) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" style="display:block" aria-hidden="true">' + body + '</svg>';
  }
  function s(color) { return 'stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'; }

  var ICONS = {
    // Passport-type badges — each is the same booklet base (a rect + spine
    // line, matching the site's other passport glyphs) with ONE bold,
    // centered emblem on the cover, sized to still read clearly at a
    // small badge (15-20px): Junior is a solid star, Explorer a compass
    // needle, Family a cluster of three overlapping circles. Earlier
    // versions packed several small corner details onto the cover, which
    // shrank to illegible dots at badge size — this keeps one shape per
    // type, centered, at a size that survives the shrink.
    passportJunior: function (size, c) {
      return svg(size, '<rect x="5" y="3" width="14" height="18" rx="1.6" ' + s(c) + '/>'
        + '<line x1="5" y1="3" x2="5" y2="21" ' + s(c) + '/>'
        // one large centered star, filled solid so it stays legible small
        + '<path d="M12 7.2 L13.3 10.8 L17.2 10.9 L14.1 13.3 L15.2 17.1 L12 14.9 L8.8 17.1 L9.9 13.3 L6.8 10.9 L10.7 10.8 Z" fill="' + c + '"/>');
    },
    passportExplorer: function (size, c) {
      return svg(size, '<rect x="5" y="3" width="14" height="18" rx="1.6" ' + s(c) + '/>'
        + '<line x1="5" y1="3" x2="5" y2="21" ' + s(c) + '/>'
        // one large centered compass: ring + bold needle diamond, north
        // half filled solid and south half faded, so it reads as a
        // compass rather than a plain diamond even at small sizes
        + '<circle cx="12" cy="12" r="5.4" ' + s(c) + '/>'
        + '<path d="M12 7.6 L13.9 12 L12 12 Z" fill="' + c + '"/>'
        + '<path d="M12 16.4 L10.1 12 L12 12 Z" fill="' + c + '" opacity=".4"/>'
        + '<circle cx="12" cy="12" r="1" fill="' + c + '"/>');
    },
    passportFamily: function (size, c) {
      return svg(size, '<rect x="5" y="3" width="14" height="18" rx="1.6" ' + s(c) + '/>'
        + '<line x1="5" y1="3" x2="5" y2="21" ' + s(c) + '/>'
        // three bold overlapping circles, clustered dead-center — reads
        // as "group" at a glance, unlike three separate tiny figures
        + '<circle cx="12" cy="8.8" r="3.1" fill="' + c + '" opacity=".85"/>'
        + '<circle cx="9" cy="14.4" r="3.1" fill="' + c + '" opacity=".85"/>'
        + '<circle cx="15" cy="14.4" r="3.1" fill="' + c + '" opacity=".85"/>');
    },
    // Junior Explorer Kit.
    booklet: function (size, c) {
      return svg(size, '<path d="M4 5.5c2-1 4.6-1.2 8 0v13c-3.4-1.2-6-1-8 0Z" ' + s(c) + '/>'
        + '<path d="M20 5.5c-2-1-4.6-1.2-8 0v13c3.4-1.2 6-1 8 0Z" ' + s(c) + '/>');
    },
    flagSticker: function (size, c) {
      return svg(size, '<line x1="6" y1="3" x2="6" y2="21" ' + s(c) + '/>'
        + '<path d="M6 4.5c3-1.4 5.5-1.4 8.5 0c2 0.9 3 0.9 3.5 0.4v8c-0.5 0.5-1.5 0.5-3.5-0.4c-3-1.4-5.5-1.4-8.5 0Z" ' + s(c) + '/>');
    },
    postcard: function (size, c) {
      return svg(size, '<rect x="3.5" y="6" width="17" height="12" rx="1.3" ' + s(c) + '/>'
        + '<path d="M4.5 7 L12 12.5 L19.5 7" ' + s(c) + '/>');
    },
    wordBubble: function (size, c) {
      return svg(size, '<path d="M4 5.5h16v9.5H10.5L7 18.5v-3.5H4Z" ' + s(c) + '/>'
        + '<line x1="7.5" y1="9" x2="16.5" y2="9" ' + s(c) + '/>'
        + '<line x1="7.5" y1="12" x2="13.5" y2="12" ' + s(c) + '/>');
    },
    tote: function (size, c) {
      return svg(size, '<path d="M5.5 8.5h13l1 12h-15Z" ' + s(c) + '/>'
        + '<path d="M8.5 8.5v-1.8a3.5 3.5 0 0 1 7 0v1.8" ' + s(c) + '/>');
    },
    // Patty Tooty capability tiles.
    mapPin: function (size, c) {
      return svg(size, '<path d="M12 21c4.2-4.6 6.5-8.1 6.5-11A6.5 6.5 0 0 0 5.5 10c0 2.9 2.3 6.4 6.5 11Z" ' + s(c) + '/>'
        + '<circle cx="12" cy="10" r="2.1" fill="' + c + '"/>');
    },
    burgerMark: function (size, c) {
      return svg(size, '<path d="M4 10.5c0-3.6 3.6-6.5 8-6.5s8 2.9 8 6.5Z" ' + s(c) + '/>'
        + '<line x1="4.5" y1="13" x2="19.5" y2="13" ' + s(c) + '/>'
        + '<path d="M3.8 16.2c2.3 1.4 5.2 1.4 8.2 1.4s5.9 0 8.2-1.4" ' + s(c) + '/>');
    },
    kidsMark: function (size, c) {
      return svg(size, '<circle cx="12" cy="8" r="3.2" ' + s(c) + '/>'
        + '<path d="M6 20c0-3.6 2.7-6.3 6-6.3s6 2.7 6 6.3" ' + s(c) + '/>');
    },
    medal: function (size, c) {
      return svg(size, '<path d="M9 3.5 L6.2 9.5 L10 12 Z" fill="' + c + '" opacity=".55"/>'
        + '<path d="M15 3.5 L17.8 9.5 L14 12 Z" fill="' + c + '" opacity=".55"/>'
        + '<circle cx="12" cy="14.5" r="6" ' + s(c) + '/>'
        + '<circle cx="12" cy="14.5" r="2.6" fill="' + c + '"/>');
    },
    calendarMark: function (size, c) {
      return svg(size, '<rect x="4" y="5.5" width="16" height="14.5" rx="1.4" ' + s(c) + '/>'
        + '<line x1="4" y1="10" x2="20" y2="10" ' + s(c) + '/>'
        + '<line x1="8" y1="3.5" x2="8" y2="7.5" ' + s(c) + '/>'
        + '<line x1="16" y1="3.5" x2="16" y2="7.5" ' + s(c) + '/>'
        + '<circle cx="12" cy="15" r="1.3" fill="' + c + '"/>');
    },
    routeMark: function (size, c) {
      return svg(size, '<circle cx="6" cy="18" r="2.1" fill="' + c + '"/>'
        + '<circle cx="18" cy="6" r="2.1" fill="' + c + '"/>'
        + '<path d="M7.5 16.5c3-2 5-3.5 5.5-6c0.4-2 1.8-3.3 3.4-3.8" ' + s(c) + '/>');
    },
    // Group-menu dietary badges (events.html Country Night packages).
    leafMark: function (size, c) {
      return svg(size, '<path d="M5 19c-1-7 3-13.5 14-14.5c1 10-5 14.5-14 14.5Z" ' + s(c) + '/>'
        + '<path d="M6 18c3-4 6-7 12.5-12.5" ' + s(c) + '/>');
    },
    chickenMark: function (size, c) {
      return svg(size, '<path d="M9 6c3.5-1.8 7.2-0.2 8 3.4c0.7 3.2-1 5.8-4 8.4l-3.8 3.4l-1.6-1.7l2.6-2.9c-2.3 0.2-4.4-0.7-5.2-2.8c-1-2.6 0.7-5 4-7.8Z" ' + s(c) + '/>'
        + '<circle cx="14.5" cy="9.3" r="1" fill="' + c + '"/>');
    },
    beefMark: function (size, c) {
      return svg(size, '<path d="M4.5 9c1-2.6 3.6-4 7-4c4.3 0 8 2.6 8 6.4c0 3.6-3.3 6.4-7.4 6.4c-1 0-1.9-0.15-2.7-0.4c-0.5 1.4-1.7 2.4-3.4 2.4c-1.9 0-3-1.2-3-2.8c0-1.1 0.6-2 1.6-2.5c-0.7-1.6-0.8-3.6-0.1-5.5Z" ' + s(c) + '/>'
        + '<circle cx="9.5" cy="10" r="1" fill="' + c + '"/>'
        + '<circle cx="14" cy="12.3" r="1" fill="' + c + '"/>');
    },
    // Defensibility icons (investors.html "Why this defends itself") —
    // one glyph per moat argument, replacing the plain two-letter
    // initials (FM/RT/CT/SU/BR) those cards used to show.
    blueprintMark: function (size, c) { // format, not recipe
      return svg(size, '<rect x="3.5" y="3.5" width="17" height="17" rx="1.2" ' + s(c) + '/>'
        + '<path d="M3.5 9h17M9 20.5V9" ' + s(c) + '/>'
        + '<path d="M12.5 13.2h5.5M12.5 16.2h3.6" ' + s(c) + '/>');
    },
    loopMark: function (size, c) { // retention by design
      return svg(size, '<path d="M5 12a7 7 0 0 1 12.3-4.5" ' + s(c) + '/>'
        + '<path d="M17.8 4.3v3.6h-3.6" ' + s(c) + '/>'
        + '<path d="M19 12a7 7 0 0 1-12.3 4.5" ' + s(c) + '/>'
        + '<path d="M6.2 19.7v-3.6h3.6" ' + s(c) + '/>');
    },
    layersMark: function (size, c) { // reusable content
      return svg(size, '<path d="M12 4 20.5 8.5 12 13 3.5 8.5Z" ' + s(c) + '/>'
        + '<path d="M3.5 12.8 12 17.3l8.5-4.5" ' + s(c) + '/>'
        + '<path d="M3.5 17 12 21.5 20.5 17" ' + s(c) + '/>');
    },
    chainMark: function (size, c) { // single supply chain
      return svg(size, '<rect x="3" y="8.5" width="9" height="7" rx="3.5" ' + s(c) + '/>'
        + '<rect x="11" y="8.5" width="9" height="7" rx="3.5" ' + s(c) + '/>');
    },
    globeMark: function (size, c) { // brand with a world
      return svg(size, '<circle cx="12" cy="12" r="8.5" ' + s(c) + '/>'
        + '<path d="M3.5 12h17M12 3.5v17" ' + s(c) + '/>'
        + '<path d="M6 6.3c2 2 10 2 12 0M6 17.7c2-2 10-2 12 0" ' + s(c) + '/>'
        + '<path d="M12 3.5c-2.6 2.3-4 5.3-4 8.5s1.4 6.2 4 8.5c2.6-2.3 4-5.3 4-8.5s-1.4-6.2-4-8.5Z" ' + s(c) + '/>');
    }
  };

  window.PP_ICON = function (name, size, color) {
    var fn = ICONS[name];
    return fn ? fn(size || 24, color || "currentColor") : "";
  };
})();
