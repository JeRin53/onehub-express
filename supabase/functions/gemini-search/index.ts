
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
          results: [],
          suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
          summary: "Could not connect to AI service. Showing default results." 
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
      You are a helpful assistant for the ONEHUB app that aggregates various services.
      User is searching for: "${query}" in the service category: "${serviceType || 'general'}".
      ${locationContext}
      Provide concise, relevant information about their query.
      
      For a food delivery search like "I want to order biriyani, fast and cheap", extract:
      - The food item (biriyani)
      - User priorities (fast delivery, cheap price)
      - Relevant cuisine types (Indian)
      
      If this is a food delivery search, suggest restaurants, dishes, or cuisines.
      If this is a cab booking search, suggest route options, fare estimates, or cab types.
      If this is a hotel reservation search, suggest hotels, features, or locations.
      If this is a fuel delivery search, provide information about fuel types, prices, or delivery options.
      If this is a train booking search, suggest train routes, timings, or classes.
      
      Format the response as a JSON object with the following structure:
      {
        "results": [
          {
            "title": "Result title",
            "description": "Brief description",
            "provider": "Service provider name",
            "price": "Estimated price (if applicable)",
            "rating": "Rating (if applicable)",
            "eta": "Estimated delivery/arrival time"
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
        // Return fallback results with 200 status code
        return new Response(
          JSON.stringify({ 
            results: [],
            suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
            summary: "Could not process your search request. Showing default results." 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error("No response from Gemini API");
        // Return fallback results with 200 status code
        return new Response(
          JSON.stringify({ 
            results: [],
            suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
            summary: "Could not process your search request. Showing default results." 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract the JSON response from the text
      const textResponse = data.candidates[0].content.parts[0].text;
      let parsedResponse;
      
      try {
        // Try to extract a JSON object from the response text
        const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                          textResponse.match(/{[\s\S]*}/);
                          
        const jsonString = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : textResponse;
        parsedResponse = JSON.parse(jsonString.replace(/\n/g, ''));
        
        console.log("Successfully parsed Gemini response");
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
        // Fallback if parsing fails - but still return 200
        parsedResponse = {
          results: [],
          suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
          summary: "Could not parse search results. Please try a different search query."
        };
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
          results: [],
          suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
          summary: "Could not connect to AI service. Showing default results." 
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
        results: [],
        suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
        summary: "An error occurred. Showing default results."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
