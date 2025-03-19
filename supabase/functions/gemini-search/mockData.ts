
// Mock data for fallback when API is unavailable

// Mock results function for fallback when API is unavailable
export function getMockResults(serviceType: string, query: string) {
  const queryLower = query.toLowerCase();
  
  // Default food delivery results
  const foodResults = [
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
  
  // Default cab booking results
  const cabResults = [
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
  
  // Default hotel booking results
  const hotelResults = [
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
      title: "Business Inn",
      description: "3-star hotel perfect for business travelers",
      provider: "MakeMyTrip",
      price: "₹3,500/night",
      rating: "4.2",
      eta: "Check-in: 12 PM",
      image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Budget Stay",
      description: "Affordable accommodation with basic amenities",
      provider: "OYO",
      price: "₹1,200/night",
      rating: "3.8",
      eta: "Check-in: 1 PM",
      image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  // Determine which results to return based on query and service type
  if (serviceType === "food-delivery" || queryLower.includes("food") || queryLower.includes("restaurant") || 
      queryLower.includes("biriyani") || queryLower.includes("pizza") || queryLower.includes("dinner") || 
      queryLower.includes("lunch") || queryLower.includes("breakfast")) {
    return foodResults;
  } else if (serviceType === "cab-booking" || queryLower.includes("cab") || queryLower.includes("taxi") || 
             queryLower.includes("ride") || queryLower.includes("uber") || queryLower.includes("ola")) {
    return cabResults;
  } else if (serviceType === "hotel-reservation" || queryLower.includes("hotel") || queryLower.includes("stay") || 
             queryLower.includes("room") || queryLower.includes("accommodation")) {
    return hotelResults;
  } else {
    // For general queries, mix results
    return [foodResults[0], cabResults[0], hotelResults[0]];
  }
}

// Mock suggestions function for fallback when API is unavailable
export function getMockSuggestions(serviceType: string, query: string) {
  const queryLower = query.toLowerCase();
  
  // Food-related suggestions
  if (serviceType === "food-delivery" || queryLower.includes("food") || queryLower.includes("restaurant") || 
      queryLower.includes("biriyani") || queryLower.includes("pizza")) {
    return [
      "Best biryani places nearby",
      "Affordable dinner options",
      "Fast food delivery under 30 minutes",
      "Top-rated restaurants in your area",
      "Vegetarian dinner options"
    ];
  }
  // Cab-related suggestions
  else if (serviceType === "cab-booking" || queryLower.includes("cab") || queryLower.includes("taxi") || 
           queryLower.includes("ride")) {
    return [
      "Book a premium cab now",
      "Affordable cab options near me",
      "Schedule a ride for tomorrow",
      "Airport pickup services",
      "Shared rides for commuting"
    ];
  }
  // Hotel-related suggestions
  else if (serviceType === "hotel-reservation" || queryLower.includes("hotel") || queryLower.includes("stay") || 
           queryLower.includes("room")) {
    return [
      "5-star hotels with pool",
      "Budget stays under ₹2000",
      "Hotels with free breakfast",
      "Business hotels with conference rooms",
      "Hotels with late check-out option"
    ];
  }
  // General suggestions
  else {
    return [
      "Food delivery services nearby",
      "Book a cab for airport pickup",
      "Best hotels for weekend stay",
      "Quick meal delivery options",
      "Services available in your area"
    ];
  }
}
