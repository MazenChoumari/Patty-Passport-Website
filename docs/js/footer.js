/* Patty Passport — shared footer, ported from PP-Footer.dc.html, rendered
   into <div id="pp-footer"></div>. Static; no per-page config needed. */
(function () {
  const colA = [
    ["Destinations", "destinations.html"],
    ["Route map", "route-map.html"],
    ["Menu", "menu.html"],
    ["Rewards & passport", "rewards.html"],
    ["Our story", "our-story.html"]
  ];
  const colB = [
    ["Events & birthdays", "events.html"],
    ["Junior explorers", "junior-explorers.html"],
    ["Ask Patty Tooty", "patty-tooty.html"],
    ["Investors", "investors.html"],
    ["My passport", "my-passport.html"],
    ["Book a table", "booking.html"],
    ["Home terminal", "index.html"]
  ];
  function col(list) {
    return list.map(l => `<a href="${l[1]}" style="text-decoration:none;color:#bab6b6;font:400 12.5px/1.5 'Archivo',sans-serif" data-hover="color:#f2b30c">${l[0]}</a>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("pp-footer");
    if (!root) return;
    root.innerHTML = `
      <div style="background:#1b1a19;color:#f7f3ec;padding:52px 32px 30px;border-top:2px solid #1b1a19;font-family:'Archivo',system-ui,sans-serif">
        <div style="max-width:1240px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:30px;border-bottom:2px solid rgba(247,243,236,.25)">
          <h2 style="font:800 clamp(28px,3.4vw,46px)/.96 'Archivo',sans-serif;letter-spacing:-.035em;margin:0;max-width:18ch">STILL DECIDING? THE DESK IS OPEN.</h2>
          <div style="display:flex;flex-wrap:wrap;gap:10px">
            <a href="booking.html" style="display:inline-flex;align-items:center;min-width:230px;padding:15px 18px;background:#ec3013;color:#fff;text-decoration:none;font:800 14px/1.1 'Archivo',sans-serif" data-hover="background:#f2b30c;color:#1b1a19">Reserve your flight<span style="margin-left:auto">→</span></a>
            <a href="patty-tooty.html" style="display:inline-flex;align-items:center;min-width:210px;padding:15px 18px;border:2px solid #f7f3ec;color:#f7f3ec;text-decoration:none;font:800 14px/1.1 'Archivo',sans-serif" data-hover="background:#f7f3ec;color:#1b1a19">Ask Patty Tooty<span style="margin-left:auto">→</span></a>
          </div>
        </div>
        <div style="max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:26px;padding:30px 0 26px;border-bottom:2px solid rgba(247,243,236,.25)">
          <div>
            <div style="font:800 15px/1 'Archivo',sans-serif;margin-bottom:10px">PATTY PASSPORT</div>
            <div style="font:400 12.5px/1.6 'Archivo',sans-serif;color:#bab6b6">Parque Tecnológico de Leganés<br>Calle Innovación 12, 28918 Leganés, Madrid</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:7px">${col(colA)}</div>
          <div style="display:flex;flex-direction:column;gap:7px">${col(colB)}</div>
          <div style="font:400 12.5px/1.6 'Archivo',sans-serif;color:#bab6b6">+34 91 123 45 67<br>WhatsApp +34 600 123 456<br>hello@pattypassport.com<br>invest@pattypassport.com<br><br>Mon—Fri 10:00 — 22:00<br>Weekends &amp; holidays 10:00 — 00:00<br><br>Instagram · TikTok · X · Facebook<br>@pattypassport</div>
        </div>
        <div style="max-width:1240px;margin:22px auto 0;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font:600 9.5px/1.6 'Archivo',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7d7979">
          <span>© 2026 Patty Passport World S.L. All rights reserved.</span>
          <span style="display:flex;gap:14px;flex-wrap:wrap">
            <a href="legal.html#faq" style="color:#7d7979;text-decoration:none" data-hover="color:#f2b30c">FAQ</a>
            <a href="legal.html#allergens" style="color:#7d7979;text-decoration:none" data-hover="color:#f2b30c">Allergens</a>
            <a href="legal.html#privacy" style="color:#7d7979;text-decoration:none" data-hover="color:#f2b30c">Privacy</a>
            <a href="legal.html#terms" style="color:#7d7979;text-decoration:none" data-hover="color:#f2b30c">Terms</a>
          </span>
          <span>Halal-friendly · Vegetarian · Vegan · Allergy-aware · Alcohol-free lanes</span>
        </div>
      </div>
    `;
    if (window.initHoverStyles) window.initHoverStyles(root);
  });
})();
