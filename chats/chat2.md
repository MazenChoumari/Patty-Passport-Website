# Homepage expansion and clarification

_Started 2026-09-20 00:52 UTC_

---

## User

Continuing from "Patty Passport homepage redesign".

## Assistant

We were building out the Patty Passport homepage — a nine-scene, motion-rich travel narrative with scroll-driven storytelling. The brand direction is Modernist (red/yellow/blue on cream, zero radius, Archivo typeface, structured grid), and the homepage unfolds like a destination journey: hero check-in → boarding pass print sequence → route map reveal → region discovery → country identity cards → passport/stamp system → kids kit parallax → culture/music → booking console.

I delivered `Patty Passport Home.dc.html` with all nine scenes live and interactive (scroll-driven animations, ticker motion, print sequences, parallax layers, region alternation, stamp landing, equalizer animation, console layout). The three earlier hero explorations remain in `Patty Passport.dc.html` for reference. All imagery is marked as drop-in placeholder slots so you can swap real photos in later without touching the layout.

Next in the queue: convert the homepage into a 9-slide deck (one scene per slide) using the deck-stage starter component, then export it as PPTX. After that: the Lebanon country page (the template for all 21), then the Destinations overview, then Menu & Rewards, Events, Team, and Investors pages in that order — all data-driven from the global menu grid (Section 6 of the brief) so edits stay synchronized across the site.

The build follows the master brief structure (Sections 5.1–5.9) and uses the corrected financial figures from Section 6.7 so the Investors page will compute scenario totals live from underlying category inputs rather than hard-coded strings.

Files in play: `Patty Passport Home.dc.html`, `Patty Passport.dc.html`, `support.js`.

## User

This is not a redesign request.

Keep the current homepage exactly as the base direction because it is working extremely well. Do not remove or replace the existing successful sections, and do not flatten the current animation system. The current flow, motion, color hierarchy, and storytelling are strong.

What I want now is a logical expansion pass that adds more story and clarity without losing the current homepage.

Important:
- keep all current sections
- keep the current animation style and existing motion effects
- keep the current color system
- keep the current layout language
- keep the current chapter / route / passport / ticket world
- do not simplify
- do not restart
- do not replace the homepage with a new concept

Use this homepage order:

1. Hero / check-in statement
2. Terminal strip / stats / route fragments
3. Ticket-printing section
4. “What country do you want to order to your table?” map section
5. “Five routes. Each one its own chapter.” route overview
6. Individual route chapter sections
7. Soundtrack / music section
8. NEW: Nature routes section
9. Passport / rewards section
10. Kids explorer kit section
11. NEW: Adult travel kit section
12. NEW: Everyone gets a passport / family bridge section
13. NEW: Different tables. One warm welcome. dietary / inclusion section
14. NEW: Meet the crew section
15. NEW: Investor CTA section
16. Booking / reserve / route selection console
17. Footer / final travel details

New section details:

A. Nature routes
Add after soundtrack and before passport.
Headline:
“Every route grows from somewhere.”
Message:
“Not just different destinations. Different worlds.”
Show Mediterranean landscapes, trees, plants, coastlines, and nature identities connected to each route.

B. Adult travel kit
Add after kids or near the passport ecosystem.
Headline:
“Book your table. Pack your curiosity.”
Show the adult destination bag / booklet / ticket / tag / country info kit.

C. Everyone gets a passport
Create a bridge between the kids and adult experiences.
Show Junior Passport, Explorer Passport, Family Passport, etc.

D. Inclusion / dietary section
Add after the experience ecosystem sections.
Headline:
“Different tables. One warm welcome.”
Show halal, kosher, vegetarian, vegan, allergy-aware, and family-friendly options clearly and elegantly.

E. Meet the crew
Add a human section using travel language.
Show Route Host, Passport Desk, Destination Guide, Kitchen Crew, Table Captain.
Include button to dedicated page.

F. Investor CTA
Add near the lower part of the homepage before booking or near the end.
Headline:
“Want to help steer the next route?”
Button:
“Explore the Opportunity”

Also keep and improve:
- fixed top navigation while scrolling
- fixed progress bar, but replace arrow with airplane icon
- more mixed props in the first blue hero side (not just Lebanon; add other country fragments too)
- more subtle motion on text, labels, cards, props, and route elements
- replace placeholder image areas with real coherent imagery
- replace internal placeholder titles with customer-facing labels where needed
- improve the logo into a stronger iconic passport-burger emblem
- keep current homepage buttons, and also allow top navigation to open detailed pages through a menu drawer

Again:
Do not remove the current successful sections.
Do not change the homepage’s overall creative direction.
This is a completion and expansion pass in the exact existing style.

## Assistant

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: dc_write]_

_[tool: tool_search_tool_bm25]_

_[tool: ready_for_verification]_

Expanded in place — all original sections kept, same motion system and palette.

New: terminal departures strip (2), Nature routes (8), Adult travel kit (11), Everyone gets a passport (12), Different tables inclusion grid (13), Meet the crew (14), Investor CTA (15). Reordered to your 17-step sequence.

Also: nav is now fixed with a full "All pages" drawer (10 destinations, Esc to close), progress bar uses an airplane icon, hero's blue side gained Greece, Morocco and Spain props alongside Lebanon, and map nodes now sway subtly. Every image area is a real drop target with a specific caption (e.g. "Cedar forest on a Lebanese mountain slope") — drag photos in and they persist.

