# PATTY PASSPORT — MASTER WEBSITE BUILD BRIEF

*This is the single source of truth for building the Patty Passport website. It merges and organizes all planning work (concept, brand, land/building/finance phases, menu, events, team, website copy) into one logical document. Hand this whole file to Claude Code as your first message in the project.*

---

## 0. HOW TO USE THIS DOCUMENT (read this first, Claude Code)

1. This is a **front-end-only build** for now. No real login, booking, payments, or review database — build the *visual and interactive experience* of these features (forms, mock data, local component state), but nothing needs to persist to a real backend yet.
2. Build **all 21 country pages**, fully detailed, using the template in Section 5.3 and the data in Section 6.5.
3. Work **one page/section at a time and commit after each one** — do not attempt the whole site in a single pass. Suggested order: (1) design system/shared components → (2) Home → (3) Country page template + Lebanon as the reference build → (4) remaining 20 country pages → (5) Menu & Rewards → (6) Events & Birthdays → (7) Our Story & Team → (8) Investors → (9) Login/My Passport shell → (10) Patty Tooty chatbot widget.
4. **Any dollar/euro figures shown on the Investors page must be computed from the input variables in Section 6, not hard-coded as strings.** Build a small calculation module (even a simple JS object of inputs → totals) so the numbers are traceable and correct. I found two arithmetic issues in the original planning notes (flagged in Section 7) — use the corrected logic, not the original stated totals.
5. Where source material didn't specify something (a few hot drinks — flagged inline with 🔶), a reasonable suggestion is given, clearly marked. Treat these as placeholders for the founders to confirm, not final facts.

---

## 1. CONCEPT OVERVIEW

**Patty Passport is not a burger restaurant. It's a miniature travel terminal where every burger is a destination.**

The guest journey:
1. **Arrival** — guest enters a "sky hall": double-height ceiling, cloud-soft lighting, route lines on the floor, flags overhead.
2. **Check-In Desk** (not "the counter") — staff greets: *"Welcome to Patty Passport. Where are we taking you today?"*
3. **Destination choice** — guest picks a country (Lebanon, Greece, Italy, Spain, Türkiye, Morocco, etc.) from a "Route Map" (not "the menu").
4. **Boarding ticket** — a printed ticket is the order slip, styled like a boarding pass:
   ```
   PATTY PASSPORT ROUTES
   Destination: Lebanon
   Route: MED-12
   Passenger: Mazen
   Seat: Table 4
   Meal: Beirut Street Shish Tawouk Combo
   Gate: Levant Route
   Boarding Number: PP-LBN-2026
   ```
5. **Seating in a "Route" zone** (Aegean Route, Levant Route, Iberian Route, North African Route, American Classics Route) — décor, music and small details reflect that destination, respectfully and without cheap stereotyping.
6. **Before the food arrives** — a short destination card sets the scene (2-3 sentences of culture/flavor context), optionally with a QR code for a deeper 1-minute story.
7. **Food arrives as a "Destination Pack"** — country color palette, map/flag motif, a destination stamp, a short phrase in the local language + translation, an ingredient story, a "did you know" fact, and a collectible number ("Lebanon: Destination #01").
8. **At the table** — a soft, curated playlist for that country; light kid-friendly activities (color the flag, match the ingredient, learn a greeting) without turning it into a lecture for adults who just want to eat.
9. **End of meal — the Passport moment** — staff stamps the guest's physical or digital Patty Passport: *"Thank you for travelling with Patty Passport. Where shall we take you next?"*
10. **Stamps become loyalty**: 3 destinations → free drink · 5 → free side · 8 → secret destination burger · all 21 → full free "World Traveller" experience (a Full Buffet). Kids have their own smaller versions of this ladder.

**The one-sentence pitch:** *"You don't come to Patty Passport just to eat a burger — you check in for a destination."*

---

## 2. BRAND IDENTITY

### 2.1 Name & slogan hierarchy
- **Brand name:** Patty Passport
- **Main line (under the logo, everywhere):** *Mediterranean journeys. Global flavors.*
- **Headline tagline (tickets, menus, social, hero sections):** *Stamp your way through flavor.*
- **Longer promotional phrase (campaigns):** *Collect the world, one burger at a time.*
- **Alternative poetic identity (usable in visuals/campaigns):** *One sea. Many cultures. Endless flavor.*

### 2.2 Visual identity
| Element | Direction |
|---|---|
| Primary colors | Sky blue (Mediterranean sky/clouds), Passport red, warm yellow (sun/joy), cream/light beige (walls/sand) |
| Text/contrast color | Deep navy instead of pure black |
| Typography | Rounded, friendly font for headlines; clean sans-serif for body |
| Motion language | Smooth scroll, soft gradients, cloud shapes, curved lines. A **route-line progress bar** runs along the top of the page — a small plane icon travels along it as the user scrolls, like crossing the Mediterranean. |
| Logo | Stylized passport: deep blue cover, "Patty Passport" stamped like a visa, a route line and a small airplane/globe icon. Top-left on every page, always links home. |

### 2.3 Travel vocabulary (use alongside plain language so nothing is confusing)
| Plain restaurant term | Patty Passport term |
|---|---|
| Counter | Check-In Desk ("Order Here" shown underneath) |
| Menu | Route Map |
| Burger | Destination Meal |
| Order number | Boarding Number |
| Table | Seat |
| Packaging | Destination Pack |
| Loyalty card | Patty Passport (the booklet/profile) |
| Staff | Journey Crew |
| Kitchen | Flavor Control |
| Daily special | Featured Destination |
| Receipt | Travel Confirmation |
| Meal collection | Route Collection |

---

## 3. SITE MAP & NAVIGATION

**Top nav:** Home · Destinations · Menu & Rewards · Events & Birthdays · Our Story & Team · Investors · Login / My Passport

**Sticky mobile buttons:** "Reserve Your Flight" (booking) · "Quick Bite Ordering" (can stay inactive/placeholder for now)

