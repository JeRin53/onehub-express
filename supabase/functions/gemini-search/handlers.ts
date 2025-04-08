
// Handler functions for the Gemini search edge function

import { SearchRequestData, SearchResponse, LocationData, SearchResult } from "./types.ts";

// Use the API key from environment variables or the provided key
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "AIzaSyCn3S7J6-bYyzLsRqu3OMXqlw-9FJf8Pvc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function processGeminiSearch(
  query: string,
  serviceType: string,
  location: LocationData | string | null
): Promise<SearchResponse> {
  console.log(`Processing search for "${query}" in category "${serviceType}"`);
  console.log(`Location data:`, location);
  
  try {
    // Format location as string for the prompt if it's an object
    let locationText = "";
    if (location) {
      if (typeof location === "string") {
        locationText = `User's location: ${location}`;
      } else if (location.latitude && location.longitude) {
        locationText = `User's location: Latitude ${location.latitude}, Longitude ${location.longitude}`;
      } else if (location.address) {
        locationText = `User's location: ${location.address}`;
      }
    }

    // Create the prompt for Gemini
    const prompt = `
You are an AI assistant for a food delivery platform. The user is searching for: "${query}".
${locationText ? locationText + "." : ""}

Based on this search query, generate a response in the following JSON format:
{
  "results": [
    {
      "title": "Restaurant or Food Item Name",
      "description": "Brief description of the restaurant or food item",
      "provider": "Swiggy or Zomato or another delivery provider",
      "price": "Price range or specific price",
      "rating": "Rating out of 5",
      "distance": "Distance from user's location",
      "image": "A description of what the food/restaurant looks like for image generation"
    },
    // Include 3-5 relevant results
  ],
  "suggestions": [
    // 3-5 related search queries the user might be interested in
  ],
  "summary": "A one-sentence summary of the search results"
}

Keep the response strictly in this JSON format without any additional text. Make the results realistic and appropriate for ${serviceType} delivery services in India, with reasonable prices, ratings, and distances. For the image field, provide detailed descriptions that could be used to generate an image of the food item or restaurant.
`;

    // Call Gemini API
    console.log("Calling Gemini API with prompt:", prompt);
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          temperature: 0.7,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      throw new Error("Invalid response format from Gemini API");
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log("Gemini response:", responseText);
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/);
                      
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsedResponse = JSON.parse(jsonText.trim());

    // Process the results to add generated images
    const resultsWithImages = await Promise.all(parsedResponse.results.map(async (result: any, index: number) => {
      // Generate image URL for each result
      const imageUrl = await generateFoodImage(result.image || result.title);
      
      return {
        ...result,
        // Replace the image description with actual image URL
        image: imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(result.title)}`
      };
    }));

    return {
      results: resultsWithImages,
      suggestions: parsedResponse.suggestions || [],
      summary: parsedResponse.summary || "Here are some food delivery options based on your search."
    };
  } catch (error) {
    console.error("Error processing search:", error);
    
    // Generate fallback results
    return generateFallbackResults(query, serviceType);
  }
}

async function generateFoodImage(description: string): Promise<string> {
  try {
    // Try to generate an image with Gemini
    // Note: This is using the image generation functionality
    // In a real implementation, we would use a proper image generation service
    
    // For now, we're returning placeholder images
    const placeholders = [
      "https://via.placeholder.com/300x200?text=Delicious+Food",
      "https://via.placeholder.com/300x200?text=Restaurant",
      "https://via.placeholder.com/300x200?text=Meal",
      "https://via.placeholder.com/300x200?text=Cuisine",
      "https://via.placeholder.com/300x200?text=Tasty"
    ];
    
    return placeholders[Math.floor(Math.random() * placeholders.length)];
    
    // In a production scenario, you would call an image generation API here
    // const response = await fetch("IMAGE_GENERATION_API_URL", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ prompt: description }),
    // });
    // const data = await response.json();
    // return data.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    return `https://via.placeholder.com/300x200?text=${encodeURIComponent(description)}`;
  }
}

function generateFallbackResults(query: string, serviceType: string): SearchResponse {
  return {
    results: [
      {
        title: "Spice Junction",
        description: `Popular restaurant for ${query}`,
        provider: "Swiggy",
        price: "₹200 - ₹400",
        rating: "4.3",
        distance: "2.5 km",
        image: "https://via.placeholder.com/300x200?text=Spice+Junction"
      },
      {
        title: "Food Paradise",
        description: `Best selling ${query} in town`,
        provider: "Zomato",
        price: "₹150 - ₹350",
        rating: "4.1",
        distance: "3.2 km",
        image: "https://via.placeholder.com/300x200?text=Food+Paradise"
      },
      {
        title: "Delicious Corner",
        description: `Authentic ${query} with great taste`,
        provider: "Swiggy",
        price: "₹250 - ₹450",
        rating: "4.4",
        distance: "1.8 km",
        image: "https://via.placeholder.com/300x200?text=Delicious+Corner"
      }
    ],
    suggestions: [
      `Best ${query} nearby`,
      `Cheap ${query} delivery`,
      `${query} with free delivery`,
      `Top rated ${query} restaurants`,
      `${query} under ₹300`
    ],
    summary: `Here are some results for "${query}" you might like to try.`,
    error: "Could not process with Gemini API, showing fallback results"
  };
}
