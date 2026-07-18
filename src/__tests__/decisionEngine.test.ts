import { vi, describe, it, expect } from 'vitest';
import { generateTripItineraryServer, recalculateConfidenceServer } from '../lib/ai/decisionEngine';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockImplementation(async ({ contents }) => {
          // Check if this is a confidence recalculation request
          if (contents.includes("recalculate") || contents.includes("Recalculate")) {
            return {
              text: JSON.stringify({
                recalculated_confidence: 85,
                score_breakdown: {
                  budget_fit: 25,
                  travel_time: 25,
                  review_quality: 18,
                  walkability: 17
                },
                delta_summary: "Alternative hotel is closer to the beach.",
                still_recommend_selected: false
              })
            };
          }
          // Otherwise, it is an itinerary generation request
          return {
            text: JSON.stringify({
              destination: "Goa, India",
              latitude: 15.2993,
              longitude: 74.1240,
              description: "Relaxing beach trip",
              hotels: [
                { id: "h1", name: "Taj Exotica Resort & Spa", pricePerNight: 28000, rating: 4.9, walkability: 9, travelTimeMinutes: 40, attributes: ["Luxury","Beachfront"], latitude: 15.2993, longitude: 74.1240 },
                { id: "h2", name: "W Goa – Vagator", pricePerNight: 18000, rating: 4.6, walkability: 8, travelTimeMinutes: 65, attributes: ["Trendy"], latitude: 15.2993, longitude: 74.1240 },
                { id: "h3", name: "Ahilya by the Sea", pricePerNight: 22000, rating: 4.8, walkability: 6, travelTimeMinutes: 80, attributes: ["Boutique"], latitude: 15.2993, longitude: 74.1240 }
              ],
              itinerary: [
                { day: 1, title: "Arrival & Sunset", activities: [{ time: "18:00", description: "Sunset at Benaulim Beach." }] }
              ],
              budget: { flights: 18000, accommodation: 84000, food: 15000, activities: 8000, total: 125000, currency: "INR" },
              packing_list: [{ category: "Beach", items: ["Beachwear"] }]
            })
          };
        })
      };
    }
  };
});

describe('AI Decision Engine', () => {
  it('generates a trip itinerary correctly', async () => {
    const preferences = {
      destination: "Goa",
      companions: "Couple 🕯️",
      budget: "Luxury",
      budgetAmount: "150000",
      durationDays: 3,
      constraints: ["Direct Flights Only ✈️"],
      specialInstructions: "Near beach"
    };

    const result = await generateTripItineraryServer(preferences);
    expect(result).toHaveProperty('destination');
    expect(result.destination).toBe('Goa, India');
    expect(result.hotels).toHaveLength(3);
    expect(result.itinerary).toHaveLength(1);
    expect(result.budget.total).toBe(125000);
  });

  it('recalculates confidence score correctly', async () => {
    const result = await recalculateConfidenceServer('h1', 'h2', 'Near the beach');
    expect(result).toHaveProperty('recalculated_confidence');
    expect(result.recalculated_confidence).toBe(85);
    expect(result.still_recommend_selected).toBe(false);
    expect(result.score_breakdown.budget_fit).toBe(25);
  });
});