Two notes: the crew button points at the on-page crew section until that page exists, and passport progress is now a tweak (0–21) that drives both the stamp grid and the reward ladder states.

## User

Found issues — fixing…

## Assistant



## User

This is amazing. Please keep the current homepage exactly as it is overall — the direction, layout language, color system, scroll storytelling, and animation spirit are all working really well. I do NOT want a redesign or simplification. I only want these specific refinement notes:

1. Logo
The logo is already strong, but please review it so it feels a bit more burger-like and also more passport-like at the same time.
Right now it reads more as a strong emblem than a burger/passport hybrid.
Please push the icon so the burger idea is more visible while still feeling premium and brandable.
I want it to feel iconic, compact, and ownable.

2. Slogan
Please test which line works better in the system:
- “Stamping your way through flavor”
or
- “Order the Mediterranean to your table”
Try both and keep the one that feels strongest with the homepage.

3. Quick access bar / top shortcut area
The quick-access options are good, but can we make them rotate/move so only a few show at once (for example 4 at a time), then slide away and reveal the others in a loop?
The goal is to keep it clean but still surface more homepage sections over time.

4. Blue hero side / prop area
I saw you added more cards, tickets, and destination props, which is great.
Please fill that blue space even more with additional destination fragments and rotating props.
Add more variety from more countries like Türkiye, Italy, Malta, Bosnia, etc.
It should feel fuller and more alive.

5. Ticket-printing section text
Please improve the text under the title in the printing section.
Current idea should become something more like:
“As you arrive, you check in at the desk, receive your boarding pass, and watch your route come to life. Keep scrolling to print it.”
Keep it sharp and on-brand.

6. Ticket-printing section title animation
The title there feels a bit static compared to the rest.
Please give the title a subtle entrance animation — for example letters typing in, or a staggered reveal when it enters the viewport.
Not crazy, just more alive.

7. Kids section CTA
In the kids section, please add another CTA option besides the birthday/events one.
For example:
- “Book a kids journey”
or
- “Explore junior destinations”
Something that makes the section useful even beyond birthdays.

8. Inclusion cards
In the “One warm welcome” section, please make each box/button clickable.
Halal, Kosher-friendly, Vegetarian, Vegan, Allergy-aware, Family-friendly should all link to the menu / dining options page or filtered menu state.

9. Home section titles
Across the homepage, please give the major section titles subtle motion/entrance animations.
They do not need to be dramatic, but they should feel alive and intentional like the rest of the page.
Keep all existing animations, just add more finesse.

10. Music button
Please add the “Play the Mediterranean” / music button in the top bar somewhere in a clean way.
It should feel integrated into the navigation system, not random.

11. Navigation button
The three-line / all-pages button is excellent.
Please just make sure the interaction works perfectly and feels polished.
It should open smoothly, feel intentional, and be production-level.

Again:
Please keep what is already there.
This homepage is working very well.
These are refinement notes only.

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

Refinements applied, plus the earlier verifier fixes (hero props no longer overlap, DS bundle loaded, unique slot ids).

1. **Logo** — now reads burger-first inside a passport cover: sesame-dotted bun, cheese line, patty, base bun, ink book frame, "21" stamp corner.
2. **Slogan** — kept "Order the Mediterranean to your table". It states the product; "Stamping your way through flavor" repeats the passport idea the stamps already carry visually.
3. **Quick access bar** — 12 shortcuts cycling 4 at a time, fading every 4.2s (paused in reduced motion).
4. **Blue hero side** — rebuilt as a two-column baggage-carousel of 12 props (Türkiye, Italy, Malta, Bosnia, Croatia, Palestine, Albania, Egypt, Greece, Morocco, Spain, Lebanon) flowing opposite directions behind the #01 stamp. Fuller, and no clipping at any width.
5/6. **Ticket section** — new copy, and the title now reveals word by word on entry.
7. **Kids** — added "Explore junior destinations" beside the birthday CTA.
8. **Inclusion cards** — all six are links now with ink hover states.
9. **Section titles** — staggered word reveal on 14 major headlines.
10. **Music** — "Play the Mediterranean" in the top bar; playing state shows live bars and a now-playing strip.
11. **Drawer** — slide-and-fade in, Esc to close, pressed state on the button, 11 entries.

Next up unless you redirect: the Patty Tooty section is live on the homepage — I can extract it as a shared component and start the detailed page system (Destinations first).

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the reveal system — rect-driven inside the scroll loop, with a safety net.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Both fixed.

Reveals no longer depend on IntersectionObserver — visibility is computed from element rects inside the existing scroll loop (which runs on load, scroll, resize) plus a 400ms poll and a 2.6s safety sweep, so nothing can end up stuck at opacity 0.

The quick-access rail now has its own full-width row under the logo bar — "Quick gates", four shortcuts rotating every 4.2s, with a "Gate 1 / 3" counter on the right. Nav spacer and anchor offsets adjusted to match.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

All three fixed: the drawer now animates from state rather than a post-mount DOM write (slides and fades to full opacity on open), the safety sweep only touches nodes already in the viewport so scroll entrances still play below the fold, and `ppFade` is defined for the backdrop.

## User

<pasted_text name="Pasted text (257 lines)">
IMPORTANT:
The homepage is now DONE.
Do not redesign it.
Do not restructure it.
Do not replace its sections.
Do not convert homepage buttons into section-scroll anchors.
Do not touch the homepage except to connect its existing buttons to separate detailed pages.

