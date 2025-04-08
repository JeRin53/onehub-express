
// Main entry point for the Gemini recommendations edge function

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || "AIzaSyCn3S7J6-bYyzLsRqu3OMXqlw-9FJf8Pvc";
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create a Supabase client with the user's JWT
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the user from the token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Error getting user: ' + (userError?.message || 'User not found'));
    }

    // Get data about the recommendation type from the request
    const { recommendationType = 'general' } = await req.json();

    // Get the user's search history
    const { data: searchHistory, error: searchError } = await supabaseClient
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (searchError) {
      console.error('Error fetching search history:', searchError);
      // Continue with default recommendations
    }

    // Generate a summary of the user's interests based on search history
    let userInterests = "The user has no search history yet.";
    
    if (searchHistory && searchHistory.length > 0) {
      const queries = searchHistory.map(item => item.query).join(", ");
      const serviceTypes = [...new Set(searchHistory.map(item => item.service_type))].join(", ");
      
      userInterests = `The user has searched for: ${queries}. Service types they're interested in: ${serviceTypes}.`;
    }

    // Create a prompt based on recommendation type
    let prompt = "";
    
    switch (recommendationType) {
      case 'restaurants':
      case 'food':
        prompt = `You are a restaurant and food recommendation system. Based on the following user information, provide 5 personalized restaurant recommendations with details:
User info: ${userInterests}
Format your response as a JSON array with objects having these fields: name, cuisine, description, price (₹), rating (1-5), location.`;
        break;
      case 'hotels':
        prompt = `You are a hotel recommendation system. Based on the following user information, provide 5 personalized hotel recommendations with details:
User info: ${userInterests}
Format your response as a JSON array with objects having these fields: name, description, amenities, price (₹/night), rating (1-5), location.`;
        break;
      case 'cabs':
        prompt = `You are a cab and transportation recommendation system. Based on the following user information, provide 5 personalized cab service recommendations with details:
User info: ${userInterests}
Format your response as a JSON array with objects having these fields: name, type (economy/premium/etc), description, price (₹), rating (1-5).`;
        break;
      default:
        prompt = `You are a recommendation system for a service aggregator platform. Based on the following user information, provide 5 personalized recommendations with details:
User info: ${userInterests}
Format your response as a JSON array with objects having these fields: name, type (restaurant/hotel/cab/etc), description, price, rating (1-5), location.`;
    }

    console.log("Calling Gemini API for recommendations");

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a recommendation system for a service aggregator platform called Onehub Express. ${prompt}
Make your recommendations realistic for Indian cities. Focus on providing detailed and personalized recommendations based on the user's history.
Keep your response STRICTLY as a JSON array with no additional text or explanations.
[
  {
    "name": "Example Restaurant",
    "description": "Brief description",
    "price": "₹200 - ₹400",
    "rating": "4.5",
    "location": "Location"
  }
]`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini");
    }

    // Parse the recommendations from the response
    const content = data.candidates[0].content.parts[0].text;
    let recommendations = [];
    
    try {
      // Try to extract JSON from the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else if (content.includes('{') && content.includes('}')) {
        // If we didn't find an array but found objects, try to extract them
        const jsonObjects = content.match(/{[\s\S]*?}/g);
        if (jsonObjects) {
          recommendations = jsonObjects.map(obj => {
            try {
              return JSON.parse(obj);
            } catch (e) {
              console.warn("Failed to parse JSON object:", obj);
              return null;
            }
          }).filter(obj => obj !== null);
        }
      }
    } catch (error) {
      console.error("Error parsing recommendations:", error);
      console.log("Content:", content);
      
      // Fallback to sending the raw content
      recommendations = [
        { name: "Failed to parse recommendations", description: "Please try again later", error: error.message }
      ];
    }

    // If we still don't have valid recommendations, create a fallback
    if (!recommendations || recommendations.length === 0) {
      console.warn("Using fallback recommendations");
      
      // Create fallback recommendations based on type
      switch (recommendationType) {
        case 'restaurants':
        case 'food':
          recommendations = [
            { name: "Spice Junction", cuisine: "Indian", description: "Authentic Indian cuisine with a wide variety of spicy dishes", price: "₹500", rating: 4.5, location: "MG Road" },
            { name: "Green Leaf", cuisine: "Vegetarian", description: "Healthy vegetarian food with farm-fresh ingredients", price: "₹350", rating: 4.2, location: "Koramangala" }
          ];
          break;
        case 'hotels':
          recommendations = [
            { name: "Grand Luxury Hotel", description: "5-star accommodation with premium amenities", amenities: "Pool, Spa, Gym", price: "₹8,000/night", rating: 4.8, location: "City Center" },
            { name: "Comfort Inn", description: "Budget-friendly hotel with comfortable rooms", amenities: "Free WiFi, Breakfast", price: "₹2,500/night", rating: 4.0, location: "Near Airport" }
          ];
          break;
        case 'cabs':
          recommendations = [
            { name: "Premium Ride", type: "Luxury", description: "Comfortable ride with professional drivers", price: "₹300/km", rating: 4.6 },
            { name: "Quick Cab", type: "Economy", description: "Affordable and quick transportation", price: "₹150/km", rating: 4.2 }
          ];
          break;
        default:
          recommendations = [
            { name: "Popular Restaurant", type: "Food", description: "Highly rated dining experience", price: "₹500", rating: 4.5, location: "City Center" },
            { name: "Budget Hotel", type: "Accommodation", description: "Affordable stay with basic amenities", price: "₹2,000/night", rating: 4.0, location: "Near Station" }
          ];
      }
    }

    const message = searchHistory && searchHistory.length > 0
      ? "Based on your search history"
      : "Personalized recommendations for you";

    return new Response(
      JSON.stringify({
        recommendations,
        message,
        timestamp: new Date().toISOString(),
        type: recommendationType
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in gemini-recommendations function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while generating recommendations",
        recommendations: [],
        message: "Failed to generate recommendations. Please try again later."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
