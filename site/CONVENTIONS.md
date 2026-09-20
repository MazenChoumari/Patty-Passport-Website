# Patty Passport — rebuild conventions

We are converting a Claude Design prototype export (`.dc.html` files under
`/home/claude/repo/project/`) into a real static HTML/CSS/JS site under
`/home/claude/repo/site/`. **Preserve the visual design exactly** — same
layout, same colors, same copy, same section order. This is a format
migration, not a redesign. Do not invent new sections or drop existing ones
unless a convention below tells you to.

## Source material (read before writing any page)

- The `.dc.html` file(s) you're converting, in `/home/claude/repo/project/`.
- `/home/claude/repo/project/uploads/patty_passport_master_brief.md` — the
  content/logic source of truth. If the prototype's copy conflicts with the
  brief's data (prices, structure, descriptions), prefer the brief — but the
  prototype and brief agree almost everywhere already, so this should be rare.
- `/home/claude/repo/site/js/data.js` — the merged, already-correct data
  module (`window.PP_DATA`: COUNTRIES with menu items + culture copy,
  PRICES, COMBOS, UPGRADES, MIN_SPEND, SCENARIOS (Investors, corrected
  totals already computed live), FUNDING, OPERATING, SEVEN_PS, HOURS). Read
  it to see the exact shape before writing code that consumes it.

## What `.dc.html` syntax maps to

The prototype uses a custom "dc-runtime" format. Translate it like this:

| Prototype syntax | Plain-HTML/JS equivalent |
|---|---|
| `<x-dc>...</x-dc>` wrapper | Delete the wrapper tag, keep the inner markup |
| `<helmet>` | Merge into the real `<head>` |
| `{{ expr }}` mustache binding | Real value, computed in JS and injected via template literal / textContent, or hard-coded if truly static |
| `<sc-if value="{{ cond }}">...</sc-if>` | Plain JS conditional (ternary in a template literal, or `if` before building markup) |
| `<sc-for list="{{ arr }}" as="x">...</sc-for>` | `arr.map(x => `...`).join('')` |
| `<dc-import name="PP-Nav" active="X">` | `<div id="pp-nav"></div>` + set `window.PP_ACTIVE = "X"` before loading `js/nav.js` (see below) |
| `<dc-import name="PP-Footer">` | `<div id="pp-footer"></div>` + load `js/footer.js` |
| `style="..." style-hover="..."` | Keep `style="..."` as-is, rename `style-hover` to `data-hover` (same CSS text). Same for `style-active` → `data-active`. `js/hover.js` (already loaded site-wide) makes these work as real interactions. |
| `<image-slot id="..." placeholder="...">` | `<div class="pp-placeholder" style="position:absolute;inset:0;aspect-ratio:...if known"><span>[same placeholder caption text]</span></div>` — see Images below |
| `onClick="{{ fn }}"` | Real `addEventListener` wired up after the markup is inserted |
| `data-rv="up" data-rv-d="120"` scroll-reveal markers | Keep these attributes and port the reveal logic (see Destination-Page's `componentDidMount` "setup" function as the reference — fade+translateY on scroll into view, staggered by the `data-rv-d` ms delay). A small shared version of this exists conceptually per-page; feel free to inline a short `initScrollReveal()` at the bottom of the page's own `<script>` if the page uses `data-rv`. |
| `class Component extends DCLogic { state = {...}; renderVals() {...} }` | A plain IIFE or small render function with a JS `state` object, a `render()` that rebuilds the relevant DOM (same pattern as `js/nav.js` — read it for a worked example), and real event listeners |

## Page shell (every page)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Patty Passport — <Page Name></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&display=swap">
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/site.css">
<!-- any other page-specific inline <style> keyframes the original .dc.html had, ported verbatim -->
</head>
<body>
<div id="pp-nav"></div>

<!-- page content, converted from the <x-dc> body -->

<div id="pp-footer"></div>

<script src="js/data.js"></script>   <!-- only if the page needs country/pricing/financial data -->
<script>window.PP_ACTIVE = "Destinations";</script>  <!-- the gate/drawer key this page maps to, see js/nav.js PAGES/GATES lists. Use "" if the page isn't one of the drawer's 12. -->
<script src="js/hover.js"></script>
<script src="js/nav.js"></script>
<script src="js/footer.js"></script>
<script src="js/<page-name>.js"></script>  <!-- this page's own render/interaction logic -->
</body>
</html>
```

Keep each page's own dynamic logic in a matching `js/<page-name>.js` file
rather than inline in the HTML — mirrors how `js/nav.js`/`js/footer.js`
already work, keeps the HTML file readable.

## Filenames (all lowercase-hyphenated, flat at site root)

`index.html` (Home), `destinations.html`, `destination.html` (single
country template, hash-routed `#lbn` etc.), `menu.html`, `rewards.html`,
`route-map.html`, `events.html`, `junior-explorers.html`, `booking.html`,
`our-story.html`, `investors.html`, `my-passport.html`, `patty-tooty.html`,
`legal.html`. Internal links must use these filenames (the originals link
to e.g. `Menu.dc.html` — rewrite every such link to `menu.html`, etc.,
including the special case `Patty Passport Home.dc.html` → `index.html`).

## Images

No real photography exists yet. Every image slot becomes a
`.pp-placeholder` div (defined in `css/site.css`) sized/positioned exactly
where the original `<image-slot>` sat (same `position:absolute;inset:0` or
whatever the original wrapper used), showing the same placeholder caption
text the prototype specified. Do not wait for real images — this is
explicitly a "ship with placeholders" build per the master brief.

## Verification

After writing a page, open it mentally against the source: every section
in the `.dc.html` should have a corresponding section in your output, same
order, same copy. Check that every `href` resolves to a real file in this
convention's filename list (no orphan links to `.dc.html` files). If a
page's JS references `window.PP_DATA`, make sure `js/data.js` is loaded
before it in the `<script>` order.

Do not touch `js/nav.js`, `js/footer.js`, `js/hover.js`, `js/data.js`,
`css/styles.css`, `css/site.css`, or any other page's files — work only on
the files you were asked to build.