The homepage is now the finished overview / story page.
It should stay exactly as it is.
From now on, the task is to build ALL the separate detailed pages that the homepage buttons and navigation should lead to.

This is the new phase:
HOME = brief immersive story / brand journey
INNER PAGES = detailed dedicated pages for each major topic

I need you to understand this clearly:
the homepage sections are only teasers / previews.
Each important section on the homepage must have a button or CTA that leads to its own separate full page.
Do NOT keep users trapped on the homepage.
Do NOT solve this by linking everything to home sections.
Create the actual detailed pages.

Use the same design system and visual language already established on the homepage:
- same logo treatment
- same color system
- same typography system
- same buttons
- same motion language
- same card logic
- same premium travel-editorial art direction
- same icon style
- same spacing rhythm

The inner pages must feel like extensions of the same Patty Passport world.
Do not let them become generic.
Do not switch to random dashboard / template / corporate styling.

Now build these separate pages and wire homepage buttons to them.

PAGE SYSTEM TO CREATE:

1. Destinations hub page
Purpose:
The main page users land on when they click homepage buttons like “Get your boarding pass”, “Start your route”, “Choose your destination”, etc.

What it should include:
- all destinations presented clearly
- filters by region / route
- hero section explaining the destination journey
- destination cards with strong cultural identity
- direct links into each individual country page
- same Patty Passport style, premium and immersive

Homepage links that should go here:
- Get your boarding pass
- Start your route
- Explore destinations
- Choose your destination
- Any CTA inviting users to begin their journey

2. Individual destination pages
Purpose:
One full page per destination / country.
These are deep pages, not just cards.

Each destination page should include:
- strong hero
- destination identity line
- cultural intro
- beautiful facts / history / mood
- burger or meal tie-in
- drinks / sides / desserts if relevant
- reward or passport tie-in
- related routes
- CTA to book / order / continue journey

Examples:
- Lebanon page
- Greece page
- Türkiye page
- Spain page
- Morocco page
etc.

Homepage links that can eventually land here indirectly:
- destination cards
- route map interactions
- featured destination buttons

3. Route Map page
Purpose:
A separate dedicated page for the Mediterranean route system.

Include:
- designed map
- clickable routes and regions
- route legend
- chapter logic
- animated lines / nodes
- travel planning atmosphere
- links to destinations within each route

Homepage links that should go here:
- map section CTA
- “Discover the routes”
- “See the Mediterranean map”
- route-related prompts

4. Menu page
Purpose:
A full Patty Passport menu page, not generic food tiles.

Include:
- destination-based menu structure
- route labels / country markers
- featured burgers and meals
- drinks / desserts / kids
- dietary indicators
- same travel storytelling visual language

Homepage links that should go here:
- food discovery CTA
- discover the menu
- what’s on the route
- any direct meal/menu CTA

5. Rewards / Passport page
Purpose:
A fully detailed page for the stamp system, rewards, passport logic, and progression.

Include:
- passport booklet visuals
- stamp collection system
- reward unlocking
- milestones
- benefits
- how it works
- progress examples
- CTA to join / log in / start collecting

Homepage links that should go here:
- passport section button
- rewards CTA
- collect your stamps
- unlock your route

6. Events &amp; Birthdays page
Purpose:
A fully detailed branded events page.

Include:
- birthdays
- family celebrations
- school / group visits
- destination-themed event packages
- inquiry form
- storytelling around the event experience
- same design language, not a generic form page

Homepage links that should go here:
- event CTA
- birthday CTA
- celebrate with us
- group booking CTA

7. Junior Explorers / Kids page
Purpose:
A dedicated detailed page for kids activities, travel kits, explorer booklets, stickers, and family engagement.

Include:
- explorer passport
- stickers / activity kits
- kids menu tie-ins
- educational / playful elements
- same world and style, just slightly more playful

Homepage links that should go here:
- kids activities CTA
- family / junior explorer CTA
- booklet / sticker / travel kit prompts

8. Investors page
Purpose:
A fully detailed investment page.
This is very important.
This should not be a small section.
It must be its own complete page.

Include:
- investment overview
- concept explanation
- business model
- growth logic
- rollout plan
- costs
- land / location / footprint considerations
- financial planning
- opportunity framing
- strategic value
- expansion logic
- investor-facing storytelling and data structure

Homepage links that should go here:
- investment CTA
- partner / investors CTA
- growth / rollout prompt
- any investor-facing button

9. Our Story / Brand page
Purpose:
A full page for the concept, identity, mission, and brand world.

Include:
- why Patty Passport exists
- the Mediterranean storytelling concept
- values
- food + travel philosophy
- brand mood
- visual richness and narrative

Homepage links that should go here:
- our story CTA
- about Patty Passport
- concept / philosophy prompts

10. Patty Tooty AI page or expanded assistant state
Purpose:
A more detailed destination-guide / concierge page connected to the homepage Patty Tooty section.

Include:
- chatbot hero panel
- suggested prompts
- sample assistance types
- discover destinations
- kids help
- rewards help
- bookings help
- route suggestions

Homepage links that should go here:
- Ask Patty Tooty
- Need help choosing?
- concierge / assistant CTA

CRITICAL RULES:
- every homepage CTA must link to one of these dedicated pages
- the homepage remains the overview only
- do not make inner pages just hidden home sections
- do not make anchors for everything
- create actual pages
- keep all pages in the same style system
- maintain a coherent navigation and page hierarchy
- use the homepage as the hub and the inner pages as the deep-dive destinations

