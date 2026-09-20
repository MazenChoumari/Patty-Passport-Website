/* Patty Passport — Home page interactivity. Drives every dynamic hook left
   in index.html: scroll-reveal (data-rv), word-stagger headlines
   (data-word-group + gh-* ids), background parallax (data-par), the
   data-driven hero prop columns / ticker / identity carousel / culture
   eq bars / passport preview (all sourced from window.PP_DATA), the
   boarding-pass print sequence, the mini Patty Tooty preview, and the
   check-in console's route filter chips. */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  /* ── Headline copy for the word-stagger sections ── */
  var HEADLINES = {
    "gh-pass": "PRINTED AT THE DESK. YOURS TO KEEP.",
    "gh-map": "THE MEDITERRANEAN, ONE TERMINAL.",
    "gh-regions": "FIVE ROUTES. TWENTY-ONE DESTINATIONS.",
    "gh-culture": "EVERY ZONE HAS A SOUNDTRACK.",
    "gh-nature": "THE LAND BEHIND EVERY PLATE.",
    "gh-garden": "A GARDEN FOR TWENTY-ONE COUNTRIES.",
    "gh-passport": "FILL THE BOOK. FLY AGAIN.",
    "gh-kit": "SMALL TRAVELLERS GET THE FULL KIT.",
    "gh-adultkit": "GROWN-UPS TRAVEL PROPERLY TOO.",
    "gh-family": "EVERYONE GETS A PASSPORT.",
    "gh-welcome": "THERE'S A LANE FOR EVERYONE.",
    "gh-crew": "MEET THE JOURNEY CREW.",
    "gh-invest": "HELP US FLY THE NEXT ROUTE.",
    "gh-tooty": "NOT SURE WHERE TO HEAD?",
    "gh-checkin": "READY TO CHECK IN?"
  };

  function initWordGroups() {
    Object.keys(HEADLINES).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el._ppWords) return;
      el._ppWords = true;
      var words = HEADLINES[id].split(" ");
      el.innerHTML = words.map(function (w, i) {
        return '<span style="display:inline-block;opacity:0;transform:translateY(.4em);transition:opacity .5s cubic-bezier(.2,.8,.25,1) ' + (i * 0.05) + 's,transform .6s cubic-bezier(.2,.85,.25,1) ' + (i * 0.05) + 's">' + w + (i < words.length - 1 ? "&nbsp;" : "") + '</span>';
      }).join("");
    });
  }

  function revealWordGroup(el) {
    if (el._ppRevealed) return;
    el._ppRevealed = true;
    Array.prototype.forEach.call(el.querySelectorAll("span"), function (s) {
      s.style.opacity = "1";
      s.style.transform = "none";
    });
  }

  /* ── Generic scroll reveal: data-rv="up|left|right|scale", data-rv-d=ms delay ── */
  var RV_FROM = {
    up: "translateY(28px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    scale: "translate(-50%,-50%) scale(.88)"
  };
  function initScrollReveal() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-rv]"));
    var headings = Array.prototype.slice.call(document.querySelectorAll("h2[data-word-group]"));
    nodes.forEach(function (el) {
      if (el._ppInit) return;
      el._ppInit = true;
      var dir = el.getAttribute("data-rv");
      var base = RV_FROM[dir] || RV_FROM.up;
      var isScale = dir === "scale";
      el.style.opacity = "0";
      if (!isScale) el.style.transform = base;
      el.style.transition = "opacity .7s cubic-bezier(.2,.8,.25,1), transform .8s cubic-bezier(.2,.85,.25,1)";
    });
    function check() {
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (!n._ppDone && r.top < window.innerHeight * 0.94 && r.bottom > 0) {
          n._ppDone = true;
          var delay = parseInt(n.getAttribute("data-rv-d") || "0", 10);
          setTimeout(function () {
            n.style.opacity = "1";
            var dir = n.getAttribute("data-rv");
            n.style.transform = dir === "scale" ? "translate(-50%,-50%) scale(1)" : "none";
          }, delay);
        }
      });
      headings.forEach(function (h) {
        var r = h.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) revealWordGroup(h);
      });
    }
    check();
    var raf = null;
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(function () { raf = null; check(); }); }, { passive: true });
    window.addEventListener("resize", check);
    setInterval(check, 400);
  }

  /* ── Background parallax circles: data-par="0.12" ── */
  function initParallax() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-par]"));
    if (!els.length) return;
    function tick() {
      els.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-par")) || 0;
        var r = el.parentElement.getBoundingClientRect();
        var center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = (el.style.transform.indexOf("rotate") > -1 ? el.style.transform.replace(/translateY\([^)]*\)\s*/, "") : "") ;
        el.style.transform = "translateY(" + (center * -f * 0.15).toFixed(1) + "px)";
      });
    }
    var raf = null;
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(function () { raf = null; tick(); }); }, { passive: true });
    tick();
  }

  function eur(n) { return "€" + n.toFixed(2).replace(/\.00$/, ".0"); }

  /* ── Hero flowing prop columns ── */
  function renderHeroProps(countries) {
    var half = Math.ceil(countries.length / 2);
    var colA = countries.slice(0, half), colB = countries.slice(half);
    function chip(c) {
      return '<a href="destination.html#' + c.code + '" style="display:flex;align-items:center;gap:8px;padding:9px 11px;background:rgba(255,255,255,.94);color:#1b1a19;text-decoration:none;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.06em;border:2px solid #1b1a19" data-hover="background:#f2b30c">'
        + '<span style="width:8px;height:8px;flex:none;background:' + RED + '"></span>' + c.stamp + '&nbsp; ' + c.name.toUpperCase() + '</a>';
    }
    document.getElementById("pp-propsA").innerHTML = colA.map(chip).join("") + colA.map(chip).join("");
    document.getElementById("pp-propsB").innerHTML = colB.map(chip).join("") + colB.map(chip).join("");
  }

  /* ── Terminal departures ticker ── */
  function renderTicker(countries) {
    var track = document.getElementById("pp-ticker-track");
    var items = countries.map(function (c) {
      return '<span style="display:flex;align-items:center;gap:10px;padding:10px 22px;white-space:nowrap;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.14em">'
        + '<span style="color:#f2b30c">' + c.med + '</span>' + c.name.toUpperCase() + '<span style="color:#605d5d;margin-left:6px">&#9670;</span></span>';
    }).join("");
    track.innerHTML = items + items;
  }

  /* ── Country identity carousel (all 21, duplicated for seamless loop) ── */
  function renderIdentityTrack(countries) {
    var track = document.getElementById("pp-identity-track");
    function card(c) {
      return '<a href="destination.html#' + c.code + '" style="display:flex;flex-direction:column;gap:14px;width:260px;flex:none;padding:26px 22px 24px;border-right:2px solid rgba(247,243,236,.25);text-decoration:none;color:#f7f3ec" data-hover="background:rgba(247,243,236,.06)">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d7979">' + c.stamp + '<span>' + c.med + '</span></div>'
        + '<div style="font:800 26px/1 \'Archivo\',sans-serif;letter-spacing:-.025em">' + c.name.toUpperCase() + '</div>'
        + '<div style="font:400 13px/1.5 \'Archivo\',sans-serif;color:#bab6b6;min-height:40px">' + c.identity + '</div>'
        + '<div style="margin-top:auto;padding-top:12px;border-top:1px solid rgba(247,243,236,.22);display:flex;align-items:center;justify-content:space-between;gap:10px">'
        + '<span style="font:800 13px/1.15 \'Archivo\',sans-serif">' + c.heroItem.name + '</span><span style="font:800 13px/1 \'Archivo\',sans-serif;color:#f2b30c">' + eur(c.heroItem.price) + '</span></div>'
        + '</a>';
    }
    var html = countries.map(card).join("");
    track.innerHTML = html + html;
  }

  /* ── Culture eq bars ── */
  function renderCultureEq() {
    var el = document.getElementById("pp-eqbars-culture");
    el.innerHTML = Array.from({ length: 22 }, function (_, k) {
      var color = k % 4 === 0 ? RED : k % 3 === 0 ? YEL : INK;
      var dur = (0.5 + (k % 6) * 0.14).toFixed(2) + "s";
      var delay = ((k % 7) * 0.08).toFixed(2) + "s";
      return '<span style="flex:1;background:' + color + ';height:30%;animation:ppEq ' + dur + ' ease-in-out ' + delay + ' infinite alternate"></span>';
    }).join("");
  }

  /* ── Passport preview (fixed demo state: 6 of 21 stamped, matches the
     static reward-ladder copy already on the page: "8: 2 TO GO", "21: 15 TO GO") ── */
  function renderPassport(countries) {
    var STAMPED = 6;
    document.getElementById("pp-passport-progress").textContent = STAMPED + " OF 21 STAMPED";
    var grid = document.getElementById("pp-stamp-grid");
    grid.innerHTML = countries.map(function (c, i) {
      var on = i < STAMPED;
      return '<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:' + (on ? "#1b1a19" : "#fff") + ';color:' + (on ? "#f2b30c" : "#c9c5c5") + ';font:800 10px/1 \'Archivo\',sans-serif;letter-spacing:.04em">' + (on ? c.stamp : "&middot;") + '</div>';
    }).join("");
  }

  /* ── Boarding pass print sequence: one-shot reveal when section scrolls into view ── */
  function initBoardingPass() {
    var sec = document.querySelector('[data-pass-sec]');
    if (!sec) return;
    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      var card = document.querySelector('[data-pass-card]');
      var rows = Array.prototype.slice.call(document.querySelectorAll('[data-pass-row]'));
      var bar = document.querySelector('[data-pass-bar]');
      var stamp = document.querySelector('[data-pass-stamp]');
      var hint = document.querySelector('[data-pass-hint]');
      if (card) { card.style.transition = "transform .8s cubic-bezier(.2,.85,.25,1)"; card.style.transform = "translateY(0)"; }
      rows.forEach(function (r, i) {
        setTimeout(function () {
          r.style.transition = "opacity .5s ease";
          r.style.opacity = "1";
        }, 500 + i * 160);
      });
      setTimeout(function () {
        if (bar) { bar.style.transition = "width 1.1s cubic-bezier(.2,.8,.25,1)"; bar.style.width = "100%"; }
      }, 500 + rows.length * 160 + 100);
      setTimeout(function () {
        if (stamp) {
          stamp.style.transition = "opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1)";
          stamp.style.opacity = "1";
          stamp.style.transform = "rotate(-11deg) scale(1)";
        }
        if (hint) hint.textContent = "Printed — PP-LBN-2026";
      }, 500 + rows.length * 160 + 1200);
    }
    function check() {
      var r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.6 && r.bottom > 0) fire();
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    setInterval(check, 400);
  }

  /* ── Mini Patty Tooty preview ── */
  function initTootyPreview(data) {
    var qEl = document.getElementById("pp-tooty-question");
    var aEl = document.getElementById("pp-tooty-answer");
    var pillsEl = document.getElementById("pp-tooty-pills");
    var chipsEl = document.getElementById("pp-tooty-chips");
    var input = document.querySelector('#tooty input[type="text"]');
    var send = document.querySelector('#tooty button');
    if (!qEl) return;

    var countries = (data && data.COUNTRIES) || [];
    function findByTag(tag) {
      for (var i = 0; i < countries.length; i++) {
        var hit = countries[i].items.find(function (it) { return it.tags.indexOf(tag) > -1 && it.group === "Burgers"; });
        if (hit) return { country: countries[i], item: hit };
      }
      return null;
    }

    var SUGGESTIONS = [
      "We're vegetarian, where should we start?",
      "Something halal and not spicy?",
      "What do kids usually love?",
      "How do the passport stamps work?"
    ];

    function answer(question) {
      var q = question.toLowerCase();
      var pills = [];
      var text;
      if (/vegan|vegetarian|veg\b/.test(q)) {
        var hit = findByTag("Vegetarian");
        text = hit ? "Start with " + hit.country.name + "'s " + hit.item.name + " — a proper vegetarian headline, not a substitution." : "Every one of the 21 countries has a vegetarian headline dish — check the menu.";
        if (hit) pills.push({ label: "Visit " + hit.country.name, href: "destination.html#" + hit.country.code });
      } else if (/halal|spicy|spice/.test(q)) {
        text = "All 21 routes are halal-friendly by default. For something mild, try Lebanon or Greece; for heat, Morocco or Tunisia run spicier.";
        pills.push({ label: "Try Lebanon", href: "destination.html#lbn" }, { label: "Try Morocco", href: "destination.html#mar" });
      } else if (/kid|child/.test(q)) {
        text = "Kids usually land on Lebanon's Shish Tawouk or Italy's Caprese — both mild, familiar shapes with a country twist.";
        pills.push({ label: "Junior Explorers", href: "junior-explorers.html" });
      } else if (/stamp|passport|reward/.test(q)) {
        text = "One stamp per destination. 3 gets a free drink, 5 a free side, 8 a secret burger, and all 21 unlocks the World Traveller buffet.";
        pills.push({ label: "See Rewards", href: "rewards.html" });
      } else {
        text = "Tell me who's at the table — spicy, vegetarian, halal or alcohol-free — and I'll pick the destination.";
        pills.push({ label: "Ask Patty Tooty", href: "patty-tooty.html" });
      }
      qEl.textContent = question;
      aEl.textContent = text;
      pillsEl.innerHTML = pills.map(function (p) {
        return '<a href="' + p.href + '" style="display:inline-flex;align-items:center;gap:6px;padding:8px 11px;background:#f2b30c;color:#1b1a19;text-decoration:none;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.05em;border:2px solid #1b1a19" data-hover="background:#1b1a19;color:#f7f3ec">' + p.label + ' &#8594;</a>';
      }).join("");
      if (window.initHoverStyles) window.initHoverStyles(pillsEl);
    }

    chipsEl.innerHTML = SUGGESTIONS.map(function (s) {
      return '<button type="button" data-q="' + s.replace(/"/g, "&quot;") + '" style="padding:9px 12px;background:#fff;border:2px solid #1b1a19;color:#1b1a19;font:600 12px/1.3 \'Archivo\',sans-serif;cursor:pointer;text-align:left" data-hover="background:#1b1a19;color:#f7f3ec">' + s + '</button>';
    }).join("");
    if (window.initHoverStyles) window.initHoverStyles(chipsEl);

    chipsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (btn) answer(btn.getAttribute("data-q"));
    });
    function submit() {
      var v = (input.value || "").trim();
      if (!v) return;
      answer(v);
      input.value = "";
    }
    if (send) send.addEventListener("click", submit);
    if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });

    answer("We're 4 adults and 2 kids — one of us is vegetarian, spicy is fine.");
  }

  /* ── Check-in console route filter chips: cosmetic active-state toggle ── */
  function initRouteChips() {
    var group = document.querySelectorAll('#checkin button[type="button"]');
    group.forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.forEach(function (b) { b.style.background = "transparent"; b.style.color = "#f7f3ec"; });
        btn.style.background = "#f2b30c";
        btn.style.color = "#1b1a19";
      });
    });
  }

  function boot() {
    var data = window.PP_DATA;
    initWordGroups();
    initScrollReveal();
    initParallax();
    initBoardingPass();
    initRouteChips();
    if (data) {
      renderHeroProps(data.COUNTRIES);
      renderTicker(data.COUNTRIES);
      renderIdentityTrack(data.COUNTRIES);
      renderCultureEq();
      renderPassport(data.COUNTRIES);
      initTootyPreview(data);
      if (window.initHoverStyles) window.initHoverStyles(document.body);
    } else {
      window.addEventListener("pp-data-ready", boot, { once: true });
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
