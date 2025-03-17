
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

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

    const { messages, serviceType } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing OpenAI chat for service: ${serviceType}`);

    // Create a Supabase client with the user's JWT token
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the user information from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user data from the database for context
    const { data: userData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    // Determine the system message based on the service type
    let systemMessage = `You are a helpful assistant for the ONEHUB app. `;
    
    switch (serviceType) {
      case 'food-delivery':
        systemMessage += `You specialize in food delivery assistance. Help users find restaurants, order food, and provide information about cuisines, dishes, and food-related queries.`;
        break;
      case 'cab-booking':
        systemMessage += `You specialize in cab booking assistance. Help users find rides, estimate fares, and provide information about routes, cab types, and transportation-related queries.`;
        break;
      case 'hotel-reservation':
        systemMessage += `You specialize in hotel reservation assistance. Help users find accommodations, check availability, and provide information about hotels, amenities, and lodging-related queries.`;
        break;
      case 'fuel-delivery':
        systemMessage += `You specialize in fuel delivery assistance. Help users order fuel, check prices, and provide information about fuel types and delivery-related queries.`;
        break;
      case 'train-booking':
        systemMessage += `You specialize in train booking assistance. Help users find train routes, check schedules, and provide information about trains, classes, and travel-related queries.`;
        break;
      default:
        systemMessage += `Provide helpful information about services offered by ONEHUB including food delivery, cab booking, hotels, fuel delivery, and train bookings.`;
        break;
    }
    
    // Add user context if available
    if (userData) {
      systemMessage += ` The user's name is ${userData.first_name || 'unknown'}.`;
    }

    // Prepare messages for OpenAI API
    const fullMessages = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: fullMessages,
        temperature: 0.7,
      }),
    });

    const data = await openAIResponse.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }

    // Store this interaction in the database if it's a user message
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      const { error: insertError } = await supabase
        .from('search_history')
        .insert([
          { 
            user_id: user.id, 
            query: messages[messages.length - 1].content,
            service_type: serviceType || 'general'
          }
        ]);
        
      if (insertError) {
        console.error("Error storing chat interaction:", insertError);
      }
    }

    return new Response(
      JSON.stringify({ message: data.choices[0].message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in openai-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during the chat" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
