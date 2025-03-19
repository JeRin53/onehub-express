
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { query, serviceType, location } = requestData;
    
    console.log(`Processing Gemini search for: "${query}" in service: ${serviceType}`);
    console.log(`User location data: ${location ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : 'Not provided'}`);

    if (!query) {
      return new Response(
        JSON.stringify({ 
          error: 'Query parameter is required',
          results: [],
          suggestions: [],
          summary: "Please provide a search query"
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we have a valid API key
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return new Response(
        JSON.stringify({ 
          results: getMockResults(serviceType, query),
          suggestions: getMockSuggestions(serviceType, query),
          summary: "Using demo results (API key not configured)" 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build location-aware prompt
    let locationContext = "";
    if (location) {
      locationContext = `The user is located at latitude ${location.latitude} and longitude ${location.longitude}. Consider this for delivery time estimates and proximity.`;
    }

    const prompt = `
      You are an intelligent assistant for a service aggregator platform called ONEHUB.
      User is searching for: "${query}" in the service category: "${serviceType || 'general'}".
      ${locationContext}
      
      Instructions:
      1. Users may search for food items (like biriyani), hotels, cab services, or other services.
      2. Provide concise, relevant information about their query.
      3. Extract the main intent, priorities, and preferences from their query.
      
      For a food delivery search like "I want to order biriyani, fast and cheap", extract:
      - The food item (biriyani)
      - User priorities (fast delivery, cheap price)
      - Relevant cuisine types (Indian)
      
      Format the response as a JSON object with the following structure:
      {
        "results": [
          {
            "title": "Result title (restaurant, hotel, or service name)",
            "description": "Brief description",
            "provider": "Service provider name",
            "price": "Estimated price (if applicable)",
            "rating": "Rating (if applicable)",
            "eta": "Estimated delivery/arrival time",
            "image": "URL to an image if applicable (or leave empty)"
          }
        ],
        "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
        "summary": "Brief summary of results",
        "extracted": {
          "item": "Extracted item (if applicable)",
          "priorities": ["Priority 1", "Priority 2"],
          "cuisine": "Cuisine type (if applicable)"
        },
        "serviceCategory": "Detected service category"
      }
    `;

    try {
      console.log("Sending request to Gemini API");
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        console.error(`Gemini API error: ${response.status} ${response.statusText}`);
        
        // Try to get error details
        let errorMessage = "Unknown error";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || "Unknown error";
          console.error("Gemini API error details:", errorData);
        } catch (e) {
          console.error("Could not parse error response", e);
        }
        
        // Return fallback results
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            results: getMockResults(serviceType, query),
            suggestions: getMockSuggestions(serviceType, query),
            summary: `Demo results (API error: ${errorMessage})` 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("Received response from Gemini API");
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error("No response from Gemini API");
        return new Response(
          JSON.stringify({ 
            results: getMockResults(serviceType, query),
            suggestions: getMockSuggestions(serviceType, query),
            summary: "Demo results (No API response)" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract the JSON response from the text
      const textResponse = data.candidates[0].content.parts[0].text;
      let parsedResponse;
      
      try {
        // Try to extract a JSON object from the response text
        console.log("Attempting to parse Gemini response");
        
        let jsonString = textResponse;
        
        // Check if the response is wrapped in markdown code blocks
        const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        } 
        // If not in code blocks, try to find JSON object directly
        else {
          const objectMatch = textResponse.match(/{[\s\S]*}/);
          if (objectMatch) {
            jsonString = objectMatch[0];
          }
        }
        
        // Parse the JSON string
        parsedResponse = JSON.parse(jsonString);
        
        console.log("Successfully parsed Gemini response");
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
        console.log("Raw response:", textResponse);
        
        // Fallback - return mock data
        parsedResponse = {
          results: getMockResults(serviceType, query),
          suggestions: getMockSuggestions(serviceType, query),
          summary: "Demo results (Failed to parse API response)"
        };
      }

      // Ensure the response has the expected structure
      if (!parsedResponse.results) {
        parsedResponse.results = getMockResults(serviceType, query);
      }
      if (!parsedResponse.suggestions) {
        parsedResponse.suggestions = getMockSuggestions(serviceType, query);
      }
      if (!parsedResponse.summary) {
        parsedResponse.summary = "Results for your search";
      }

      return new Response(
        JSON.stringify(parsedResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      console.error("Error fetching from Gemini API:", fetchError);
      // Return fallback results with 200 status code
      return new Response(
        JSON.stringify({ 
          error: fetchError.message,
          results: getMockResults(serviceType, query),
          suggestions: getMockSuggestions(serviceType, query),
          summary: "Demo results (Connection error)" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in gemini-search function:", error);
    // Even for general errors, return a 200 with fallback content
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during the search",
        results: [
          {
            title: "Error",
            description: error.message || "An error occurred during the search",
            provider: "System",
            price: "N/A",
            rating: "N/A",
            eta: "N/A"
          }
        ],
        suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
        summary: "An error occurred. Showing default results."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Mock results function for fallback when API is unavailable
function getMockResults(serviceType, query) {
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
function getMockSuggestions(serviceType, query) {
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