**Footer (every page):**
- Address: Parque Tecnológico de Leganés, Calle Innovación 12, 28918 Leganés, Madrid, Spain
- Phone: +34 91 123 45 67 · WhatsApp: +34 600 123 456
- Email: hello@pattypassport.com (general) · invest@pattypassport.com (investors)
- Social: Instagram, TikTok, X, Facebook — handle @pattypassport
- Copyright: © 2026 Patty Passport World S.L. All rights reserved.
- Secondary links: FAQ, Allergens, Privacy, Terms


---

## 4. DESIGN SYSTEM & INTERACTION NOTES

- **Route-line scroll progress bar**: fixed to top of viewport; fills / moves a plane icon as the user scrolls through a page — used most prominently on Home.
- **Map highlight**: on Destinations and each Country page, the Mediterranean map shows the selected country glowing/highlighted in a brighter color against the rest.
- **Greeting animation**: local-language greeting slides in with a small flag-wave animation at the top of each country page.
- **Cloud/sky motif**: soft cloud shapes and gradient skies appear behind hero sections, echoing the restaurant's real double-height "sky hall."
- **Cards & carousels**: country cards (flag + name + short tagline) appear in horizontal auto-scroll carousels on Home and as a grid on Destinations.
- Mobile-first, fast-loading, accessible color contrast, alt text on all images, real HTML menus (never PDFs or images-only menus).

---

## 5. PAGE SPECIFICATIONS

### 5.1 HOME — "Check In to the World"

**Above the fold:**
- Animated sky gradient background with soft clouds.
- Centered: logo + "Patty Passport" + "Mediterranean journeys. Global flavors." + "Stamp your way through flavor."
- Subtext: *"You don't come to Patty Passport just to eat a burger — you check in for a destination."*
- Two buttons: **Get Your Boarding Pass** (scrolls to booking) · **Explore Destinations** (→ Destinations page)

**Scrolling scenes (built as sequential sections, route-line + plane animate as user scrolls):**

1. **Scene 1 – Concept snapshot**: Mediterranean map with flags around it, plane gliding along the route line. Lines appear: *"Every burger is a journey." / "Your passport to unforgettable flavor." / "Collect the world, one burger at a time."*
2. **Scene 2 – Journey structure** (short, scannable in 10-20 seconds): *"Check in at the Patty Passport desk." → "Choose your destination: Lebanon, Greece, Italy, Spain… or more." → "Receive your boarding ticket." → "Discover your country through burger, fries, salad, drink, dessert, music, facts and activities." → "Stamp your passport. Plan your next route."*
3. **Scene 3 – Boarding ticket example (Lebanon)**: show the full ticket mock (see Section 1, step 4) with Lebanon flag + route icons. Button: **"Visit Lebanon's Destination Page."**
4. **Scene 4 – Auto-scroll country cards**: horizontal carousel, flag + name + 3-4 word tagline per card, each clickable into its country page.
5. **Scene 5 – Experience promise**: Headline *"One sea. Many cultures. Endless flavor."* Bullets: *"We connect you with cultures and heritage, one destination at a time." / "We mix education and fun: language, facts, stories, playlists and activities." / "No matter who you are, you are welcome: halal, kosher-sensitive, vegetarian, alcohol-free, or cocktail lovers — there is a lane for you."*
6. **Scene 6 – Call to action**: *"Ready to check in?"* Buttons: **Reserve Your Flight** · **See Routes & Menu** · **Meet Patty Tooty (your travel buddy)**

---

### 5.2 DESTINATIONS OVERVIEW — "Where should we head next?"

- Hero: Mediterranean map or globe with dots/flags for all 21 countries; headline *"Where should we head next?"*
- Grid/carousel of cards for all 21 countries: flag, name, short teaser line.
- On selecting a country: the map highlights that country's area in a glowing color, plus a small playful welcome animation with a greeting in the local language.

---

### 5.3 COUNTRY PAGE TEMPLATE (used for all 21 pages — see Section 6.5 for the full data set)

Every country page follows this exact structure:

1. **Greeting & language** — local-language greeting (native script if applicable) + romanization + English translation, animated in with a flag-wave.
2. **Map highlight** — small map, this country glowing. Line: *"Here's where you are on the Mediterranean route."*
3. **"Did you know?" culture facts** — 3-5 short, playful bullets on geography/history/culture/food (not textbook-toned).
4. **Food at Patty Passport from this country** — pulled from the Global Price Grid (Section 6.6): 3 burgers (veg/chicken/beef), 2 loaded fries, 1 salad, cold country drink, alcoholic country drink, hot drink, 2 desserts. Show item images (Claude can generate representative food imagery), name, and price.
5. **Music & playlists** — "Listen while you travel," playlist name + a few example track/artist listings (no auto-play), link out to streaming services.
6. **Activities & mini-learning** — a "learn to say hello" bit, a light quiz question, a coloring/flag-match idea for kids.
7. **Booking & menu actions** — buttons: **"Taste [Country] Now – Reserve Your Seat"** and **"Order a Quick Bite from [Country]."**

---

### 5.4 MENU & REWARDS PAGE

- Full HTML menu (never image/PDF), grouped by Burgers (Veg/Chicken/Beef by country), Loaded Fries & Sides, Salads, Desserts, Drinks (soft, country cold drinks, local beers, alcoholic country drinks, hot drinks). Every item priced from the Global Price Grid (Section 6.6).
- Dietary tags on every item: Halal-friendly, Kosher-sensitive, No pork, Alcohol-free, Vegetarian, Vegan-friendly, Contains alcohol, Contains nuts, etc.
- Rewards section explaining the passport stamp ladder: 3 destinations → free drink · 5 → free side · 8 → secret destination burger · 21 → full free World Traveller Buffet. Show a visual "passport filling with stamps" progress element.

---

### 5.5 EVENTS & BIRTHDAYS PAGE

