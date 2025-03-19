
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
    const { recommendationType = "general" } = await req.json();
    console.log(`Processing recommendations for type: ${recommendationType}`);

    // If OpenAI API key is not set, return mock data
    if (!OPENAI_API_KEY) {
      console.log("OPENAI_API_KEY not set, returning mock recommendations");
      return new Response(
        JSON.stringify({ 
          recommendations: getMockRecommendations(recommendationType),
          message: "Personalized recommendations for you (demo data)" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the prompt based on the recommendation type
    const systemPrompt = `
      You are an AI assistant for ONEHUB, a service aggregator platform that brings together various services like food delivery, cab bookings, and hotel reservations.
      
      Your task is to generate personalized ${recommendationType === "general" ? "general" : recommendationType} recommendations for the user.
      
      Each recommendation should include:
      - name: The name of the restaurant, hotel, or cab service
      - description: A brief description
      - price: A price range or estimate
      - rating: A rating out of 5
      - location: A location description
      ${recommendationType === "restaurants" ? "- cuisine: Type of cuisine" : ""}
      ${recommendationType === "hotels" ? "- amenities: Key amenities offered" : ""}
      ${recommendationType === "cabs" ? "- vehicleType: Type of vehicle" : ""}
      
      Provide 3-5 recommendations in a JSON array.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate personalized ${recommendationType} recommendations for me.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      
      let errorMessage = "Unknown error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || "Unknown error";
        console.error("OpenAI API error details:", errorData);
      } catch (e) {
        console.error("Could not parse error response", e);
      }
      
      // Return mock recommendations if API fails
      return new Response(
        JSON.stringify({ 
          recommendations: getMockRecommendations(recommendationType),
          message: "Personalized recommendations for you (demo data)",
          error: errorMessage
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error("No response from OpenAI API");
      return new Response(
        JSON.stringify({ 
          recommendations: getMockRecommendations(recommendationType),
          message: "Personalized recommendations for you (demo data)" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JSON from the response
    const responseContent = data.choices[0].message.content;
    let parsedResponse;
    
    try {
      // Try to extract a JSON array from the response text
      console.log("Attempting to parse OpenAI response");
      
      // Check if the response is wrapped in markdown code blocks
      const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      let jsonString = jsonMatch ? jsonMatch[1] : responseContent;
      
      // If we don't have a JSON array directly, try to find it
      if (!jsonString.trim().startsWith('[')) {
        const arrayMatch = jsonString.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          jsonString = arrayMatch[0];
        }
      }
      
      parsedResponse = JSON.parse(jsonString);
      console.log("Successfully parsed OpenAI response");
    } catch (e) {
      console.error("Error parsing JSON from OpenAI response:", e);
      console.log("Raw response:", responseContent);
      
      // Return mock data if parsing fails
      return new Response(
        JSON.stringify({ 
          recommendations: getMockRecommendations(recommendationType),
          message: "Personalized recommendations for you (demo data)" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        recommendations: parsedResponse,
        message: "AI-powered recommendations based on your preferences" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in openai-recommendations function:", error);
    return new Response(
      JSON.stringify({ 
        recommendations: getMockRecommendations("general"),
        message: "Personalized recommendations for you (demo data)",
        error: error.message 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getMockRecommendations(type: string) {
  // Restaurant recommendations
  if (type === "restaurants") {
    return [
      {
        name: "Spice Junction",
        description: "Authentic Indian cuisine with famous biriyani and curry dishes",
        price: "₹200-₹500",
        rating: "4.6",
        location: "MG Road, City Center",
        cuisine: "Indian"
      },
      {
        name: "Pizza Heaven",
        description: "Artisanal pizzas with gourmet toppings and fresh ingredients",
        price: "₹300-₹600",
        rating: "4.4",
        location: "Park Street, Downtown",
        cuisine: "Italian"
      },
      {
        name: "Sushi Express",
        description: "Fresh and authentic Japanese sushi and sashimi",
        price: "₹400-₹800",
        rating: "4.7",
        location: "Lake View Road, Uptown",
        cuisine: "Japanese"
      }
    ];
  }
  // Hotel recommendations
  else if (type === "hotels") {
    return [
      {
        name: "Grand Luxury Hotel",
        description: "5-star hotel with pool, spa, and fine dining",
        price: "₹8,000/night",
        rating: "4.8",
        location: "Beach Road, Coastal Area",
        amenities: "Pool, Spa, Restaurant, Gym"
      },
      {
        name: "Business Inn",
        description: "3-star hotel perfect for business travelers",
        price: "₹3,500/night",
        rating: "4.2",
        location: "Tech Park Road, Business District",
        amenities: "Free Wi-Fi, Conference Rooms, Breakfast"
      },
      {
        name: "Budget Stay",
        description: "Affordable accommodation with basic amenities",
        price: "₹1,200/night",
        rating: "3.8",
        location: "College Road, University Area",
        amenities: "Free Wi-Fi, Air Conditioning, TV"
      }
    ];
  }
  // Cab recommendations
  else if (type === "cabs") {
    return [
      {
        name: "Premium Sedan",
        description: "Comfortable ride for up to 4 passengers",
        price: "₹250 base fare",
        rating: "4.5",
        location: "Available citywide",
        vehicleType: "Sedan"
      },
      {
        name: "Economy Hatchback",
        description: "Affordable ride for up to 3 passengers",
        price: "₹150 base fare",
        rating: "4.3",
        location: "Available citywide",
        vehicleType: "Hatchback"
      },
      {
        name: "Luxury SUV",
        description: "Spacious ride for up to 6 passengers",
        price: "₹350 base fare",
        rating: "4.7",
        location: "Available citywide",
        vehicleType: "SUV"
      }
    ];
  }
  // General recommendations (mix of all)
  else {
    return [
      {
        name: "Spice Junction",
        description: "Authentic Indian cuisine with famous biriyani",
        price: "₹200-₹500",
        rating: "4.6",
        location: "MG Road, City Center"
      },
      {
        name: "Grand Luxury Hotel",
        description: "5-star hotel with pool and spa",
        price: "₹8,000/night",
        rating: "4.8",
        location: "Beach Road, Coastal Area"
      },
      {
        name: "Premium Sedan",
        description: "Comfortable ride for up to 4 passengers",
        price: "₹250 base fare",
        rating: "4.5",
        location: "Available citywide"
      }
    ];
  }
}
