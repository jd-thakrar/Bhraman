import type { TripItinerary, TripPreferences } from "@/types/trip";

const baseHotels = {
  goa: {
    destination: "Goa, India",
    description:
      "Sun-kissed beaches, Portuguese heritage, and vibrant coastal life — perfect for a relaxed Indian getaway.",
    flightRoute: "DEL → GOI · IndiGo 6E-234 · 2h 15m",
    seasonNote: "Best Oct–Mar. Avoid peak monsoon (Jun–Aug) for water sports.",
    hotels: [
      {
        id: "h1",
        name: "Taj Exotica Resort & Spa",
        pricePerNight: 25000,
        rating: 4.8,
        walkability: 8,
        travelTimeMinutes: 45,
        attributes: ["Luxury", "Beachfront", "Spa", "Quiet"],
      },
      {
        id: "h2",
        name: "W Goa",
        pricePerNight: 18000,
        rating: 4.6,
        walkability: 9,
        travelTimeMinutes: 60,
        attributes: ["Party", "Modern", "Vibrant", "Pool"],
        rejectionReason: "Higher noise levels; less ideal for quiet beach mornings.",
      },
      {
        id: "h3",
        name: "Ahilya by the Sea",
        pricePerNight: 22000,
        rating: 4.9,
        walkability: 6,
        travelTimeMinutes: 75,
        attributes: ["Boutique", "Heritage", "Romantic", "Quiet"],
        rejectionReason: "75 min from Dabolim airport — longer transfer on narrow coastal roads.",
      },
    ],
    winnerConfidence: 87,
    winnerBreakdown: { budget_fit: 25, travel_time: 28, review_quality: 18, walkability: 16 },
    rejectedScores: { h2: 71, h3: 65 },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Sunset",
        activities: [
          { time: "14:00", description: "Check-in at Taj Exotica. Private transfer from GOI airport (45 min)." },
          { time: "16:30", description: "Sunset walk at Benaulim Beach — less crowded than Baga." },
          { time: "19:30", description: "Pure veg Goan thali at Mum's Kitchen, Margao (Jain options available)." },
        ],
      },
      {
        day: 2,
        title: "Heritage & Latin Quarter",
        activities: [
          { time: "10:00", description: "Basilica of Bom Jesus & Se Cathedral (Old Goa UNESCO site)." },
          { time: "13:00", description: "Lunch at Venite — rooftop views over Fontainhas." },
          { time: "15:30", description: "Walk through Fontainhas — colourful Portuguese quarter." },
          { time: "19:00", description: "Evening Mandovi River cruise with live Goan music." },
        ],
      },
      {
        day: 3,
        title: "Adventure & Departure",
        activities: [
          { time: "09:00", description: "Water sports at Calangute (parasailing, jet ski)." },
          { time: "12:00", description: "Beach club lunch at Thalassa, Vagator." },
          { time: "15:00", description: "Depart for GOI airport via NH66." },
        ],
      },
    ],
    budget: { flights: 15000, accommodation: 50000, food: 20000, activities: 10000, total: 95000, currency: "INR" as const },
    packing_list: [
      { category: "Clothing", items: ["Light cotton kurtas/shirts", "Swimwear", "Light jacket for evenings"] },
      { category: "Essentials", items: ["Sunscreen SPF 50+", "Sunglasses", "Mosquito repellent (Odomos)"] },
      { category: "Footwear", items: ["Flip-flops for beach", "Comfortable walking sandals"] },
    ],
  },
  manali: {
    destination: "Manali, Himachal Pradesh",
    description:
      "Snow-capped peaks, apple orchards, and adventure trails in the Kullu Valley — India's favourite hill escape.",
    flightRoute: "DEL → KUU (Bhuntar) · Air India · 1h 20m + 2h scenic drive",
    seasonNote: "Dec–Feb for snow. Mar–Jun for trekking. Monsoon landslides possible Jul–Aug.",
    hotels: [
      {
        id: "h1",
        name: "The Himalayan Resort & Spa",
        pricePerNight: 12000,
        rating: 4.7,
        walkability: 7,
        travelTimeMinutes: 120,
        attributes: ["Mountain View", "Spa", "Heated Rooms", "Family"],
      },
      {
        id: "h2",
        name: "Snow Valley Resorts",
        pricePerNight: 8500,
        rating: 4.4,
        walkability: 5,
        travelTimeMinutes: 90,
        attributes: ["Budget", "Adventure", "Bonfire", "Group"],
        rejectionReason: "Limited accessibility for elderly — steep internal paths.",
      },
      {
        id: "h3",
        name: "Span Resort & Spa",
        pricePerNight: 15000,
        rating: 4.6,
        walkability: 4,
        travelTimeMinutes: 150,
        attributes: ["Luxury", "Riverside", "Private", "Quiet"],
        rejectionReason: "150 min from Bhuntar airport — long mountain road transfer.",
      },
    ],
    winnerConfidence: 84,
    winnerBreakdown: { budget_fit: 26, travel_time: 24, review_quality: 18, walkability: 16 },
    rejectedScores: { h2: 68, h3: 62 },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Mall Road",
        activities: [
          { time: "13:00", description: "Check-in at Himalayan Resort. Acclimatise at 2,050m altitude." },
          { time: "16:00", description: "Stroll Mall Road — local woollen shops and Himachali cuisine." },
          { time: "19:00", description: "Dinner at Johnson's Cafe — trout and veg thukpa." },
        ],
      },
      {
        day: 2,
        title: "Solang Valley Adventure",
        activities: [
          { time: "08:00", description: "Drive to Solang Valley (14 km) — paragliding or skiing (seasonal)." },
          { time: "13:00", description: "Lunch at Solang village dhaba — maggi and chai with mountain views." },
          { time: "15:00", description: "Visit Hadimba Devi Temple — ancient cedar-wood shrine." },
          { time: "19:30", description: "Bonfire and local folk music at resort." },
        ],
      },
      {
        day: 3,
        title: "Rohtang Pass & Return",
        activities: [
          { time: "06:00", description: "Early drive toward Rohtang Pass (permit required, seasonal)." },
          { time: "12:00", description: "Lunch at Marhi dhabas — rajma-chawal at 3,900m." },
          { time: "16:00", description: "Return to Manali. Shop for Kullu shawls on Mall Road." },
        ],
      },
    ],
    budget: { flights: 12000, accommodation: 36000, food: 15000, activities: 18000, total: 81000, currency: "INR" as const },
    packing_list: [
      { category: "Clothing", items: ["Thermal innerwear", "Woollen jacket & gloves", "Waterproof shell"] },
      { category: "Essentials", items: ["Altitude sickness tablets (Diamox)", "Lip balm", "Power bank"] },
      { category: "Footwear", items: ["Waterproof trekking boots", "Warm socks (wool blend)"] },
    ],
  },
  udaipur: {
    destination: "Udaipur, Rajasthan",
    description:
      "City of Lakes — palaces, ghats, and royal heritage on the edge of the Aravalli hills.",
    flightRoute: "BOM → UDR · Vistara · 1h 35m",
    seasonNote: "Oct–Mar ideal. Summer (Apr–Jun) hits 42°C+. Monsoon lakes are stunning but humid.",
    hotels: [
      {
        id: "h1",
        name: "Taj Lake Palace",
        pricePerNight: 45000,
        rating: 4.9,
        walkability: 9,
        travelTimeMinutes: 35,
        attributes: ["Heritage", "Lake View", "Luxury", "Romantic"],
      },
      {
        id: "h2",
        name: "The Leela Palace Udaipur",
        pricePerNight: 32000,
        rating: 4.7,
        walkability: 8,
        travelTimeMinutes: 40,
        attributes: ["Modern Luxury", "Spa", "Pool", "Lake View"],
        rejectionReason: "Higher per-night cost without matching heritage experience.",
      },
      {
        id: "h3",
        name: "Jagat Niwas Palace",
        pricePerNight: 8500,
        rating: 4.3,
        walkability: 10,
        travelTimeMinutes: 30,
        attributes: ["Heritage Haveli", "Budget", "Lakefront", "Local"],
        rejectionReason: "Limited AC rooms and fewer amenities for luxury-tier budget.",
      },
    ],
    winnerConfidence: 91,
    winnerBreakdown: { budget_fit: 22, travel_time: 29, review_quality: 20, walkability: 20 },
    rejectedScores: { h2: 74, h3: 58 },
    itinerary: [
      {
        day: 1,
        title: "Palace Arrival",
        activities: [
          { time: "14:00", description: "Boat transfer to Taj Lake Palace on Lake Pichola." },
          { time: "16:30", description: "Sunset from City Palace terrace — panoramic lake views." },
          { time: "19:30", description: "Royal Rajasthani thali at 1559 AD — pure veg menu available." },
        ],
      },
      {
        day: 2,
        title: "Heritage Circuit",
        activities: [
          { time: "09:00", description: "City Palace & Crystal Gallery guided tour." },
          { time: "12:00", description: "Lunch at Ambrai — lake-view terrace dining." },
          { time: "15:00", description: "Jagdish Temple & old city bazaar — miniature paintings." },
          { time: "19:00", description: "Sound & light show at City Palace." },
        ],
      },
      {
        day: 3,
        title: "Countryside & Departure",
        activities: [
          { time: "08:00", description: "Day trip to Kumbhalgarh Fort (UNESCO, 2h drive)." },
          { time: "14:00", description: "Return via Ranakpur Jain Temple — marble architecture." },
          { time: "17:00", description: "Depart for Maharana Pratap Airport (UDR)." },
        ],
      },
    ],
    budget: { flights: 14000, accommodation: 90000, food: 25000, activities: 12000, total: 141000, currency: "INR" as const },
    packing_list: [
      { category: "Clothing", items: ["Light cotton for day", "Modest attire for temples", "Evening formal wear"] },
      { category: "Essentials", items: ["Sunscreen", "Reusable water bottle", "Camera for palace shots"] },
      { category: "Footwear", items: ["Comfortable walking shoes", "Sandals for ghats"] },
    ],
  },
  kerala: {
    destination: "Alleppey, Kerala",
    description:
      "Backwaters, houseboats, and coconut groves — God's Own Country at its most serene.",
    flightRoute: "BLR → COK · IndiGo · 1h 10m + 1.5h drive to Alleppey",
    seasonNote: "Sep–Mar best. Onam (Aug–Sep) is festive. Monsoon (Jun–Aug) = lush but houseboat limits.",
    hotels: [
      {
        id: "h1",
        name: "Punnamada Resort",
        pricePerNight: 14000,
        rating: 4.8,
        walkability: 8,
        travelTimeMinutes: 90,
        attributes: ["Backwater View", "Houseboat Partner", "Ayurveda", "Quiet"],
      },
      {
        id: "h2",
        name: "Lake Palace Resort",
        pricePerNight: 11000,
        rating: 4.5,
        walkability: 6,
        travelTimeMinutes: 75,
        attributes: ["Budget", "Pool", "Family", "Lake View"],
        rejectionReason: "Houseboat quality inconsistent; fewer Ayurveda options.",
      },
      {
        id: "h3",
        name: "Coconut Lagoon CGH Earth",
        pricePerNight: 22000,
        rating: 4.9,
        walkability: 7,
        travelTimeMinutes: 100,
        attributes: ["Eco Luxury", "Heritage", "Sustainable", "Romantic"],
        rejectionReason: "₹22K/night exceeds Comfort tier budget for 3-night stay.",
      },
    ],
    winnerConfidence: 89,
    winnerBreakdown: { budget_fit: 27, travel_time: 26, review_quality: 19, walkability: 17 },
    rejectedScores: { h2: 69, h3: 63 },
    itinerary: [
      {
        day: 1,
        title: "Backwater Arrival",
        activities: [
          { time: "13:00", description: "Transfer from Kochi (COK) to Alleppey via NH66." },
          { time: "15:00", description: "Check-in at Punnamada. Ayurvedic welcome drink." },
          { time: "17:00", description: "Sunset canoe ride through narrow backwater channels." },
          { time: "19:30", description: "Kerala sadya (banana-leaf feast) — 100% vegetarian." },
        ],
      },
      {
        day: 2,
        title: "Houseboat Day Cruise",
        activities: [
          { time: "09:00", description: "Board deluxe houseboat — Vembanad Lake full-day cruise." },
          { time: "13:00", description: "Fresh karimeen (pearl spot fish) or veg avial on board." },
          { time: "16:00", description: "Village walk — coir-making and toddy tapping demo." },
          { time: "19:00", description: "Kathakali performance at resort amphitheatre." },
        ],
      },
      {
        day: 3,
        title: "Fort Kochi & Departure",
        activities: [
          { time: "08:00", description: "Drive to Fort Kochi — Chinese fishing nets & St. Francis Church." },
          { time: "12:00", description: "Lunch at Kashi Art Cafe — fusion Kerala-European." },
          { time: "15:00", description: "Depart from Cochin International Airport (COK)." },
        ],
      },
    ],
    budget: { flights: 11000, accommodation: 42000, food: 18000, activities: 14000, total: 85000, currency: "INR" as const },
    packing_list: [
      { category: "Clothing", items: ["Breathable cotton kurtas", "Light rain jacket (monsoon)", "Mosquito-friendly long sleeves"] },
      { category: "Essentials", items: ["Strong mosquito repellent", "Waterproof phone pouch", "Ayurvedic sunscreen"] },
      { category: "Footwear", items: ["Easy-slip sandals for houseboat", "Closed shoes for village walks"] },
    ],
  },
};

