
// Main entry point for the Gemini search edge function

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processGeminiSearch } from "./handlers.ts";
import { SearchRequestData } from "./types.ts";

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
    const requestData: SearchRequestData = await req.json();
    const { query, serviceType, location } = requestData;
    
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

    // Process the search request
    const searchResponse = await processGeminiSearch(query, serviceType, location);

    return new Response(
      JSON.stringify(searchResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
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
            distance: "N/A",
            image: "https://via.placeholder.com/300x200?text=Error"
          }
        ],
        suggestions: ["Pizza delivery", "Vegetarian restaurants", "Cheap food near me"],
        summary: "An error occurred. Showing default results."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