Please review the code file structure you already created and now add these pages properly.
Use the existing Patty Passport codebase/style direction rather than starting a disconnected new design.
</pasted_text>

## Assistant

Building the page system. Starting with the shared nav and footer components.

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: update_todos]_

## Assistant

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: update_todos]_

Now rewiring the homepage CTAs to the new pages.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the JS-side links (drawer, quick gates, dietary cards, Tooty pills, country chips).

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

The full page system is in place — homepage untouched except for its links.

**New pages** (all sharing `PP-Nav` + `PP-Footer`, same palette, type, borders, reveal motion, image slots):

- **Destinations** — 21 cards, live route filter, ticker, "how a destination works"
- **Destination-Page** — one deep page per country, hash-routed (`#lbn`, `#grc`…): hero in the route colour, quick facts, culture essay, phrase card with equaliser, signature plate + pairings, related route stops, booking CTA. All 21 countries have real written content.
- **Route-Map** — clickable node map, legend isolates a chapter, per-chapter stop grids
- **Menu** — route × dietary-lane filtering, 21 signature plates, sides/coolers/sweets/junior
- **Rewards** — interactive stamp spread (±), five-rung ladder that unlocks live, how it works, three passport tiers
- **Events** — five packages, evening timeline, floating props, booking console
- **Junior-Explorers** — explorer kit, junior routes, what kids learn, parent info
- **Investors** — full model computed from underlying inputs (covers, ticket, events, retail, cost ratios) with conservative/base/stretch scenarios recalculating revenue, EBITDA, margin and payback; build-out breakdown, rollout, site criteria, moat
- **Our-Story** — the concept argument, five beliefs, timeline, crew
- **Patty-Tooty** — eight concierge threads, each ending in real page links

Homepage CTAs now route out: boarding pass and destinations → Destinations, route map → Route-Map, country chips → their country page, passport → Rewards, birthday → Events, junior → Junior-Explorers, crew → Our-Story, opportunity → Investors, Tooty → Patty-Tooty, dietary cards → Menu. The drawer and quick-gates rail now list the ten real pages; only "Book a table" stays an on-page anchor since the console lives on the homepage.

## User

Found issues — fixing…

## Assistant

Porting the homepage's rotating gate rail into PP-Nav and driving offsets from the measured nav height.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Both nav defects fixed at the root.

The quick-gates rail now rotates four gates at a time with the homepage's fade and a "Gate n / 3" counter — no scrollbar, no clipped chip. On each inner page it starts on the page that contains that page's own gate, so the active one is visible on arrival.

Nav height is now measured, not hardcoded: PP-Nav writes its real height into the spacer, into any `[data-sticky-under-nav]` bar, and into every section's `scroll-margin-top`, re-syncing on resize, on music-strip toggle and via a ResizeObserver. The Destinations and Menu filter bars carry that attribute, so they pin flush under the nav instead of 7px behind it.

## User

<attached_files>
- uploads/patty_passport_master_brief.md
</attached_files>

<pasted_text name="Pasted text (305 lines)">
IMPORTANT CONTEXT
- The detailed pages and overall design are now PERFECT. Do not redesign or restructure anything globally.
- Only improve the specific areas below: Investors page, Menu completeness, Passport login popups, Our Story founders section, and booking / reserve forms.
- Keep the same design system, components, layout style, motion language, and art direction you already established.

================================================
1. INVESTORS PAGE – UPGRADE USING THE 7Ps + SCENARIO SELECTORS
================================================

Goal:
Make the Investors page crystal clear for partners using a structured 7Ps view + live scenario cards, without changing the visual style or the rest of the site.

Source:
Use the existing instructions and data in the Patty Passport master brief:
- Section 5.7 Investors page spec.
- Sections 6.4–6.10 for land, building, exterior, operating costs, investment scenarios, and financial model.
- The 7Ps summary for investors in Section 6.9–6.10. [This is already written – just structure it visually.] [file:278]

Keep:
- All current design and layout of the Investors page.
- All existing charts and tables you already built.
- All corrected ranges for A1/A2/B1/B2 and the calculation logic.
We are not scrapping your work; we are adding clarity and structure.

A. Add 7Ps Structure to the Investors Page

Create a clearly marked **“Business model in 7Ps”** section on the Investors page. Use the existing 7Ps summary from the brief and render it as a **clean grid or tab system**, not just a text block. [file:278]

Use these seven blocks:

1) Product
- Use the “Product” part of the summary: destination burgers per country, loaded fries, salads, desserts, drinks, Full Experience and Quick Bite formats, passports &amp; stamps, kids journeys, birthdays, group packages, music &amp; activities. [file:278]
- Visually show at least one product card per type (burger, combo, kids, events) with short lines.

2) Price
- Use global price and combo grid: Quick Bite 13–15 €, Full Buffet 24–26 €, kids birthdays 18–22 €/child, minimum spend 10 €/adult &amp; 8 €/child, alcoholic upgrade 2.5 €, hot drink upgrade 2.0 €. [file:278]
- Show a small table or chart summarizing these key ranges.

3) Place
- Use the land + building context: Leganés and Villaverde plots, 1,500–2,000 m building, double‑height hall, 40–50 parking, Mediterranean garden. [file:278]
- Show a short description and maybe a tiny schematic map / plan cards for A/B.

