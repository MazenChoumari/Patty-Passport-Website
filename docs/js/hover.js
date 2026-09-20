/* Patty Passport — hover/active inline-style helper.
   The prototype used non-standard style-hover="..." / style-active="..."
   attributes (a Claude Design authoring shorthand). Real HTML has no such
   attribute, so this scans for data-hover / data-active (plain CSS text,
   same as a style="") and swaps it in on pointer interaction, restoring the
   base style on release/leave. Call initHoverStyles(root) after injecting
   any dynamic markup (nav, footer, country template, etc.) — it's safe to
   call repeatedly, already-bound elements are skipped. */
(function () {
  function bind(el) {
    if (el.__ppHoverBound) return;
    el.__ppHoverBound = true;
    const base = el.getAttribute("style") || "";
    const hover = el.getAttribute("data-hover");
    const active = el.getAttribute("data-active");
    if (hover) {
      el.addEventListener("mouseenter", () => { if (!el.__ppActive) el.setAttribute("style", base + ";" + hover); });
      el.addEventListener("mouseleave", () => { el.setAttribute("style", base); });
    }
    if (active) {
      el.addEventListener("mousedown", () => { el.__ppActive = true; el.setAttribute("style", base + ";" + active); });
      const release = () => { el.__ppActive = false; el.setAttribute("style", el.matches(":hover") && hover ? base + ";" + hover : base); };
      el.addEventListener("mouseup", release);
      el.addEventListener("mouseleave", release);
    }
  }
  window.initHoverStyles = function (root) {
    (root || document).querySelectorAll("[data-hover], [data-active]").forEach(bind);
  };
  document.addEventListener("DOMContentLoaded", () => window.initHoverStyles());
})();
