/* Patty Passport — shared data (Master Brief §6.1, §6.2, §6.3, §6.4–6.10).
   Loaded in <helmet> as a classic script; assigns window.PP_DATA. */
(function () {
  var PRICES = {
    vegBurger: 10.5, chickenBurger: 11.5, beefBurger: 13.0,
    regularFries: 3.5, loadedFries: 5.5, salad: 6.5, dessert: 5.5,
    softDrink: 3.0, coldDrink: 3.5, localBeer: 4.0, alcoholDrink: 6.5, hotDrink: 2.5
  };

  var COMBOS = [
    ["Veg Quick Bite", "Veg burger + regular fries + soft/cold drink", 13.0, "Quick Bite"],
    ["Chicken Quick Bite", "Chicken burger + regular fries + soft/cold drink", 14.0, "Quick Bite"],
    ["Beef Quick Bite", "Beef burger + regular fries + soft/cold drink", 15.0, "Quick Bite"],
    ["Loaded Fries Combo", "Loaded fries + soft/cold drink", 7.0, "Light"],
    ["Regular Fries Combo", "Regular fries + soft/cold drink", 6.0, "Light"],
    ["Salad Combo", "Country salad + soft/cold drink", 8.0, "Light"],
    ["Veg Full Buffet", "Veg burger + loaded fries + salad + drink + dessert", 24.0, "Full Experience"],
    ["Chicken Full Buffet", "Chicken burger + loaded fries + salad + drink + dessert", 25.0, "Full Experience"],
    ["Beef Full Buffet", "Beef burger + loaded fries + salad + drink + dessert", 26.0, "Full Experience"]
  ].map(function (c) { return { name: c[0], contents: c[1], price: c[2], group: c[3] }; });

  var UPGRADES = [
    ["Swap included drink for the alcoholic country drink", 2.5],
    ["Add a hot drink", 2.0]
  ].map(function (u) { return { name: u[0], price: u[1] }; });

  var MIN_SPEND = { adult: 10, child: 8 };

  // code, name, route, med, greeting, veg, chicken, beef, fries[2], salad, cold, alcoholic, hot, desserts[2], hero
  var C = [
    ["lbn","Lebanon","LEV","MED-12",
     "Ya meet ahla w sahla bi Lebnen, nawartouna! — A hundred welcomes to Lebanon, you have brightened our day!",
     ["Halloumi Village Burger","Grilled halloumi, tomato, basil, cucumber-mint, lemony labneh, olive oil, za'atar brioche"],
     ["Shish Tawouk Street Burger","Yoghurt-garlic-lemon marinated chicken, lettuce, tomato, pickles, coriander, toum, potato bun"],
     ["Shawarma Souk Burger","Beef patty with shawarma slices, peppers, onions, sumac, pomegranate molasses, toum, sesame bun"],
     [["Batata Harra Fries","Garlic, coriander, chilli, lemon, tahini-lemon drizzle"],["Za'atar & Cheese Fries","Za'atar, halloumi and akkawi, tomato, yoghurt-mint sauce"]],
     ["Tabbouleh Mountain Salad","Parsley, mint, tomato, fine bulgur, lemon, olive oil, allspice"],
     "Lemon Mint Corniche Cooler","Arak Sea Breeze","Levant Strong Coffee",
     [["Knefe bel Kaak","Warm cheese and semolina in toasted kaak, orange blossom syrup, pistachios"],["Baklava Ice-Cream Sundae","Crushed baklava, pistachio, vanilla ice cream"]],
     "chicken"],

    ["syr","Syria","LEV","MED-13","Ahlan wa sahlan — Welcome",
     ["Falafel Old City Burger","Falafel patty, tahini, pickled turnip, tomato, parsley, sesame bun"],
     ["Aleppo Pepper Chicken Burger","Aleppo-pepper chicken, roasted peppers, garlic yoghurt, herbs"],
     ["Kebab Sumac Burger","Kebab-style beef, sumac onions, parsley, tahini-yoghurt sauce"],
     [["Aleppo Chilli Fries","Aleppo pepper, garlic, herbs"],["Fattoush Fries","Lettuce, tomato, cucumber, radish, crisp bread, sumac dressing"]],
     ["Fattoush Garden Salad","Garden vegetables, crisp bread, sumac and pomegranate dressing"],
     "Mulberry Silk Juice","Arak Aleppo Nights","Syrian Cardamom Coffee",
     [["Bouza Arabieh Pistachio","Stretchy mastic ice cream rolled in pistachios"],["Ma'amoul Cloud","Warm date and nut semolina cookies with a small ice cream"]],
     "beef"],

    ["pse","Palestine","LEV","MED-14","Ahlan — Welcome",
     ["Hummus & Sabich Burger","Fried eggplant, hummus, egg slices, pickles, amba"],
     ["Musakhan Chicken Burger","Sumac chicken, onions, pine nuts, olive oil, taboon-style bun"],
     ["Kefta Olives Burger","Herb kefta patty, grilled tomato, olives, tahini yoghurt sauce"],
     [["Musakhan Fries","Sumac onions, shredded chicken, pine nuts, olive oil"],["Hummus Fries","Warm hummus, olive oil, paprika"]],
     ["Olive & Herb Salad","Olives, cucumber, tomato, parsley, olive oil"],
     "Pomegranate Field Juice","Local Wine / Arak Glass","Sage Tea",
     [["Kunafa Nabulsi Slice","Shredded pastry, Nabulsi cheese, syrup"],["Madluka","Milk and semolina pudding, crushed nuts and syrup"]],
     "chicken"],

    ["tur","Türkiye","AEG","MED-21","Hoş geldiniz — Welcome",
     ["Menemen Veg Burger","Pepper-tomato menemen, egg, cheese, herbs"],
     ["Doner Chicken Burger","Sliced doner chicken, tomato, onion, pickles, yoghurt-garlic sauce"],
     ["Sujuk Fire Burger","Beef patty, grilled sujuk, spicy pepper sauce"],
     [["Iskender Fries","Tomato butter sauce, yoghurt, sliced meat"],["Sujuk Fries","Grilled sujuk, yoghurt-garlic, herbs"]],
     ["Çoban Shepherd Salad","Tomato, cucumber, pepper, onion, parsley, lemon"],
     "Ayran Cool Glass","Rakı Table Drink","Turkish Tea",
     [["Künefe Tray","Warm cheese pastry, syrup, pistachio"],["Lokum Delight Bowl","Turkish delight, nuts, rose"]],
     "chicken"],

    ["cyp","Cyprus","AEG","MED-22","Kalos irthate — Welcome",
     ["Halloumi Island Burger","Grilled halloumi, tomato, mint, island greens"],
     ["Mediterranean Chicken Burger","Lemon-herb chicken, yoghurt sauce, cucumber"],
     ["Olive & Feta Beef Burger","Beef, feta, olive tapenade, tomato"],
     [["Halloumi Fries","Fried halloumi sticks, honey, mint"],["Village Fries","Oregano, feta, olive oil"]],
     ["Village Salad","Tomato, cucumber, olives, onion, feta"],
     "Carob & Grape Cooler","Brandy Sour","Cyprus Coffee",
     [["Loukoumades","Honey-soaked dough puffs, cinnamon"],["Carob Cake Slice","Carob syrup sponge, walnut"]],
     "veg"],

    ["grc","Greece","AEG","MED-23","Kalós irthate — Welcome",
     ["Spanakopita Veg Burger","Spinach and feta patty, dill, tzatziki, tomato"],
     ["Souvlaki Burger","Lemon-oregano chicken, tzatziki, onion, tomato"],
     ["Aegean Beef Burger","Beef, feta, olive tapenade, cucumber, yoghurt sauce"],
     [["Feta & Oregano Fries","Crumbled feta, oregano, lemon"],["Greek Salad Fries","Tomato, cucumber, olive, feta, red onion"]],
     ["Horiatiki Greek Salad","Tomato, cucumber, pepper, olives, feta block, oregano"],
     "Honey Lemon Frappe","Ouzo Glass","Mountain Tea",
     [["Loukoumades Honey Clouds","Warm dough puffs, honey, walnut"],["Galaktoboureko Slice","Semolina custard in filo, syrup"]],
     "chicken"],

    ["ita","Italy","IBL","MED-31","Benvenuti — Welcome",
     ["Caprese Burger","Mozzarella, tomato, basil, olive oil"],
     ["Pesto Chicken Burger","Grilled chicken, basil pesto, rocket, parmesan"],
     ["Bistecca Burger","Aged beef, rosemary, roasted pepper, aioli"],
     [["Truffle & Parm Fries","Truffle oil, parmesan, parsley"],["Arrabbiata Fries","Spicy tomato sugo, chilli, basil"]],
     ["Caprese Salad","Mozzarella, tomato, basil, olive oil"],
     "Blood Orange Soda","Aperol Spritz","Espresso",
     [["Tiramisu","Mascarpone, espresso, cocoa"],["Affogato","Vanilla gelato drowned in hot espresso"]],
     "beef"],

    ["esp","Spain","IBL","MED-32","Bienvenidos — Welcome",
     ["Pisto Veg Burger","Slow-cooked pepper and tomato pisto, manchego"],
     ["Bravas Chicken Burger","Paprika chicken, bravas sauce, aioli"],
     ["Iberian Beef Burger","Iberian blend, piquillo pepper, manchego, pimentón aioli"],
     [["Patatas Bravas Fries","Bravas sauce, aioli, smoked paprika"],["Jamón & Manchego Fries","Iberian ham, manchego, olive oil"]],
     ["Side Salad & Gazpacho Shot","Leaves, tomato, olive, chilled gazpacho"],
     "Granizado Lemon","Sangria","Thick Hot Chocolate",
     [["Crema Catalana","Burnt-sugar custard, citrus, cinnamon"],["Churros & Chocolate","Hot churros, thick chocolate"]],
     "beef"],

    ["fra","France","IBL","MED-33","Bienvenue — Welcome",
     ["Ratatouille Burger","Provençal ratatouille, goat cheese, herbs"],
     ["Herb Chicken Burger","Herbes de Provence chicken, dijon crème"],
     ["Bistro Burger","Beef, comté, caramelised onion, dijon"],
     [["Ratatouille Fries","Ratatouille, herbs, olive oil"],["Dijon Fries","Dijon cream, chives"]],
     ["Niçoise-Inspired Salad","Green beans, egg, olives, tomato, potato"],
     "Sparkling Citrus Lemonade","Pastis","Café Crème",
     [["Tarte Tatin","Caramelised apple, butter pastry"],["Crème Brûlée Cup","Vanilla custard, cracked sugar"]],
     "beef"],

    ["mco","Monaco","IBL","MED-34","Benvenue — Welcome",
     ["Riviera Veg Burger","Grilled courgette, pepper, basil pistou"],
     ["Herb Lemon Chicken Burger","Lemon-herb chicken, fennel slaw"],
     ["Luxury Beef Burger","Aged beef, truffle aioli, comté"],
     [["Riviera Fries","Basil pistou, lemon zest"],["Cheese & Onion Fries","Melted comté, caramelised onion"]],
     ["Mediterranean Riviera Salad","Leaves, citrus, olives, fennel"],
     "Citrus Spritz","Rosé Spritz","Espresso",
     [["Riviera Fruit Tart","Seasonal fruit, crème pâtissière"],["Chocolate Mousse","Dark chocolate, sea salt"]],
     "beef"],

    ["mlt","Malta","IBL","MED-35","Merħba — Welcome",
     ["Caponata Veg Burger","Sweet-sour aubergine caponata, capers"],
     ["Mediterranean Chicken Burger","Lemon-oregano chicken, tomato, olive"],
     ["Coastal Beef Burger","Beef, peppered gbejna cheese, onion jam"],
     [["Caponata Fries","Aubergine caponata, capers, olive"],["Herb & Olive Fries","Wild herbs, black olive, lemon"]],
     ["Maltese Garden Salad","Tomato, capers, olives, onion"],
     "Bitter Orange Soda","Maltese Wine / Beer","Maltese Tea",
     [["Honey Rings","Treacle-filled pastry rings"],["Ricotta Pastry Bites","Flaky pastry, sweet ricotta"]],
     "beef"],

    ["svn","Slovenia","ADR","MED-41","Dobrodošli — Welcome",
     ["Grilled Veg & Cheese Burger","Grilled vegetables, mountain cheese, herbs"],
     ["Paprika Herb Chicken Burger","Paprika chicken, sour cream, herbs"],
     ["Balkan Grill Burger","Grill-spiced beef, ajvar, onion"],
     [["Ajvar Fries","Roast pepper ajvar, kajmak"],["Herb & Garlic Fries","Garlic butter, parsley"]],
     ["Bean & Herb Salad","White beans, onion, parsley, vinegar"],
     "Elderflower Berry Drink","Local Wine Spritz","Herbal Mountain Tea",
     [["Walnut Strudel Slice","Rolled pastry, walnut, cinnamon"],["Honey Nut Cake","Honey sponge, hazelnut"]],
     "beef"],

    ["hrv","Croatia","ADR","MED-42","Dobro došli — Welcome",
     ["Adriatic Veg Burger","Grilled aubergine, tomato, herb cheese"],
     ["Dalmatian Herb Chicken Burger","Rosemary chicken, lemon, olive oil"],
     ["Coastal Beef Burger","Beef, ajvar, kajmak, crisp onion"],
     [["Ajvar Fries","Roast pepper ajvar, kajmak"],["Cheese & Herb Fries","Island cheese, parsley, garlic"]],
     ["Dalmatian Salad","Tomato, onion, olive, olive oil"],
     "Citrus Soda","Local Wine Spritz","Adriatic Espresso",
     [["Walnut Pudding Cake","Walnut sponge, vanilla cream"],["Citrus Semolina Slice","Semolina cake, orange syrup"]],
     "beef"],

    ["bih","Bosnia & Herzegovina","ADR","MED-43","Dobro došli — Welcome",
     ["Burek Veg Burger","Spinach-cheese burek patty, yoghurt sauce"],
     ["Kajmak Chicken Burger","Grilled chicken, kajmak, onion"],
     ["Ćevapi Burger","Hand-minced ćevapi patty, kajmak, raw onion, somun bread"],
     [["Ćevapi Fries","Minced ćevapi, kajmak, onion"],["Paprika Fries","Sweet paprika, sour cream"]],
     ["Shopska-Style Salad","Tomato, cucumber, pepper, grated white cheese"],
     "Yoghurt Drink","Rakija","Bosnian Coffee",
     [["Bosnia Apple Dream","Baked apple, walnut, cinnamon cream"],["Honey Walnut Squares","Layered pastry, honey, walnut"]],
     "beef"],

    ["mne","Montenegro","ADR","MED-44","Dobrodošli — Welcome",
     ["Coastal Veg Burger","Grilled pepper, courgette, young cheese"],
     ["Coastal Herb Chicken Burger","Herb chicken, lemon, yoghurt"],
     ["Balkan Grill Beef Burger","Smoked beef, ajvar, onion"],
     [["Herb & Garlic Fries","Garlic, parsley, olive oil"],["Ajvar Fries","Roast pepper ajvar, kajmak"]],
     ["Bay Salad","Tomato, cucumber, onion, white cheese"],
     "Mountain Lemonade","Local Wine","Montenegrin Coffee",
     [["Priganice Honey Puffs","Fried dough, honey, cheese"],["Walnut Layer Cake","Walnut sponge, cream layers"]],
     "beef"],

    ["alb","Albania","ADR","MED-45","Mirë se vini — Welcome",
     ["Pepper & White Cheese Burger","Roast pepper, white cheese, oregano"],
     ["Yoghurt Herb Chicken Burger","Yoghurt-marinated chicken, herbs"],
     ["Coastal Beef Burger","Beef, mountain cheese, tomato"],
     [["White Cheese Fries","Crumbled white cheese, oregano"],["Spicy Pepper Fries","Chilli pepper, garlic"]],
     ["Riviera Salad","Tomato, cucumber, onion, white cheese"],
     "Yoghurt Drink","Raki","Albanian Coffee",
     [["Revani","Semolina cake soaked in syrup"],["Almond Citrus Cookies","Almond, lemon zest"]],
     "beef"],

    ["egy","Egypt","NAF","MED-51","Ahlan bik — Welcome",
     ["Ta'ameya Veg Burger","Herb falafel patty, tahini, pickles"],
     ["Koshari Chicken Burger","Spiced chicken, crisp onion, tomato-cumin sauce"],
     ["Hawawshi Burger","Cumin-chilli minced beef baked into the bun, pepper, parsley"],
     [["Dukka Fries","Dukka spice, olive oil, herbs"],["Koshari Fries","Tomato-cumin sauce, crisp onion, chickpeas"]],
     ["Baladi Salad","Tomato, cucumber, onion, lemon, cumin"],
     "Sugarcane & Hibiscus Drink","Local Wine / Beer","Egyptian Spiced Coffee",
     [["Basbousa","Semolina cake, coconut, syrup"],["Konafa Street Slice","Shredded pastry, cream, nuts"]],
     "beef"],

    ["lby","Libya","NAF","MED-52","Marhaban bik — Welcome",
     ["Chickpea Veg Burger","Spiced chickpea patty, tahini, salad"],
     ["Harissa Chicken Burger","Harissa chicken, preserved lemon, mint"],
     ["Bazin Spice Beef Burger","Bzaar-spiced beef, tomato, chilli"],
     [["Harissa Fries","Harissa, garlic, coriander"],["Garlic & Herb Fries","Garlic, parsley, olive oil"]],
     ["Tripoli Salad","Tomato, onion, olives, olive oil"],
     "Date & Orange Drink","Wine / Beer","Libyan Spiced Tea",
     [["Date Semolina Bars","Date paste, semolina, sesame"],["Citrus Honey Donuts","Fried dough, citrus honey"]],
     "beef"],

    ["tun","Tunisia","NAF","MED-53","Ahlan wa sahlan — Welcome",
     ["Harissa Veg Burger","Grilled vegetables, harissa, herb salad"],
     ["Mechouia Chicken Burger","Grilled chicken, mechouia pepper salad"],
     ["Merguez Burger","Merguez-spiced beef, harissa, egg"],
     [["Harissa & Egg Fries","Harissa, soft egg, capers"],["Merguez Fries","Sliced merguez, tomato, chilli"]],
     ["Mechouia Salad","Grilled pepper and tomato, capers, olive oil"],
     "Citronade","Boukha Cocktail / Wine","Tunisian Mint Tea with Pine Nuts",
     [["Makroudh Date Diamonds","Semolina pastry, date, honey"],["Bambalouni Beach Donuts","Fried rings, sugar"]],
     "beef"],

    ["dza","Algeria","NAF","MED-54","Marhaba — Welcome",
     ["Couscous Veg Burger","Vegetable couscous patty, harissa yoghurt"],
     ["Ras el Hanout Chicken Burger","Spiced chicken, preserved lemon, coriander"],
     ["Merguez Beef Burger","Merguez-spiced beef, roast pepper, chermoula"],
     [["Harira Fries","Harira-spiced tomato, chickpea, coriander"],["Spicy Fries","Chilli, garlic, cumin"]],
     ["Carrot & Orange Cumin Salad","Carrot, orange, cumin, olive oil"],
     "Orange & Mint Drink","Algerian Wine","Algerian Mint Tea",
     [["Makroud Almond Slice","Semolina, almond, honey"],["Orange Blossom Semolina Cake","Semolina sponge, orange blossom"]],
     "beef"],

    ["mar","Morocco","NAF","MED-55","Marhaba — Welcome",
     ["Chermoula Veg Burger","Chermoula-marinated vegetables, harissa aioli"],
     ["Tagine Chicken Burger","Slow-cooked tagine chicken, preserved lemon, olive"],
     ["Tagine Beef Burger","Tagine beef, apricot-onion jam, ras el hanout aioli"],
     [["Harissa Fries","Harissa, cumin, coriander"],["Orange-Almond Fries","Orange zest, toasted almond, honey"]],
     ["Orange & Olive Salad","Orange, olive, red onion, cinnamon"],
     "Orange Blossom Lemonade","Spiced Wine Cocktail","Moroccan Mint Tea",
     [["M'hanncha Snake Cake","Coiled almond pastry, cinnamon"],["Almond Honey Cigars","Crisp pastry, almond, honey"]],
     "beef"]
  ];

  var ROUTES = {
    LEV: { name: "Levant", bg: "#f2b30c", fg: "#1b1a19" },
    AEG: { name: "Aegean", bg: "#2b76c9", fg: "#ffffff" },
    IBL: { name: "Iberia & Latin", bg: "#f7f3ec", fg: "#1b1a19" },
    ADR: { name: "Adriatic", bg: "#e7e3dc", fg: "#1b1a19" },
    NAF: { name: "N. Africa", bg: "#ec3013", fg: "#ffffff" }
  };

  var NUTS = /pistachio|walnut|almond|pine nut|hazelnut|nuts|dukka|tahini|sesame/i;
  var PORK = /jamón|ham|sujuk|chorizo|bacon|pork/i;

  function tagsFor(kind, name, desc) {
    var text = (name + " " + (desc || ""));
    var t = [];
    if (kind === "veg" || kind === "salad") t.push("Vegetarian");
    if (kind === "alcohol") { t.push("Contains alcohol"); }
    else { t.push("Alcohol-free"); }
    if (PORK.test(text)) t.push("Contains pork"); else t.push("No pork");
    if (kind !== "alcohol" && !PORK.test(text)) t.push("Halal-friendly");
    if (NUTS.test(text)) t.push("Contains nuts");
    return t;
  }

  function countryMenu(c) {
    var mk = function (kind, pair, price, group) {
      var name = pair[0], desc = pair[1] || "";
      return { kind: kind, name: name, desc: desc, price: price, group: group, tags: tagsFor(kind, name, desc) };
    };
    var items = [
      mk("veg", c[5], PRICES.vegBurger, "Burgers"),
      mk("chicken", c[6], PRICES.chickenBurger, "Burgers"),
      mk("beef", c[7], PRICES.beefBurger, "Burgers"),
      mk("fries", c[8][0], PRICES.loadedFries, "Loaded fries"),
      mk("fries", c[8][1], PRICES.loadedFries, "Loaded fries"),
      mk("salad", c[9], PRICES.salad, "Salads"),
      mk("cold", [c[10], "Cold country drink"], PRICES.coldDrink, "Drinks"),
      mk("alcohol", [c[11], "Alcoholic country drink"], PRICES.alcoholDrink, "Drinks"),
      mk("hot", [c[12], "Hot drink"], PRICES.hotDrink, "Drinks"),
      mk("dessert", c[13][0], PRICES.dessert, "Desserts"),
      mk("dessert", c[13][1], PRICES.dessert, "Desserts")
    ];
    return items;
  }

  var COUNTRIES = C.map(function (c, i) {
    return {
      code: c[0], name: c[1], routeKey: c[2], route: ROUTES[c[2]].name, med: c[3],
      greeting: c[4], heroKind: c[14],
      stamp: "#" + String(i + 1).padStart(2, "0"),
      items: countryMenu(c)
    };
  });

  /* ── Investors: §6.4–6.10 ─────────────────────────────────────────── */
  var LAND = {
    A: { name: "Leganés Technology Park", plot: 2500, low: 553900, high: 553900, lines: [
      ["Base land purchase", 500000], ["6% ITP transfer tax", 30000], ["Notary / registry / lawyer", 7200],
      ["Urbanistic certificate", 200], ["Compatibility + alignment", 500], ["Topographical + geotechnical", 2600],
      ["Smoke / odour / noise study", 2000], ["Catastro coordination", 400], ["Clearance & levelling", 1000], ["Utility hookups", 10000]
    ]},
    B: { name: "Villaverde", plot: 3000, low: 330000, high: 360000, lines: [
      ["Base land purchase", 300000], ["6% ITP transfer tax", 18000], ["Notary / registry / lawyer", 5700],
      ["Urbanistic certificate", 200], ["Compatibility + alignment", 500], ["ECU review fee (Madrid city)", 1500],
      ["Topographical + geotechnical", 2600], ["Smoke / odour / noise study", 2000], ["Catastro coordination", 400],
      ["Clearance & levelling", 1000], ["Utility hookups", 8000]
    ]}
  };

  var BUILD_RATE = { low: 1800, high: 2500 };

  // Exterior capex bands per scenario (§6.6)
  var EXTERIOR = {
    A1: [188000, 321000], A2: [140000, 260000], B1: [244000, 436000], B2: [220000, 380000]
  };

  var SCENARIOS = [
    { key: "A1", plan: "A", label: "Plan A1", site: "Leganés", plot: 2500, building: 1500,
      parking: [40, 40], garden: 120, trees: [18, 26],
      fees: [216000, 450000], licences: [110000, 260000], contingency: [300000, 600000], working: [200000, 400000],
      note: "40 spaces at ~22 m²/space genuinely fit, leaving ~120 m² for a small plaza." },
    { key: "A2", plan: "A", label: "Plan A2", site: "Leganés", plot: 2500, building: 2000,
      parking: [20, 25], garden: 40, trees: [8, 14],
      fees: [280000, 600000], licences: [150000, 350000], contingency: [350000, 700000], working: [200000, 400000],
      note: "Only ~500 m² remains after the building — 20–25 spaces, garden reduced to tree islands and strips." },
    { key: "B1", plan: "B", label: "Plan B1", site: "Villaverde", plot: 3000, building: 1500,
      parking: [45, 50], garden: 380, trees: [24, 34],
      fees: [216000, 450000], licences: [110000, 260000], contingency: [300000, 600000], working: [200000, 400000],
      note: "Largest garden of the four. 50 spaces only at a tightened ~20 m²/space; 45 is the honest ceiling." },
    { key: "B2", plan: "B", label: "Plan B2", site: "Villaverde", plot: 3000, building: 2000,
      parking: [40, 45], garden: 120, trees: [16, 24],
      fees: [280000, 600000], licences: [150000, 350000], contingency: [350000, 700000], working: [200000, 400000],
      note: "~1,000 m² left over: 45 spaces at the 22 m²/space standard, 50 only with tighter spacing." }
  ].map(function (s) {
    var land = LAND[s.plan];
    var ext = EXTERIOR[s.key];
    s.categories = [
      { label: "Land (" + land.name + ")", low: land.low, high: land.high, note: s.plot.toLocaleString("en-GB") + " m² plot, taxes and surveys included" },
      { label: "Building", low: s.building * BUILD_RATE.low, high: s.building * BUILD_RATE.high, note: s.building.toLocaleString("en-GB") + " m² turnkey at €1,800–2,500/m²" },
      { label: "Exterior", low: ext[0], high: ext[1], note: "Parking, plaza, garden, lighting, sound" },
      { label: "Professional fees", low: s.fees[0], high: s.fees[1], note: "8–12% of build cost" },
      { label: "Licences & ICIO", low: s.licences[0], high: s.licences[1], note: "4–7% of build cost" },
      { label: "Contingency", low: s.contingency[0], high: s.contingency[1], note: "10–15% of project" },
      { label: "Working capital", low: s.working[0], high: s.working[1], note: "Opening stock, payroll runway, launch" }
    ];
    s.totalLow = s.categories.reduce(function (a, c) { return a + c.low; }, 0);
    s.totalHigh = s.categories.reduce(function (a, c) { return a + c.high; }, 0);
    s.mid = (s.totalLow + s.totalHigh) / 2;
    return s;
  });

  var FUNDING = { equity: 400000, loan: 500000, committed: 900000 };

  var OPERATING = {
    days: 350,
    revenueCases: [
      { key: "low", label: "Low", guests: 120, spend: 18 },
      { key: "base", label: "Base case", guests: 160, spend: 20 },
      { key: "high", label: "High", guests: 220, spend: 22 }
    ],
    foodPct: 0.30, labourPct: 0.30, marketingPct: 0.07,
    fixedMonthly: 6025,
    seats: 240, staff: 42
  };

  var SEVEN_PS = [
    ["P1", "Product", "Destination burgers per country, loaded fries, salads, desserts and drinks; Full Experience and Quick Bite formats; passports and stamps; kids' journeys, birthdays and group packages; music and activities.",
      [["Destination burger", "3 per country — veg, chicken, beef"], ["Quick Bite", "Burger + fries + drink, €13–15"], ["Full Experience", "Buffet format, €24–26"], ["Kids journeys", "Junior passport, kits, birthdays"]]],
    ["P2", "Price", "One global price grid across all twenty-one countries — only the flavours change. Combos sit 22–24% below the same items à la carte.",
      [["Quick Bite", "€13–15"], ["Full Buffet", "€24–26"], ["Kids birthdays", "€18–22 per child"], ["Minimum spend", "€10 adult · €8 child"]]],
    ["P3", "Place", "Leganés (2,500 m²) or Villaverde (3,000 m²), with a 1,500–2,000 m² building: double-height sky hall plus mezzanine, 40–50 parking spaces and a Mediterranean garden — plus the website as a second venue.",
      [["Plot", "2,500 m² or 3,000 m²"], ["Building", "1,500 m² or 2,000 m²"], ["Parking", "20–50 spaces by scenario"], ["Garden", "Mediterranean, tree per country"]]],
    ["P4", "Promotion", "Retention is designed in rather than bought: the passport gives a reason to return twenty more times, and the calendar gives a reason to come this week.",
      [["Passport stamps", "21-country reward ladder"], ["Combos & bundles", "Quick Bite to Full Buffet"], ["Country nights", "One destination, one evening"], ["Seasonal menus & UGC", "Digital 60–80%, offline 20–40%"]]],
    ["P5", "People", "Two founders who already run restaurants and retail, and a young multicultural crew of around 42 organised into named travel roles.",
      [["Founders", "Mazen — global trade · Ahmed — retail"], ["Core full-time", "30 employees"], ["Part-time / peak", "~12 employees"], ["Peak on-site", "28–34 at busiest"]]],
    ["P6", "Process", "The guest journey is the operating model: check in, choose a destination, take the ticket, get seated, eat with the destination card, collect the stamp, book the next route.",
      [["1 · Check-in", "At the desk, name and party"], ["2 · Destination", "Country and route chosen"], ["3 · Ticket & seat", "Boarding pass printed"], ["4 · Stamp", "Passport stamped, next route hooked"]]],
    ["P7", "Physical Evidence", "Everything the guest can touch or photograph: the hall, the zones, the garden, and the printed travel kit they carry out.",
      [["Sky hall", "Double-height, mezzanine above"], ["Route pockets", "Five zones, one per chapter"], ["Exterior garden", "Trees, plaques, plaza, parking"], ["Printed kit", "Tickets, passports, packaging"]]]
  ].map(function (p) {
    return { id: p[0], name: p[1], summary: p[2], cards: p[3].map(function (c) { return { title: c[0], line: c[1] }; }) };
  });

  window.PP_DATA = {
    PRICES: PRICES, COMBOS: COMBOS, UPGRADES: UPGRADES, MIN_SPEND: MIN_SPEND,
    ROUTES: ROUTES, COUNTRIES: COUNTRIES,
    SCENARIOS: SCENARIOS, FUNDING: FUNDING, OPERATING: OPERATING, SEVEN_PS: SEVEN_PS,
    HOURS: [
      { days: "Monday — Friday", time: "10:00 — 22:00" },
      { days: "Weekends & holidays", time: "10:00 — 00:00" }
    ]
  };
  window.dispatchEvent(new Event("pp-data-ready"));
})();