4) Promotion
- Use the passport stamps, combos, country nights, seasonal menus, digital + offline marketing, UGC challenges. [file:278]
- Show bullet points or badges for each promo type.

5) People
- Use founders + 42‑person team concept: Mazen, Ahmed, Journey Crew, kitchen, kids guides, etc. [file:278]
- Summarize in a mini “team structure” card (founders + staffing model).

6) Process
- Use the guest journey: check‑in, destination choice, ticket, seating, destination card, passport stamp, next route. [file:278]
- Show it as a numbered flow or timeline.

7) Physical Evidence
- Use the double‑height sky hall, mezzanine, route pockets, exterior garden, packaging, tickets, passports, website. [file:278]
- Show images / icons representing physical assets.

You already have all the text; just organize it visually and label each part clearly as P1–P7 so investors see the whole business in one structured view.

B. Scenario Selector – Plot and Plan Buttons

Add an interactive **scenario selector component** near the CAPEX section, while keeping your current charts intact:

- Show four cards or buttons:
  - Plan A1 – Leganés, 1,500 m building
  - Plan A2 – Leganés, 2,000 m building
  - Plan B1 – Villaverde, 1,500 m building
  - Plan B2 – Villaverde, 2,000 m building

When the user clicks a scenario card:
- Highlight the card (active state).
- Update the visible CAPEX ranges (land, building, exterior, fees, licences, contingency, working capital) using the corrected totals from Section 6.6–6.7. [file:278]
- Update the total investment range (low/high).
- Trigger recalculation of:
  - Annual profit vs that investment,
  - ROI (%) and payback (years),
  using the model in Section 6.8–6.9. [file:278]

Important:
- Use live computation from the underlying data arrays/objects (as the brief already told you), not hard‑coded strings.
- Do NOT change the numbers themselves; just surface them in a clear, clickable scenario selector.

C. Plot &amp; Measurements Buttons

Within each scenario, add **plot + footprint options**:

- For each scenario (A1/A2/B1/B2), show:
  - Land size (2,500 m or 3,000 m).
  - Building size (1,500 m or 2,000 m).
  - Approximate parking capacity and garden space (using the logic in Section 6.5–6.6). [file:278]

Allow the investor to select:
- Building size option (1,500 vs 2,000 m), and
- See how parking spaces and garden change (e.g. 40 vs 50 spaces and garden areas).

Display a small differences table:
- Spaces, m² left for garden/plaza, tree count range, etc.

D. Breakeven &amp; Sales Block

Add a clearly labeled **“Break-even &amp; sales”** block summarizing:

From Section 6.8:
- Base case guests/day, average spend, annual revenue. [file:278]
- Break-even fixed cost and guests/month/day.
- Base-case annual profit, ROI %, payback years for one chosen scenario (e.g. A1 midband 4.8m).
- Note: mention that ROI/payout adjust automatically for whichever scenario is selected via the scenario cards.

Use a simple mini chart or clear table, not a huge wall of text.

E. Investor / Partner Buttons + Popup Form

For the **“Invest / Partner” buttons** on the Investors page:
- Make sure clicking them opens a small **popup or inline form** (front-end only for now).
- The form should have fields like:
  - Name
  - Email
  - Phone / WhatsApp
  - Investment interest (checkboxes or dropdown for scenario A1/A2/B1/B2, ticket sizes, equity/loan interest)
  - Message box
- No real backend yet – just show sample behavior and store locally / mock state.

Keep styling consistent with the rest of the site (same buttons, same cards, same input style).

================================================
2. MENU PAGE – ADD ALL MISSING PRODUCTS (KEEP DESIGN)
================================================

Goal:
Complete the Menu page so it includes **all products** you planned, per country, without changing the design.

Source:
Use Section 5.3 (Country page template), Section 5.4 (Menu &amp; Rewards), and Section 6.1–6.3 for the global price grid and full menu data for all 21 countries. [file:278]

Rules (already in the brief, but make them visible in code):

For **each country** menu, you must include:
- 3 burgers:
  - 1 veg burger
  - 1 chicken burger
  - 1 beef burger
- 2 loaded fries variants
- 1 salad
- 1 cold country drink
- 1 alcoholic country drink
- 1 hot drink
- 2 desserts

Prices:
- Burger prices from global price grid: veg 10.5 €, chicken 11.5 €, beef 13.0 €. [file:278]
- Loaded fries 5.5 €, salad 6.5 €, cold drink 3.5 €, alcoholic drink 6.5 €, dessert 5.5 €, hot drink 2.5 €. [file:278]
- Combos from global combo grids (Quick Bite, Loaded Fries Combo, Salad Combo, Full Buffets). [file:278]

Instruction:
1. Read Section 6.3 “All 21 Countries Full Menu Data” for the exact names and compositions for each item. [file:278]
2. Ensure the Menu page (and each country page where you surface menu items) includes ALL of those products:
   - Burgers, loaded fries, salads, desserts, soft drinks, cold country drinks, local beer, alcoholic country drinks, hot drinks.
3. Do not change the visual design – keep your card layout, typography, colors, and grouping as-is.
4. Just fill in missing items where you only showed some of the products and forgot others (desserts, fries, drinks, etc.).
5. Use the dietary tags logic from the brief (Halal-friendly, Kosher-sensitive, No pork, Alcohol-free, Vegetarian, etc.) and apply tags to each item correctly. [file:278]

