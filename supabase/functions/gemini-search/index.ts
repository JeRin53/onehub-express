
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
          results: [
            {
              title: "API Key Missing",
              description: "Gemini API key is not configured. Please set up the API key in Supabase secrets.",
              provider: "System",
              price: "N/A",
              rating: "N/A",
              eta: "N/A"
            }
          ],
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
        
        // Return fallback results with 200 status code
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            results: [
              {
                title: "API Error",
                description: `Could not process your search request: ${errorMessage}`,
                provider: "System",
                price: "N/A",
                rating: "N/A",
                eta: "N/A"
              }
            ],
            suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
            summary: "Could not process your search request. Showing default results." 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("Received response from Gemini API");
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error("No response from Gemini API");
        // Return fallback results with 200 status code
        return new Response(
          JSON.stringify({ 
            results: [
              {
                title: "No Results",
                description: "Could not generate results for your query",
                provider: "System",
                price: "N/A",
                rating: "N/A",
                eta: "N/A"
              }
            ],
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
        
        // Try a more aggressive approach to extract JSON
        try {
          // Find anything that looks like a JSON object
          const possibleJson = textResponse.match(/{[\s\S]*}/);
          if (possibleJson) {
            // Clean up the string by removing extra whitespace and newlines
            const cleanedJson = possibleJson[0].replace(/\s+/g, ' ');
            parsedResponse = JSON.parse(cleanedJson);
            console.log("Parsed JSON with aggressive approach");
          } else {
            throw new Error("No JSON object found in response");
          }
        } catch (fallbackError) {
          console.error("Fallback parsing failed:", fallbackError);
          
          // Fallback if parsing fails - but still return 200
          parsedResponse = {
            results: [
              {
                title: "Search Results",
                description: "We found some results based on your query",
                provider: "System",
                price: "Various",
                rating: "N/A",
                eta: "N/A"
              }
            ],
            suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
            summary: "Could not parse search results. Please try a different search query."
          };
        }
      }

      // Ensure the response has the expected structure
      if (!parsedResponse.results) {
        parsedResponse.results = [];
      }
      if (!parsedResponse.suggestions) {
        parsedResponse.suggestions = [];
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
          results: [
            {
              title: "Connection Error",
              description: "Could not connect to search service",
              provider: "System",
              price: "N/A",
              rating: "N/A",
              eta: "N/A"
            }
          ],
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