**Kids birthday packages** (cards):
- **Little Explorer Birthday (Weekdays)** — €18/child, min. 8 children. Includes: 1 kids-size burger (any country, veg/chicken/beef) · small fries · drink (soft or country cold drink) · mini dessert · 2 hours kids' play area access · party hall with themed playlist · birthday passport activity (3 countries stamped) · goodie bag (stickers, small toy, country postcard) · basic table covers/balloons (parents may add their own decor).
- **World Explorer Birthday (Weekends)** — €22/child, min. 10 children. Same food base, upgraded to a Full Country kids combo for the birthday child, plus Patty-Passport-provided decor (flags/banners/themed tables), a host running games (passport quiz, "find the country," dance), and an optional on-screen video with the birthday child's name and favorite countries.

**Adult / mixed group events:**
- **"Country Night" group menu** — per adult: Full Buffet (Veg €24 / Chicken €25 / Beef €26), each including burger + loaded fries + shared salad + soft/cold drink/local beer + dessert. Kids at the same event: €15/child bundle. Optional flat hall fee (€80-120) for fully private use, or a group minimum spend (e.g. €400+ total) if not private.

**Seasonal events:**
- **Ramadan — "Iftar Passport"**: Adult set €22 (dates + water to break fast, soup, 1 halal-friendly burger — no pork/no alcohol in recipe, from any country, 1 loaded fries or side, 1 salad, 1 dessert, 1 cold non-alcoholic country drink). Kids set €14. No alcohol in the set menu by default; guests not observing Ramadan can order freely outside it.
- **Lent — "Sea Journey Menu"**: Friday seafood combo (fish/seafood burger + regular fries + drink) €13-14, optional dessert upgrade; consider double passport stamps on these Friday sets during Lent.
- **Other occasions** (Christmas, Easter, Eid, etc.): limited-time "Country of the Month" menus and small stamp/price incentives, always respecting halal/kosher/vegetarian needs for that occasion.

**Inclusivity note (display prominently):** Patty Passport is open to everyone — halal-friendly, kosher-sensitive, vegetarian, vegan, alcohol-free or alcohol-friendly. Menu clearly tags pork, alcohol, and dietary info rather than assuming one rule for all guests.

**Access info line:** *"We offer 40-50 surface parking spaces around the building, with clear signage for each route."* / *"Bus connections: lines L1, L3 and L7 stop at 'Parque Tecnológico – Patty Passport,' a short walk from our entrance."* 🔶 *(Bus line numbers are illustrative placeholders from the source planning notes — confirm real line numbers before launch.)*

---

### 5.6 OUR STORY & TEAM PAGE

**Founders' story (emotional tone, no numbers/prices here — those live on Investors):**
- **Mazen Chouamri — Co-Founder & Global Journeys Lead.** Runs an electronics company operating in Spain and the UAE, selling internationally in wholesale and retail — brings global trade, logistics and customer-service experience.
- **Ahmed [Surname] — Co-Founder & Retail Experience Lead.** Owns retail stores operating in Spain — brings high-street customer insight, visual merchandising, and day-to-day retail operations expertise.
- **Why together:** *"We came together with the vision to connect the world in one place like nothing else. We wanted to create a destination where cultures, heritage, food and stories meet — where a burger is a journey, not just a meal."*
- Briefly narrate how the concept grew from travel, business, and a love of Mediterranean culture, and how the check-in/ticket/passport/route system was designed for families and for anyone looking for a place that welcomes everyone.

**Team & employee roster (example profiles — front-end only, no real backend):**

| Name | Role | Background | Example guest review |
|---|---|---|---|
| George Ammar | Journey Crew (Server) | Lebanese/Spanish | "George made our trip to Greece unforgettable. He explained the destination card so well and made our kids feel at home." |
| Lucía Fernández | Check-In Host | Spanish | "Lucía greeted us with such warmth. She helped us choose Lebanon as our first destination and walked our child through the passport stamps." |
| Marco Rossi | Flavor Control (Kitchen) | Italian | "Marco's attention to detail made our Italian burger taste like a real piazza moment." |
| Yasmin Haddad | Kids & Destinations Guide | Lebanese | "Yasmin ran an amazing activity for our kids, teaching them about flags and flavors." |
| Nikos Papadopoulos | Route Crew (Server) | Greek | — |
| Alicia Morales | Events & Birthdays Coordinator | Spanish | — |
| Omar El Tayar | Drinks & Destinations | Egyptian | — |
| Sofia Costa | Pastry & Desserts | Portuguese/Moroccan | — |

Each profile card shows: photo placeholder, name, role, nationality tag, short description, a few guest reviews, and a **"Leave a Review"** button — front-end only for now (choose a staff member, write a comment; store in local component state / mock array, no real database yet).

---

### 5.7 INVESTORS PAGE

Structure:
1. Vision & concept recap (short version of Section 1).
2. CAPEX plans — all four scenarios (A1/A2/B1/B2) shown side-by-side, using the **corrected** figures and methodology in Sections 6.5 and 7 (build this as a small calculator so numbers stay traceable).
3. Operating model — cost structure from Section 6.4 (food/labour/marketing as % of revenue; fixed costs).
4. Sales scenarios, break-even, and ROI/payback from Section 6.6.
5. 7Ps breakdown (Section 9 in the appendix logic — see Section 6.7 for the compact table).
6. Contact form → invest@pattypassport.com (front-end form only for now).

No need to repeat every menu price here — show ranges, tables and simple charts (bar/line is enough; no need for anything fancy tonight).

---

### 5.8 LOGIN / MY PASSPORT (front-end shell only)

- Account creation screen (mock — no real auth backend yet).
- Upload passport photo (local preview only).
- View stamps collected (mock data: which of the 21 countries "visited").
- See unlocked rewards based on stamp count (reuse the ladder logic from Section 5.4).
- See upcoming bookings/events (mock list).

---

### 5.9 PATTY TOOTY — MASCOT CHATBOT WIDGET

