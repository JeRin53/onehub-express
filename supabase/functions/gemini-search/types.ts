
// Type definitions for the Gemini search function

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface SearchRequestData {
  query: string;
  serviceType: string;
  location: LocationData | null;
}

export interface SearchResult {
  title: string;
  description: string;
  provider: string;
  price: string;
  rating: string;
  eta: string;
  image?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  suggestions: string[];
  summary: string;
  error?: string;
  extracted?: {
    item?: string;
    priorities?: string[];
    cuisine?: string;
  };
  serviceCategory?: string;
}