If anything is missing on the Menu page now:
- Use the brief as the single source of truth.
- Do not invent new items; pull them exactly from Section 6.3.

================================================
3. PASSPORT / REWARDS – LOGIN POPUP FOR “COLLECT” BUTTONS
================================================

Goal:
When users click **Passport / Collect / Rewards / My Passport** related buttons, they should:
- either go to the My Passport page, or
- open a small login / create account popup.

Source:
Use Section 5.8 (Login / My Passport shell) and 5.4–5.6 for the rewards logic. [file:278]

Instructions:
- Keep My Passport page as front-end only.
- Add a small modal or drawer that appears when the user clicks:
  - “Collect your stamps”
  - “See your rewards”
  - “My Passport”
  - any “Join” or “Create account” CTA related to passport.

The modal should show:
- Name field
- Email field
- Password (or simple PIN) field
- “Create my Patty Passport” button
- “Log in instead” link

Behavior:
- No real backend – just mock state, but show the flow visually.
- Once user “submits”, show their mock stamps / rewards view (the existing My Passport shell).

Keep styling aligned with the rest of the site.

================================================
4. BOOKING / RESERVE – MAKE SURE ALL BOOK/RESERVE BUTTONS GO TO THE RIGHT PATH
================================================

Goal:
Any button that mentions **book, reserve, check-in, flight** should:
- open a booking form or
- navigate to the dedicated Booking / Reserve page.

Source:
Your brief already defines “Reserve Your Flight” / booking as a core action on Home and other pages. [file:278]

Instructions:
- Find all buttons and links with text like:
  - Reserve Your Flight
  - Ready to check in?
  - Reserve a table
  - Book a birthday
  - Book an event
- Make sure each one:
  - either navigates to the booking / events page, or
  - opens a booking form inline/modal (frontend only).
- The booking form should allow:
  - Date and time selection
  - Destination (country/route)
  - Number of guests
  - Name
  - Contact details (email/phone)

No backend required – just mock behavior.

================================================
5. OUR STORY – FOUNDERS + HOURS
================================================

Goal:
Update the **Our Story** page to show:
- Founders images (placeholders for now),
- Founders backstory showing that you are already business owners in other restaurants,
- Hours of operation,
- A short “how we met and decided to invest” paragraph – keeping the same design.

Source:
Use Section 5.6 Our Story / Team for founders names and existing copy as the base. [file:278]

Instructions:

A. Founders images and copy
- Add a section with two founder cards:
  - Mazen Choumari
  - Ahmed Al Moutaz (use this name; user will confirm surname later).
- Each card:
  - Image placeholder (founder will upload later).
  - Name.
  - Role.
  - Short bio.

Suggested text (you can adjust tone but keep meaning):

For Mazen:
“Mazen Choumari – Co‑Founder, Global Journeys Lead. Mazen runs other restaurant and business operations today and has previously grown an electronics company between Spain and the UAE. He brings global trade, logistics, and hospitality experience to Patty Passport.”

For Ahmed:
“Ahmed Al Moutaz – Co‑Founder, Retail Experience Lead. Ahmed owns and runs retail and restaurant businesses in Spain, with deep experience in high‑street customers, visual merchandising, and day‑to‑day operations. He brings the real‑world restaurant perspective we need to make Patty Passport work in practice.”

Add a short paragraph under the two cards:
“We met through running our own restaurants and businesses, and realized we shared the same spirit: connecting people, places, and stories. Patty Passport is our decision to invest in a new idea and to find partners and crew who share that spirit—people who believe a burger can be a destination, not just a quick bite.”

B. Hours of operation
Add a clear **Hours &amp; Opening** block on Our Story or Contact / Footer:

- Weekdays: 10:00 AM – 10:00 PM
- Weekends &amp; holidays: 10:00 AM – 12:00 AM (midnight)

Make this visible wherever you show practical info, without breaking the design.

================================================
6. READY TO CHECK IN / RESERVE – OPTIONS FOR TIME, DESTINATION, ROUTE
================================================

For the “Ready to check in?” and similar CTAs on Home and elsewhere:
- The interface should let the guest choose:
  - Time (timeslot),
  - Destination (country),
  - Route (Levant, Aegean, Iberia, North Africa, etc.),
  - Name (passenger).

Then when they submit:
- Show a ticket‑style confirmation component (like the boarding pass example already in the brief) with their name, destination, route, and table seat. [file:278]

Again, no backend; just mock logic.

================================================
7. GENERAL – ENSURE ALL BUTTONS ACTUALLY GO SOMEWHERE
================================================

Final check:
- Make sure every button in the site:
  - either navigates to the correct detailed page (Destinations, Menu, Rewards, Events, Investors, My Passport, etc.), or
  - opens a relevant popup/modal (login, booking, investor interest form).
- No orphan buttons or dead CTAs.
- Do not change the look; just wire the interactions properly.

================================================
END OF INSTRUCTIONS – IMPROVE ONLY THESE PARTS, KEEP THE REST
================================================
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Modernist (design system)">
[Design System] This project uses the **Modernist** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

This project has the **Modernist_modern** design system bound at `_ds/modernist-cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/`. If anything under that path is missing or fails to load, the folder name may differ — `list_files` `_ds/` and use the folder whose name ends with cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69 instead, including in the <link>/<script> paths below.

**Loading the bundle is how you use this design system.** Every Design Component you build must load `_ds/modernist-cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/_ds_bundle.js` in `<helmet>` (include it in child DCs too — de-duped by URL) and compose with its components — do not recreate those components from scratch or restyle raw HTML to look like them. At the top of the template:

