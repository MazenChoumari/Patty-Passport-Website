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

  /* code, subheading, description, cardDescription, culture1, culture2,
     greetingNative, greetingRoman, phraseNative, phraseRoman, phraseEnglish,
     facts[3], nature, capital, pop, sea, dietTags */
  var CULTURE_SRC = [
    ["lbn","Harbour of the First Alphabet","Phoenician ports, cedar mountains, Roman temples and Ottoman kitchens meet on one small coast, where mezze, trade and argument still arrive together at the table.","Phoenician ports, cedar mountains and a table where mezze, trade and argument all arrive together.","Lebanon gave the alphabet to the world and then spent three thousand years perfecting the art of feeding people who show up unannounced. The mezze table is the national argument — twenty small plates, all arriving at once, none of them optional.","Beirut cooks like a port city because it is one: Ottoman grills, French bakery technique, mountain village preserving, all inside six streets.","يا هلا فيكن","Ya hala fikon","أهلا وسهلا، نورتونا","Ahlan wa sahlan, nawwartouna","Welcome, you have brightened our home",[["Alphabet exporters","The Phoenician script that became Greek, Latin and most of what you're reading."],["Six millennia of Byblos","One of the oldest continuously inhabited cities on earth, still serving lunch."],["Cedar on the flag","The tree that built Egyptian ships and Solomon's temple."]],"Cedar forest on a Lebanese mountain slope","Beirut","5.5M","Levantine Sea","Halal · nut-free option"],
    ["syr","Cradle of the Oldest Kitchens","From Ebla and Damascus to Aleppo’s spice markets, Syria carries one of the Mediterranean’s deepest culinary lineages, where ancient cities, caravan trade and fire-cooked food still shape the table.","Ancient cities, caravan trade and fire-cooked food shape one of the Mediterranean's deepest culinary lineages.","Aleppo was a trade capital when Rome was a village, and its kitchen still shows the inventory: pistachio, cherry, cumin, tamarind, charcoal.","Damascus does sweets the way Paris does pastry — patient, layered, and slightly competitive.","أهلاً وسهلاً","Ahlan wa sahlan","يا هلا بالضيف","Ya hala bil-ḍeif","A warm welcome to our guest",[["Cherry kebab","Aleppo grills lamb over sour cherries — sweet, sharp, unmistakable."],["Oldest capital","Damascus has been continuously inhabited for roughly eleven thousand years."],["Spice road station","Every caravan between Asia and the sea stopped here and left something behind."]],"Terraced orchards outside Aleppo","Damascus","21M","Levantine Sea","Halal · contains nuts"],
    ["pse","Stone, Olive and Memory","Palestine’s hills, ports and old cities are bound by olive harvests, taboon bread, citrus groves and a cuisine that turns land, season and memory into identity.","Olive harvests, taboon bread and citrus groves turn land, season and memory into identity.","The Palestinian table is built on preserving: oil, olives, thyme, sumac, labneh rolled in herbs and kept in jars through the winter.","Musakhan — sumac chicken on oil-soaked bread — is the dish families cook to mark the first press of the season.","يا مرحبا فيكن","Ya marhaba fikon","البيت بيتك","Al-bēt bētak","Make yourself at home",[["First press","The olive harvest is a national calendar event, not an agricultural one."],["Za'atar blend","Wild thyme, sesame, sumac — every family swears by a different ratio."],["Taboon bread","Baked directly on hot stones, dimpled by the oven floor."]],"Olive terraces on limestone hills","Ramallah","5.4M","Levantine Sea","Halal · contains nuts"],
    ["tur","Where Continents Share a Table","Straits, empires and caravan routes made Türkiye a meeting place of Balkan, Anatolian, Black Sea and Levantine traditions, turning the table into a map of movement across two continents.","Straits, empires and caravan routes meet at a table spanning two continents.","Turkish cooking is regional to the point of stubbornness: Black Sea anchovies, Gaziantep pistachio, Aegean olive oil, Istanbul street everything.","The meyhane table — small plates, slow drinking, long conversation — is the Mediterranean's other mezze tradition.","Hoş geldiniz","Hoş geldiniz","Soframıza hoş geldiniz","Soframıza hoş geldiniz","Welcome to our table",[["Two continents","Istanbul is the only city sitting on two landmasses at once."],["Pistachio capital","Gaziantep produces baklava under legal geographic protection."],["Tea by volume","Türkiye drinks more tea per person than any country on earth."]],"Aegean coastline with olive groves","Ankara","85M","Aegean & Black Sea","Halal · contains dairy"],
    ["cyp","Island of Copper and Crossroads","Cyprus stands between Greece, the Levant and Anatolia, where Bronze Age trade, layered histories, village kitchens and sea-bound hospitality shape the island’s voice and flavour.","Bronze Age trade, layered histories and sea-bound hospitality shape the island's voice and flavour.","Cyprus cooks Greek and Turkish at the same time and has never seen a contradiction in it.","Meze here runs to thirty plates and several hours; nobody orders a main course.","Καλώς ήρθατε","Kalós írthate","Κόπιαστε","Kópi̱aste","Come in and join us",[["Halloumi is protected","Only cheese made on the island can carry the name."],["Copper island","Cyprus gave copper its Latin name — cuprum."],["Commandaria","The oldest named wine still in production, going since 800 BC."]],"Troodos vineyards above the sea","Nicosia","1.2M","Levantine Sea","Vegetarian option · contains dairy"],
    ["grc","Sea of Myths, Fire and Olive Oil","Greece joins Bronze Age seafaring, classical cities, mountain villages and island kitchens in a world where olive oil, fish, bread and lemon feel as old as the stories themselves.","Bronze Age seafaring, mountain villages and island kitchens where olive oil, fish, bread and lemon rule.","Greek cooking is an argument for restraint: good oil, hot charcoal, one herb, plenty of lemon.","The taverna model — shared plates, no rush, the sea in view — is the reason the rest of Europe eats outside.","Καλώς ήρθατε","Kalós írthate","Καλώς μας ήρθες","Kalós mas írthes","Welcome among us",[["Six thousand islands","Two hundred and twenty-seven of them inhabited."],["Olive oil per head","Greece consumes more per person than anywhere in the world."],["Coastline","Eleven times longer than Italy's relative to land area."]],"Aegean island coast, white rock and olive","Athens","10.4M","Aegean & Ionian","Contains dairy · pork"],
    ["ita","Empire of Craft and Appetite","Italy turns Roman roads, city-states, peasant technique and regional pride into a cuisine of precision, where wheat, wine, cheese and patience became a civilization of the table.","Roman roads, city-states and regional pride, turned into a cuisine of wheat, wine, cheese and patience.","Italian cooking is regional law: Naples defends the pizza, Bologna the ragù, Sicily the citrus and the eggplant.","The Mediterranean diet was formally described in Southern Italy — a village diet rebranded as the world's healthiest.","Benvenuti","Benvenuti","Fate come foste a casa","Fate come foste a casa","Make yourselves at home",[["Sixty pasta shapes","Each one engineered for a specific sauce viscosity."],["Slow Food started here","Founded in Piedmont in 1986, in protest at a fast-food opening."],["Citrus of Sicily","Arab traders planted the groves that still define the island."]],"Sicilian lemon grove under Etna","Rome","59M","Tyrrhenian & Adriatic","Vegetarian option · contains dairy"],
    ["esp","Kingdom of Ports and Long Tables","Spain’s Mediterranean shore carries Iberian, Roman, Jewish, Islamic and imperial layers, expressed through saffron rice, olive oil, smoked paprika and a social life built around lingering meals.","Iberian, Roman, Jewish, Islamic and imperial layers, expressed in saffron rice, paprika and long meals.","Spain eats late, in company, and in small plates — the tapas format exists because nobody wants the meal to end.","Andalusian olive plains produce more oil than any country on earth; the Basque coast produces the cooks.","Bienvenidos","Bienvenidos","Pasad, que hay sitio","Pasad, que hay sitio","Come in, there is room",[["Olive oil superpower","Spain produces roughly half the world's olive oil."],["Tapas by law","In some regions a drink still legally arrives with food."],["Longest lunch","The midday meal is protected by habit, not legislation — but only just."]],"Andalusian olive rows at golden hour","Madrid","48M","Balearic & Alborán","Contains dairy · pork"],
    ["fra","The Southern Grammar of Taste","On the Mediterranean coast of France, Greek foundations, Roman towns, Provençal herbs and port-city exchange produce a cuisine where restraint, sunlight and technique meet.","Greek foundations, Roman towns and Provençal herbs meet in a cuisine of restraint and sunlight.","The French Mediterranean is not Paris: it is garlic, anchovy, tomato, olive — closer to Naples than to Normandy.","Marseille's bouillabaisse began as the fishermen's leftovers and ended up with a legal charter.","Bienvenue","Bienvenue","Entrez, la table est prête","Entrez, la table est prête","Come in, the table is ready",[["Bouillabaisse charter","Marseille restaurants signed a legal recipe agreement in 1980."],["Herbes de Provence","Thyme, rosemary, savory, oregano — the hillside, dried."],["Camargue salt","Hand-harvested from the Rhône delta since Roman times."]],"Lavender and stone in inland Provence","Paris","68M","Gulf of Lion","Contains dairy"],
    ["mco","A Principality Between Cliff and Harbour","Tiny in territory but shaped by Ligurian roots, princely history and Riviera elegance, Monaco turns a narrow coastline into a polished meeting point of sea trade, spectacle and hospitality.","Ligurian roots, princely history and Riviera elegance on a narrow coastline of trade and spectacle.","Monaco's kitchen is Ligurian at heart: chickpea flour, olive oil, basil, seafood straight off the rock.","Barbagiuan — fried chard and ricotta pastry — is the national dish of a country you can walk across in an hour.","Bienvenue","Bienvenue","Installez-vous, la mer est à vous","Installez-vous, la mer est à vous","Sit down, the sea is yours",[["Two square kilometres","The second-smallest country in the world."],["Barbagiuan","Chard and ricotta in fried pastry — served at every national holiday."],["Socca","Chickpea pancake shared with neighbouring Nice."]],"Cliffs and harbour on the Riviera","Monaco","39K","Ligurian Sea","Pescatarian · contains dairy"],
    ["mlt","Fortress of Stone and Semitic Tongue","Malta compresses Phoenician traces, Arab language, Crusader memory and British afterlives into an island culture where limestone cities, fishing harbours and intensely local food speak with a voice found nowhere else.","Phoenician traces, Arab language and British afterlives on an island of limestone and local food.","Malta sits exactly between Sicily and North Africa, and its food and language both prove it — Semitic grammar, Italian vocabulary, British habits.","Fenkata, the rabbit feast, is the closest thing the islands have to a national ceremony.","Merħba","Merħba","Il-mejda tagħna hi tiegħek","Il-mejda tagħna hi tiegħek","Our table is yours",[["Semitic language, Latin script","Maltese is the only one of its kind in the EU."],["Fenkata","The rabbit feast is a village-scale event, not a dinner."],["Limestone everywhere","The whole archipelago is one honey-coloured rock."]],"Honey limestone cliffs above blue water","Valletta","540K","Sicilian Channel","Contains alcohol in sauce"],
    ["svn","Where the Alps Lean Toward the Adriatic","Slovenia’s brief coastline gathers Alpine, Venetian and Slavic worlds into a compact frontier where salt pans, karst landscapes and careful cooking meet the sea.","A brief coastline where Alpine, Venetian and Slavic worlds meet salt pans and careful cooking.","Slovenian cooking runs Alpine in the north, Italian on the coast and Balkan in the east, all within two hours' drive.","The Karst produces prosciutto cured in the bora wind, and wine grown on red iron soil.","Dobrodošli","Dobrodošli","Kar naprej, prostor je za vse","Kar naprej, prostor je za vse","Come in, there is room for everyone",[["46 km of coast","One of the shortest coastlines in Europe, fiercely used."],["Karst prosciutto","Cured by the bora wind, not by smoke."],["Beekeeping nation","Slovenia has more beekeepers per head than anywhere in the EU."]],"Karst vineyards on red iron soil","Ljubljana","2.1M","Gulf of Trieste","Contains pork · gluten"],
    ["hrv","Coast of Islands and Republics","Croatia stretches along a fractured Adriatic of island harbours, Roman ruins, Venetian towns and Dalmatian kitchens, where stone, salt, wine and grill smoke define the shore.","A fractured Adriatic of island harbours, Roman ruins and Dalmatian kitchens defined by stone and smoke.","Dalmatian cooking is Venetian at the edges and Ottoman inland: olive oil and fish on the coast, peka and paprika behind it.","Peka — meat and vegetables under an iron bell buried in embers — is the slowest good idea on the Adriatic.","Dobro došli","Dobro došli","Izvolite za naš stol","Izvolite za naš stol","Please, take your place at our table",[["1,244 islands","Only about fifty are permanently inhabited."],["Peka under embers","Cooked under an iron bell for three hours, minimum."],["Zinfandel origin","DNA-traced to the Croatian grape crljenak kaštelanski."]],"Karst cliffs above the green Adriatic","Zagreb","3.9M","Adriatic Sea","Contains dairy"],
    ["bih","The Inland Bridge of Empires","Though it barely touches the sea, Bosnia and Herzegovina belongs to the Adriatic story through Ottoman bazaars, Austro-Hungarian layers, mountain pastures and a table shaped by coffee, bread and grilled meat.","Ottoman bazaars, Austro-Hungarian layers and mountain pastures shape a table of coffee, bread and grilled meat.","Bosnian food is Ottoman architecture in edible form: slow-braised, layered, cooked in copper, served with bread that arrives hot.","Sarajevo's ćevabdžinicas serve one thing, perfectly, all day. Nothing else is on the menu.","Dobro došli","Dobro došli","Bujrum, sjedite s nama","Bujrum, sjedite s nama","Come in, sit with us",[["Twenty kilometres of coast","The shortest coastline of any Adriatic country."],["Copper craft","Sarajevo's coppersmith street has worked metal since the 1500s."],["Somun bread","Baked to order, always served hot enough to steam."]],"Mountain rivers above Mostar","Sarajevo","3.2M","Adriatic Sea","Halal available · contains dairy"],
    ["mne","Black Mountain Above the Blue Bay","Montenegro compresses medieval coasts, Orthodox monasteries, Ottoman frontiers and steep limestone drama into one of the Mediterranean’s most striking landscapes, where smoke, sea and stone share the same horizon.","Medieval coasts, Orthodox monasteries and steep limestone drama where smoke, sea and stone meet.","Montenegro cooks between mountain and coast: Njeguši ham cured in mountain air, fish pulled from the Bay of Kotor below it.","The bay is the Mediterranean's deepest natural inlet, and it behaves like a lake with opinions.","Dobrodošli","Dobrodošli","Uđite, kuća je otvorena","Uđite, kuća je otvorena","Come in, the house is open",[["Bay of Kotor","Often called Europe's southernmost fjord — technically a ria."],["Njeguši village","Two hundred people, one nationally famous ham."],["Black mountain","Named by Venetians for the dark forest on Mount Lovćen."]],"The Bay of Kotor from the mountain road","Podgorica","620K","Adriatic Sea","Contains dairy"],
    ["alb","Ancient Shore of Eagles and Illyrians","Albania links Illyrian roots, Roman roads, Byzantine churches and mountain hospitality to a coastline where olive groves, byrek, lamb and salt air still feel defiantly under-discovered.","Illyrian roots and mountain hospitality on a coastline of olive groves, byrek and salt air.","Albanian cooking leans on yoghurt, lamb and wild herbs, with Ottoman pastry technique layered over it.","Tavë kosi — lamb baked under a yoghurt custard — is comfort food with an unusual amount of engineering.","Mirë se vini","Mirë se vini","Hyni, buka është gati","Hyni, buka është gati","Come in, the bread is ready",[["Two seas","Adriatic in the north, Ionian in the south, one coastline."],["Bunkers everywhere","Around 170,000 of them, now mostly cafés and storage."],["Wild herbs","Albania is one of Europe's largest exporters of wild sage."]],"The Albanian Riviera from the pass","Tirana","2.8M","Adriatic & Ionian","Contains dairy · eggs"],
    ["egy","River Kingdom at the Edge of the Sea","Egypt brings pharaonic antiquity, Nile agriculture, Alexandria’s cosmopolitan memory and street-food genius into one civilization where bread, beans, spice and empire meet the Mediterranean.","Pharaonic antiquity, Nile agriculture and street-food genius where bread, beans and spice meet the sea.","Egyptian cooking is the oldest continuous tradition on the Mediterranean: bread, beans, onions, herbs, all documented on tomb walls.","Hawawshi — spiced minced meat baked inside bread — is the Cairo street dish that translates perfectly into a burger.","أهلاً بيك","Ahlan bik","نورتونا يا أهلًا","Nawwartouna ya ahlan","Your presence has lit up the place",[["Bread as currency","Pyramid workers were partly paid in bread and beer."],["Ful medames","The national breakfast, unchanged for several thousand years."],["One river","Ninety-five percent of Egyptians live within a few kilometres of it."]],"Nile delta farmland at dawn","Cairo","112M","Eastern Mediterranean","Halal · contains sesame"],
    ["lby","Desert Gate to the Inner Sea","Libya joins Greek and Roman ruins, Saharan caravan routes and North African grain cultures on a long coast where harbour cities once linked the desert world to the Mediterranean table.","Greek and Roman ruins meet Saharan caravan routes on a long coast of harbour cities.","Libyan cooking sits between Maghreb and Levant: pasta from Italy, spice from the desert routes, fish from a very long coastline.","Shorba, the spiced lamb and orzo soup, is the dish every family makes slightly differently.","مرحباً بيكم","Marḥaban bikum","البيت بيتكم","Al-bēt bētkom","Our home is your home",[["Longest coast","Nearly 1,800 km of Mediterranean shoreline."],["Bzaar spice","Turmeric, cinnamon, caraway — the house blend of the country."],["Roman Leptis Magna","One of the best-preserved Roman cities anywhere."]],"Where the desert reaches the sea","Tripoli","7M","Gulf of Sidra","Halal · spicy"],
    ["tun","Carthage, Harissa and the Middle Sea","Tunisia carries Punic, Roman, Amazigh, Arab and Ottoman inheritances in a compact landscape where olive oil, spice, couscous and coastal trade produce one of the region’s most layered cuisines.","Punic, Roman, Amazigh and Ottoman inheritances in olive oil, spice, couscous and coastal trade.","Tunisian food is the spiciest on the Mediterranean, and the most Italian-influenced in North Africa — a Carthage habit that never stopped.","Brik — egg in crisp pastry, eaten with your hands and some risk — is the national test of nerve.","أهلا بيكم","Ahla bikom","مرحبا بيكم، الدار داركم","Marḥba bikom, ed-dār dārkom","Welcome, our home is your home",[["Harissa's home","Protected by UNESCO as intangible cultural heritage."],["Carthage","Rome's great rival ran the western Mediterranean from here."],["Olive groves","Among the largest planted olive areas on earth."]],"Olive plains inland from Sfax","Tunis","12M","Gulf of Gabès","Halal · spicy · contains fish"],
    ["dza","Vast Republic of Mountains and Sahara","Algeria spans Roman cities, Amazigh highlands, Ottoman ports and Saharan trade routes, creating a food culture where semolina, lamb, herbs, dates and memory move between sea and desert.","Roman cities, Amazigh highlands and Saharan trade routes move semolina, lamb, herbs and dates between sea and desert.","Algeria is Africa's largest country, and its coast cooks nothing like its desert — Kabyle olive oil north, dates and cumin south.","Chakhchoukha, rechta, merguez: dishes that travelled to Marseille and stayed there.","مرحبا بيكم","Marḥba bikom","دارنا داركم","Dārna dārkom","Our house is your house",[["Largest in Africa","Eighty percent of it is Sahara."],["Kabyle olive oil","Mountain groves producing oil pressed the same way for centuries."],["Merguez everywhere","The sausage that colonised French street food."]],"Kabyle mountain olive terraces","Algiers","45M","Alborán & Algerian Basin","Halal · spicy"],
    ["mar","Kingdom of Gates, Atlas and Atlantic Light","Morocco stands at the western threshold of the Mediterranean, shaped by Amazigh kingdoms, Andalusian exile, imperial cities and market craft, where spice, tea, citrus and slow cooking define ceremony as much as flavour.","Amazigh kingdoms, Andalusian exile and imperial cities where spice, tea, citrus and slow cooking define ceremony.","Moroccan cooking is the Mediterranean's most patient: tagines run for hours, preserved lemons sit for months, tea is poured from a height for the theatre of it.","Marrakech's spice souks still sell by pyramid, and the ras el hanout blend changes with every stall.","مرحبا بكم","Marḥaban bikum","الدار داركم","Ad-dār dārkom","Make yourselves at home",[["Two coastlines","Atlantic on one side, Mediterranean on the other."],["Ras el hanout","Literally 'head of the shop' — the merchant's best blend."],["Mint tea ritual","Poured from height to aerate; refusing a glass is not really an option."]],"Date palm oasis at the desert edge","Rabat","37M","Alborán Sea","Halal · contains nuts"]
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

  // Approved one-per-country plant/tree identity — used by the home
  // garden section (one plaque per country) and anywhere else a single
  // shared "national plant" needs to stay consistent. Names were checked
  // one by one against the actual uploaded photo at images/trees/<code>_
  // tree.jpg (most were mismatched — e.g. lbn's photo is a pomegranate
  // tree, not a cedar; tun's is a desert acacia, not a pomegranate), so
  // every label here now matches what its own photo actually shows.
  var PLANTS = {
    lbn: "Pomegranate", syr: "Aleppo Pistachio", pse: "Olive Tree", tur: "Anatolian Maple",
    cyp: "Cyprus Golden Oak", grc: "Mediterranean Cypress", ita: "Apennine Fir", esp: "Cork Oak",
    fra: "Stone Pine", mco: "Aleppo Pine", mlt: "Phoenician Juniper", svn: "Norway Spruce",
    hrv: "Holm Oak", bih: "Bosnian Spruce", mne: "Dwarf Mountain Pine", alb: "Black Pine",
    egy: "Nile Acacia", lby: "Libyan Juniper", tun: "Sahara Acacia", dza: "Atlas Cedar", mar: "Argan Tree"
  };

  var CULTURE_BY_CODE = {};
  CULTURE_SRC.forEach(function (d) {
    CULTURE_BY_CODE[d[0]] = {
      identity: d[1], intro: d[2], cardIntro: d[3], culture1: d[4], culture2: d[5],
      greetingNative: d[6], greetingRoman: d[7],
      phraseNative: d[8], phraseRoman: d[9], phraseEnglish: d[10],
      facts: d[11], nature: d[12],
      capital: d[13], population: d[14], sea: d[15], dietTags: d[16]
    };
  });

  var COUNTRIES = MENU_SRC.map(function (c, idx) {
    var items = countryMenu(c);
    var heroKind = c[14];
    var hero = items.find(function (i) { return i.group === "Burgers" && i.kind === heroKind; }) || items[0];
    var culture = CULTURE_BY_CODE[c[0]] || {};
    return {
      code: c[0], name: c[1], routeKey: c[2], route: ROUTES[c[2]].name, med: c[3],
      // Kept for anything still reading the old combined shapes: a plain
      // "romanised — English" phrase string and a "romanised · Welcome"
      // greeting string, built from the same explicit fields below.
      greeting: (culture.phraseRoman || "") + " — " + (culture.phraseEnglish || ""),
      nativePhrase: culture.greetingNative || "", translit: (culture.greetingRoman || "") + " · Welcome",
      heroKind: heroKind, heroItem: hero,
      stamp: "#" + String(idx + 1).padStart(2, "0"),
      items: items,
      identity: culture.identity || "", intro: culture.intro || "", cardIntro: culture.cardIntro || "",
      culture1: culture.culture1 || "", culture2: culture.culture2 || "",
      greetingNative: culture.greetingNative || "", greetingRoman: culture.greetingRoman || "",
      phraseNative: culture.phraseNative || "", phraseRoman: culture.phraseRoman || "", phraseEnglish: culture.phraseEnglish || "",
      facts: culture.facts || [], nature: culture.nature || "",
      capital: culture.capital || "", population: culture.population || "",
      sea: culture.sea || "", dietTags: culture.dietTags || "",
      plant: PLANTS[c[0]] || ""
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

  // Kids menu — one combo per route, not per country (a route-level
  // "lane", same idea as the rest of the junior gate). Every combo is
  // the same fixed price regardless of which burger/side/dessert is
  // picked; the choice is real, the price isn't itemised per component.
  // No alcohol anywhere on this menu, by design, not just by omission.
  var KIDS_COMBO_PRICE = 10.5;
  var KIDS_MENU_SRC = [
    ["LEV",
      [["Mini Shawarma Beef", "beef", "Beef patty, tahini, pickles — mild"], ["Mini Tawouk Chicken", "chicken", "Yoghurt-garlic chicken, no chilli"], ["Mini Halloumi Veg", "veg", "Grilled halloumi, tomato, mild labneh"]],
      [["Plain Fries", "Salted, no seasoning blend"], ["Hummus Dippers", "Warm pita strips with plain hummus"]],
      ["Lemon Mint Cooler", "Still lemon-mint, no fizz option too"],
      [["Mini Knefe Bites", "Warm cheese pastry, light syrup"], ["Baklava Twist", "One small filo-nut twist"]]],
    ["AEG",
      [["Mini Souvlaki Beef", "beef", "Grilled beef strips, soft pita"], ["Mini Souvlaki Chicken", "chicken", "Grilled chicken strips, soft pita"], ["Mini Halloumi Aegean", "veg", "Grilled halloumi, cucumber, mild yoghurt"]],
      [["Plain Fries", "Salted, no seasoning blend"], ["Pita Dippers", "Warm pita strips with plain yoghurt"]],
      ["Ayran Cooler", "Plain salted yoghurt drink, mild"],
      [["Mini Baklava", "One small filo-nut piece"], ["Yoghurt & Honey Cup", "Plain yoghurt, honey drizzle"]]],
    ["IBL",
      [["Mini Iberian Beef", "beef", "Beef patty, mild pepper, manchego"], ["Mini Chicken Milanese", "chicken", "Breaded chicken, no spice"], ["Mini Margherita Veg", "veg", "Tomato, mozzarella, basil"]],
      [["Plain Fries", "Salted, no seasoning blend"], ["Patatas Lite", "Roast potatoes, no spiced sauce"]],
      ["Orange Splash Cooler", "Fresh orange, still or sparkling"],
      [["Churro Bites", "Three bites, cinnamon sugar"], ["Gelato Cup", "One scoop, vanilla or chocolate"]]],
    ["ADR",
      [["Mini Ćevapi Beef", "beef", "Grilled beef fingers, soft bun"], ["Mini Adriatic Chicken", "chicken", "Grilled chicken, mild herb"], ["Mini Cheese Štrukli Veg", "veg", "Baked cheese pastry parcel"]],
      [["Plain Fries", "Salted, no seasoning blend"], ["Polenta Fingers", "Soft baked polenta, no sauce"]],
      ["Apple Berry Cooler", "Apple-berry juice, still"],
      [["Mini Palačinke", "Two small pancake bites, jam"], ["Honey Cookie", "One soft honey biscuit"]]],
    ["NAF",
      [["Mini Beef Kefta", "beef", "Mild beef kefta, no harissa"], ["Mini Chicken Kefta", "chicken", "Mild chicken kefta, no harissa"], ["Mini Chickpea Veg", "veg", "Chickpea patty, mild tahini"]],
      [["Plain Fries", "Salted, no seasoning blend"], ["Couscous Cup", "Plain couscous, olive oil"]],
      ["Orange Blossom Cooler", "Orange blossom water, still"],
      [["Date Bites", "Two small stuffed date bites"], ["Mini Basbousa", "One small semolina cake square"]]]
  ].map(function (r) {
    return {
      routeKey: r[0],
      burgers: r[1].map(function (b) { return { name: b[0], kind: b[1], line: b[2] }; }),
      sides: r[2].map(function (s) { return { name: s[0], line: s[1] }; }),
      drink: { name: r[3][0], line: r[3][1] },
      desserts: r[4].map(function (d) { return { name: d[0], line: d[1] }; })
    };
  });
  var KIDS_MENU = {};
  KIDS_MENU_SRC.forEach(function (k) { KIDS_MENU[k.routeKey] = k; });

  /* Passport types — three separate reward ladders sharing the same
     3/5/8/21-stamp cadence, so switching the passport-type tab (Home
     teaser, Rewards page, My Passport signup) genuinely swaps what a
     guest earns, not just the label above it. */
  var PASSPORT_TYPES = {
    explorer: {
      name: "Explorer", tagline: "The solo route — one passport, every destination.",
      ladder: [
        { stamps: 3, title: "Free country drink", desc: "Any destination's signature drink, on us." },
        { stamps: 5, title: "Free loaded fries", desc: "A full loaded-fries plate from any route." },
        { stamps: 8, title: "Secret destination burger", desc: "An off-menu burger the crew only tells stamped guests about." },
        { stamps: 21, title: "World Traveller buffet", desc: "The full 21-country buffet, once the whole passport is stamped." }
      ]
    },
    junior: {
      name: "Junior", tagline: "The kids' route — smaller portions, its own ladder of wins.",
      ladder: [
        { stamps: 3, title: "Free kids dessert", desc: "Any country's junior dessert, picked by the explorer." },
        { stamps: 5, title: "Free kids side", desc: "Fries or a fruit cup with the next junior combo." },
        { stamps: 8, title: "Free drink + sticker sheet", desc: "A junior drink and that route's flag-sticker sheet unlocked." },
        { stamps: 21, title: "Junior World Explorer combo", desc: "A full junior combo from every route, plus a graduation stamp." }
      ]
    },
    family: {
      name: "Family", tagline: "The table route — one passport, stamped for the whole group.",
      ladder: [
        { stamps: 3, title: "Free shared starter", desc: "A country salad or regular fries for the table." },
        { stamps: 5, title: "Free loaded fries platter", desc: "A full shared loaded-fries platter, family-size." },
        { stamps: 8, title: "Free round of drinks", desc: "One drink each, for the whole table." },
        { stamps: 21, title: "Family World Traveller feast", desc: "The full shared buffet for the table, once the map is complete." }
      ]
    }
  };

  window.PP_DATA = {
    PRICES: PRICES, COMBOS: COMBOS, UPGRADES: UPGRADES, MIN_SPEND: MIN_SPEND,
    KIDS_MENU: KIDS_MENU, KIDS_COMBO_PRICE: KIDS_COMBO_PRICE,
    ROUTES: ROUTES, COUNTRIES: COUNTRIES,
    SCENARIOS: SCENARIOS, FUNDING: FUNDING, OPERATING: OPERATING, SEVEN_PS: SEVEN_PS,
    LAND: LAND, BUILD_RATE: BUILD_RATE, EXTERIOR: EXTERIOR,
    PASSPORT_TYPES: PASSPORT_TYPES,
    HOURS: [
      { days: "Monday — Friday", time: "10:00 — 22:00" },
      { days: "Weekends & holidays", time: "10:00 — 00:00" }
    ]
  };
  window.dispatchEvent(new Event("pp-data-ready"));
})();
