/* Patty Passport — shared top nav, ported from PP-Nav.dc.html's x-dc
   template + Component logic (rotating "quick gates", scroll route-line
   progress bar, terminal directory drawer, music toggle) into plain JS
   that renders into <div id="pp-nav"></div>.

   Each page sets `window.PP_ACTIVE = "<gate/drawer key>"` before this
   script runs (see PAGES/GATES keys below) so the nav can highlight the
   current page. */
(function () {
  const PAGES = [
    ["01", "Destinations", "All 21 countries, route by route", "destinations.html"],
    ["02", "Route map", "The Mediterranean network", "route-map.html"],
    ["03", "Menu", "Every dish, by destination", "menu.html"],
    ["04", "Rewards & passport", "Stamps, ladder, unlockables", "rewards.html"],
    ["05", "Events & birthdays", "Celebrations on any route", "events.html"],
    ["06", "Junior explorers", "Kits, booklets, kids routes", "junior-explorers.html"],
    ["07", "Our story", "Why Patty Passport exists", "our-story.html"],
    ["08", "Ask Patty Tooty", "The destination concierge", "patty-tooty.html"],
    ["09", "Investors", "Steer the next route", "investors.html"],
    ["10", "My passport", "Stamps, rewards, bookings", "my-passport.html"],
    ["11", "Book a table", "Choose time, route and destination", "booking.html"],
    ["12", "Home terminal", "The full journey, top to bottom", "index.html"]
  ];
  const GATES = [
    ["Destinations", "destinations.html", "#ec3013"],
    ["Route map", "route-map.html", "#2b76c9"],
    ["Menu", "menu.html", "#f2b30c"],
    ["Rewards", "rewards.html", "#ec3013"],
    ["Events", "events.html", "#f2b30c"],
    ["Kids", "junior-explorers.html", "#2b76c9"],
    ["Story", "our-story.html", "#ec3013"],
    ["Patty Tooty", "patty-tooty.html", "#f2b30c"],
    ["Investors", "investors.html", "#ec3013"],
    ["Book", "booking.html", "#ec3013"]
  ];

  const state = { drawerOpen: false, drawerIn: false, musicOn: false, gatePage: 0, gateFade: 1 };
  const active = window.PP_ACTIVE || "";

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

  function render() {
    const root = document.getElementById("pp-nav");
    if (!root) return;
    const { pg, pages, slice } = computeGates();

    const gatesHtml = slice.map(g => {
      const isActive = active === g[0];
      const bg = isActive ? "#1b1a19" : "transparent";
      const fg = isActive ? "#f7f3ec" : "#1b1a19";
      const border = isActive ? "#1b1a19" : "rgba(27,26,25,.2)";
      return `<a href="${g[1]}" style="display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:2px solid ${border};background:${bg};text-decoration:none;color:${fg};font:600 10px/1 'Archivo',sans-serif;letter-spacing:.13em;text-transform:uppercase;white-space:nowrap" data-hover="border-color:#ec3013;color:#ec3013">`
        + `<span style="width:6px;height:6px;flex:none;background:${g[2]}"></span>${g[0]}</a>`;
    }).join("");

    const drawerLinksHtml = PAGES.map(p => {
      const bg = active === p[1] ? "rgba(242,179,12,.14)" : "transparent";
      return `<a href="${p[3]}" style="display:flex;align-items:baseline;gap:14px;padding:18px 24px;border-bottom:1px solid rgba(247,243,236,.22);text-decoration:none;color:#f7f3ec;background:${bg}" data-hover="background:#ec3013;color:#fff">`
        + `<span style="font:600 10px/1 'Archivo',sans-serif;letter-spacing:.16em;color:#f2b30c;width:28px;flex:none">${p[0]}</span>`
        + `<span style="flex:1"><span style="display:block;font:800 19px/1.1 'Archivo',sans-serif;letter-spacing:-.02em">${p[1]}</span>`
        + `<span style="display:block;font:400 12px/1.45 'Archivo',sans-serif;color:#bab6b6;margin-top:3px">${p[2]}</span></span>`
        + `<span style="font:800 15px/1 'Archivo',sans-serif">→</span></a>`;
    }).join("");

    const drawerHtml = state.drawerOpen ? `
      <div style="position:fixed;inset:0;z-index:90;display:flex;justify-content:flex-end;font-family:'Archivo',system-ui,sans-serif">
        <div id="pp-nav-scrim" style="position:absolute;inset:0;background:rgba(27,26,25,.62);animation:ppNavFade .22s ease both"></div>
        <div style="position:relative;width:min(430px,90vw);height:100%;background:#1b1a19;color:#f7f3ec;border-left:2px solid #1b1a19;overflow-y:auto;transform:${state.drawerIn ? "translateX(0)" : "translateX(16px)"};opacity:${state.drawerIn ? "1" : "0.35"};transition:transform .32s cubic-bezier(.2,.85,.25,1),opacity .28s ease">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:2px solid rgba(247,243,236,.3)">
            <span style="font:800 11px/1 'Archivo',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#f2b30c">Terminal directory</span>
            <button type="button" id="pp-nav-close" style="background:transparent;border:2px solid rgba(247,243,236,.5);color:#f7f3ec;font:800 11px/1 'Archivo',sans-serif;letter-spacing:.14em;padding:9px 12px;cursor:pointer" data-hover="background:#ec3013;border-color:#ec3013">CLOSE ✕</button>
          </div>
          ${drawerLinksHtml}
          <div style="padding:22px 24px;font:400 12px/1.6 'Archivo',sans-serif;color:#bab6b6">Leganés · Madrid<br>Open daily 12:00 — 00:00</div>
        </div>
      </div>` : "";

    const nowPlayingHtml = state.musicOn ? `
      <div style="display:flex;align-items:center;gap:12px;padding:8px 26px;background:#1b1a19;color:#f7f3ec;font:600 9.5px/1 'Archivo',sans-serif;letter-spacing:.16em;text-transform:uppercase">
        <span style="width:7px;height:7px;background:#f2b30c;animation:ppNavBlink 1.3s steps(1) infinite"></span>
        Now playing · Beirut Corniche, 7pm — Levant Route
        <span style="margin-left:auto;color:#bab6b6">42 tracks</span>
      </div>` : "";

    root.innerHTML = `
      <div data-nav-root="1" style="position:fixed;top:0;left:0;right:0;z-index:80;background:#f7f3ec;border-bottom:2px solid #1b1a19;font-family:'Archivo',system-ui,sans-serif">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;padding:11px 26px">
          <a href="index.html" style="display:flex;align-items:center;gap:13px;text-decoration:none;color:#1b1a19;flex:none">
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
            <button type="button" id="pp-nav-open" style="display:inline-flex;align-items:center;gap:10px;padding:10px 13px;background:transparent;border:2px solid #1b1a19;color:#1b1a19;font:800 10.5px/1 'Archivo',sans-serif;letter-spacing:.13em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c" data-active="background:#ec3013;border-color:#ec3013;color:#fff">
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
      ${drawerHtml}
      <div data-nav-spacer="1" style="height:136px"></div>
    `;

    root.querySelector("#pp-nav-music")?.addEventListener("click", () => { state.musicOn = !state.musicOn; render(); });
    root.querySelector("#pp-nav-open")?.addEventListener("click", () => {
      state.drawerOpen = true; state.drawerIn = false; render();
      setTimeout(() => { state.drawerIn = true; render(); }, 20);
    });
    const closeDrawer = () => { state.drawerOpen = false; state.drawerIn = false; render(); };
    root.querySelector("#pp-nav-close")?.addEventListener("click", closeDrawer);
    root.querySelector("#pp-nav-scrim")?.addEventListener("click", closeDrawer);

    if (window.initHoverStyles) window.initHoverStyles(root);
    syncNavHeight();
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

  document.addEventListener("DOMContentLoaded", () => {
    render();
    let raf = null;
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = null; tick(); }); }, { passive: true });
    window.addEventListener("resize", () => { tick(); syncNavHeight(); });
    window.addEventListener("keydown", e => { if (e.key === "Escape" && state.drawerOpen) { state.drawerOpen = false; state.drawerIn = false; render(); } });
    tick();
    setInterval(syncNavHeight, 350);
    setInterval(() => {
      state.gateFade = 0; render();
      setTimeout(() => { state.gatePage += 1; state.gateFade = 1; render(); }, 260);
    }, 4200);
  });
})();
