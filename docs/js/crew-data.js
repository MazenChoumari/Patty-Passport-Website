/* Patty Passport — single shared crew dataset, used by both crew.js
   (the full 32-profile directory on crew.html) and our-story.js (the 8
   "featured" profiles on our-story.html), so the two pages read the same
   names/roles/bios and can never drift apart. A representative staffing
   model, not a claim of real headcount — no profile here represents an
   identifiable real person; none of these names, bios or nationalities
   describe anyone real, and none should be read as such. */
(function () {
  var ROLE_GROUP = {
    "Route Host": "guest", "Passport Desk": "guest", "Destination Guide": "guest",
    "Table Captain": "guest", "Kitchen Crew": "kitchen"
  };

  var SRC = [
    ["George Ammar", "Route Host", "Levant", "Runs the floor on the busiest routes and never lets a table feel rushed between courses.", "Lebanese / Spanish", true],
    ["Lucía Fernández", "Passport Desk", "All routes", "The first face at the desk — reads a party in seconds and picks the right first destination for them.", "Spanish", true],
    ["Marco Rossi", "Kitchen Crew", "Iberia & Latin", "Holds every country's plate to the same standard: nothing leaves the pass unless it tastes like the place it's from.", "Italian", true],
    ["Yasmin Haddad", "Destination Guide", "Levant", "Turns the passport into a game for younger guests — flags, phrases and a stamp they actually want to earn.", "Lebanese", true],
    ["Nikos Papadopoulos", "Route Host", "Aegean", "Keeps the Aegean route moving and always has a story about the dish that's about to land.", "Greek", true],
    ["Alicia Morales", "Table Captain", "All routes", "Plans the birthdays and group journeys, from the first booking call to the final candle.", "Spanish", true],
    ["Omar El Tayar", "Kitchen Crew", "N. Africa", "Runs the drinks pass across all twenty-one countries and knows which cooler pairs with which route.", "Egyptian", true],
    ["Sofia Costa", "Kitchen Crew", "All routes", "Closes every table's journey with the country's dessert — and keeps the sweet stamp worth waiting for.", "Portuguese / Moroccan", true],

    ["Rami Nasser", "Kitchen Crew", "Levant", "Grew up watching his grandmother stuff vine leaves in Beirut; runs the Levant pass with the same patience.", "Lebanese", false],
    ["Dana Khalil", "Passport Desk", "Levant", "Remembers regulars' routes before they've said a word.", "Syrian", false],
    ["Elena Vasiliou", "Destination Guide", "Aegean", "Explains why Greek olive oil isn't just olive oil, without ever sounding like a lecture.", "Greek", false],
    ["Mert Yildiz", "Kitchen Crew", "Aegean", "Runs the Aegean grill station like a short-order philosopher.", "Turkish", false],
    ["Clara Duarte", "Table Captain", "Iberia & Latin", "Keeps a six-top of extended family fed, happy and never waiting.", "Portuguese", false],
    ["Diego Fernández", "Kitchen Crew", "Iberia & Latin", "Can tell you the story behind every Iberian pour, sober.", "Spanish", false],
    ["Giulia Bianchi", "Kitchen Crew", "Iberia & Latin", "Trained in Naples; treats every gelato scoop like a small ceremony.", "Italian", false],
    ["Ivana Horvat", "Route Host", "Adriatic", "First face of the Adriatic gate — reads a party before they've sat down.", "Croatian", false],
    ["Petar Jovanović", "Kitchen Crew", "Adriatic", "Keeps the grill honest across five very different Balkan plates.", "Montenegrin", false],
    ["Yara Aziz", "Destination Guide", "N. Africa", "Turns Egypt's stamp into the one every kid wants first.", "Egyptian", false],
    ["Karim Belhadj", "Table Captain", "N. Africa", "Books more birthdays than any other route, on purpose.", "Tunisian", false],
    ["Sami Trabelsi", "Kitchen Crew", "N. Africa", "Runs the North Africa pass with the discipline of a spice trader's ledger.", "Tunisian", false],
    ["Noor Haddad", "Passport Desk", "All routes", "Second face at the desk on the busiest nights.", "Palestinian", false],
    ["Hugo Álvarez", "Table Captain", "Iberia & Latin", "Runs the school-journey tables without losing a single booklet.", "Spanish", false],
    ["Mireille Costa", "Table Captain", "All routes", "Plans the group departures that need two zones, not one.", "French", false],
    ["Théo Lambert", "Kitchen Crew", "All routes", "Keeps the alcohol-free list as serious as the wine list.", "French", false],
    ["Aylin Demir", "Destination Guide", "All routes", "Covers for any route's guide on a moment's notice.", "Turkish", false],
    ["Bruno Silva", "Kitchen Crew", "All routes", "Night-shift lead; the pass never slows down on his watch.", "Portuguese", false],
    ["Farah Idris", "Passport Desk", "All routes", "Stamped more junior passports than anyone on the floor.", "Egyptian", false],
    ["Léa Moreau", "Table Captain", "All routes", "Runs the private-zone team departures.", "French", false],
    ["Adrian Kowalski", "Kitchen Crew", "All routes", "Cross-trained on all five route stations.", "Polish", false],
    ["Salma Rahal", "Destination Guide", "All routes", "Wrote half the route booklets the kids use today.", "Algerian", false],
    ["Viktor Petrov", "Kitchen Crew", "Adriatic", "Built the alcohol-free cooler menu from scratch.", "Montenegrin", false],
    ["Nadia Boumediene", "Table Captain", "N. Africa", "Runs corporate team departures without losing the fun.", "Algerian", false]
  ].map(function (c) {
    return { name: c[0], role: c[1], route: c[2], bio: c[3], nationality: c[4], featured: c[5], group: ROLE_GROUP[c[1]] || "guest" };
  });

  // Names an owner has asked to feature, pending their explicit consent
  // to be publicly represented as crew before publication. Not merged
  // into SRC above until confirmed — kept here only as a visible,
  // clearly-labeled holding list so the request isn't lost.
  var PENDING_APPROVAL = [
    // { name: "…", role: "…", route: "…", requestedBy: "owner", note: "awaiting consent to publish" }
  ];

  window.PP_CREW_DATA = { ALL: SRC, FEATURED: SRC.filter(function (c) { return c.featured; }), PENDING_APPROVAL: PENDING_APPROVAL };
})();
