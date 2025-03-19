
// Request handlers and core search logic

import { LocationData } from "./types.ts";
import { getMockResults, getMockSuggestions } from "./mockData.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// Process search request with Gemini API
export async function processGeminiSearch(
  query: string,
  serviceType: string,
  location: LocationData | null
) {
  console.log(`Processing Gemini search for: "${query}" in service: ${serviceType}`);
  console.log(`User location data: ${location ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : 'Not provided'}`);

  // Check if we have a valid API key
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return {
      results: getMockResults(serviceType, query),
      suggestions: getMockSuggestions(serviceType, query),
      summary: "Using demo results (API key not configured)"
    };
  }

  // Build location-aware prompt
  let locationContext = "";
  if (location) {
    locationContext = `The user is located at latitude ${location.latitude} and longitude ${location.longitude}. Consider this for delivery time estimates and proximity.`;
  }

  const prompt = `
    You are an intelligent assistant for a service aggregator platform called ONEHUB.
    User is searching for: "${query}" in the service category: "${serviceType || 'general'}".
    ${locationContext}
    
    Instructions:
    1. Users may search for food items (like biriyani), hotels, cab services, or other services.
    2. Provide concise, relevant information about their query.
    3. Extract the main intent, priorities, and preferences from their query.
    
    For a food delivery search like "I want to order biriyani, fast and cheap", extract:
    - The food item (biriyani)
    - User priorities (fast delivery, cheap price)
    - Relevant cuisine types (Indian)
    
    Format the response as a JSON object with the following structure:
    {
      "results": [
        {
          "title": "Result title (restaurant, hotel, or service name)",
          "description": "Brief description",
          "provider": "Service provider name",
          "price": "Estimated price (if applicable)",
          "rating": "Rating (if applicable)",
          "eta": "Estimated delivery/arrival time",
          "image": "URL to an image if applicable (or leave empty)"
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
      
      // Return fallback results
      return {
        error: errorMessage,
        results: getMockResults(serviceType, query),
        suggestions: getMockSuggestions(serviceType, query),
        summary: `Demo results (API error: ${errorMessage})`
      };
    }

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No response from Gemini API");
      return {
        results: getMockResults(serviceType, query),
        suggestions: getMockSuggestions(serviceType, query),
        summary: "Demo results (No API response)"
      };
    }

    // Extract the JSON response from the text
    return parseGeminiResponse(data, serviceType, query);
  } catch (fetchError) {
    console.error("Error fetching from Gemini API:", fetchError);
    // Return fallback results
    return {
      error: fetchError.message,
      results: getMockResults(serviceType, query),
      suggestions: getMockSuggestions(serviceType, query),
      summary: "Demo results (Connection error)"
    };
  }
}

// Parse Gemini API response
function parseGeminiResponse(data: any, serviceType: string, query: string) {
  try {
    // Try to extract a JSON object from the response text
    console.log("Attempting to parse Gemini response");
    const textResponse = data.candidates[0].content.parts[0].text;
    
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
    const parsedResponse = JSON.parse(jsonString);
    
    console.log("Successfully parsed Gemini response");

    // Ensure the response has the expected structure
    if (!parsedResponse.results) {
      parsedResponse.results = getMockResults(serviceType, query);
    }
    if (!parsedResponse.suggestions) {
      parsedResponse.suggestions = getMockSuggestions(serviceType, query);
    }
    if (!parsedResponse.summary) {
      parsedResponse.summary = "Results for your search";
    }

    return parsedResponse;
  } catch (e) {
    console.error("Error parsing JSON from Gemini response:", e);
    
    // Fallback - return mock data
    return {
      results: getMockResults(serviceType, query),
      suggestions: getMockSuggestions(serviceType, query),
      summary: "Demo results (Failed to parse API response)"
    };
  }
}
