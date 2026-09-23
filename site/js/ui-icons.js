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
    // line, matching the site's other passport glyphs) with a distinct
    // composition on the cover so the three types read apart even at a
    // small badge size, not just by their differently-shaped emblem:
    // Junior gets a booklet + a stuck-on sticker + a pencil drawing a
    // route line; Explorer gets a single passport + a compass + a lone
    // traveller silhouette; Family gets one shared passport + several
    // small figures + a route line joining them underfoot.
    passportJunior: function (size, c) {
      return svg(size, '<rect x="5" y="3" width="14" height="18" rx="1.6" ' + s(c) + '/>'
        + '<line x1="5" y1="3" x2="5" y2="21" ' + s(c) + '/>'
        // sticker, stuck on at an angle near the top corner
        + '<path d="M15 5.5 L15.6 6.9 L17.1 7.1 L16 8.1 L16.3 9.6 L15 8.9 L13.7 9.6 L14 8.1 L12.9 7.1 L14.4 6.9 Z" fill="' + c + '"/>'
        // pencil sketching a short dashed route line across the lower cover
        + '<path d="M7.3 17.6 L11.6 15.2" ' + s(c) + ' stroke-dasharray="1.6 1.7"/>'
        + '<path d="M11.6 15.2 L13.1 14.3 L12.5 16 Z" fill="' + c + '"/>');
    },
    passportExplorer: function (size, c) {
      return svg(size, '<rect x="5" y="3" width="14" height="18" rx="1.6" ' + s(c) + '/>'
        + '<line x1="5" y1="3" x2="5" y2="21" ' + s(c) + '/>'
        // compass, upper cover
        + '<circle cx="13" cy="9.4" r="2.7" ' + s(c) + '/>'
        + '<path d="M14.3 8 L13.4 9.7 L11.7 10.6 L12.6 8.9 Z" fill="' + c + '"/>'
        // single traveller silhouette, lower-left of the cover
        + '<circle cx="8.6" cy="15.6" r="1.15" fill="' + c + '"/>'
        + '<path d="M6.9 19.3 C6.9 17.1 10.3 17.1 10.3 19.3 Z" fill="' + c + '"/>');
    },
    passportFamily: function (size, c) {
      return svg(size, '<rect x="5" y="3" width="14" height="18" rx="1.6" ' + s(c) + '/>'
        + '<line x1="5" y1="3" x2="5" y2="21" ' + s(c) + '/>'
        // three small figures sharing the one cover
        + '<circle cx="9.3" cy="9.6" r="1" fill="' + c + '"/>'
        + '<path d="M7.9 12.9 C7.9 11 10.7 11 10.7 12.9 Z" fill="' + c + '"/>'
        + '<circle cx="13.7" cy="8.7" r="1.1" fill="' + c + '"/>'
        + '<path d="M12.1 12.3 C12.1 10.2 15.3 10.2 15.3 12.3 Z" fill="' + c + '"/>'
        + '<circle cx="16.6" cy="10.1" r="0.85" fill="' + c + '" opacity=".8"/>'
        + '<path d="M15.4 12.9 C15.4 11.4 17.8 11.4 17.8 12.9 Z" fill="' + c + '" opacity=".8"/>'
        // one route line joining everyone underfoot
        + '<path d="M7.8 16.6 L17.4 16.6" ' + s(c) + '/>'
        + '<circle cx="7.8" cy="16.6" r="0.9" fill="' + c + '"/>'
        + '<circle cx="17.4" cy="16.6" r="0.9" fill="' + c + '"/>');
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
    }
  };

  window.PP_ICON = function (name, size, color) {
    var fn = ICONS[name];
    return fn ? fn(size || 24, color || "currentColor") : "";
  };
})();
