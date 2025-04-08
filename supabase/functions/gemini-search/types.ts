
// Type definitions for the Gemini search function

export interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface SearchRequestData {
  query: string;
  serviceType: string;
  location: LocationData | string | null;
}

export interface SearchResult {
  title: string;
  description: string;
  provider: string;
  price: string;
  rating: string;
  distance: string;
  image: string;
}

export interface SearchResponse {
  results: SearchResult[];
  suggestions: string[];
  summary: string;
  error?: string;
}
