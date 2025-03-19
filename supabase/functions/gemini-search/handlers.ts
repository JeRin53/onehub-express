
import { SearchRequestData, SearchResponse, LocationData } from "./types.ts";
import { generateMockData } from "./mockData.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function processGeminiSearch(
  query: string,
  serviceType: string,
  location: LocationData | null
): Promise<SearchResponse> {
  console.log(`Processing search for "${query}" in category "${serviceType}"`);
  
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return generateMockData(query, serviceType, location, "GEMINI_API_KEY is not set");
  }

  try {
    // Construct the prompt based on the query and service type
    const prompt = createSearchPrompt(query, serviceType, location);
    
    // Call Gemini API
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
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      
      // Return mock data with the error message
      return generateMockData(query, serviceType, location, `Gemini API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    
    console.log("Gemini API response:", JSON.stringify(data));

    // Check if we got a valid response
    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      console.error("Invalid response format from Gemini API");
      return generateMockData(query, serviceType, location, "Invalid response format from Gemini API");
    }

    // Try to parse the response as JSON
    try {
      const responseText = data.candidates[0].content.parts[0].text;
      console.log("Raw response text:", responseText);
      
      // Try to find a JSON object in the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsedResponse = JSON.parse(jsonText.trim());
        
        // Ensure the parsedResponse matches our expected format
        const results = parsedResponse.results || parsedResponse.recommendations || parsedResponse.services || [];
        const suggestions = parsedResponse.suggestions || [];
        const summary = parsedResponse.summary || "Here are the search results for your query.";
        const extracted = parsedResponse.extracted || {};
        const serviceCategory = parsedResponse.serviceCategory || serviceType;
        
        return {
          results: ensureResultsFormat(results),
          suggestions: ensureSuggestionsFormat(suggestions),
          summary,
          extracted,
          serviceCategory,
        };
      } else {
        // If JSON parsing fails, try to extract structured information anyway
        console.warn("Could not find JSON in response, attempting to extract structured data");
        return extractStructuredData(responseText, query, serviceType);
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return generateMockData(query, serviceType, location, `Error parsing Gemini response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error in Gemini search:", error);
    return generateMockData(query, serviceType, location, `Error in Gemini search: ${error.message}`);
  }
}

function createSearchPrompt(query: string, serviceType: string, location: LocationData | null): string {
  let locationText = "";
  if (location) {
    locationText = `User's location: Latitude ${location.latitude}, Longitude ${location.longitude}.\n`;
  }

  let serviceContext = "";
  switch (serviceType) {
    case "food-delivery":
      serviceContext = "The user is looking for food delivery services, restaurants, or food items.";
      break;
    case "cab-booking":
      serviceContext = "The user is looking for cab or taxi services, ride sharing, or transportation options.";
      break;
    case "hotel-reservation":
      serviceContext = "The user is looking for hotels, accommodations, or lodging options.";
      break;
    case "fuel-delivery":
      serviceContext = "The user is looking for fuel delivery services, gasoline, diesel, or petroleum products.";
      break;
    case "train-booking":
      serviceContext = "The user is looking for train tickets, railroad services, or railway information.";
      break;
    default:
      serviceContext = "The user is using a general service aggregator app that includes food delivery, cab booking, hotel reservations, and other services.";
  }

  return `
You are an AI assistant for a service aggregator platform called Onehub Express. Your task is to process the user's search query and provide relevant recommendations.

${serviceContext}
${locationText}
User query: "${query}"

Analyze the query and return a response in JSON format with the following fields:
1. "results": An array of service recommendations, each with:
   - "title": Name of the service provider
   - "description": Brief description
   - "provider": Service provider name (e.g., Swiggy, Uber, MakeMyTrip)
   - "price": Approximate price or price range
   - "rating": User rating (as a string, e.g., "4.5")
   - "eta": Estimated time of arrival or service delivery
   - "image": (optional) URL for an image (leave empty, will be populated later)

2. "suggestions": An array of 3-5 related search queries the user might be interested in.

3. "summary": A brief summary of the search results in one sentence.

4. "extracted": (optional) An object containing detected entities like:
   - "item": Specific item mentioned in the query (e.g., "biryani" from "best biryani delivery")
   - "priorities": Array of user priorities (e.g., ["fast", "cheap"] from "fast and cheap food")
   - "cuisine": Type of cuisine if mentioned
   
5. "serviceCategory": The most relevant service category for this query:
   - "food-delivery"
   - "cab-booking"
   - "hotel-reservation"
   - "fuel-delivery"
   - "train-booking"
   - "general" (if no specific category applies)

Return only the JSON without any additional text or explanations. Ensure the output can be parsed with JSON.parse().
`;
}

