/* Patty Passport — "Play the Mediterranean" nav music toggle, backed by a
   real embedded YouTube track (requested video: oUv0nN_KMi0). Loads the
   YouTube IFrame API on demand (not on every page load), keeps the player
   visually hidden (it's audio-only from the user's point of view — the nav
   button is the only control), and only ever starts playback from an
   explicit click on the nav's music toggle (js/nav.js calls
   window.PP_MUSIC.toggle(on)), so nothing plays unprompted on page load
   and nothing starts at a jarring volume. */
(function () {
  var VIDEO_ID = "oUv0nN_KMi0";
  var DEFAULT_VOLUME = 55;

  var player = null;
  var apiReady = false;
  var pendingOn = null; // desired on/off state requested before the player exists

  function ensureHost() {
    var host = document.getElementById("pp-yt-host");
    if (host) return host;
    host = document.createElement("div");
    host.id = "pp-yt-host";
    host.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;";
    var mount = document.createElement("div");
    mount.id = "pp-yt-player";
    host.appendChild(mount);
    document.body.appendChild(host);
    return host;
  }

  function loadApi() {
    if (window.YT && window.YT.Player) { onApiReady(); return; }
    if (document.getElementById("pp-yt-api")) return;
    var tag = document.createElement("script");
    tag.id = "pp-yt-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    var prevCb = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prevCb === "function") prevCb();
      onApiReady();
    };
  }

  function onApiReady() {
    if (apiReady) return;
    apiReady = true;
    ensureHost();
    player = new YT.Player("pp-yt-player", {
      videoId: VIDEO_ID,
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0 },
      events: {
        onReady: function (e) {
          e.target.setVolume(DEFAULT_VOLUME);
          if (pendingOn !== null) { applyState(pendingOn); pendingOn = null; }
        }
      }
    });
  }

  function applyState(on) {
    if (!player || typeof player.playVideo !== "function") { pendingOn = on; return; }
    if (on) player.playVideo(); else player.pauseVideo();
  }

  window.PP_MUSIC = {
    toggle: function (on) {
      if (!apiReady) { pendingOn = on; loadApi(); return; }
      applyState(on);
    }
  };
})();
