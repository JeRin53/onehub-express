
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
    const { query, serviceType } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing Gemini search for: "${query}" in service: ${serviceType}`);

    const prompt = `
      You are a helpful assistant for the ONEHUB app that aggregates various services.
      User is searching for: "${query}" in the service category: "${serviceType || 'general'}".
      Provide concise, relevant information about their query.
      
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
            "rating": "Rating (if applicable)"
          }
        ],
        "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
        "summary": "Brief summary of results"
      }
    `;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY!,
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

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
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
    } catch (e) {
      console.error("Error parsing JSON from Gemini response:", e);
      // Fallback if parsing fails
      parsedResponse = {
        results: [],
        suggestions: [],
        summary: "Could not parse search results. Please try a different search query."
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in gemini-search function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during the search" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
