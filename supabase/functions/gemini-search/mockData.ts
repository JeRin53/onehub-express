
import { SearchResponse, LocationData } from "./types.ts";

export function generateMockData(
  query: string,
  serviceType: string,
  location: LocationData | null,
  errorMessage?: string
): SearchResponse {
  console.log(`Generating mock data for "${query}" (${serviceType})`);
  
  // Basic mock data that somewhat relates to the query
  let results = [];
  let suggestions = [];
  let summary = "";
  let serviceCategory = serviceType !== "general" ? serviceType : detectServiceCategory(query);
  
  // This is the data we'll return when the Gemini API fails
  switch (serviceCategory) {
    case "food-delivery":
      results = [
        {
          title: "Spice Junction",
          description: "Authentic Indian cuisine with famous biriyani and curry dishes",
          provider: "Swiggy",
          price: "₹200-₹500",
          rating: "4.6",
          eta: "25 min",
          image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Biryani House",
          description: "Specializing in authentic dum biryani with secret family recipes",
          provider: "Zomato",
          price: "₹250-₹450",
          rating: "4.3",
          eta: "35 min",
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Paradise Restaurant",
          description: "Famous for Hyderabadi biryani and North Indian cuisine",
          provider: "Swiggy",
          price: "₹300-₹600",
          rating: "4.8",
          eta: "30 min",
          image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        }
      ];
      suggestions = [
        "Best biryani places nearby",
        "Affordable dinner options",
        "Fast food delivery under 30 minutes",
        "Top-rated restaurants in your area",
        "Vegetarian dinner options"
      ];
      summary = query.toLowerCase().includes("biryani") 
        ? "Here are some great biryani options available for delivery near you."
        : "Here are some popular food delivery options near you.";
      break;
      
    case "cab-booking":
      results = [
        {
          title: "Economy Sedan",
          description: "Comfortable ride for up to 4 passengers",
          provider: "Uber",
          price: "₹250",
          rating: "4.5",
          eta: "5 min",
          image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Premium SUV",
          description: "Spacious ride for up to 6 passengers with extra luggage space",
          provider: "Ola",
          price: "₹350",
          rating: "4.7",
          eta: "7 min",
          image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Mini",
          description: "Affordable ride for up to 3 passengers",
          provider: "Uber",
          price: "₹150",
          rating: "4.3",
          eta: "3 min",
          image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        }
      ];
      suggestions = [
        "Book a premium cab now",
        "Affordable cab options near me",
        "Schedule a ride for tomorrow",
        "Airport pickup services",
        "Shared rides for commuting"
      ];
      summary = "Here are available cab options near your location.";
      break;
      
    case "hotel-reservation":
      results = [
        {
          title: "Grand Luxury Hotel",
          description: "5-star hotel with pool, spa, and fine dining",
          provider: "Booking.com",
          price: "₹8,000/night",
          rating: "4.8",
          eta: "Check-in: 2 PM",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Business Inn Express",
          description: "3-star hotel with breakfast and business center",
          provider: "MakeMyTrip",
          price: "₹3,500/night",
          rating: "4.2",
          eta: "Check-in: 12 PM",
          image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Cozy Homestay",
          description: "Comfortable private room in a residential area",
          provider: "Airbnb",
          price: "₹1,800/night",
          rating: "4.6",
          eta: "Check-in: 3 PM",
          image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
        }
      ];
      suggestions = [
        "Luxury hotels with pool",
        "Budget-friendly accommodations",
        "Hotels with free breakfast",
        "Pet-friendly hotels nearby",
        "Hotels with airport shuttle"
      ];
      summary = "Here are accommodation options available for your stay.";
      break;
      
    case "fuel-delivery":
      results = [
        {
          title: "Diesel Delivery",
          description: "High-quality diesel delivered to your location",
          provider: "FuelBuddy",
          price: "₹90/liter",
          rating: "4.7",
          eta: "2 hours",
          image: "https://images.unsplash.com/photo-1565677467616-7a0f7bfc8e22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Petrol Delivery",
          description: "Premium petrol with doorstep delivery",
          provider: "MyPetrolPump",
          price: "₹102/liter",
          rating: "4.5",
          eta: "3 hours",
          image: "https://images.unsplash.com/photo-1615139511287-f6fb75f9e7a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Emergency Fuel Service",
          description: "24/7 emergency fuel delivery when you're stranded",
          provider: "Humsafar",
          price: "₹110/liter",
          rating: "4.8",
          eta: "1 hour",
          image: "https://images.unsplash.com/photo-1621068539540-b346a3566f90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        }
      ];
      suggestions = [
        "Emergency fuel delivery",
        "Bulk diesel for generators",
        "Premium quality petrol",
        "Monthly fuel subscription",
        "Late night fuel delivery"
      ];
      summary = "Here are fuel delivery options available in your area.";
      break;
      
    case "train-booking":
      results = [
        {
          title: "Express Rajdhani",
          description: "Premium high-speed train with meals included",
          provider: "IRCTC",
          price: "₹1,200 (AC Chair Car)",
          rating: "4.5",
          eta: "Departure: 06:15 AM",
          image: "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Shatabdi Express",
          description: "Intercity high-speed train with breakfast and lunch",
          provider: "IRCTC",
          price: "₹850 (Executive Chair Car)",
          rating: "4.3",
          eta: "Departure: 08:30 AM",
          image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1184&q=80"
        },
        {
          title: "Duronto Express",
          description: "Non-stop train connecting major cities",
          provider: "IRCTC",
          price: "₹950 (3-Tier AC)",
          rating: "4.2",
          eta: "Departure: 11:45 PM",
          image: "https://images.unsplash.com/photo-1581397912614-4d2c6c600953?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        }
      ];
      suggestions = [
        "Premium trains with meals",
        "Overnight sleeper trains",
        "Weekend train packages",
        "First-class train tickets",
        "Group booking discounts"
      ];
      summary = "Here are train ticket options for your journey.";
      break;
      
    default:
      // General fallback results
      results = [
        {
          title: "Popular Restaurant",
          description: "Highly rated dining with varied cuisine options",
          provider: "Swiggy",
          price: "₹500 for two",
          rating: "4.6",
          eta: "30 min delivery",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "City Cab",
          description: "Reliable transportation across the city",
          provider: "Uber",
          price: "₹200-₹400",
          rating: "4.5",
          eta: "5 min away",
          image: "https://images.unsplash.com/photo-1511899897619-f10d0e1aeead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        },
        {
          title: "Comfort Hotel",
          description: "Affordable and comfortable stay in the city center",
          provider: "Booking.com",
          price: "₹2,500/night",
          rating: "4.3",
          eta: "Check-in anytime",
          image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
        }
      ];
      suggestions = [
        "Popular services near me",
        "Best-rated restaurants",
        "Quick cab booking",
        "Affordable hotels",
        "Weekend getaway packages"
      ];
      summary = `Here are popular services matching your search for "${query}".`;
  }
  
  // Add extracted details for better results
  const extracted: any = {};
  
  // Try to identify specific food items
  if (serviceCategory === "food-delivery") {
    const foodItems = [
      "biryani", "pizza", "burger", "dosa", "idli", "pasta", 
      "noodles", "sushi", "sandwich", "thali", "paratha", "curry"
    ];
    
    for (const item of foodItems) {
      if (query.toLowerCase().includes(item)) {
        extracted.item = item;
        break;
      }
    }
  }
  
  // Detect priorities
  const priorityKeywords = {
    "fast": ["fast", "quick", "soon", "speedy", "rapid", "express"],
    "cheap": ["cheap", "affordable", "budget", "inexpensive", "economical"],
    "best": ["best", "top", "highest rated", "premium", "excellent", "good"],
    "nearby": ["nearby", "close", "near me", "around", "local"]
  };
  
  const priorities = [];
  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    for (const keyword of keywords) {
      if (query.toLowerCase().includes(keyword)) {
        priorities.push(priority);
        break;
      }
    }
  }
  
  if (priorities.length > 0) {
    extracted.priorities = priorities;
  }
  
  // Return the mock response with error details if provided
  return {
    results,
    suggestions,
    summary: errorMessage 
      ? `Demo results (${errorMessage})` 
      : summary,
    extracted: Object.keys(extracted).length > 0 ? extracted : undefined,
    serviceCategory,
    error: errorMessage
  };
}

function detectServiceCategory(query: string): string {
  const query_lower = query.toLowerCase();
  
  if (/food|restaurant|meal|eat|dinner|lunch|breakfast|biryani|pizza/i.test(query_lower)) {
    return "food-delivery";
  } else if (/cab|taxi|ride|car|uber|lift/i.test(query_lower)) {
    return "cab-booking";
  } else if (/hotel|stay|room|accommodation|lodge/i.test(query_lower)) {
    return "hotel-reservation";
  } else if (/fuel|gas|petrol|diesel/i.test(query_lower)) {
    return "fuel-delivery";
  } else if (/train|rail|travel|ticket/i.test(query_lower)) {
    return "train-booking";
  }
  
  return "general";
}