```html
<helmet>
  <link rel="stylesheet" href="_ds/modernist-cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/styles.css">
  <script src="_ds/modernist-cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/_ds_bundle.js"></script>
</helmet>
```

Then mount any component directly in the template — no logic class needed:

```html
<x-import component-from-global-scope="Modernist_modern.Button" hint-size="auto,40px">Label</x-import>
```

Props are template attributes (kebab → camelCase); template children pass through as `props.children`. The linked stylesheet(s) carry the design tokens (colors, type, spacing) — style against those via `var(--*)` and the design system's classes rather than guessing values.

**Start from a template if one matches.** Before building from scratch, check whether a template below matches the user's request. Read the template (list its folder, `read_file` the entry) and decide: if it's close to what's asked, `copy_files` the folder as your starting point; if you'd rather re-author in DC, `dc_write` a new page using the template as your structural reference. When this design system is bound, `copy_files` repoints the copied `ds-base.js` automatically — only edit its base line yourself if the copy result says so, or when copying from an unbound project (change `'../..'` to your `_ds/modernist-cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69` path). (Older templates have no `ds-base.js` and carry `../../…` bundle/stylesheet refs in their pages instead — repoint those by hand.)

- `Deck` (`/projects/cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/templates/deck/`) — A twenty-one-slide presentation starter: cover, contents, dividers, columns, quadrants, a data table, SVG charts and timeline, bleed imagery, a quote and a close, on the theme's tokens
- `Landing` (`/projects/cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/templates/landing/`) — A one-page product landing in the system's own voice — an invented product (Takt: Swiss-clockwork timetables), a ruled hero, stat row, feature rows, a grayscale photograph and a red poster close