function ensureResultsFormat(results: any[]): any[] {
  // Ensure we have at least some default results
  if (!results || !Array.isArray(results) || results.length === 0) {
    return [
      {
        title: "No specific results found",
        description: "Please try refining your search query",
        provider: "Onehub Express",
        price: "Varies",
        rating: "N/A",
        eta: "N/A"
      }
    ];
  }
  
  // Ensure each result has all required fields
  return results.map(result => ({
    title: result.title || result.name || "Unknown",
    description: result.description || "No description available",
    provider: result.provider || result.service || "Onehub Express",
    price: result.price || "Price not available",
    rating: result.rating || "N/A",
    eta: result.eta || result.time || "N/A",
    image: result.image || undefined
  }));
}

function ensureSuggestionsFormat(suggestions: any[]): string[] {
  if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
    return [
      "Try a more specific search",
      "Search for popular options",
      "Browse by category",
      "Search by location"
    ];
  }
  
  // Convert any non-string items to strings
  return suggestions.map(suggestion => 
    typeof suggestion === 'string' ? suggestion : String(suggestion)
  );
}

function extractStructuredData(text: string, query: string, serviceType: string): SearchResponse {
  // Very basic extraction of potential service providers from unstructured text
  const results = [];
  const lines = text.split('\n');
  
  let currentItem: Record<string, string> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check if this line looks like a title/header
    if (trimmedLine.endsWith(':') || 
        /^\d+\.\s/.test(trimmedLine) || 
        /^[A-Z][a-zA-Z\s]+$/.test(trimmedLine)) {
      
      // Save previous item if it has some content
      if (Object.keys(currentItem).length > 0 && currentItem.title) {
        results.push(currentItem);
      }
      
      // Start a new item
      const title = trimmedLine.replace(/^\d+\.\s/, '').replace(/:$/, '');
      currentItem = { title };
      continue;
    }
    
    // Try to extract provider, price, rating, etc.
    if (/price|cost/i.test(trimmedLine)) {
      currentItem.price = extractValue(trimmedLine) || "Varies";
    } else if (/rating|stars/i.test(trimmedLine)) {
      currentItem.rating = extractValue(trimmedLine) || "4.0";
    } else if (/time|delivery|eta/i.test(trimmedLine)) {
      currentItem.eta = extractValue(trimmedLine) || "30 min";
    } else if (/provider|from|by/i.test(trimmedLine)) {
      currentItem.provider = extractValue(trimmedLine) || "Onehub Express";
    } else if (!currentItem.description) {
      currentItem.description = trimmedLine;
    }
  }
  
  // Add the last item if it exists
  if (Object.keys(currentItem).length > 0 && currentItem.title) {
    results.push(currentItem);
  }
  
  // If we couldn't extract any meaningful results, return mock data
  if (results.length === 0) {
    return generateMockData(query, serviceType, null, "Could not extract structured data from response");
  }
  
  // Format the results properly
  const formattedResults = results.map(result => ({
    title: result.title || "Unknown",
    description: result.description || "No description available",
    provider: result.provider || "Onehub Express",
    price: result.price || "Price not available",
    rating: result.rating || "4.2",
    eta: result.eta || "30 min"
  }));
  
  return {
    results: formattedResults,
    suggestions: [
      `More like ${query}`,
      "Popular options nearby",
      "Best rated options",
      "Budget-friendly options"
    ],
    summary: `Here are some results related to "${query}".`,
    serviceCategory: serviceType
  };
}

function extractValue(line: string): string | null {
  // Try to extract a value from a line like "Price: $10.99" or "Rating: 4.5 stars"
  const match = line.match(/[^:]+:\s*(.+)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}
