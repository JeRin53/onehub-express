
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

    // Create a Supabase client with the user's JWT token
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { recommendationType } = await req.json();
    
    if (!recommendationType) {
      return new Response(
        JSON.stringify({ error: 'Recommendation type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating OpenAI recommendations for: ${recommendationType}`);

    // Get the user information from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user data from the database
    const { data: userData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    // Get user preferences from the database
    const { data: preferencesData, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (preferencesError) {
      console.error("Error fetching user preferences:", preferencesError);
    }

    // Get user search history from the database
    const { data: searchHistory, error: searchError } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(10);
      
    if (searchError) {
      console.error("Error fetching search history:", searchError);
    }

    // Get user bookings from the database
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
    }

    // Construct a prompt for OpenAI based on user data
    const userContext = {
      profile: userData || {},
      preferences: preferencesData || {},
      searchHistory: searchHistory || [],
      bookings: bookings || [],
    };

    let prompt = '';
    
    switch (recommendationType) {
      case 'restaurants':
        prompt = `Based on this user's data, recommend 5 restaurants they might like. User data: ${JSON.stringify(userContext)}`;
        break;
      case 'hotels':
        prompt = `Based on this user's data, recommend 5 hotels they might like. User data: ${JSON.stringify(userContext)}`;
        break;
      case 'cabs':
        prompt = `Based on this user's data, recommend 5 cab routes or services they might use. User data: ${JSON.stringify(userContext)}`;
        break;
      case 'general':
      default:
        prompt = `Based on this user's data, provide 5 personalized recommendations across all services (food, cabs, hotels, etc). User data: ${JSON.stringify(userContext)}`;
        break;
    }

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a personalization AI for the ONEHUB app, which aggregates various services like food delivery, cab booking, hotels, etc. Provide recommendations based on user data in JSON format only. For recommendations with no data, provide sensible defaults.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    const data = await openAIResponse.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }

    // Parse the JSON response
    const recommendationsText = data.choices[0].message.content;
    let recommendations;
    
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (e) {
      console.error("Error parsing JSON from OpenAI response:", e);
      recommendations = {
        recommendations: [],
        message: "Could not generate personalized recommendations. Please try again later."
      };
    }

    // Store this interaction in the database
    const { error: insertError } = await supabase
      .from('search_history')
      .insert([
        { 
          user_id: user.id, 
          query: `AI Recommendations: ${recommendationType}`,
          service_type: recommendationType
        }
      ]);
      
    if (insertError) {
      console.error("Error storing search interaction:", insertError);
    }

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in openai-recommendations function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during recommendation generation" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
