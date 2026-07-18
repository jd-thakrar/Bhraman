import type { TripItinerary, TripPreferences } from "@/types/trip";

const baseHotels = {
  goa: {
    destination: "Goa, India",
    description: "Sun-kissed beaches, Portuguese heritage, and vibrant coastal life.",
    flightRoute: "RAJ → GOI · IndiGo 6E-234 · 3h 15m (1 stop)",
    seasonNote: "Best Oct–Mar. Avoid peak monsoon (Jun–Aug) for water sports.",
    hotels: [
      { id: "h1", name: "Taj Exotica Resort & Spa", pricePerNight: 22000, rating: 4.8, walkability: 8, travelTimeMinutes: 45, attributes: ["Luxury", "Beachfront", "Spa", "Quiet"] },
      { id: "h2", name: "W Goa", pricePerNight: 16000, rating: 4.6, walkability: 9, travelTimeMinutes: 60, attributes: ["Party", "Modern", "Vibrant", "Pool"] },
      { id: "h3", name: "Ahilya by the Sea", pricePerNight: 19000, rating: 4.9, walkability: 6, travelTimeMinutes: 75, attributes: ["Boutique", "Heritage", "Romantic", "Quiet"] },
    ],
    winnerConfidence: 87,
    winnerBreakdown: { budget_fit: 25, travel_time: 28, review_quality: 18, walkability: 16 },
    rejectedScores: { h2: 71, h3: 65 },
    itinerary: [
      { day: 1, title: "Arrival & Beach Sunset", activities: [{ time: "14:00", description: "Check-in at Taj Exotica. Cab transfer from airport." }, { time: "16:30", description: "Sunset walk at Benaulim Beach." }, { time: "19:30", description: "Dinner at Mum's Kitchen." }] },
      { day: 2, title: "Heritage & Latin Quarter", activities: [{ time: "10:00", description: "Basilica of Bom Jesus & Se Cathedral." }, { time: "13:00", description: "Lunch Venite fontainhas." }, { time: "19:00", description: "Evening Mandovi River cruise." }] },
      { day: 3, title: "Adventure & Departure", activities: [{ time: "09:00", description: "Water sports at Calangute." }, { time: "15:00", description: "Depart for airport." }] },
    ],
    budget: { flights: 12000, accommodation: 44000, food: 15000, activities: 8000, total: 79000, currency: "INR" as const },
    packing_list: [
      { category: "Clothing", items: ["Light cotton kurtas/shirts", "Swimwear", "Light jacket"] },
      { category: "Essentials", items: ["Sunscreen SPF 50+", "Sunglasses", "Odomos repellent"] },
    ],
  },
  manali: {
    destination: "Manali, Himachal Pradesh",
    description: "Snow-capped peaks, apple orchards, and adventure trails in Kullu Valley.",
    flightRoute: "RAJ → KUU · Scenic Flight · 4h 10m",
    seasonNote: "Dec–Feb for snow. Mar–Jun for trekking.",
    hotels: [
      { id: "h1", name: "The Himalayan Resort & Spa", pricePerNight: 12000, rating: 4.7, walkability: 7, travelTimeMinutes: 120, attributes: ["Mountain View", "Spa", "Heated Rooms", "Family"] },
      { id: "h2", name: "Snow Valley Resorts", pricePerNight: 8500, rating: 4.4, walkability: 8, travelTimeMinutes: 90, attributes: ["Budget Friendly", "Active", "View", "Balcony"] },
    ],
    winnerConfidence: 85,
    winnerBreakdown: { budget_fit: 28, travel_time: 20, review_quality: 22, walkability: 15 },
    rejectedScores: { h2: 74 },
    itinerary: [
      { day: 1, title: "Arrival & Mall Road", activities: [{ time: "14:00", description: "Check in. Hot cardamom tea welcome." }, { time: "17:00", description: "Walk Mall Road, try hot local momos." }] },
      { day: 2, title: "Solang Snow Adventure", activities: [{ time: "09:00", description: "Scenic drive to Solang Valley." }, { time: "11:00", description: "Paragliding or snow walks." }] },
    ],
    budget: { flights: 16000, accommodation: 24000, food: 10000, activities: 6000, total: 56000, currency: "INR" as const },
    packing_list: [{ category: "Warm Clothing", items: ["Thermals", "Down jacket", "Gloves"] }],
  },
  udaipur: {
    destination: "Udaipur, Rajasthan",
    description: "The city of lakes, floating marble palaces, and royal Mewar history.",
    flightRoute: "RAJ → UDR · Direct Flight · 1h 05m",
    seasonNote: "Oct–Mar ideal. Summer (Apr–Jun) gets extremely hot.",
    hotels: [
      { id: "h1", name: "Hotel Lake Pichola", pricePerNight: 9500, rating: 4.6, walkability: 9, travelTimeMinutes: 35, attributes: ["Lake View", "Heritage Feel", "Central Location", "Vegetarian Friendly"] },
      { id: "h2", name: "Hotel Sarovar Portico Udaipur", pricePerNight: 5500, rating: 4.3, walkability: 8, travelTimeMinutes: 30, attributes: ["Modern Stays", "Family Rooms", "Wi-Fi"] },
      { id: "h3", name: "Hotel Badi Haveli", pricePerNight: 3000, rating: 4.1, walkability: 7, travelTimeMinutes: 40, attributes: ["Budget", "Rooftop dining"] },
    ],
    winnerConfidence: 88,
    winnerBreakdown: { budget_fit: 27, travel_time: 24, review_quality: 19, walkability: 18 },
    rejectedScores: { h2: 73, h3: 61 },
    itinerary: [
      { day: 1, title: "Lake Pichola Cruise", activities: [{ time: "14:00", description: "Check-in at Hotel Lake Pichola." }, { time: "17:00", description: "Sunset boat cruise past Taj Lake Palace." }] },
      { day: 2, title: "Palace Tour & Crafts", activities: [{ time: "09:30", description: "Visit City Palace Museum." }, { time: "16:00", description: "Craft shopping at Shilpgram." }] },
    ],
    budget: { flights: 8000, accommodation: 19000, food: 9000, activities: 5000, total: 41000, currency: "INR" as const },
    packing_list: [{ category: "Clothing", items: ["Breathable linen", "Sunglasses", "Hat"] }],
  },
  kerala: {
    destination: "Kerala Backwaters, India",
    description: "Serene houseboats, lush coconut palms, and calming Ayurvedic wellness.",
    flightRoute: "RAJ → COK · IndiGo · 4h 30m (1 stop)",
    seasonNote: "Sep–Mar best. Monsoon (Jun–Aug) is wet but lush.",
    hotels: [
      { id: "h1", name: "Punnamada Resort", pricePerNight: 12000, rating: 4.7, walkability: 8, travelTimeMinutes: 95, attributes: ["Backwater View", "Ayurveda Stays", "Quiet"] },
      { id: "h2", name: "Lake Palace Resort", pricePerNight: 8000, rating: 4.4, walkability: 7, travelTimeMinutes: 80, attributes: ["Lake View", "Pool", "Family friendly"] },
    ],
    winnerConfidence: 89,
    winnerBreakdown: { budget_fit: 26, travel_time: 25, review_quality: 20, walkability: 18 },
    rejectedScores: { h2: 72 },
    itinerary: [
      { day: 1, title: "Backwater Arrival", activities: [{ time: "15:00", description: "Check in. Ayurvedic welcome tea." }, { time: "17:00", description: "Sunset canoe boat ride." }] },
      { day: 2, title: "Houseboat Cruise", activities: [{ time: "09:00", description: "Board day houseboat for lake cruise." }, { time: "19:00", description: "Traditional resort performance." }] },
    ],
    budget: { flights: 14000, accommodation: 24000, food: 11000, activities: 7000, total: 56000, currency: "INR" as const },
    packing_list: [{ category: "Clothing", items: ["Linen wear", "Rain poncho", "Odomos lotion"] }],
  },
};

