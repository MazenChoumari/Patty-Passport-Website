/* Patty Passport — single shared data file for the whole site.
   Source of truth: uploads/patty_passport_master_brief.md, Section 6.
   Merges the prototype's two previously-separate country data sources
   (pp-data.js's menu/pricing catalogue and Destination-Page.dc.html's
   inline culture/story array) into one COUNTRIES array, keyed by code,
   so every page reads the same object. Loaded as a classic <script> —
   assigns window.PP_DATA, no build step. */
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

  var ROUTES = {
    LEV: { name: "Levant", bg: "#f2b30c", fg: "#1b1a19" },
    AEG: { name: "Aegean", bg: "#2b76c9", fg: "#ffffff" },
    IBL: { name: "Iberia & Latin", bg: "#f7f3ec", fg: "#1b1a19" },
    ADR: { name: "Adriatic", bg: "#e7e3dc", fg: "#1b1a19" },
    NAF: { name: "N. Africa", bg: "#ec3013", fg: "#ffffff" }
  };

  /* code, name, route, med, greeting(romanised — English), veg, chicken, beef,
     fries[2], salad, cold, alcoholic, hot, desserts[2], heroKind */
  var MENU_SRC = [
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

  /* code, identity, intro, culture1, culture2, nativePhrase, translit, facts[3], nature, capital, pop, sea, dietTags */
  var CULTURE_SRC = [
    ["lbn","Land of the Phoenicians","The loudest welcome on the Mediterranean: cedar mountains behind you, the sea in front, and a table that refuses to stay small.","Lebanon gave the alphabet to the world and then spent three thousand years perfecting the art of feeding people who show up unannounced. The mezze table is the national argument — twenty small plates, all arriving at once, none of them optional.","Beirut cooks like a port city because it is one: Ottoman grills, French bakery technique, mountain village preserving, all inside six streets.","مرحبا","Marhaba · Welcome",[["Alphabet exporters","The Phoenician script that became Greek, Latin and most of what you're reading."],["Six millennia of Byblos","One of the oldest continuously inhabited cities on earth, still serving lunch."],["Cedar on the flag","The tree that built Egyptian ships and Solomon's temple."]],"Cedar forest on a Lebanese mountain slope","Beirut","5.5M","Levantine Sea","Halal · nut-free option"],
    ["syr","The Oldest Kitchens","Aleppo pepper, pomegranate molasses and a grill tradition older than most of the borders around it.","Aleppo was a trade capital when Rome was a village, and its kitchen still shows the inventory: pistachio, cherry, cumin, tamarind, charcoal.","Damascus does sweets the way Paris does pastry — patient, layered, and slightly competitive.","أهلا وسهلا","Ahlan wa sahlan · Welcome",[["Cherry kebab","Aleppo grills lamb over sour cherries — sweet, sharp, unmistakable."],["Oldest capital","Damascus has been continuously inhabited for roughly eleven thousand years."],["Spice road station","Every caravan between Asia and the sea stopped here and left something behind."]],"Terraced orchards outside Aleppo","Damascus","21M","Levantine Sea","Halal · contains nuts"],
    ["pse","Olive, Thyme and Stone","Za'atar hillsides, taboon bread baked on stones, and the sweetest olive oil on the eastern coast.","The Palestinian table is built on preserving: oil, olives, thyme, sumac, labneh rolled in herbs and kept in jars through the winter.","Musakhan — sumac chicken on oil-soaked bread — is the dish families cook to mark the first press of the season.","أهلاً","Ahlan · Welcome",[["First press","The olive harvest is a national calendar event, not an agricultural one."],["Za'atar blend","Wild thyme, sesame, sumac — every family swears by a different ratio."],["Taboon bread","Baked directly on hot stones, dimpled by the oven floor."]],"Olive terraces on limestone hills","Ramallah","5.4M","Levantine Sea","Halal · contains nuts"],
    ["tur","The Bridge Between Continents","Two seas, two landmasses, and the grill culture that connects them.","Turkish cooking is regional to the point of stubbornness: Black Sea anchovies, Gaziantep pistachio, Aegean olive oil, Istanbul street everything.","The meyhane table — small plates, slow drinking, long conversation — is the Mediterranean's other mezze tradition.","Hoş geldiniz","Hoş geldiniz · Welcome",[["Two continents","Istanbul is the only city sitting on two landmasses at once."],["Pistachio capital","Gaziantep produces baklava under legal geographic protection."],["Tea by volume","Türkiye drinks more tea per person than any country on earth."]],"Aegean coastline with olive groves","Ankara","85M","Aegean & Black Sea","Halal · contains dairy"],
    ["cyp","Island of Two Tables","Halloumi on the grill, mint in the salad, and a sea on every side.","Cyprus cooks Greek and Turkish at the same time and has never seen a contradiction in it.","Meze here runs to thirty plates and several hours; nobody orders a main course.","Καλώς ήρθατε","Kalos irthate · Welcome",[["Halloumi is protected","Only cheese made on the island can carry the name."],["Copper island","Cyprus gave copper its Latin name — cuprum."],["Commandaria","The oldest named wine still in production, going since 800 BC."]],"Troodos vineyards above the sea","Nicosia","1.2M","Levantine Sea","Vegetarian option · contains dairy"],
    ["grc","Birthplace of the Open Sea","Six thousand islands, one horizon, and a cuisine built on fire, lemon and patience.","Greek cooking is an argument for restraint: good oil, hot charcoal, one herb, plenty of lemon.","The taverna model — shared plates, no rush, the sea in view — is the reason the rest of Europe eats outside.","Καλώς ήρθατε","Kalós irthate · Welcome",[["Six thousand islands","Two hundred and twenty-seven of them inhabited."],["Olive oil per head","Greece consumes more per person than anywhere in the world."],["Coastline","Eleven times longer than Italy's relative to land area."]],"Aegean island coast, white rock and olive","Athens","10.4M","Aegean & Ionian","Contains dairy · pork"],
    ["ita","The Art of Fewer Things","Three ingredients, done perfectly, repeated for two thousand years.","Italian cooking is regional law: Naples defends the pizza, Bologna the ragù, Sicily the citrus and the eggplant.","The Mediterranean diet was formally described in Southern Italy — a village diet rebranded as the world's healthiest.","Benvenuti","Benvenuti · Welcome",[["Sixty pasta shapes","Each one engineered for a specific sauce viscosity."],["Slow Food started here","Founded in Piedmont in 1986, in protest at a fast-food opening."],["Citrus of Sicily","Arab traders planted the groves that still define the island."]],"Sicilian lemon grove under Etna","Rome","59M","Tyrrhenian & Adriatic","Vegetarian option · contains dairy"],
    ["esp","Kingdom of the Long Table","Where lunch is an institution and the heat comes from smoked paprika, not chilli.","Spain eats late, in company, and in small plates — the tapas format exists because nobody wants the meal to end.","Andalusian olive plains produce more oil than any country on earth; the Basque coast produces the cooks.","Bienvenidos","Bienvenidos · Welcome",[["Olive oil superpower","Spain produces roughly half the world's olive oil."],["Tapas by law","In some regions a drink still legally arrives with food."],["Longest lunch","The midday meal is protected by habit, not legislation — but only just."]],"Andalusian olive rows at golden hour","Madrid","48M","Balearic & Alborán","Contains dairy · pork"],
    ["fra","The Southern Kitchen","Provençal herbs, sea salt and butter that refuses to apologise.","The French Mediterranean is not Paris: it is garlic, anchovy, tomato, olive — closer to Naples than to Normandy.","Marseille's bouillabaisse began as the fishermen's leftovers and ended up with a legal charter.","Bienvenue","Bienvenue · Welcome",[["Bouillabaisse charter","Marseille restaurants signed a legal recipe agreement in 1980."],["Herbes de Provence","Thyme, rosemary, savory, oregano — the hillside, dried."],["Camargue salt","Hand-harvested from the Rhône delta since Roman times."]],"Lavender and stone in inland Provence","Paris","68M","Gulf of Lion","Contains dairy"],
    ["mco","The Smallest Coastline","A harbour the size of a street, cooking above its weight since 1297.","Monaco's kitchen is Ligurian at heart: chickpea flour, olive oil, basil, seafood straight off the rock.","Barbagiuan — fried chard and ricotta pastry — is the national dish of a country you can walk across in an hour.","Benvenue","Benvenue · Welcome",[["Two square kilometres","The second-smallest country in the world."],["Barbagiuan","Chard and ricotta in fried pastry — served at every national holiday."],["Socca","Chickpea pancake shared with neighbouring Nice."]],"Cliffs and harbour on the Riviera","Monaco","39K","Ligurian Sea","Pescatarian · contains dairy"],
    ["mlt","Fortress in the Middle","Limestone, rabbit stew and a language that belongs to nowhere else.","Malta sits exactly between Sicily and North Africa, and its food and language both prove it — Semitic grammar, Italian vocabulary, British habits.","Fenkata, the rabbit feast, is the closest thing the islands have to a national ceremony.","Merħba","Merħba · Welcome",[["Semitic language, Latin script","Maltese is the only one of its kind in the EU."],["Fenkata","The rabbit feast is a village-scale event, not a dinner."],["Limestone everywhere","The whole archipelago is one honey-coloured rock."]],"Honey limestone cliffs above blue water","Valletta","540K","Sicilian Channel","Contains alcohol in sauce"],
    ["svn","Where the Alps Meet the Sea","Forty-six kilometres of coast and a kitchen borrowed — brilliantly — from three neighbours.","Slovenian cooking runs Alpine in the north, Italian on the coast and Balkan in the east, all within two hours' drive.","The Karst produces prosciutto cured in the bora wind, and wine grown on red iron soil.","Dobrodošli","Dobrodošli · Welcome",[["46 km of coast","One of the shortest coastlines in Europe, fiercely used."],["Karst prosciutto","Cured by the bora wind, not by smoke."],["Beekeeping nation","Slovenia has more beekeepers per head than anywhere in the EU."]],"Karst vineyards on red iron soil","Ljubljana","2.1M","Gulf of Trieste","Contains pork · gluten"],
    ["hrv","A Thousand Islands of Stone","Karst cliffs, black risotto, and grill smoke over green water.","Dalmatian cooking is Venetian at the edges and Ottoman inland: olive oil and fish on the coast, peka and paprika behind it.","Peka — meat and vegetables under an iron bell buried in embers — is the slowest good idea on the Adriatic.","Dobro došli","Dobro došli · Welcome",[["1,244 islands","Only about fifty are permanently inhabited."],["Peka under embers","Cooked under an iron bell for three hours, minimum."],["Zinfandel origin","DNA-traced to the Croatian grape crljenak kaštelanski."]],"Karst cliffs above the green Adriatic","Zagreb","3.9M","Adriatic Sea","Contains dairy"],
    ["bih","The Inland Coast","Ćevapi, kajmak and copper pots — the Adriatic's mountain kitchen.","Bosnian food is Ottoman architecture in edible form: slow-braised, layered, cooked in copper, served with bread that arrives hot.","Sarajevo's ćevabdžinicas serve one thing, perfectly, all day. Nothing else is on the menu.","Dobro došli","Dobro došli · Welcome",[["Twenty kilometres of coast","The shortest coastline of any Adriatic country."],["Copper craft","Sarajevo's coppersmith street has worked metal since the 1500s."],["Somun bread","Baked to order, always served hot enough to steam."]],"Mountain rivers above Mostar","Sarajevo","3.2M","Adriatic Sea","Halal available · contains dairy"],
    ["mne","Black Mountain, Blue Bay","Fjord light, smoked ham and the quietest gulf on the sea.","Montenegro cooks between mountain and coast: Njeguši ham cured in mountain air, fish pulled from the Bay of Kotor below it.","The bay is the Mediterranean's deepest natural inlet, and it behaves like a lake with opinions.","Dobrodošli","Dobrodošli · Welcome",[["Bay of Kotor","Often called Europe's southernmost fjord — technically a ria."],["Njeguši village","Two hundred people, one nationally famous ham."],["Black mountain","Named by Venetians for the dark forest on Mount Lovćen."]],"The Bay of Kotor from the mountain road","Podgorica","620K","Adriatic Sea","Contains dairy"],
    ["alb","The Undiscovered Shore","Byrek pastry, mountain yoghurt and a coastline Europe forgot to develop.","Albanian cooking leans on yoghurt, lamb and wild herbs, with Ottoman pastry technique layered over it.","Tavë kosi — lamb baked under a yoghurt custard — is comfort food with an unusual amount of engineering.","Mirë se vini","Mirë se vini · Welcome",[["Two seas","Adriatic in the north, Ionian in the south, one coastline."],["Bunkers everywhere","Around 170,000 of them, now mostly cafés and storage."],["Wild herbs","Albania is one of Europe's largest exporters of wild sage."]],"The Albanian Riviera from the pass","Tirana","2.8M","Adriatic & Ionian","Contains dairy · eggs"],
    ["egy","Gift of the River","Seven thousand years of street food perfected on one riverbank.","Egyptian cooking is the oldest continuous tradition on the Mediterranean: bread, beans, onions, herbs, all documented on tomb walls.","Hawawshi — spiced minced meat baked inside bread — is the Cairo street dish that translates perfectly into a burger.","أهلا بيك","Ahlan bik · Welcome",[["Bread as currency","Pyramid workers were partly paid in bread and beer."],["Ful medames","The national breakfast, unchanged for several thousand years."],["One river","Ninety-five percent of Egyptians live within a few kilometres of it."]],"Nile delta farmland at dawn","Cairo","112M","Eastern Mediterranean","Halal · contains sesame"],
    ["lby","Desert Meets Harbour","Bazin, harissa and a coast where the Sahara comes right down to the sea.","Libyan cooking sits between Maghreb and Levant: pasta from Italy, spice from the desert routes, fish from a very long coastline.","Shorba, the spiced lamb and orzo soup, is the dish every family makes slightly differently.","مرحبا بك","Marhaban bik · Welcome",[["Longest coast","Nearly 1,800 km of Mediterranean shoreline."],["Bzaar spice","Turmeric, cinnamon, caraway — the house blend of the country."],["Roman Leptis Magna","One of the best-preserved Roman cities anywhere."]],"Where the desert reaches the sea","Tripoli","7M","Gulf of Sidra","Halal · spicy"],
    ["tun","The Spice Crossroads","Harissa born here, brik pastry perfected here, olives absolutely everywhere.","Tunisian food is the spiciest on the Mediterranean, and the most Italian-influenced in North Africa — a Carthage habit that never stopped.","Brik — egg in crisp pastry, eaten with your hands and some risk — is the national test of nerve.","أهلا وسهلا","Ahlan wa sahlan · Welcome",[["Harissa's home","Protected by UNESCO as intangible cultural heritage."],["Carthage","Rome's great rival ran the western Mediterranean from here."],["Olive groves","Among the largest planted olive areas on earth."]],"Olive plains inland from Sfax","Tunis","12M","Gulf of Gabès","Halal · spicy · contains fish"],
    ["dza","The Widest Country","Mountain herbs, Saharan dates and a French-Ottoman kitchen entirely its own.","Algeria is Africa's largest country, and its coast cooks nothing like its desert — Kabyle olive oil north, dates and cumin south.","Chakhchoukha, rechta, merguez: dishes that travelled to Marseille and stayed there.","مرحبا","Marhaba · Welcome",[["Largest in Africa","Eighty percent of it is Sahara."],["Kabyle olive oil","Mountain groves producing oil pressed the same way for centuries."],["Merguez everywhere","The sausage that colonised French street food."]],"Kabyle mountain olive terraces","Algiers","45M","Alborán & Algerian Basin","Halal · spicy"],
    ["mar","Where the Desert Meets the Atlantic","Fondouks, tanneries and spice mountains — a kitchen that never rushes anything.","Moroccan cooking is the Mediterranean's most patient: tagines run for hours, preserved lemons sit for months, tea is poured from a height for the theatre of it.","Marrakech's spice souks still sell by pyramid, and the ras el hanout blend changes with every stall.","مرحبا","Marhaba · Welcome",[["Two coastlines","Atlantic on one side, Mediterranean on the other."],["Ras el hanout","Literally 'head of the shop' — the merchant's best blend."],["Mint tea ritual","Poured from height to aerate; refusing a glass is not really an option."]],"Date palm oasis at the desert edge","Rabat","37M","Alborán Sea","Halal · contains nuts"]
  ];

  var NUTS = /pistachio|walnut|almond|pine nut|hazelnut|nuts|dukka|tahini|sesame/i;
  var PORK = /jamón|ham|sujuk|chorizo|bacon|pork/i;
  function tagsFor(kind, name, desc) {
    var text = (name + " " + (desc || ""));
    var t = [];
    if (kind === "veg" || kind === "salad") t.push("Vegetarian");
    if (kind === "alcohol") { t.push("Contains alcohol"); } else { t.push("Alcohol-free"); }
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
    return [
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
  }

  var CULTURE_BY_CODE = {};
  CULTURE_SRC.forEach(function (d) {
    CULTURE_BY_CODE[d[0]] = {
      identity: d[1], intro: d[2], culture1: d[3], culture2: d[4],
      nativePhrase: d[5], translit: d[6], facts: d[7], nature: d[8],
      capital: d[9], population: d[10], sea: d[11], dietTags: d[12]
    };
  });

  var COUNTRIES = MENU_SRC.map(function (c, idx) {
    var items = countryMenu(c);
    var heroKind = c[14];
    var hero = items.find(function (i) { return i.group === "Burgers" && i.kind === heroKind; }) || items[0];
    var culture = CULTURE_BY_CODE[c[0]] || {};
    return {
      code: c[0], name: c[1], routeKey: c[2], route: ROUTES[c[2]].name, med: c[3],
      greeting: c[4], heroKind: heroKind, heroItem: hero,
      stamp: "#" + String(idx + 1).padStart(2, "0"),
      items: items,
      identity: culture.identity || "", intro: culture.intro || "",
      culture1: culture.culture1 || "", culture2: culture.culture2 || "",
      nativePhrase: culture.nativePhrase || "", translit: culture.translit || "",
      facts: culture.facts || [], nature: culture.nature || "",
      capital: culture.capital || "", population: culture.population || "",
      sea: culture.sea || "", dietTags: culture.dietTags || ""
    };
  });

  /* ── Investors: master brief §6.4–6.10, corrected totals per §6.7/§7 ── */
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
  var EXTERIOR = { A1: [188000, 321000], A2: [140000, 260000], B1: [244000, 436000], B2: [220000, 380000] };
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
    var land = LAND[s.plan], ext = EXTERIOR[s.key];
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
    fixedMonthly: 6025, seats: 240, staff: 42
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