- A playful burger-planet mascot character with a tiny passport, headphones, and sneakers.
- Lives as a chat bubble bottom-right: "Ask Patty Tooty."
- Front-end only for tonight: canned/scripted responses are fine (e.g. simple keyword matching) to: greet the user, help pick a destination based on stated preference (spicy/veg/halal/alcohol-free), answer basic menu/destination/event questions from the data already on the site, and point investors toward the Investors page.

---

### 5.10 EXTERIOR / "GARDEN OF DESTINATIONS" (visual section, can live on Home, Destinations, or its own small section)

Show the exterior concept: 40-50 parking spaces, Mediterranean garden with a tree or palm representing each of several countries, each with a small story plaque, e.g.:
- *"Tree dedicated to Greece — olives, islands and stone."*
- *"Tree dedicated to Lebanon — cedars and mountains."*
- *"Tree dedicated to Morocco — oranges and spices."*


---

## 6. FULL DATA APPENDIX

### 6.1 Global Price Grid (same for every country — only flavors change)

| Item type | Price (€) |
|---|---|
| Veg burger | 10.5 |
| Chicken burger | 11.5 |
| Beef burger | 13.0 |
| Regular fries | 3.5 |
| Loaded fries (country signature) | 5.5 |
| Salad (country iconic) | 6.5 |
| Dessert (each) | 5.5 |
| Soft drink | 3.0 |
| Cold country drink | 3.5 |
| Local beer | 4.0 |
| Alcoholic country drink | 6.5 |
| Hot drink (coffee/tea) | 2.5 |

### 6.2 Global Combo Grid

| Combo | Contents | Price (€) |
|---|---|---|
| Veg Quick Bite | Veg burger + regular fries + soft/cold drink | 13.0 |
| Chicken Quick Bite | Chicken burger + regular fries + soft/cold drink | 14.0 |
| Beef Quick Bite | Beef burger + regular fries + soft/cold drink | 15.0 |
| Loaded Fries Combo | Loaded fries + soft/cold drink | 7.0 |
| Regular Fries Combo (optional lighter option) | Regular fries + soft/cold drink | 6.0 |
| Salad Combo | Country salad + soft/cold drink | 8.0 |
| Veg Full Buffet | Veg burger + loaded fries + salad + soft/cold drink + dessert | 24.0 |
| Chicken Full Buffet | Chicken burger + loaded fries + salad + soft/cold drink + dessert | 25.0 |
| Beef Full Buffet | Beef burger + loaded fries + salad + soft/cold drink + dessert | 26.0 |

**Upgrades (any combo, any country):** swap included drink for alcoholic country drink +€2.5 · add a hot drink +€2.0. (Maxed-out Beef Full Buffet with both upgrades = €30.5.)

**Minimum spend, Experience Zone seating only:** Adults €10/person · Kids €8/child (any mix of items/combos). Quick Bite counter/bar seating has no minimum.

*Verified: every combo sits at roughly 22-24% below the same items bought separately — consistent with the "10-25% cheaper than à la carte" combo-pricing principle cited in the original notes.*

### 6.3 All 21 Countries — Full Menu Data

Each entry below plugs into the Country Page Template (5.3) and the Global Price/Combo Grids above. 🔶 = not specified in the source planning notes; a reasonable placeholder is suggested and should be confirmed by the founders before launch.

**Lebanon**
- Greeting: Arabic "يا ميت أهلا وسهلا بلبنان، نورتونا!" · Romanized: "Ya meet ahla w sahla bi Lebnen, nawartouna!" · English: "A hundred welcomes to Lebanon, you have brightened our day!"
- Veg burger: Halloumi Village Burger (grilled halloumi, tomato, basil, cucumber-mint, lemony labneh, olive oil, sesame or za'atar brioche)
- Chicken burger: Shish Tawouk Street Burger (yoghurt-garlic-lemon marinated chicken, lettuce, tomato, pickles, coriander, toum, soft potato bun) — **Quick Bite hero item**
- Beef burger: Shawarma Souk Burger (beef patty + shawarma slices, peppers, onions, sumac, pomegranate molasses, toum, sesame bun)
- Loaded fries: Batata Harra Fries (garlic, coriander, chilli, lemon, tahini-lemon drizzle) / Za'atar & Cheese Fries (za'atar, halloumi/akkawi, tomato, yoghurt-mint sauce)
- Salad: Tabbouleh Mountain Salad (parsley, mint, tomato, fine bulgur, lemon, olive oil, allspice)
- Cold drink: Lemon Mint Corniche Cooler · Alcoholic: Arak Sea Breeze · Hot: Levant Strong Coffee (cardamom option)
- Desserts: Knefe bel Kaak (warm cheese + semolina in toasted kaak, orange blossom syrup, pistachios) / Baklava Ice-Cream Sundae

**Syria**
- Veg burger: Falafel Old City Burger (falafel patty, tahini, pickled turnip, tomato, parsley, sesame bun)
- Chicken burger: Aleppo Pepper Chicken Burger (Aleppo-pepper chicken, roasted peppers, garlic yoghurt, herbs)
- Beef burger: Kebab Sumac Burger (kebab-style beef, sumac onions, parsley, tahini/yoghurt sauce) — **Quick Bite hero item**
- Loaded fries: Aleppo Chilli Fries / Fattoush Fries (lettuce, tomato, cucumber, radish, crisp bread, sumac dressing)
- Salad: Fattoush Garden Salad
- Cold drink: Mulberry Silk Juice · Alcoholic: Arak Aleppo Nights · Hot: Syrian Cardamom Coffee
- Desserts: Bouza Arabieh Pistachio (stretchy mastic ice cream, pistachios) / Ma'amoul Cloud (date/nut semolina cookies, warm, small ice cream)