const DESTINATION_MAP: Record<string, keyof typeof baseHotels> = {
  goa: "goa", beach: "goa", himachal: "manali", manali: "manali", mountain: "manali",
  udaipur: "udaipur", rajasthan: "udaipur", kerala: "kerala", backwater: "kerala",
};

export function getMockDataForDestination(destination: string, budgetTier: string): TripItinerary {
  const normalized = destination.toLowerCase();

  // ── 1. If keyword match, return preset ────────────────────────────────
  for (const [keyword, key] of Object.entries(DESTINATION_MAP)) {
    if (normalized.includes(keyword)) {
      return JSON.parse(JSON.stringify(baseHotels[key]));
    }
  }

  // ── 2. Dynamic generation for unmatched cities (e.g. Junagadh) ────────
  const city = destination.split(",")[0].trim();
  const capCity = city.charAt(0).toUpperCase() + city.slice(1);

  // Set real-world rates matching budget tiers
  let flightCost = 5000;
  let stayCost = 4500;
  let foodCost = 3000;
  let actCost = 2500;

  if (budgetTier === "Economy") {
    flightCost = 3000; stayCost = 1800; foodCost = 1500; actCost = 1200;
  } else if (budgetTier === "Luxury") {
    flightCost = 12000; stayCost = 15000; foodCost = 8000; actCost = 6000;
  }

  const hotel1 = `Hotel ${capCity} Platinum`;
  const hotel2 = `Hotel Sukun ${capCity}`;
  const hotel3 = `Hotel President ${capCity}`;

  return {
    destination: destination,
    description: `A custom designed plan exploring the sights and hidden gems of ${capCity}.`,
    flightRoute: `RAJ → ${capCity.substring(0,3).toUpperCase()} · Regional · 2h 15m`,
    seasonNote: "Best visited during October to March. Pack light breathable wear.",
    hotels: [
      { id: "h1", name: hotel1, pricePerNight: stayCost, rating: 4.7, walkability: 9, travelTimeMinutes: 30, attributes: ["Modern Stays", "Central Location", "Vegetarian Friendly"] },
      { id: "h2", name: hotel2, pricePerNight: Math.round(stayCost * 0.7), rating: 4.4, walkability: 8, travelTimeMinutes: 25, attributes: ["Comfort", "Wi-Fi", "Clean"] },
      { id: "h3", name: hotel3, pricePerNight: Math.round(stayCost * 0.4), rating: 4.1, walkability: 7, travelTimeMinutes: 35, attributes: ["Budget Choice", "Rooftop Restaurant"] },
    ],
    winnerConfidence: 87,
    winnerBreakdown: { budget_fit: 27, travel_time: 25, review_quality: 18, walkability: 17 },
    rejectedScores: { h2: 73, h3: 62 },
    itinerary: [
      {
        day: 1,
        title: `Welcome to ${capCity}`,
        activities: [
          { time: "14:00", description: `Check-in at your recommended hotel: ${hotel1}.` },
          { time: "16:30", description: `Brief orientation walk around local city center.` },
          { time: "19:30", description: "Relaxed dinner featuring traditional regional delicacies." },
        ],
      },
      {
        day: 2,
        title: "Sightseeing Tour",
        activities: [
          { time: "09:00", description: "Visit the principal heritage landmarks and temple sights." },
          { time: "13:00", description: "Lunch at highly-rated local restaurant." },
          { time: "16:00", description: "Leisurely evening stroll and street shopping." },
        ],
      },
    ],
    budget: {
      flights: flightCost,
      accommodation: stayCost * 2,
      food: foodCost,
      activities: actCost,
      total: flightCost + (stayCost * 2) + foodCost + actCost,
      currency: "INR",
    },
    packing_list: [
      { category: "Clothing", items: ["Light breathable cottons", "Comfortable walking shoes"] },
      { category: "Essentials", items: ["Personal toiletries", "Power bank", "Cash (for local shops)"] },
    ],
  };
}

