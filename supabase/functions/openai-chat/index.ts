
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

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
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the request body
    const { messages, serviceType = 'general' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    console.log(`Processing chat request for service type: ${serviceType}`);
    console.log(`Message history length: ${messages.length}`);

    // Create system message based on service type
    let systemMessage = "You are a helpful assistant for the ONEHUB app.";
    
    switch (serviceType) {
      case 'food-delivery':
        systemMessage = "You are a food delivery assistant for ONEHUB. Help users find restaurants, recommend dishes, and provide information about food delivery services.";
        break;
      case 'cab-booking':
        systemMessage = "You are a cab booking assistant for ONEHUB. Help users book rides, estimate fares, and provide information about transportation options.";
        break;
      case 'hotel-reservation':
        systemMessage = "You are a hotel reservation assistant for ONEHUB. Help users find accommodations, compare prices, and provide information about hotels and resorts.";
        break;
      case 'fuel-delivery':
        systemMessage = "You are a fuel delivery assistant for ONEHUB. Help users order fuel, find gas stations, and provide information about fuel prices and types.";
        break;
      case 'train-booking':
        systemMessage = "You are a train booking assistant for ONEHUB. Help users find train routes, check schedules, and provide information about train tickets and services.";
        break;
      default:
        systemMessage = "You are a helpful assistant for the ONEHUB app. Provide information about various services integrated in our platform, including food delivery, cab booking, hotel reservations, fuel delivery, and train booking.";
    }

    // Add system message if not already present
    const allMessages = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system', content: systemMessage }, ...messages];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from OpenAI API");
    }

    // Return the assistant's message
    return new Response(
      JSON.stringify({ 
        message: data.choices[0].message,
        usage: data.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in openai-chat function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during chat processing",
        message: {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again later."
        }
      }),
      { 
        status: 200, // Still return 200 to avoid breaking the frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
