
// Mock data generator for the Gemini search function
// Used as a fallback when real data cannot be obtained

import { SearchResponse, LocationData } from "./types.ts";

export function generateMockData(query: string, serviceType: string, location: LocationData | null, errorMessage?: string): SearchResponse {
  console.log("Generating mock data for query:", query);
  console.log("Service type:", serviceType);
  
  // Extract food type from query if possible
  const foodTerms = query.match(/pizza|burger|biryani|pasta|chinese|indian|italian|thai|sushi|sandwich|salad|cake|ice cream|coffee/gi);
  const foodType = foodTerms ? foodTerms[0].toLowerCase() : "food";
  
  // Generate appropriate mock data based on the query and food type
  const mockResults = [];
  const restaurants = getFoodRestaurants(foodType);
  
  for (let i = 0; i < restaurants.length && i < 5; i++) {
    const restaurant = restaurants[i];
    mockResults.push({
      title: restaurant.name,
      description: restaurant.description.replace("{foodType}", foodType),
      provider: restaurant.provider,
      price: restaurant.priceRange,
      rating: restaurant.rating,
      distance: getRandomDistance(),
      image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(restaurant.name.replace(/\s/g, '+'))}`
    });
  }
  
  // Generate relevant search suggestions
  const suggestions = generateSuggestions(query, foodType);
  
  return {
    results: mockResults,
    suggestions,
    summary: `Here are some ${foodType} options${location ? " near you" : ""} based on your search.`,
    error: errorMessage
  };
}

function getFoodRestaurants(foodType: string) {
  // Define restaurant templates based on food type
  const restaurantTemplates = {
    pizza: [
      { name: "Domino's Pizza", description: "Famous for quick delivery of {foodType}", provider: "Swiggy", priceRange: "₹200 - ₹500", rating: "4.2" },
      { name: "Pizza Hut", description: "Enjoy authentic {foodType} with stuffed crust", provider: "Zomato", priceRange: "₹300 - ₹600", rating: "4.0" },
      { name: "La Pino'z", description: "Budget-friendly {foodType} with great taste", provider: "Swiggy", priceRange: "₹150 - ₹400", rating: "4.1" },
      { name: "Oven Story", description: "Gourmet {foodType} with unique toppings", provider: "Zomato", priceRange: "₹400 - ₹800", rating: "4.3" }
    ],
    burger: [
      { name: "Burger King", description: "Flame-grilled {foodType}s with signature taste", provider: "Swiggy", priceRange: "₹150 - ₹350", rating: "4.1" },
      { name: "McDonald's", description: "Classic {foodType}s and meals", provider: "Zomato", priceRange: "₹120 - ₹300", rating: "4.0" },
      { name: "Burger Farm", description: "Gourmet {foodType}s with local ingredients", provider: "Swiggy", priceRange: "₹200 - ₹400", rating: "4.4" },
      { name: "Wat-a-Burger", description: "Jumbo sized {foodType}s with Indian flavors", provider: "Zomato", priceRange: "₹180 - ₹350", rating: "4.2" }
    ],
    biryani: [
      { name: "Behrouz Biryani", description: "Royal {foodType} with authentic spices", provider: "Swiggy", priceRange: "₹300 - ₹600", rating: "4.3" },
      { name: "Biryani Blues", description: "Hyderabadi style {foodType} with rich flavors", provider: "Zomato", priceRange: "₹250 - ₹500", rating: "4.2" },
      { name: "Paradise Biryani", description: "World famous {foodType} with secret recipe", provider: "Swiggy", priceRange: "₹350 - ₹650", rating: "4.5" },
      { name: "Mani's Dum Biryani", description: "Traditional dum cooked {foodType}", provider: "Zomato", priceRange: "₹280 - ₹550", rating: "4.3" }
    ]
  };
  
  // Default restaurants for any other food type
  const defaultRestaurants = [
    { name: "Spice Junction", description: "Popular restaurant for {foodType}", provider: "Swiggy", priceRange: "₹200 - ₹400", rating: "4.3" },
    { name: "Food Express", description: "Quick delivery of {foodType}", provider: "Zomato", priceRange: "₹150 - ₹350", rating: "4.1" },
    { name: "Taste Buds", description: "Delicious {foodType} with great ambiance", provider: "Swiggy", priceRange: "₹250 - ₹450", rating: "4.2" },
    { name: "Urban Kitchen", description: "Modern restaurant serving {foodType}", provider: "Zomato", priceRange: "₹200 - ₹500", rating: "4.0" },
    { name: "Flavours", description: "Authentic {foodType} with local touch", provider: "Swiggy", priceRange: "₹180 - ₹400", rating: "4.4" }
  ];
  
  // Return food-specific restaurants or default ones
  return (foodType in restaurantTemplates) ? 
    restaurantTemplates[foodType as keyof typeof restaurantTemplates] : 
    defaultRestaurants;
}

function getRandomDistance(): string {
  // Generate a random distance between 0.5 and 8.0 km
  const distance = (Math.random() * 7.5 + 0.5).toFixed(1);
  return `${distance} km`;
}

function generateSuggestions(query: string, foodType: string): string[] {
  const commonSuggestions = [
    `Best ${foodType} near me`,
    `${foodType} with free delivery`,
    `Top rated ${foodType} restaurants`,
    `${foodType} under ₹300`,
    `Fast delivery ${foodType}`,
    `${foodType} with offers`,
    `New ${foodType} places`,
    `Vegetarian ${foodType} options`,
    `${foodType} for two people`,
    `Late night ${foodType} delivery`
  ];
  
  // Shuffle and pick 5 suggestions
  return shuffleArray(commonSuggestions).slice(0, 5);
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