export function getMockDataFromPreferences(prefs: TripPreferences): TripItinerary {
  // Pass budget preference to ensure rates scale accurately
  const data = getMockDataForDestination(prefs.destination, prefs.budget);

  if (prefs.constraints.some((c) => c.toLowerCase().includes("vegetarian") || c.toLowerCase().includes("jain"))) {
    data.description += " All dining suggestions prioritize pure vegetarian / Jain-friendly dining options.";
  }

  return data;
}

export function getMockChallengeResponse(
  rejectedHotelId: string,
  userConstraint: string
): import("@/types/trip").ChallengeResponse {
  const constraint = userConstraint.toLowerCase();
  let confidence = 72;

  if (constraint.includes("budget") || constraint.includes("cost")) confidence = 81;
  if (constraint.includes("nightlife") || constraint.includes("vibrant")) confidence = 79;
  if (constraint.includes("quiet") || constraint.includes("peaceful")) confidence = 76;

  return {
    recalculated_confidence: confidence,
    score_breakdown: {
      budget_fit: Math.min(28, Math.round(confidence * 0.3)),
      travel_time: Math.min(26, Math.round(confidence * 0.28)),
      review_quality: Math.min(18, Math.round(confidence * 0.2)),
      walkability: Math.min(18, Math.round(confidence * 0.18)),
    },
    delta_summary: userConstraint
      ? `Rescaled with "${userConstraint}". The score shifts to ${confidence}%. Stays are updated to match your stated preferences.`
      : "Alternative stay re-scored. The winner remains ahead due to walkability and travel time constraints.",
    still_recommend_selected: confidence < 85,
  };
}

export const ALL_MOCK_DESTINATIONS = Object.values(baseHotels);
export const GOA_MOCK_DATA: TripItinerary = baseHotels.goa;
export const MANALI_MOCK_DATA: TripItinerary = baseHotels.manali;
export const UDAIPUR_MOCK_DATA: TripItinerary = baseHotels.udaipur;
export const KERALA_MOCK_DATA: TripItinerary = baseHotels.kerala;