The full design-system source tree lives at `/projects/cf9009e6-65ae-4cc3-81bb-0a0e3ffc9a69/` — use `list_files` / `read_file` from there for anything not under `_ds/` (layout varies by brand; don't assume folder names). Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Modernist design system

Modernist is flat, architectural and set entirely in Archivo: a near-mono red on white, a visible modular grid, zero corner radius and strong 2px rules. Nothing floats and nothing is decorated — alignment and the strength of the dividers do all the organising, labels sit flush left (even inside buttons), and photography prints in pure black and white.

## How to use this

- Link the one stylesheet from every page — `&lt;link rel="stylesheet" href="styles.css"&gt;` (adjust the relative path) — and take every color, font, spacing, radius and shadow from its variables (`var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`). Never hard-code a hex, a font name or a px value the tokens already carry.
- Build with the classes below rather than inventing parallel ones; the component pages are plain HTML, so view source and copy the markup.
- `templates/` holds starting points a consuming project can copy whole.
- The whole system was derived from `theme.json`. To change the look, edit the tokens at the top of `styles.css` — every page, the thumbnail and this guide read from them — and keep `theme.json` and the written guidance in step so they don't drift from what the CSS actually does.

## Direction

Modular grid layouts — content in equal-width cells, strong horizontal and vertical rhythm, visible structure. Use strong 2px dividers (`var(--color-divider)`) between major sections. Button labels are flush left — a button wider than its label starts the text at the left padding edge (trailing icon and all), never centered. Wrap hero and inline images in the `.grayscale` class — they print in pure black and white.

## Color

A light ground (`--color-bg` #f3f2f2) with `--color-text` #201e1d and a single accent #ec3013 (this is a mono scheme: no second accent was chosen — the `--color-accent-2-*` variables carry a machine-derived stand-in kept only so both sets resolve; treat them as one role). Each role carries a 100–900 tonal ramp (`--color-neutral-100` … `--color-accent-2-900`) generated in OKLCH on a shared perceptual lightness scale, so the same step of any ramp has the same visual weight. Use the light steps (100–300) for tinted fills, hovers and subtle borders, 500 as the role's base, and the dark steps (700–900) for text on tinted fills and for pressed states; prefer ramp steps over ad-hoc `color-mix()`. For elevation use `--shadow-sm/md/lg` (already tuned to the ground) rather than ad-hoc box-shadows.

## Type

Archivo for headings over Archivo for body text, loaded as `--font-heading` / `--font-body`. Density 1.00× and radius 0px are already baked into the `--space-*` / `--radius-*` scales — use the variables, not raw numbers.

## Icons

Use Lucide icons (https://lucide.dev) throughout.

## Interaction states

Interactive states are themed, never browser defaults: give every interactive element a `:hover` tint and a pressed state from the accent ramp (one step past the base — `--color-accent-600` on a light ground, `--color-accent-400` on a dark one, or a `color-mix()` tint for outlined/ghost variants), and style keyboard focus with `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — never leave the default blue focus ring.

## Components

| Class | What it is | Shown in |
| --- | --- | --- |
| `.btn` with `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon`, `.btn-block` | Actions — the primary is a solid accent fill | components/buttons.html |
| `.tag` with `.tag-accent`, `.tag-accent-2`, `.tag-neutral`, `.tag-outline` | Small labels tinted from the ramps (mono palette: accent-2 reads the same as accent) | components/buttons.html |
| `.field` + `label`, `.input`, `.radio` + `.dot`, `.seg` + `.seg-opt` | Form fields and choices on native elements — no script | components/forms.html |
| `.card` with `.card-kicker`, `.card-title`, `.card-body`, `.card-meta`; `.elev-sm/md/lg` | Surface-filled content cards; elevation utilities | components/cards.html |
| `.nav` + `.nav-brand` | The header bar | components/navigation.html |
| `.table` | Data tables with themed header and row rules | components/table.html |
| `.dialog-backdrop` + `.dialog` (+ `.dialog-title/-body/-actions`) | A modal at the top elevation | components/dialog.html |
| `.hr` | A strong 2px horizontal rule | foundations/layout.html |
| `.grayscale` | The image wrapper — every content photograph goes through it | foundations/image.html |

States are built in: hovers and pressed states come from the accent ramp, keyboard focus is the 2px accent `:focus-visible` ring, `::selection` is an accent tint, and disabled controls drop to 45% opacity. Don't restyle them per page. The accent-to-ground pair is tuned to at least 3:1 — enough for icons, large text and interface chrome, not for body copy — so for paragraph-size text in the accent use a deep ramp step (`--color-accent-700` on this ground) rather than the accent itself.

## Do

- Let the grid show: equal-width cells, strong horizontal rules between sections, visible structure.
- Keep everything flush left — headings, copy, and the labels inside wide buttons.
- Use the accent sparingly, for the primary action and small emphasis; the system is mostly ink on ground. The one place red runs as a field is the poster statement — the deck's section dividers and the landing's closing banner — where type stays display-grade and the accent carries the page.
- Print photographs in black and white with the `.grayscale` wrapper.

## Don't

- Do not round a corner anywhere — `--radius-md` is 0 on purpose.
- Do not center button labels or hero copy.
- Do not soften the rules into hairlines or drop them for whitespace.
- Do not tint or colorize imagery.

## Files

- `styles.css` — the only stylesheet: the token sheet (`:root` variables, ramps, base type) plus the component layer. Link it from every page.
- `readme.md` — this guide.
- `theme.json` — the parameters these files were derived from (a machine-readable record of the theme).
- `thumbnail.html` — the project cover (brand mark + swatches).
- `foundations/type.html` — the type scale and the heading/body pairing at real sizes.
- `foundations/color.html` — color roles and the 100-900 tonal ramps, with usage notes.
- `foundations/layout.html` — the spacing scale, the grid and how edges are drawn.
- `foundations/icons.html` — the icon set at interface sizes, inline and in buttons.
- `foundations/image.html` — how photographs and figures are treated.
- `components/buttons.html` — buttons, icon buttons and tags in every variant and state.
- `components/forms.html` — text fields, radios and the segmented control on native elements.
- `components/cards.html` — content cards and the elevation steps.
- `components/navigation.html` — the header bar pattern.
- `components/table.html` — a data table with the themed header and row rules.
- `components/dialog.html` — a modal over its backdrop at the top elevation.
- `theme.html` — the theme's parameters rendered as a reference sheet.
- `templates/landing/` — a starter page consuming the system the intended way (`index.html`, its `ds-base.js` loader, and the vendored `image-slot.js` its photograph mounts).
- `assets/photo.jpg` — the reference photograph the imagery page treats.

</design-system-guide>
</attached-skill>

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

Reading complete. Building the shared data module and the full menu first.

_[tool: write_file]_

Now the full Menu page rebuilt on that data.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: get_webview_logs]_

Now the country page menu, Booking page, and My Passport page.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the Booking page and My Passport page.

_[tool: dc_write]_

_[tool: dc_write]_

Now the Investors upgrade: 7Ps, scenario selector, footprint options, break-even, and the partner form.

_[tool: dc_write]_

_[tool: snip]_

_[tool: snip]_

_[tool: update_todos]_

## Assistant

_[tool: update_todos]_

## Assistant

Adding the founders and hours to Our Story.

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

Now wiring the remaining CTAs across nav, footer, homepage and the other pages.

_[tool: run_script]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

All five areas are in, built on a new shared `pp-data.js` that carries the brief's §6.1–6.3 menu data and §6.4–6.10 financials — so nothing is a hard-coded string.

**Investors** — added "Business model in 7Ps" as a P1–P7 tab system with a summary and four evidence cards each; a four-card scenario selector (A1/A2/B1/B2) that recomputes the CAPEX breakdown, corrected total range, ROI at low/mid/high, payback and the capital gap after the €900k committed; a footprint toggle showing plot, building, land left, parking, garden and tree count per scenario; a "Break-even & sales" block with the three revenue cases, live annual P&L and break-even at ~31 guests/day; and an "Explore the Opportunity" popup with name, contact, scenario, ticket size, structure and message.

**Menu** — now the complete card for every country: 3 burgers, 2 loaded fries, salad, cold/alcoholic/hot country drinks and 2 desserts, at the global price grid, with dietary tags derived per item and route/course/diet filters. The nine combos, the full price grid, upgrades and minimum spend sit below. Country pages carry the same full card grouped by course.

**Passport** — new My Passport page: create/log-in modal (name, email, PIN, switch link), then the stamp spread you can tap, the five-rung ladder and mock bookings. All passport CTAs point at it.

**Booking** — new page: route → destination → time → passenger → guests, then a printed boarding-pass confirmation with stamp, gate and table. Every reserve/check-in button across the site now lands there.

**Our Story** — founder cards for Mazen Choumari and Ahmed Al Moutaz with image slots and bios, the "how we met" paragraph, and an hours block (10:00–22:00 weekdays, 10:00–00:00 weekends), also added to the footer.