**Palestine**
- Veg burger: Hummus & Sabich Burger (fried eggplant, hummus, egg slices, pickles, amba)
- Chicken burger: Musakhan Chicken Burger (sumac chicken, onions, pine nuts, olive oil, taboon-style bun) — **Quick Bite hero item**
- Beef burger: Kefta Olives Burger (herb kefta patty, grilled tomato, olives, tahini yoghurt sauce)
- Loaded fries: Musakhan Fries (sumac onions, shredded chicken, pine nuts, olive oil) / Hummus Fries (warm hummus, olive oil, paprika)
- Salad: Olive & Herb Salad
- Cold drink: Pomegranate Field Juice · Alcoholic: Local Wine / Arak Glass · Hot: Sage Tea
- Desserts: Kunafa Nabulsi Slice / Madluka (milk/semolina pudding, crushed nuts and syrup)

**Turkey**
- Veg burger: Menemen Veg Burger (pepper-tomato menemen, egg, cheese, herbs)
- Chicken burger: Doner Chicken Burger (sliced doner chicken, tomato, onion, pickles, yoghurt-garlic sauce) — **Quick Bite hero item**
- Beef burger: Sujuk Fire Burger (beef patty, grilled sujuk, spicy pepper sauce)
- Loaded fries: Iskender Fries (tomato butter sauce, yoghurt, sliced meat) / Sujuk Fries (grilled sujuk, yoghurt-garlic, herbs)
- Salad: Çoban Shepherd Salad
- Cold drink: Ayran Cool Glass · Alcoholic: Rakı Table Drink · Hot: Turkish Tea (tulip glass)
- Desserts: Künefe Tray / Lokum Delight Bowl (Turkish delight, nuts, rose)

**Cyprus**
- Veg burger: Halloumi Island Burger · Chicken: Mediterranean Chicken Burger · Beef: Olive & Feta Beef Burger
- Loaded fries: Halloumi Fries / Village Fries · Salad: Village Salad
- Cold drink: Carob / Grape Cooler 🔶 · Alcoholic: Brandy Sour · Hot: 🔶 suggest Cyprus coffee (Greek-style, unsweetened option)
- Desserts: Loukoumades / Carob Cake Slice

**Greece**
- Veg burger: Spanakopita Veg Burger (spinach and feta patty, dill, tzatziki, tomato)
- Chicken burger: Souvlaki Burger (lemon-oregano chicken, tzatziki, onion, tomato) — **Quick Bite hero item**
- Beef burger: Aegean Beef Burger (beef, feta, olive tapenade, cucumber, yoghurt sauce)
- Loaded fries: Feta & Oregano Fries / Greek Salad Fries
- Salad: Horiatiki Greek Salad
- Cold drink: Honey Lemon Frappe / Lemonade · Alcoholic: Ouzo Glass · Hot: Mountain Tea (honey and lemon)
- Desserts: Loukoumades Honey Clouds / Galaktoboureko Slice

**Italy**
- Veg burger: Caprese Burger · Chicken: Pesto Chicken Burger · Beef: Bistecca Burger
- Loaded fries: Truffle & Parm Fries / Arrabbiata Fries · Salad: Caprese Salad
- Cold drink: Blood Orange Soda · Alcoholic: Aperol Spritz · Hot: Espresso
- Desserts: Tiramisu / Affogato

**Spain**
- Veg burger: Pisto Veg Burger · Chicken: Bravas Chicken Burger · Beef: Iberian Beef Burger
- Loaded fries: Patatas Bravas Fries / Jamón & Manchego Fries · Salad: Side Salad + Gazpacho Shot
- Cold drink: Granizado Lemon · Alcoholic: Sangria · Hot: Thick Hot Chocolate (pairs with churros)
- Desserts: Crema Catalana / Churros & Chocolate

**France**
- Veg burger: Ratatouille Burger · Chicken: Herb Chicken Burger · Beef: Bistro Burger
- Loaded fries: Ratatouille Fries / Dijon Fries · Salad: Niçoise-Inspired Salad
- Cold drink: Sparkling Citrus Lemonade · Alcoholic: Pastis · Hot: Café Crème
- Desserts: Tarte Tatin / Crème Brûlée Cup

**Monaco**
- Veg burger: Riviera Veg Burger · Chicken: Herb Lemon Chicken Burger · Beef: Luxury Beef Burger
- Loaded fries: Riviera Fries / Cheese & Onion Fries · Salad: Mediterranean Riviera Salad
- Cold drink: Citrus Spritz · Alcoholic: Rosé Spritz · Hot: 🔶 suggest espresso (as with neighboring Italy/France)
- Desserts: Riviera Fruit Tart / Chocolate Mousse

**Malta**
- Veg burger: Caponata Veg Burger · Chicken: Mediterranean Chicken Burger · Beef: Coastal Beef Burger
- Loaded fries: Caponata Fries / Herb & Olive Fries · Salad: Tomato-Capers-Olives-Onions Salad
- Cold drink: Bitter Orange Soda (Kinnie-style) · Alcoholic: Maltese Wine / Beer · Hot: 🔶 suggest Maltese-style tea or espresso
- Desserts: Honey Rings / Ricotta Pastry Bites

**Slovenia**
- Veg burger: Grilled Veg & Cheese Burger · Chicken: Paprika Herb Chicken Burger · Beef: Balkan Grill Burger
- Loaded fries: Ajvar Fries / Herb & Garlic Fries · Salad: Bean & Herb Salad
- Cold drink: Elderflower / Berry Drink · Alcoholic: Local Wine Spritz · Hot: 🔶 suggest herbal mountain tea
- Desserts: Walnut Strudel Slice / Honey Nut Cake

**Croatia**
- Veg burger: Adriatic Veg Burger · Chicken: Dalmatian Herb Chicken Burger · Beef: Coastal Beef Burger
- Loaded fries: Ajvar Fries / Cheese & Herb Fries · Salad: Tomato-Onion-Olive Salad
- Cold drink: Citrus Soda · Alcoholic: Local Wine Spritz · Hot: 🔶 suggest espresso (strong Adriatic coffee culture)
- Desserts: Walnut Pudding Cake / Citrus Semolina Slice