export const GOA_MOCK_DATA: TripItinerary = baseHotels.goa;
export const MANALI_MOCK_DATA: TripItinerary = baseHotels.manali;
export const UDAIPUR_MOCK_DATA: TripItinerary = baseHotels.udaipur;
export const KERALA_MOCK_DATA: TripItinerary = baseHotels.kerala;

const DESTINATION_MAP: Record<string, keyof typeof baseHotels> = {
  goa: "goa",
  beach: "goa",
  "goa beachfront": "goa",
  himachal: "manali",
  manali: "manali",
  mountain: "manali",
  trek: "manali",
  udaipur: "udaipur",
  heritage: "udaipur",
  rajasthan: "udaipur",
  kerala: "kerala",
  backwater: "kerala",
  alleppey: "kerala",
  allepey: "kerala",
};

export function getMockDataForDestination(destination: string): TripItinerary {
  const normalized = destination.toLowerCase();

  for (const [keyword, key] of Object.entries(DESTINATION_MAP)) {
    if (normalized.includes(keyword)) {
      return { ...baseHotels[key] };
    }
  }

  return { ...baseHotels.goa, destination: destination || "Goa, India" };
}

export function getMockDataFromPreferences(prefs: TripPreferences): TripItinerary {
  const data = getMockDataForDestination(prefs.destination);

  if (prefs.constraints.some((c) => c.toLowerCase().includes("vegetarian") || c.toLowerCase().includes("jain"))) {
    data.description += " All meals prioritise pure vegetarian and Jain-friendly restaurants.";
  }

  if (prefs.budget.toLowerCase().includes("economy")) {
    data.budget.total = Math.round(data.budget.total * 0.65);
    data.budget.accommodation = Math.round(data.budget.accommodation * 0.6);
    data.winnerConfidence = Math.max(data.winnerConfidence - 5, 75);
  } else if (prefs.budget.toLowerCase().includes("luxury")) {
    data.budget.total = Math.round(data.budget.total * 1.4);
    data.budget.accommodation = Math.round(data.budget.accommodation * 1.5);
    data.winnerConfidence = Math.min(data.winnerConfidence + 3, 95);
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
      ? `With "${userConstraint}" applied, this stay's score shifts to ${confidence}%. It improves on your stated priority but still trails the top pick on overall transfer time and review consistency.`
      : "Re-scored against your original constraints. The alternative improves marginally but distance and review depth keep the recommended stay ahead.",
    still_recommend_selected: confidence < 85,
  };
}

export const ALL_MOCK_DESTINATIONS = Object.values(baseHotels);
