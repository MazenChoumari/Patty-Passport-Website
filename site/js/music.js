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

  // Warms the connection to the domains the IFrame API and the embedded
  // player both need (DNS + TLS handshake done ahead of the actual
  // request) so the real fetches below start measurably faster instead
  // of paying that setup cost right when the user clicks play.
  function preconnect(href) {
    if (document.querySelector('link[rel="preconnect"][href="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "";
    document.head.appendChild(link);
  }
  preconnect("https://www.youtube.com");
  preconnect("https://www.google.com");

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

  // js/nav.js's toggle sets its "Playing" label optimistically the instant
  // it's clicked, before the YouTube player has necessarily finished
  // loading — this event is how it finds out when audio has actually
  // started/stopped, so it can show a real "Loading…" state instead of
  // claiming playback that hasn't begun yet.
  function announce(playing) {
    window.dispatchEvent(new CustomEvent("pp-music-state", { detail: { playing: playing } }));
  }

  function onApiReady() {
    if (apiReady) return;
    apiReady = true;
    ensureHost();
    player = new YT.Player("pp-yt-player", {
      videoId: VIDEO_ID,
      // loop+playlist (set to the same single video) is the documented way
      // to make the IFrame API loop one video; onStateChange below is a
      // belt-and-braces fallback that explicitly restarts on ENDED, since
      // loop:1 alone is known to be unreliable in some embed contexts.
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, loop: 1, playlist: VIDEO_ID },
      events: {
        onReady: function (e) {
          e.target.setVolume(DEFAULT_VOLUME);
          if (pendingOn !== null) { applyState(pendingOn); pendingOn = null; }
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.ENDED) {
            e.target.seekTo(0);
            e.target.playVideo();
          } else if (e.data === YT.PlayerState.PLAYING) {
            announce(true);
          } else if (e.data === YT.PlayerState.PAUSED) {
            announce(false);
          }
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
    },
    // True only once playVideo() can actually fire synchronously and
    // start audio immediately — used by nav.js to decide whether a click
    // shows "Playing" right away or a brief "Loading…" state first.
    isReady: function () { return !!(player && typeof player.playVideo === "function"); }
  };

  /* Fix for the "first click doesn't start music" bug: browsers only allow
     player.playVideo() to actually start audio when it's called synchronously
     inside a real click handler. If the YouTube API/player is only created
     on that first click (as above), player.playVideo() ends up firing later
     from an async network/script-load callback instead — no longer inside
     the click's call stack — so browsers silently block it. Toggling off
     then on again "fixes" it only because, by then, the player already
     exists, so the second click's playVideo() call is synchronous again.
     Loading the API and creating the (paused) player ahead of time, as soon
     as the page is ready, means the very first click also calls
     player.playVideo() synchronously from within the click handler, so it
     starts reliably every time. */
  if (document.body) {
    loadApi();
  } else {
    document.addEventListener("DOMContentLoaded", loadApi);
  }
})();
