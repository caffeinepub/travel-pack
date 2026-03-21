export type HotelRegion = {
  name: string;
  cities: string[];
};

export type HotelCountry = {
  country: string;
  regions: HotelRegion[];
};

export const hotelLocations: HotelCountry[] = [
  {
    country: "France",
    regions: [
      {
        name: "Île-de-France",
        cities: ["Paris", "Versailles", "Fontainebleau"],
      },
      {
        name: "Provence-Alpes-Côte d'Azur",
        cities: ["Nice", "Cannes", "Marseille", "Antibes", "Saint-Tropez"],
      },
      {
        name: "Normandy",
        cities: ["Rouen", "Caen", "Honfleur", "Mont Saint-Michel"],
      },
      { name: "Occitanie", cities: ["Toulouse", "Montpellier", "Carcassonne"] },
      {
        name: "Auvergne-Rhône-Alpes",
        cities: ["Lyon", "Grenoble", "Chamonix", "Annecy"],
      },
      { name: "Aquitaine", cities: ["Bordeaux", "Biarritz", "Dordogne"] },
    ],
  },
  {
    country: "United States",
    regions: [
      {
        name: "California",
        cities: [
          "Los Angeles",
          "San Francisco",
          "San Diego",
          "Santa Monica",
          "Palm Springs",
          "Napa",
        ],
      },
      {
        name: "Florida",
        cities: ["Miami", "Orlando", "Key West", "Tampa", "Fort Lauderdale"],
      },
      {
        name: "New York",
        cities: [
          "New York City",
          "The Hamptons",
          "Niagara Falls",
          "Saratoga Springs",
        ],
      },
      { name: "Hawaii", cities: ["Honolulu", "Maui", "Kauai", "Big Island"] },
      { name: "Nevada", cities: ["Las Vegas", "Lake Tahoe", "Reno"] },
      { name: "Texas", cities: ["Austin", "Houston", "Dallas", "San Antonio"] },
      { name: "Illinois", cities: ["Chicago"] },
      { name: "Louisiana", cities: ["New Orleans", "Baton Rouge"] },
      {
        name: "Arizona",
        cities: ["Phoenix", "Scottsdale", "Sedona", "Grand Canyon"],
      },
      { name: "Colorado", cities: ["Denver", "Aspen", "Vail", "Boulder"] },
    ],
  },
  {
    country: "Spain",
    regions: [
      {
        name: "Catalonia",
        cities: ["Barcelona", "Sitges", "Girona", "Tarragona"],
      },
      {
        name: "Andalusia",
        cities: ["Seville", "Granada", "Málaga", "Córdoba", "Marbella"],
      },
      { name: "Community of Madrid", cities: ["Madrid", "Toledo", "Segovia"] },
      {
        name: "Canary Islands",
        cities: ["Tenerife", "Gran Canaria", "Lanzarote", "Fuerteventura"],
      },
      { name: "Balearic Islands", cities: ["Ibiza", "Mallorca", "Menorca"] },
      { name: "Basque Country", cities: ["Bilbao", "San Sebastián"] },
    ],
  },
  {
    country: "Italy",
    regions: [
      { name: "Lazio", cities: ["Rome", "Tivoli"] },
      {
        name: "Lombardy",
        cities: ["Milan", "Lake Como", "Bergamo", "Brescia"],
      },
      {
        name: "Tuscany",
        cities: ["Florence", "Siena", "Pisa", "Lucca", "Chianti"],
      },
      { name: "Veneto", cities: ["Venice", "Verona", "Padua", "Lake Garda"] },
      {
        name: "Campania",
        cities: ["Naples", "Amalfi Coast", "Pompeii", "Capri", "Positano"],
      },
      {
        name: "Sicily",
        cities: ["Palermo", "Taormina", "Catania", "Syracuse"],
      },
    ],
  },
  {
    country: "United Kingdom",
    regions: [
      {
        name: "England",
        cities: [
          "London",
          "Bath",
          "Brighton",
          "Oxford",
          "Cambridge",
          "York",
          "Manchester",
          "Liverpool",
        ],
      },
      {
        name: "Scotland",
        cities: [
          "Edinburgh",
          "Glasgow",
          "St Andrews",
          "Inverness",
          "Isle of Skye",
        ],
      },
      { name: "Wales", cities: ["Cardiff", "Snowdonia"] },
      { name: "Northern Ireland", cities: ["Belfast", "Giant's Causeway"] },
    ],
  },
  {
    country: "Thailand",
    regions: [
      { name: "Bangkok", cities: ["Bangkok"] },
      { name: "Phuket", cities: ["Phuket City", "Patong", "Kata", "Kamala"] },
      { name: "Chiang Mai", cities: ["Chiang Mai"] },
      { name: "Koh Samui", cities: ["Koh Samui", "Koh Phangan", "Koh Tao"] },
      { name: "Krabi", cities: ["Ao Nang", "Krabi Town", "Koh Lanta"] },
    ],
  },
  {
    country: "Japan",
    regions: [
      { name: "Tokyo", cities: ["Tokyo", "Shibuya", "Shinjuku", "Ginza"] },
      { name: "Osaka", cities: ["Osaka", "Dotonbori", "Namba"] },
      { name: "Kyoto", cities: ["Kyoto", "Arashiyama", "Gion"] },
      { name: "Hokkaido", cities: ["Sapporo", "Niseko", "Hakodate"] },
      { name: "Okinawa", cities: ["Naha", "Ishigaki", "Miyako Island"] },
      { name: "Hiroshima", cities: ["Hiroshima", "Miyajima"] },
    ],
  },
  {
    country: "UAE",
    regions: [
      {
        name: "Dubai",
        cities: [
          "Dubai Marina",
          "Downtown Dubai",
          "Palm Jumeirah",
          "Jumeirah Beach",
          "Deira",
        ],
      },
      {
        name: "Abu Dhabi",
        cities: ["Abu Dhabi", "Yas Island", "Saadiyat Island"],
      },
      { name: "Sharjah", cities: ["Sharjah"] },
      { name: "Ras Al Khaimah", cities: ["Ras Al Khaimah"] },
    ],
  },
  {
    country: "Mexico",
    regions: [
      { name: "Mexico City", cities: ["Mexico City", "Polanco", "Roma Norte"] },
      {
        name: "Quintana Roo",
        cities: [
          "Cancún",
          "Tulum",
          "Playa del Carmen",
          "Cozumel",
          "Isla Mujeres",
        ],
      },
      { name: "Jalisco", cities: ["Guadalajara", "Puerto Vallarta"] },
      {
        name: "Oaxaca",
        cities: ["Oaxaca City", "Puerto Escondido", "Huatulco"],
      },
      {
        name: "Baja California Sur",
        cities: ["Los Cabos", "La Paz", "Loreto"],
      },
    ],
  },
  {
    country: "Australia",
    regions: [
      {
        name: "New South Wales",
        cities: ["Sydney", "Blue Mountains", "Hunter Valley"],
      },
      {
        name: "Victoria",
        cities: ["Melbourne", "Great Ocean Road", "Ballarat"],
      },
      {
        name: "Queensland",
        cities: ["Gold Coast", "Brisbane", "Cairns", "Whitsundays"],
      },
      {
        name: "Western Australia",
        cities: ["Perth", "Margaret River", "Broome"],
      },
      { name: "South Australia", cities: ["Adelaide", "Barossa Valley"] },
      { name: "Northern Territory", cities: ["Uluru", "Darwin"] },
    ],
  },
  {
    country: "Greece",
    regions: [
      { name: "Attica", cities: ["Athens", "Cape Sounion"] },
      {
        name: "South Aegean",
        cities: ["Santorini", "Mykonos", "Rhodes", "Paros", "Naxos"],
      },
      { name: "Crete", cities: ["Heraklion", "Chania", "Rethymno", "Elounda"] },
      { name: "Ionian Islands", cities: ["Corfu", "Zakynthos", "Kefalonia"] },
    ],
  },
  {
    country: "Maldives",
    regions: [
      { name: "North Malé Atoll", cities: ["Malé", "Hulhumalé", "Thulusdhoo"] },
      { name: "South Malé Atoll", cities: ["Maafushi", "Guraidhoo"] },
      { name: "Baa Atoll", cities: ["Dharavandhoo", "Fulhadhoo"] },
      { name: "Ari Atoll", cities: ["Rasdhoo", "Mahibadhoo"] },
    ],
  },
  {
    country: "Portugal",
    regions: [
      { name: "Lisbon", cities: ["Lisbon", "Sintra", "Cascais"] },
      { name: "Porto", cities: ["Porto", "Douro Valley", "Braga"] },
      { name: "Algarve", cities: ["Faro", "Lagos", "Albufeira", "Vilamoura"] },
      { name: "Madeira", cities: ["Funchal", "Porto Moniz"] },
      { name: "Azores", cities: ["Ponta Delgada", "Terceira"] },
    ],
  },
  {
    country: "Turkey",
    regions: [
      {
        name: "Istanbul",
        cities: ["Istanbul", "Beyoğlu", "Sultanahmet", "Bosphorus"],
      },
      { name: "Antalya", cities: ["Antalya", "Alanya", "Side", "Belek"] },
      {
        name: "Aegean Region",
        cities: ["Bodrum", "Izmir", "Marmaris", "Fethiye"],
      },
      { name: "Cappadocia", cities: ["Göreme", "Ürgüp", "Avanos"] },
    ],
  },
  {
    country: "Indonesia",
    regions: [
      {
        name: "Bali",
        cities: ["Seminyak", "Ubud", "Kuta", "Nusa Dua", "Canggu", "Jimbaran"],
      },
      { name: "Jakarta", cities: ["Jakarta"] },
      { name: "Lombok", cities: ["Lombok", "Gili Islands"] },
      { name: "Java", cities: ["Yogyakarta", "Surabaya", "Bandung"] },
      { name: "Komodo", cities: ["Labuan Bajo"] },
    ],
  },
  {
    country: "Morocco",
    regions: [
      { name: "Marrakech-Safi", cities: ["Marrakech", "Essaouira"] },
      { name: "Fès-Meknès", cities: ["Fès", "Meknes"] },
      { name: "Casablanca-Settat", cities: ["Casablanca", "Rabat"] },
      { name: "Souss-Massa", cities: ["Agadir"] },
    ],
  },
  {
    country: "South Africa",
    regions: [
      {
        name: "Western Cape",
        cities: ["Cape Town", "Stellenbosch", "Franschhoek", "Garden Route"],
      },
      { name: "Gauteng", cities: ["Johannesburg", "Pretoria"] },
      { name: "KwaZulu-Natal", cities: ["Durban", "Umhlanga", "iSimangaliso"] },
      { name: "Limpopo", cities: ["Kruger Park"] },
    ],
  },
  {
    country: "India",
    regions: [
      {
        name: "Rajasthan",
        cities: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
      },
      { name: "Goa", cities: ["North Goa", "South Goa", "Panaji"] },
      { name: "Maharashtra", cities: ["Mumbai", "Pune"] },
      { name: "Delhi", cities: ["New Delhi", "Old Delhi"] },
      { name: "Kerala", cities: ["Kochi", "Munnar", "Alleppey", "Varkala"] },
      { name: "Tamil Nadu", cities: ["Chennai", "Ooty"] },
    ],
  },
  {
    country: "Brazil",
    regions: [
      {
        name: "Rio de Janeiro",
        cities: ["Rio de Janeiro", "Búzios", "Paraty"],
      },
      { name: "São Paulo", cities: ["São Paulo"] },
      { name: "Bahia", cities: ["Salvador", "Porto Seguro", "Trancoso"] },
      { name: "Ceará", cities: ["Fortaleza", "Jericoacoara"] },
      { name: "Amazonas", cities: ["Manaus"] },
    ],
  },
  {
    country: "Argentina",
    regions: [
      { name: "Buenos Aires", cities: ["Buenos Aires", "La Plata"] },
      { name: "Patagonia", cities: ["Bariloche", "El Calafate", "Ushuaia"] },
      { name: "Mendoza", cities: ["Mendoza", "Valle de Uco"] },
    ],
  },
  {
    country: "Peru",
    regions: [
      { name: "Lima", cities: ["Lima", "Miraflores", "Barranco"] },
      { name: "Cusco", cities: ["Cusco", "Machu Picchu", "Sacred Valley"] },
      { name: "Arequipa", cities: ["Arequipa", "Colca Canyon"] },
    ],
  },
  {
    country: "Colombia",
    regions: [
      { name: "Cundinamarca", cities: ["Bogotá"] },
      { name: "Bolívar", cities: ["Cartagena"] },
      { name: "Antioquia", cities: ["Medellín"] },
      { name: "Valle del Cauca", cities: ["Cali"] },
    ],
  },
  {
    country: "Canada",
    regions: [
      { name: "Ontario", cities: ["Toronto", "Ottawa", "Niagara Falls"] },
      { name: "Quebec", cities: ["Montreal", "Quebec City"] },
      {
        name: "British Columbia",
        cities: ["Vancouver", "Victoria", "Whistler"],
      },
      { name: "Alberta", cities: ["Calgary", "Banff", "Jasper", "Edmonton"] },
    ],
  },
  {
    country: "Germany",
    regions: [
      {
        name: "Bavaria",
        cities: ["Munich", "Nuremberg", "Neuschwanstein", "Berchtesgaden"],
      },
      { name: "Berlin", cities: ["Berlin"] },
      { name: "Hamburg", cities: ["Hamburg"] },
      {
        name: "Baden-Württemberg",
        cities: ["Stuttgart", "Heidelberg", "Black Forest"],
      },
    ],
  },
  {
    country: "Netherlands",
    regions: [
      { name: "North Holland", cities: ["Amsterdam", "Haarlem"] },
      { name: "South Holland", cities: ["Rotterdam", "The Hague", "Delft"] },
    ],
  },
  {
    country: "Switzerland",
    regions: [
      { name: "Zurich", cities: ["Zurich"] },
      { name: "Geneva", cities: ["Geneva", "Lausanne"] },
      { name: "Valais", cities: ["Zermatt", "Verbier"] },
      { name: "Bern Oberland", cities: ["Interlaken", "Grindelwald"] },
      { name: "Graubünden", cities: ["St. Moritz", "Davos"] },
    ],
  },
  {
    country: "Austria",
    regions: [
      { name: "Vienna", cities: ["Vienna"] },
      { name: "Salzburg", cities: ["Salzburg"] },
      { name: "Tyrol", cities: ["Innsbruck", "Kitzbühel"] },
    ],
  },
  {
    country: "Maldives",
    regions: [
      { name: "North Malé Atoll", cities: ["Malé"] },
      { name: "South Malé Atoll", cities: ["Maafushi"] },
    ],
  },
  {
    country: "Singapore",
    regions: [
      {
        name: "Central Region",
        cities: ["Marina Bay", "Orchard Road", "Sentosa"],
      },
      { name: "East Region", cities: ["Changi", "East Coast"] },
    ],
  },
  {
    country: "Malaysia",
    regions: [
      { name: "Kuala Lumpur", cities: ["Kuala Lumpur", "Putrajaya"] },
      { name: "Penang", cities: ["George Town", "Batu Ferringhi"] },
      { name: "Sabah", cities: ["Kota Kinabalu", "Sipadan"] },
      { name: "Langkawi", cities: ["Langkawi"] },
    ],
  },
  {
    country: "Vietnam",
    regions: [
      { name: "Ho Chi Minh City", cities: ["Ho Chi Minh City"] },
      { name: "Hanoi", cities: ["Hanoi"] },
      { name: "Da Nang", cities: ["Da Nang", "Hoi An"] },
      { name: "Quảng Ninh", cities: ["Ha Long Bay"] },
      { name: "Khánh Hòa", cities: ["Nha Trang"] },
    ],
  },
  {
    country: "Cambodia",
    regions: [
      { name: "Siem Reap", cities: ["Siem Reap", "Angkor Wat"] },
      { name: "Phnom Penh", cities: ["Phnom Penh"] },
    ],
  },
  {
    country: "Philippines",
    regions: [
      { name: "Metro Manila", cities: ["Manila", "Makati", "BGC"] },
      { name: "Palawan", cities: ["El Nido", "Coron", "Puerto Princesa"] },
      { name: "Cebu", cities: ["Cebu City", "Moalboal", "Malapascua"] },
      { name: "Boracay", cities: ["Boracay"] },
    ],
  },
  {
    country: "New Zealand",
    regions: [
      { name: "Auckland", cities: ["Auckland"] },
      { name: "Canterbury", cities: ["Christchurch", "Aoraki Mount Cook"] },
      { name: "Otago", cities: ["Queenstown", "Dunedin"] },
      { name: "Bay of Plenty", cities: ["Rotorua", "Tauranga"] },
    ],
  },
  {
    country: "Egypt",
    regions: [
      { name: "Cairo", cities: ["Cairo", "Giza"] },
      { name: "Red Sea", cities: ["Hurghada", "Sharm El Sheikh", "Dahab"] },
      { name: "Luxor", cities: ["Luxor", "Aswan"] },
    ],
  },
  {
    country: "Kenya",
    regions: [
      { name: "Nairobi", cities: ["Nairobi"] },
      { name: "Coast Province", cities: ["Mombasa", "Diani Beach", "Malindi"] },
      { name: "Rift Valley", cities: ["Masai Mara", "Nakuru"] },
    ],
  },
  {
    country: "Tanzania",
    regions: [
      { name: "Zanzibar", cities: ["Stone Town", "Nungwi", "Paje"] },
      { name: "Kilimanjaro", cities: ["Arusha", "Moshi"] },
      { name: "Dar es Salaam", cities: ["Dar es Salaam"] },
    ],
  },
  {
    country: "Russia",
    regions: [
      { name: "Moscow", cities: ["Moscow"] },
      { name: "Saint Petersburg", cities: ["Saint Petersburg"] },
      { name: "Krasnodar Krai", cities: ["Sochi"] },
    ],
  },
  {
    country: "China",
    regions: [
      { name: "Beijing", cities: ["Beijing"] },
      { name: "Shanghai", cities: ["Shanghai"] },
      { name: "Guangdong", cities: ["Hong Kong", "Guangzhou", "Shenzhen"] },
      { name: "Sichuan", cities: ["Chengdu"] },
      { name: "Hainan", cities: ["Sanya", "Haikou"] },
    ],
  },
  {
    country: "Saudi Arabia",
    regions: [
      { name: "Riyadh", cities: ["Riyadh"] },
      { name: "Makkah", cities: ["Mecca", "Jeddah"] },
      { name: "NEOM", cities: ["AlUla", "Tabuk"] },
    ],
  },
  {
    country: "Jordan",
    regions: [
      { name: "Amman", cities: ["Amman"] },
      { name: "Aqaba", cities: ["Aqaba", "Wadi Rum"] },
      { name: "Ma'an", cities: ["Petra"] },
    ],
  },
  {
    country: "Israel",
    regions: [
      { name: "Jerusalem", cities: ["Jerusalem"] },
      { name: "Tel Aviv", cities: ["Tel Aviv", "Jaffa"] },
      { name: "South District", cities: ["Eilat", "Dead Sea"] },
    ],
  },
  {
    country: "Cuba",
    regions: [
      { name: "Havana", cities: ["Havana"] },
      { name: "Holguín", cities: ["Varadero", "Guardalavaca"] },
      { name: "Santiago de Cuba", cities: ["Santiago de Cuba"] },
    ],
  },
  {
    country: "Jamaica",
    regions: [
      { name: "Saint James", cities: ["Montego Bay"] },
      { name: "Saint Ann", cities: ["Ocho Rios"] },
      { name: "Kingston", cities: ["Kingston"] },
    ],
  },
  {
    country: "Bahamas",
    regions: [
      { name: "New Providence", cities: ["Nassau", "Cable Beach"] },
      { name: "Grand Bahama", cities: ["Freeport"] },
      { name: "Exumas", cities: ["Great Exuma"] },
    ],
  },
  {
    country: "Sri Lanka",
    regions: [
      { name: "Western Province", cities: ["Colombo", "Negombo"] },
      { name: "Southern Province", cities: ["Galle", "Mirissa", "Tangalle"] },
      { name: "Central Province", cities: ["Kandy", "Nuwara Eliya", "Ella"] },
    ],
  },
  {
    country: "Nepal",
    regions: [
      { name: "Bagmati Province", cities: ["Kathmandu", "Bhaktapur", "Patan"] },
      { name: "Gandaki Province", cities: ["Pokhara"] },
    ],
  },
];

export const sortedHotelLocations = [...hotelLocations].sort((a, b) =>
  a.country.localeCompare(b.country),
);