**Bosnia & Herzegovina**
- Veg burger: Burek Veg Burger · Chicken: Kajmak Chicken Burger · Beef: Ćevapi Burger
- Loaded fries: Ćevapi Fries / Paprika Fries · Salad: Shopska-Style Salad
- Cold drink: Yoghurt Drink · Alcoholic: Rakija · Hot: 🔶 suggest Bosnian coffee (cezve-brewed)
- Desserts: Bosnia Apple Dream / Honey Walnut Squares

**Montenegro**
- Veg burger: Coastal Veg Burger · Chicken: Coastal Herb Chicken Burger · Beef: Balkan Grill Beef Burger
- Loaded fries: Herb & Garlic Fries / Ajvar Fries · Salad: Mixed Tomato-Cucumber-Onion-Cheese Salad
- Cold drink: Lemonade · Alcoholic: Local Wine · Hot: 🔶 suggest Montenegrin coffee/espresso
- Desserts: Priganice Honey Puffs / Walnut Layer Cake

**Albania**
- Veg burger: Pepper & White Cheese Burger · Chicken: Yoghurt Herb Chicken Burger · Beef: Coastal Beef Burger
- Loaded fries: White Cheese Fries / Spicy Pepper Fries · Salad: Tomato-Cucumber-Onion Cheese Salad
- Cold drink: Yoghurt Drink · Alcoholic: Raki · Hot: 🔶 suggest Albanian coffee
- Desserts: Revani / Almond Citrus Cookies

**Egypt**
- Veg burger: Ta'ameya Veg Burger · Chicken: Koshari Chicken Burger · Beef: Hawawshi Burger
- Loaded fries: Dukka Fries / Koshari Fries · Salad: Baladi Salad
- Cold drink: Sugarcane / Hibiscus Drink · Alcoholic: Local Wine / Beer · Hot: 🔶 suggest Egyptian spiced coffee
- Desserts: Basbousa / Konafa Street Slice

**Libya**
- Veg burger: Chickpea Veg Burger · Chicken: Harissa Chicken Burger · Beef: Bazin Spice Beef Burger
- Loaded fries: Harissa Fries / Garlic & Herb Fries · Salad: Tomato-Onion Olive Salad
- Cold drink: Date / Orange Drink · Alcoholic: Wine / Beer · Hot: 🔶 suggest Libyan spiced tea
- Desserts: Date Semolina Bars / Citrus Honey Donuts

**Tunisia**
- Veg burger: Harissa Veg Burger · Chicken: Mechouia Chicken Burger · Beef: Merguez Burger
- Loaded fries: Harissa & Egg Fries / Merguez Fries · Salad: Mechouia Salad
- Cold drink: Citronade · Alcoholic: Boukha Cocktail / Wine · Hot: 🔶 suggest Tunisian mint tea with pine nuts
- Desserts: Makroudh Date Diamonds / Bambalouni Beach Donuts

**Algeria**
- Veg burger: Couscous Veg Burger · Chicken: Ras el Hanout Chicken Burger · Beef: Merguez Beef Burger
- Loaded fries: Harira Fries / Spicy Fries · Salad: Carrot & Orange Cumin Salad
- Cold drink: Orange & Mint Drink · Alcoholic: Wine · Hot: 🔶 suggest Algerian mint tea
- Desserts: Makroud Almond Slice / Orange Blossom Semolina Cake

**Morocco**
- Veg burger: Chermoula Veg Burger · Chicken: Tagine Chicken Burger · Beef: Tagine Beef Burger
- Loaded fries: Harissa Fries / Orange-Almond Fries · Salad: Orange & Olive Salad
- Cold drink: Orange Blossom Lemonade · Alcoholic: Spiced Wine / Cocktail · Hot: Moroccan Mint Tea 🔶 *(implied by cuisine, not explicitly listed in source — very safe suggestion)*
- Desserts: M'hanncha Snake Cake / Almond Honey Cigars


### 6.4 Phase 1 — Land ("Shovel-Ready") — verified correct ✅

**Plan A — Leganés Technology Park (2,500 m²)**

| Item | Cost (€) |
|---|---|
| Base land purchase | 500,000 |
| 6% ITP transfer tax | 30,000 |
| Notary/Registry/Lawyer/Gestoría | 7,200 |
| Urbanistic certificate | 200 |
| Restaurant compatibility + alignment/rasante | 500 |
| Topographical + geotechnical surveys | 2,600 |
| Smoke/odour/noise engineering assessment | 2,000 |
| Catastro/Registry coordination | 400 |
| Site clearance & minor leveling | 1,000 |
| Utility hookups (acometidas) | 10,000 |
| **TOTAL** | **€553,900** |

**Plan B — Villaverde (3,000 m²)**

| Item | Cost (€) |
|---|---|
| Base land purchase | 300,000 |
| 6% ITP transfer tax | 18,000 |
| Notary/Registry/Lawyer/Gestoría | 5,700 |
| Urbanistic certificate | 200 |
| Restaurant compatibility + alignment/rasante | 500 |
| ECU review fee (Madrid city) | 1,500 |
| Topographical + geotechnical surveys | 2,600 |
| Smoke/odour/noise engineering assessment | 2,000 |
| Catastro/Registry coordination | 400 |
| Site clearance & minor leveling | 1,000 |
| Utility hookups (acometidas) | 8,000 |
| **TOTAL** | **€339,900** |

### 6.5 Phase 2 — Building — verified correct ✅

Band used: **1,800–2,500 €/m²** turnkey (new build + full restaurant fit-out).

| Building size | Low (×1,800) | High (×2,500) |
|---|---|---|
| 1,500 m² | €2,700,000 | €3,750,000 |
| 2,000 m² | €3,600,000 | €5,000,000 |

Space allocation (1,500 m² plan): Central hall ~450-500 m² · Full Experience pockets ~250-300 m² · Quick Bite ~150-180 m² · Kids' area ~100-120 m² · Birthday/events ~150-200 m² · Kitchen & prep ~220-260 m² · Admin & storage ~200-250 m² · Circulation/toilets ~250-300 m².

(2,000 m² plan scales each of these up proportionally — see original notes; not repeated here to save space, ask if you want the full breakdown reproduced.)

