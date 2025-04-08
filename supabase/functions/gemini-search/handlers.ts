
// Handler functions for the Gemini search edge function

import { SearchRequestData, SearchResponse, LocationData, SearchResult, ExtractedData } from "./types.ts";

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

    // Detect food items, cuisine types, and priorities from query
    const foodItems = query.match(/pizza|burger|biryani|pasta|chinese|indian|italian|thai|sushi|sandwich|salad|cake|ice cream|coffee/gi);
    const priorities = query.match(/cheap|affordable|quick|fast|best|top|nearest|healthy|spicy|vegetarian|vegan/gi);
    const cuisineType = query.match(/chinese|indian|italian|thai|mexican|continental/gi)?.[0] || "";
    
    // Prepare a more specific prompt based on detected food items
    let specificPrompt = "";
    if (foodItems && foodItems.length > 0) {
      specificPrompt = `The user is specifically looking for ${foodItems.join(", ")}. `;
      if (priorities && priorities.length > 0) {
        specificPrompt += `They prioritize ${priorities.join(", ")}. `;
      }
      if (cuisineType) {
        specificPrompt += `They prefer ${cuisineType} cuisine. `;
      }
    }

    // Create the prompt for Gemini with more specific food-related instructions
    const prompt = `
You are an AI assistant for a food delivery platform in India. The user is searching for: "${query}".
${locationText ? locationText + "." : ""}
${specificPrompt}

Based on this search query, generate a detailed response in the following JSON format:
{
  "results": [
    {
      "title": "Restaurant or Food Item Name",
      "description": "Brief description of the restaurant or food item",
      "provider": "Swiggy or Zomato or another delivery provider",
      "price": "Price range or specific price",
      "rating": "Rating out of 5",
      "distance": "Distance from user's location",
      "image": "A detailed vivid description of what the food/restaurant looks like for image generation"
    },
    // Include 4-5 relevant results
  ],
  "suggestions": [
    // 5 related search queries the user might be interested in
  ],
  "summary": "A one-sentence summary of the search results",
  "extracted": {
    "item": "${foodItems ? foodItems[0] : ""}",
    "priorities": ${JSON.stringify(priorities || [])},
    "cuisine": "${cuisineType || ""}"
  }
}

Make sure the response is strictly in this JSON format. Make the results realistic for food delivery services in India with appropriate prices (in ₹), ratings (out of 5), and distances (in km). For the image field, provide very detailed descriptions of what the food items or restaurant looks like - this will be used to generate realistic images.
`;

    // Call Gemini API
    console.log("Calling Gemini API with prompt");
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
      // Generate image URL for each result based on the image description
      const imageUrl = await generateFoodImage(result.title, result.image);
      
      return {
        ...result,
        // Replace the image description with actual image URL
        image: imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(result.title)}`
      };
    }));

    // Make sure we have valid extracted data
    const extracted: ExtractedData = {
      item: parsedResponse.extracted?.item || foodItems?.[0] || "",
      priorities: parsedResponse.extracted?.priorities || priorities || [],
      cuisine: parsedResponse.extracted?.cuisine || cuisineType || ""
    };

    return {
      results: resultsWithImages,
      suggestions: parsedResponse.suggestions || [],
      summary: parsedResponse.summary || "Here are some food delivery options based on your search.",
      extracted
    };
  } catch (error) {
    console.error("Error processing search:", error);
    
    // Generate fallback results based on the query
    return generateFallbackResults(query, serviceType);
  }
}

async function generateFoodImage(title: string, description: string): Promise<string> {
  try {
    // Use Gemini to generate an image based on the description
    const imagePrompt = `Generate a realistic photo of ${title}. ${description}. Make it look like a professional food photograph.`;
    console.log("Generating image with prompt:", imagePrompt);
    
    // Call a separate Gemini endpoint to generate an image
    // In this implementation, we'll use pre-defined food images
    // In a production environment, you would integrate with an image generation API
    
    const foodImages = [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=480&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=480&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=480&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=480&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=480&auto=format&fit=crop"
    ];
    
    // For food items, use more deterministic selection
    const specificFoodMap: Record<string, string> = {
      'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=480&auto=format&fit=crop',
      'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=480&auto=format&fit=crop',
      'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=480&auto=format&fit=crop',
      'pasta': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=480&auto=format&fit=crop',
      'dosa': 'https://images.unsplash.com/photo-1610192244261-3f33de3f24a9?q=80&w=480&auto=format&fit=crop',
      'noodles': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=480&auto=format&fit=crop',
      'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=480&auto=format&fit=crop',
    };
    
    // Check if the title contains any specific food keywords
    const lowerTitle = title.toLowerCase();
    for (const [food, url] of Object.entries(specificFoodMap)) {
      if (lowerTitle.includes(food)) {
        return url;
      }
    }
    
    // If no specific food matched, use hash-based selection
    const hash = title.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const index = hash % foodImages.length;
    
    return foodImages[index];
  } catch (error) {
    console.error("Error generating image:", error);
    return `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`;
  }
}

function generateFallbackResults(query: string, serviceType: string): SearchResponse {
  const foodType = query.match(/pizza|burger|biryani|pasta|chinese|indian|italian|thai|sushi|sandwich|salad|cake|ice cream|coffee/i)?.[0] || "food";
  
  return {
    results: [
      {
        title: `Best ${foodType} Place`,
        description: `Popular restaurant for ${foodType}`,
        provider: "Swiggy",
        price: "₹200 - ₹400",
        rating: "4.3",
        distance: "2.5 km",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=480&auto=format&fit=crop"
      },
      {
        title: `${foodType} Paradise`,
        description: `Best selling ${foodType} in town`,
        provider: "Zomato",
        price: "₹150 - ₹350",
        rating: "4.1",
        distance: "3.2 km",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=480&auto=format&fit=crop"
      },
      {
        title: `${foodType} Express`,
        description: `Authentic ${foodType} with great taste`,
        provider: "Swiggy",
        price: "₹250 - ₹450",
        rating: "4.4",
        distance: "1.8 km",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=480&auto=format&fit=crop"
      }
    ],
    suggestions: [
      `Best ${foodType} nearby`,
      `Cheap ${foodType} delivery`,
      `${foodType} with free delivery`,
      `Top rated ${foodType} restaurants`,
      `${foodType} under ₹300`
    ],
    summary: `Here are some results for "${query}" you might like to try.`,
    extracted: {
      item: foodType,
      priorities: [],
      cuisine: ""
    },
    error: "Could not process with Gemini API, showing fallback results"
  };
}
