/* Patty Passport — shared top nav, ported from PP-Nav.dc.html's x-dc
   template + Component logic (rotating "quick gates", scroll route-line
   progress bar, terminal directory drawer, music toggle) into plain JS
   that renders into <div id="pp-nav"></div>.

   Each page sets `window.PP_ACTIVE = "<code>"` before this script runs
   (see the first column of PAGES/GATES below) so the nav can highlight
   the current page in both the quick-gates bar and the "All pages"
   drawer. The gate number, bar label and drawer label are three
   different strings for the same page (e.g. "Rewards" in the gates bar
   vs "Rewards & passport" in the drawer) — comparing against a single
   stable code, instead of against either display label directly, is
   what keeps both highlights in sync regardless of which label a given
   list happens to show. */
(function () {
  const PAGES = [
    ["01", "destinations", "Destinations", "All 21 countries, route by route", "destinations.html"],
    ["02", "route-map", "Route map", "The Mediterranean network", "route-map.html"],
    ["02b", "soundtracks", "Route soundtracks", "The sound of every destination", "soundtracks.html"],
    ["03", "menu", "Menu", "Every dish, by destination", "menu.html"],
    ["04", "rewards", "Rewards & passport", "Stamps, ladder, unlockables", "rewards.html"],
    ["05", "events", "Events & birthdays", "Celebrations on any route", "events.html"],
    ["06", "kids", "Junior explorers", "Kits, booklets, kids routes", "junior-explorers.html"],
    ["07", "story", "Our story", "Why Patty Passport exists", "our-story.html"],
    ["08", "patty-tooty", "Ask Patty Tooty", "The destination concierge", "patty-tooty.html"],
    ["09", "investors", "Investors", "Steer the next route", "investors.html"],
    ["10", "my-passport", "My passport", "Stamps, rewards, bookings", "my-passport.html"],
    ["11", "booking", "Book a table", "Choose time, route and destination", "booking.html"],
    ["12", "home", "Home terminal", "The full journey, top to bottom", "index.html"]
  ];
  const GATES = [
    ["destinations", "Destinations", "destinations.html", "#ec3013"],
    ["route-map", "Route map", "route-map.html", "#2b76c9"],
    ["menu", "Menu", "menu.html", "#f2b30c"],
    ["rewards", "Rewards", "rewards.html", "#ec3013"],
    ["events", "Events", "events.html", "#f2b30c"],
    ["kids", "Kids", "junior-explorers.html", "#2b76c9"],
    ["story", "Story", "our-story.html", "#ec3013"],
    ["patty-tooty", "Patty Tooty", "patty-tooty.html", "#f2b30c"],
    ["investors", "Investors", "investors.html", "#ec3013"],
    ["booking", "Book", "booking.html", "#ec3013"]
  ];

  const state = { drawerOpen: false, drawerIn: false, musicOn: false, gatePage: 0, gateFade: 1 };
  let active = window.PP_ACTIVE || "";

  function eqBars() {
    return '<span style="display:flex;align-items:flex-end;gap:2px;height:12px;width:14px">'
      + '<span style="flex:1;background:#ec3013;height:40%;animation:ppNavEq .62s ease-in-out infinite alternate"></span>'
      + '<span style="flex:1;background:#ec3013;height:80%;animation:ppNavEq .48s ease-in-out .1s infinite alternate"></span>'
      + '<span style="flex:1;background:#ec3013;height:55%;animation:ppNavEq .74s ease-in-out .2s infinite alternate"></span>'
      + '</span>';
  }
  function playIcon() {
    return '<span style="width:0;height:0;border-left:9px solid currentColor;border-top:6px solid transparent;border-bottom:6px solid transparent"></span>';
  }

  function computeGates() {
    const per = 4, pages = Math.ceil(GATES.length / per);
    const activeIdx = GATES.findIndex(g => g[0] === active);
    const homePage = activeIdx > -1 ? Math.floor(activeIdx / per) : 0;
    const pg = (homePage + state.gatePage) % pages;
    return { pg, pages, slice: GATES.slice(pg * per, pg * per + per) };
  }

  /* Bar (logo, buttons, quick gates, progress) and drawer (the "All
     pages" overlay) are rendered into separate containers and never
     torn down together. The gate-rotation timer and music toggle only
     call renderBar(), so the drawer's DOM — and its scrim's one-shot
     fade-in animation — is never rebuilt while it's open. Rebuilding it
     on every 4.2s gate tick was exactly what caused the tint to flash
     out to the page background and back in. */
  function renderBar() {
    const bar = document.getElementById("pp-nav-bar");
    if (!bar) return;
    const { pg, pages, slice } = computeGates();

    const gatesHtml = slice.map(g => {
      const isActive = active === g[0];
      const bg = isActive ? "#1b1a19" : "transparent";
      const fg = isActive ? "#f7f3ec" : "#1b1a19";
      const border = isActive ? "#1b1a19" : "rgba(27,26,25,.2)";
      return `<a href="${g[2]}" style="display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:2px solid ${border};background:${bg};text-decoration:none;color:${fg};font:600 10px/1 'Archivo',sans-serif;letter-spacing:.13em;text-transform:uppercase;white-space:nowrap" data-hover="border-color:#ec3013;color:#ec3013">`
        + `<span style="width:6px;height:6px;flex:none;background:${g[3]}"></span>${g[1]}</a>`;
    }).join("");

    const nowPlayingHtml = state.musicOn ? `
      <div style="display:flex;align-items:center;gap:12px;padding:8px 26px;background:#1b1a19;color:#f7f3ec;font:600 9.5px/1 'Archivo',sans-serif;letter-spacing:.16em;text-transform:uppercase">
        <span style="width:7px;height:7px;background:#f2b30c;animation:ppNavBlink 1.3s steps(1) infinite"></span>
        Now playing · Beirut Corniche, 7pm — Levant Route
        <span style="margin-left:auto;color:#bab6b6">42 tracks</span>
      </div>` : "";

    bar.innerHTML = `
      <div data-nav-root="1" style="position:fixed;top:0;left:0;right:0;z-index:80;background:#f7f3ec;border-bottom:2px solid #1b1a19;font-family:'Archivo',system-ui,sans-serif">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;padding:11px 26px">
          <a href="index.html" id="pp-nav-logo" style="display:flex;align-items:center;gap:13px;text-decoration:none;color:#1b1a19;flex:none">
            <span style="position:relative;width:44px;height:44px;flex:none;background:#1b1a19;display:block">
              <span style="position:absolute;left:4px;top:4px;right:4px;bottom:4px;border:2px solid #f7f3ec;display:block"></span>
              <span style="position:absolute;left:9px;top:9px;width:26px;height:8px;background:#f2b30c;display:block"></span>
              <span style="position:absolute;left:13px;top:11px;width:3px;height:3px;background:#1b1a19;display:block"></span>
              <span style="position:absolute;left:20px;top:11px;width:3px;height:3px;background:#1b1a19;display:block"></span>
              <span style="position:absolute;left:27px;top:11px;width:3px;height:3px;background:#1b1a19;display:block"></span>
              <span style="position:absolute;left:9px;top:19px;width:26px;height:3px;background:#f7f3ec;display:block"></span>
              <span style="position:absolute;left:9px;top:23px;width:26px;height:6px;background:#ec3013;display:block"></span>
              <span style="position:absolute;left:9px;top:30px;width:26px;height:6px;background:#f2b30c;display:block"></span>
              <span style="position:absolute;right:-7px;bottom:-7px;width:20px;height:20px;border:2px solid #ec3013;background:#f7f3ec;display:flex;align-items:center;justify-content:center;font:800 8px/1 'Archivo',sans-serif;color:#ec3013;transform:rotate(-12deg)">21</span>
            </span>
            <span>
              <span style="display:block;font:800 17px/1 'Archivo',sans-serif;letter-spacing:-.02em">PATTY PASSPORT</span>
              <span style="display:block;font:600 8.5px/1.5 'Archivo',sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#7d7979">Order the Mediterranean to your table</span>
            </span>
          </a>
          <div style="display:flex;align-items:center;gap:10px;flex:none;margin-left:auto">
            <button type="button" id="pp-nav-music" style="display:inline-flex;align-items:center;gap:9px;padding:9px 12px;border:2px solid #1b1a19;background:transparent;color:#1b1a19;font:800 10px/1 'Archivo',sans-serif;letter-spacing:.13em;text-transform:uppercase;cursor:pointer;white-space:nowrap" data-hover="background:#f2b30c;border-color:#f2b30c">
              ${state.musicOn ? eqBars() : playIcon()}
              ${state.musicOn ? "Playing" : "Play the Mediterranean"}
            </button>
            <a href="my-passport.html" style="display:inline-flex;align-items:center;gap:8px;padding:10px 14px;background:#1b1a19;color:#f7f3ec;text-decoration:none;font:800 10.5px/1 'Archivo',sans-serif;letter-spacing:.13em;text-transform:uppercase;white-space:nowrap" data-hover="background:#ec3013">My Passport</a>
            <button type="button" id="pp-nav-open" aria-expanded="${state.drawerOpen ? "true" : "false"}" aria-controls="pp-nav-drawer" style="display:inline-flex;align-items:center;gap:10px;padding:10px 13px;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:800 10.5px/1 'Archivo',sans-serif;letter-spacing:.13em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c" data-active="background:#ec3013;border-color:#ec3013;color:#fff">
              <span style="display:block;width:16px">
                <span style="display:block;height:2px;background:currentColor;margin-bottom:3px"></span>
                <span style="display:block;height:2px;background:currentColor;margin-bottom:3px"></span>
                <span style="display:block;height:2px;background:currentColor"></span>
              </span>All pages
            </button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;padding:9px 26px;border-top:2px solid rgba(27,26,25,.16);overflow:hidden">
          <span style="font:600 9px/1 'Archivo',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d7979;flex:none">Quick gates</span>
          <div style="display:flex;align-items:center;gap:8px;min-width:0;opacity:${state.gateFade};transition:opacity .24s ease">
            ${gatesHtml}
          </div>
          <span style="margin-left:auto;flex:none;font:600 9px/1 'Archivo',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">Gate ${pg + 1} / ${pages}</span>
        </div>
        ${nowPlayingHtml}
        <div style="position:relative;height:5px;background:rgba(27,26,25,.14)">
          <div data-nav-fill="1" style="position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#ec3013,#f2b30c)"></div>
          <div data-nav-plane="1" style="position:absolute;top:-11px;left:0;width:26px;height:26px;color:#1b1a19">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.9 4.2-2.1 2.1-2.1-.4a.5.5 0 0 0-.5.8l2 2 2 2a.5.5 0 0 0 .8-.5l-.4-2.1 2.1-2.1 4.2 3.9a.5.5 0 0 0 .8-.5Z" fill="#f7f3ec"></path></svg>
          </div>
        </div>
      </div>
      <div data-nav-spacer="1" style="height:136px"></div>
    `;

    bar.querySelector("#pp-nav-music")?.addEventListener("click", () => { state.musicOn = !state.musicOn; renderBar(); toggleMusicPlayback(); });
    bar.querySelector("#pp-nav-open")?.addEventListener("click", openDrawer);
    // Logo/name/slogan click: already home -> smooth-scroll to top (and
    // clear any hash) instead of a same-URL click silently doing nothing;
    // anywhere else -> don't intercept, let the click bubble to
    // js/router.js's normal link handling for the SPA navigation home.
    bar.querySelector("#pp-nav-logo")?.addEventListener("click", e => {
      if (/\/(index\.html)?$/.test(location.pathname)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      }
    });

    if (window.initHoverStyles) window.initHoverStyles(bar);
    syncNavHeight();
  }

  /* Single source of truth for opening/closing the "All pages" drawer —
     every trigger (hamburger tap, X button, scrim click, Escape, tapping
     a link inside the drawer, or a client-side navigation firing
     elsewhere on the page via js/router.js) goes through open/closeDrawer
     so state.drawerOpen, the panel's own built/torn-down DOM, and the
     hamburger's aria-expanded attribute can never drift out of sync with
     each other — that drift (an open drawer surviving a navigation, or a
     stale rebuild flag blocking the next open) was exactly what made a
     second tap unreliable. */
  function syncOpenButton() {
    const btn = document.getElementById("pp-nav-open");
    if (btn) btn.setAttribute("aria-expanded", state.drawerOpen ? "true" : "false");
  }
  function openDrawer() {
    if (state.drawerOpen) return;
    state.drawerOpen = true; state.drawerIn = false; renderDrawer(); syncOpenButton();
    setTimeout(() => { state.drawerIn = true; renderDrawer(); }, 20);
  }
  function closeDrawer() {
    if (!state.drawerOpen) return;
    state.drawerOpen = false; state.drawerIn = false; renderDrawer(); syncOpenButton();
  }

  function renderDrawer() {
    const drawer = document.getElementById("pp-nav-drawer");
    if (!drawer) return;

    if (!state.drawerOpen) {
      if (drawer._ppOpen) { drawer.innerHTML = ""; drawer._ppOpen = false; }
      return;
    }

    // drawer._ppOpen tracks whether the panel DOM is currently built, so
    // opening always builds fresh (guaranteed single-tap reopen) while the
    // drawerIn transition tick 20ms later — still open, DOM already built —
    // only flips the transform/opacity in place, so the scrim's one-shot
    // fade-in animation is never restarted mid-open.
    if (!drawer._ppOpen) {
      drawer._ppOpen = true;
      const drawerLinksHtml = PAGES.map(p => {
        const bg = active === p[1] ? "rgba(242,179,12,.14)" : "transparent";
        return `<a href="${p[4]}" style="display:flex;align-items:baseline;gap:14px;padding:18px 24px;border-bottom:1px solid rgba(247,243,236,.22);text-decoration:none;color:#f7f3ec;background:${bg}" data-hover="background:#ec3013;color:#fff">`
          + `<span style="font:600 10px/1 'Archivo',sans-serif;letter-spacing:.16em;color:#f2b30c;width:28px;flex:none">${p[0]}</span>`
          + `<span style="flex:1"><span style="display:block;font:800 19px/1.1 'Archivo',sans-serif;letter-spacing:-.02em">${p[2]}</span>`
          + `<span style="display:block;font:400 12px/1.45 'Archivo',sans-serif;color:#bab6b6;margin-top:3px">${p[3]}</span></span>`
          + `<span style="font:800 15px/1 'Archivo',sans-serif">→</span></a>`;
      }).join("");

      drawer.innerHTML = `
        <div style="position:fixed;inset:0;z-index:90;display:flex;justify-content:flex-end;font-family:'Archivo',system-ui,sans-serif">
          <div id="pp-nav-scrim" style="position:absolute;inset:0;background:rgba(27,26,25,.62);animation:ppNavFade .22s ease both"></div>
          <div id="pp-nav-panel" style="position:relative;width:min(430px,90vw);height:100%;background:#1b1a19;color:#f7f3ec;border-left:2px solid #1b1a19;overflow-y:auto;transform:${state.drawerIn ? "translateX(0)" : "translateX(16px)"};opacity:${state.drawerIn ? "1" : "0.35"};transition:transform .32s cubic-bezier(.2,.85,.25,1),opacity .28s ease">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:2px solid rgba(247,243,236,.3)">
              <span style="font:800 11px/1 'Archivo',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#f2b30c">Terminal directory</span>
              <button type="button" id="pp-nav-close" style="background:transparent;border:2px solid rgba(247,243,236,.5);color:#f7f3ec;font:800 11px/1 'Archivo',sans-serif;letter-spacing:.14em;padding:9px 12px;cursor:pointer" data-hover="background:#ec3013;border-color:#ec3013">CLOSE ✕</button>
            </div>
            ${drawerLinksHtml}
            <div style="padding:22px 24px;font:400 12px/1.6 'Archivo',sans-serif;color:#bab6b6">Leganés · Madrid<br>Mon—Fri 10:00 — 22:00<br>Weekends &amp; holidays 10:00 — 00:00</div>
          </div>
        </div>`;
      drawer.querySelector("#pp-nav-close")?.addEventListener("click", closeDrawer);
      drawer.querySelector("#pp-nav-scrim")?.addEventListener("click", closeDrawer);
      // Tapping any link inside the drawer closes it immediately; the
      // click event still bubbles to js/router.js's document-level
      // listener afterwards (removing this node from the DOM here doesn't
      // stop that — the browser fixes an event's propagation path before
      // dispatch), so the SPA navigation itself is untouched.
      Array.prototype.forEach.call(drawer.querySelectorAll("a[href]"), a => a.addEventListener("click", closeDrawer));
      if (window.initHoverStyles) window.initHoverStyles(drawer);
    } else {
      const panel = drawer.querySelector("#pp-nav-panel");
      if (panel) {
        panel.style.transform = state.drawerIn ? "translateX(0)" : "translateX(16px)";
        panel.style.opacity = state.drawerIn ? "1" : "0.35";
      }
    }
  }

  function toggleMusicPlayback() {
    if (window.PP_MUSIC) window.PP_MUSIC.toggle(state.musicOn);
  }

  let navH = 0;
  function syncNavHeight() {
    const rootEl = document.querySelector("[data-nav-root]");
    const spacer = document.querySelector("[data-nav-spacer]");
    if (!rootEl) return;
    const h = Math.ceil(rootEl.getBoundingClientRect().height);
    if (h === navH) return;
    navH = h;
    if (spacer) spacer.style.height = h + "px";
    document.documentElement.style.setProperty("--pp-nav-h", h + "px");
    document.querySelectorAll("[data-sticky-under-nav]").forEach(el => { el.style.top = h + "px"; });
    document.querySelectorAll("section").forEach(el => { el.style.scrollMarginTop = (h + 20) + "px"; });
  }

  function tick() {
    const fill = document.querySelector("[data-nav-fill]");
    const plane = document.querySelector("[data-nav-plane]");
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    if (fill) fill.style.width = (p * 100) + "%";
    if (plane) plane.style.left = "calc(" + (p * 100) + "% - 13px)";
  }

  /* The nav is a persistent, single-instance script — js/router.js never
     re-runs it on a client-side page change — so "current page" can't
     stay a value frozen from whichever page happened to load first.
     The router calls this after every swap with the new page's
     PP_ACTIVE value so gate/drawer highlighting stays correct. */
  window.PP_NAV = {
    setActive(next) {
      active = next || "";
      renderBar();
      if (state.drawerOpen) renderDrawer();
    },
    // js/router.js calls this on every internal navigation click, so the
    // drawer never survives onto the next page open and stale.
    closeMenu: closeDrawer
  };

  window.PP_READY(() => {
    const root = document.getElementById("pp-nav");
    if (!root) return;
    root.innerHTML = '<div id="pp-nav-bar"></div><div id="pp-nav-drawer"></div>';

    renderBar();
    let raf = null;
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = null; tick(); }); }, { passive: true });
    window.addEventListener("resize", () => { tick(); syncNavHeight(); });
    window.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
    tick();
    setInterval(syncNavHeight, 350);
    setInterval(() => {
      state.gateFade = 0; renderBar();
      setTimeout(() => { state.gatePage += 1; state.gateFade = 1; renderBar(); }, 260);
    }, 4200);
  });
})();