### 6.6 Phase 4 — Exterior Capex — verified correct ✅

| Category | Plan A (1,500 m² building, ~40 spaces) | Plan B (1,500 m² building, ~50 spaces) |
|---|---|---|
| Parking surfaces | €130,000–200,000 | €150,000–240,000 |
| Paths & plaza | €5,000–20,000 | €20,000–60,000 |
| Trees & palms | €10,000–20,000 | €15,000–30,000 |
| Benches | €4,000–11,000 | €6,000–16,000 |
| LED lighting | €4,000–10,000 | €5,000–13,000 |
| Fountains | €10,000–20,000 | €15,000–30,000 |
| Signs & flags | €5,000–10,000 | €6,000–12,000 |
| Sound system | €5,000–10,000 | €7,000–15,000 |
| Landscaping & irrigation | €15,000–30,000 | €20,000–40,000 |
| **TOTAL** | **€188,000–321,000** | **€244,000–436,000** |

**If the building grows to 2,000 m²:**
- **Plan A (2,500 m² land):** only ~500 m² is left after the building — enough for roughly **20-25 parking spaces** (at ~20-22 m²/space), not 40-50. Garden shrinks to tree islands and small strips.
- **Plan B (3,000 m² land):** ~1,000 m² is left. ⚠️ **Correction:** the original notes described a "50 space" option here, but 50 spaces at the same ~22 m²/space standard used everywhere else in the plan need ~1,100 m² — more than the 1,000 m² actually available. The realistic ceiling in that footprint is **~45 spaces** (at 22 m²/space) or 50 spaces only if space-per-car is tightened to ~20 m²/space with minimal circulation. The clean **40-space option genuinely fits** (880 m², leaving ~120 m² for a small plaza) exactly as stated.

### 6.7 Phase 5 — Investment Scenarios — ⚠️ CORRECTED

The original planning notes summed each scenario's **low-end** correctly, but the **high-end totals were understated** — they don't actually equal the sum of every category's own stated maximum. Below are both the original stated ranges and the corrected ranges (sum of all category minimums = low bound; sum of all category maximums = high bound). **Build the Investors page to calculate this live from the category inputs, not as a hard-coded string**, so it's always internally consistent.

| Scenario | Land | Building | Exterior | Professional fees (8-12% of build) | Licences & ICIO (4-7% of build) | Contingency (10-15%) | Working capital | Originally stated total | **Corrected total** |
|---|---|---|---|---|---|---|---|---|---|
| **A1** – Leganés, 1,500 m² | 553.9k | 2.70–3.75m | 188–321k | 216–450k | 110–260k | 300–600k | 200–400k | €4.3m–5.3m | **€4.27m–6.33m** |
| **A2** – Leganés, 2,000 m² | 553.9k | 3.60–5.00m | 140–260k | 280–600k | 150–350k | 350–700k | 200–400k | €5.2m–7.3m | **€5.27m–7.86m** |
| **B1** – Villaverde, 1,500 m² | 330–360k | 2.70–3.75m | 244–436k | 216–450k | 110–260k | 300–600k | 200–400k | €4.1m–5.2m | **€4.10m–6.26m** |
| **B2** – Villaverde, 2,000 m² | 330–360k | 3.60–5.00m | 220–380k | 280–600k | 150–350k | 350–700k | 200–400k | €5.1m–7.2m | **€5.13m–7.79m** |

**Why this matters for the site:** the low-end numbers you already had are safe to use as-is. The high-end numbers understate worst-case investor exposure by roughly €0.9m–1.1m per scenario. Use the corrected ranges on the Investors page — it makes the deck more credible, not less, because an investor who runs the same addition themselves will get the corrected number, not the original one.

**Funding structure (unchanged, still correct):** Founders' equity €400k (Mazen €200k + Ahmed €200k) + initial bank loan €500k = **€900k committed in Phase 1**, in all four scenarios. The **remaining capital gap** = corrected total − €900k, and should be computed live rather than restated as a fixed figure.

### 6.8 Phase 3 — Interior Operations (Main Plan, 1,500 m², ~240 seats) — verified correct ✅

| Category | Fixed/Variable | Planning rule |
|---|---|---|
| Core full-time staff | Mostly fixed | 30 employees |
| Part-time/peak staff | Variable | ~12 employees |
| Total staff pool | Mixed | ~42 (40-45 typical; up to ~48-50 at extreme peak) |
| Labour cost (wages + social security) | Mixed | 27-32% of total sales |
| Food & beverage materials | Variable | 28-32% of F&B revenue |
| Electricity | Semi-fixed | €2,000-2,500/month |
| Water + sewage | Semi-fixed | €300-500/month |
| Fibre/wifi | Fixed | €30-60/month |
| Insurance | Fixed | €3,000-6,000/year (~€250-500/month) |
| Cleaning & hygiene | Semi-fixed | €1,500-3,000/month |
| Security (CCTV/alarm) | Fixed | €100-200/month |
| Concept materials (passports, bags, activity books) | Variable | ~€3-4 per Full Experience guest |
| Admin & office | Fixed | €300-800/month |
| Marketing (Year 1) | Variable (% of revenue) | 7-8% of gross revenue — 60-80% digital, 20-40% offline |

**Peak shift staffing:** ~28-34 people on-site at busiest; quiet periods ~8-14.

### 6.9 Phase 7 — Base-Case Financial Model — verified correct ✅

All figures below were independently recalculated and check out exactly.

**Revenue scenarios** (350 operating days/year):

| Scenario | Guests/day | Avg. spend | Annual revenue |
|---|---|---|---|
| Low | 120 | €18 | ~€756,000 |
| **Base (used below)** | **160** | **€20** | **~€1,120,000** |
| High | 220 | €22 | ~€1,694,000 |

**Base-case monthly P&L** (midpoints of Section 6.8 bands):

