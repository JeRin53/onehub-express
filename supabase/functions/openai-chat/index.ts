
// Main entry point for the OpenAI chat edge function

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { messages, serviceType } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Generate system prompt based on service type
    let systemPrompt = "You are a helpful assistant for Onehub Express, a service aggregator platform.";
    
    switch (serviceType) {
      case 'food-delivery':
        systemPrompt += " You specialize in food delivery services, restaurants, cuisines, and dining experiences. You can help users find food options, explore cuisines, and answer food-related questions.";
        break;
      case 'cab-booking':
        systemPrompt += " You specialize in transportation services, cab bookings, and commuting options. You can help users find rides, estimate fares, and answer transportation-related questions.";
        break;
      case 'hotel-reservation':
        systemPrompt += " You specialize in accommodation services, hotel bookings, and lodging options. You can help users find places to stay, check amenities, and answer hotel-related questions.";
        break;
      case 'fuel-delivery':
        systemPrompt += " You specialize in fuel delivery services, fuel types, and vehicle refueling. You can help users order fuel, check prices, and answer fuel-related questions.";
        break;
      case 'train-booking':
        systemPrompt += " You specialize in train travel, ticket bookings, and railway services. You can help users find train routes, check schedules, and answer train-related questions.";
        break;
      default:
        systemPrompt += " You can provide general information about various services including food delivery, transportation, accommodation, and more.";
    }

    // Prepare messages for the API call
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    console.log("Calling OpenAI API with messages:", JSON.stringify(apiMessages));

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a current model that's fast and cost-effective
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("OpenAI API response:", JSON.stringify(data));

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    return new Response(
      JSON.stringify({
        message: data.choices[0].message,
        usage: data.usage
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in openai-chat function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your request",
        message: {
          role: "assistant",
          content: "I'm sorry, I couldn't process your request. Please try again later."
        }
      }),
      { 
        status: 200, // Keeping 200 to not break frontend
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
