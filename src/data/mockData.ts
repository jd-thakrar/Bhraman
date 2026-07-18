export const GOA_MOCK_DATA = {
  destination: "Goa, India",
  description: "A tropical paradise known for its beautiful beaches, vibrant nightlife, and Portuguese heritage.",
  hotels: [
    {
      id: "h1",
      name: "Taj Exotica Resort & Spa",
      pricePerNight: 25000,
      rating: 4.8,
      walkability: 8,
      travelTimeMinutes: 45, // from airport
      attributes: ["Luxury", "Beachfront", "Spa", "Quiet"]
    },
    {
      id: "h2",
      name: "W Goa",
      pricePerNight: 18000,
      rating: 4.6,
      walkability: 9,
      travelTimeMinutes: 60,
      attributes: ["Party", "Modern", "Vibrant", "Pool"]
    },
    {
      id: "h3",
      name: "Ahilya by the Sea",
      pricePerNight: 22000,
      rating: 4.9,
      walkability: 6,
      travelTimeMinutes: 75,
      attributes: ["Boutique", "Heritage", "Romantic", "Quiet"]
    }
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival & Beach Relaxation",
      activities: [
        { time: "14:00", description: "Check-in to the hotel and freshen up." },
        { time: "16:00", description: "Sunset walk on the beach." },
        { time: "19:00", description: "Welcome dinner at a seaside shack enjoying local seafood." }
      ]
    },
    {
      day: 2,
      title: "Heritage & Culture",
      activities: [
        { time: "10:00", description: "Explore the Basilica of Bom Jesus and Se Cathedral." },
        { time: "13:00", description: "Lunch at a traditional Goan Portuguese restaurant." },
        { time: "15:00", description: "Walk through the Latin Quarter of Fontainhas." },
        { time: "19:00", description: "Evening Mandovi River cruise." }
      ]
    },
    {
      day: 3,
      title: "Adventure & Departure",
      activities: [
        { time: "09:00", description: "Morning water sports (parasailing/jet ski)." },
        { time: "12:00", description: "Relax at a beach club." },
        { time: "15:00", description: "Depart for the airport." }
      ]
    }
  ],
  budget: {
    flights: 15000,
    accommodation: 50000,
    food: 20000,
    activities: 10000,
    total: 95000,
    currency: "INR"
  },
  packing_list: [
    { category: "Clothing", items: ["Lightweight cotton clothes", "Swimwear", "Light jacket for evenings"] },
    { category: "Essentials", items: ["Sunscreen (SPF 50+)", "Sunglasses", "Mosquito repellent"] },
    { category: "Footwear", items: ["Flip-flops", "Comfortable walking shoes"] }
  ]
};