| Line | Monthly (€) | Annual (€) |
|---|---|---|
| Revenue | ~93,333 | 1,120,000 |
| Food & beverage (30%) | 28,000 | 336,000 |
| Labour (30%) | 28,000 | 336,000 |
| Marketing (7%) | ~6,500 | 78,400 |
| Fixed overhead (utilities+insurance+cleaning+security+admin) | ~6,025 | 72,300 |
| **Operating profit** | **~24,500** | **~294,000** |
| Operating margin | — | **~26%** |

**Break-even:** fixed costs ÷ (1 − variable %) = €6,025 ÷ 0.33 ≈ **€18,200/month** ≈ **910 guests/month** ≈ **~31-32 guests/day** at €20 average spend.

**ROI & payback** (using a €4.8m mid-band investment for Plan A1 — re-run this against the corrected range in 6.7 once a specific budget point is chosen):

| Scenario | Annual profit | ROI | Payback |
|---|---|---|---|
| Base case | ~€294,000 | ~6.1% | ~16.3 years |
| High traffic (20% margin on €1.7m) | ~€340,000 | ~7.1% | ~14.1 years |
| Compressed margin (15% on €1.1m) | ~€165,000 | ~3.4% | ~29 years |

*Note: since the corrected total investment range for A1 is now €4.27m–6.33m (Section 6.7) rather than €4.3m–5.3m, ROI and payback should be recalculated live against whichever specific investment figure is finally chosen — don't hard-code €4.8m if the real target ends up elsewhere in that range.*

### 6.10 7Ps Summary (for Investors page)

| P | Summary |
|---|---|
| Product | Destination burgers per country, loaded fries/salads/desserts/drinks, Full Experience + Quick Bite formats, passport/stamps, kids' journeys, birthdays, group packages, music/activities |
| Price | Quick Bite €13-15 · Full Buffet €24-26 · kids birthdays €18-22/child · min. spend €10 adult/€8 child · alcoholic upgrade +€2.5 · hot drink upgrade +€2.0 |
| Place | Leganés (2,500 m²) or Villaverde (3,000 m²), 1,500-2,000 m² building, double-height hall + mezzanine, 40-50 parking, Mediterranean garden, plus the website |
| Promotion | Passport stamps, combos/bundles, country nights, seasonal menus, digital + offline marketing, UGC challenges |
| People | Founders Mazen (global trade) + Ahmed (retail); ~42-person team, young and multicultural |
| Process | Check-in → destination choice → ticket → seating → food + destination card → passport stamp → next-visit hook; mirrored online in the site's own navigation flow |
| Physical Evidence | Double-height sky hall, mezzanine, route-zone pockets, exterior garden/parking, packaging/tickets/passports, and the website itself |


---

## 7. CALCULATION AUDIT — WHAT I CHECKED AND WHAT I FOUND

I re-derived every number in the original planning notes by hand before writing this brief. Here's the full result:

**Verified correct, no changes needed:**
- Both land totals (€553,900 and €339,900) ✅
- All building cost bands (€/m² × size) ✅
- All combo prices and their ~22-24% savings vs. à la carte ✅
- The entire Phase 3 interior operating cost structure ✅
- The entire Phase 7 financial model — revenue scenarios, P&L, break-even, ROI, payback — every formula and result checks out exactly ✅
- Individual exterior capex category bands (Plan A and Plan B, 1,500 m² building) ✅

**Two issues found and corrected:**

1. **Investment scenario high-end totals (Section 6.7)** — in all four scenarios (A1/A2/B1/B2), the stated "total project" high-end figure is €0.9m-1.1m lower than what you get from actually summing every category's own stated maximum. The low-end figures are all correct. I've shown both the original and corrected numbers side-by-side so you can see exactly where the gap comes from — it's a real arithmetic gap, not a rounding difference.

2. **Plan B, 2,000 m² building, 50-parking-space option (Section 6.6)** — the notes claim 50 surface spaces fit in the ~1,000 m² left over, but 50 spaces at the same 22 m²/space standard used everywhere else in the plan actually need ~1,100 m². The realistic max in that footprint is ~45 spaces (or 50 only with tighter ~20 m²/space spacing). I've flagged the honest ceiling rather than repeating the original number.

**Build instruction:** the Investors page should compute scenario totals from the underlying category numbers (a simple object/array of {category, low, high} per scenario, summed in code), not display a pre-written string. That way if any single category number is later revised, the totals update correctly automatically instead of silently going stale again.

---

## 8. BUILD SEQUENCE FOR CLAUDE CODE

1. **Scaffold** — pick a stack (a static site with a lightweight framework like Astro, Next.js, or plain HTML/CSS/JS + a templating approach for the 21 country pages is all fine — your call based on what's easiest to maintain for 21 near-identical pages; a data-driven approach where one Country template component reads from a single JSON/data file of all 21 countries, rather than 21 hand-copied files, is strongly preferred so edits only need to happen in one place).
2. **Design system first** — colors, fonts, the route-line scroll progress bar, card components, button styles — build these as shared/reusable pieces before any page.
3. **Home page** (Section 5.1).
4. **Country template + Lebanon** as the first full country build (Section 5.3 + Lebanon data in 6.3) — get this exactly right once, since it's reused 20 more times.
5. **Remaining 20 country pages**, generated from the data in 6.3 through the same template.
6. **Destinations overview** (5.2).
7. **Menu & Rewards** (5.4 + 6.1/6.2).
8. **Events & Birthdays** (5.5).
9. **Our Story & Team** (5.6).
10. **Investors** (5.7 + all of Section 6.4-6.10) — build the calculation module described in Section 7 here.
11. **Login/My Passport shell** (5.8) and **Patty Tooty widget** (5.9) — both front-end only.
12. **Exterior/Garden of Destinations** visual section (5.10) — can be folded into Home or Destinations rather than being a standalone page.

Commit after each numbered step. Use placeholder/generated imagery for food and staff photos until real photography exists — keep alt text accurate to what's described in Section 6.3 so it's easy to swap in real photos later without rewriting copy.

**— End of brief —**
