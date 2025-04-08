
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SearchOptions {
  serviceType: string;
  query: string;
  locationData: LocationData | null;
  locationEnabled: boolean;
  onResults?: (results: any) => void;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async ({
    query,
    serviceType,
    locationData,
    locationEnabled,
    onResults,
  }: SearchOptions) => {
    if (query.trim() === "") {
      toast.error("Please enter a search query");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting search with query:", query);
      console.log("Service type:", serviceType);
      console.log("Location enabled:", locationEnabled);
      console.log("Location data:", locationData);

      // If user is logged in, save search to history
      if (session) {
        try {
          await supabase.from("search_history").insert([
            {
              user_id: session.user.id,
              query: query,
              service_type: serviceType,
              location_data: locationEnabled ? JSON.stringify(locationData) : null,
            },
          ]);
          console.log("Search saved to history");
        } catch (historyError) {
          console.error("Error saving search history:", historyError);
          // Continue with search even if history saving fails
        }
      }

      // Set a reasonable timeout for the search
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 15000);

      // Get search results from Gemini
      const { data, error } = await supabase.functions.invoke("gemini-search", {
        body: {
          query,
          serviceType,
          location: locationEnabled ? locationData : null,
        },
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error("Search error from Supabase function:", error);
        toast.error("Search failed. Please try again.");
        if (onResults) {
          onResults({
            results: [],
            summary: "Search failed. Please try again.",
          });
        }
        return;
      }

      console.log("Search results:", data);

      // Send results to parent component
      if (onResults) {
        onResults(data);
      }

      toast.success("Search completed successfully");

      // Detect service category from data, extracted items, or query
      let detectedService = data?.serviceCategory || serviceType;

      // If we have extracted food item data, make sure to use it
      const extractedItem = data?.extracted?.item?.toLowerCase() || "";
      const query_lower = query.toLowerCase();
      
      // Check for food-related terms
      const foodTerms = /food|restaurant|meal|eat|dinner|lunch|breakfast|biryani|pizza|burger|curry|dosa/i;
      const cabTerms = /cab|taxi|ride|car|uber|lift/i;
      const hotelTerms = /hotel|stay|room|accommodation|lodge/i;
      const fuelTerms = /fuel|gas|petrol|diesel/i;
      const trainTerms = /train|rail|travel|ticket/i;
      
      if (detectedService === "general") {
        // If no specific category detected or if we're starting with a generic search,
        // try to infer from the extracted item, query, or results
        
        if (foodTerms.test(extractedItem) || foodTerms.test(query_lower) || 
            (data?.results && data.results.some((r: any) => 
              r.provider === "Swiggy" || r.provider === "Zomato"))) {
          detectedService = "food-delivery";
        } else if (cabTerms.test(query_lower)) {
          detectedService = "cab-booking";
        } else if (hotelTerms.test(query_lower)) {
          detectedService = "hotel-reservation";
        } else if (fuelTerms.test(query_lower)) {
          detectedService = "fuel-delivery";
        } else if (trainTerms.test(query_lower)) {
          detectedService = "train-booking";
        }
      }

      // Navigate to the appropriate service page if needed
      if (detectedService !== "general" && detectedService !== serviceType) {
        navigate(`/services/${detectedService}`, {
          state: {
            searchQuery: query,
            searchResults: data,
            userLocation: locationEnabled ? locationData : null,
          },
        });
      }

      return data;
    } catch (error: any) {
      console.error("Unexpected search error:", error);
      
      let errorMessage = "Search failed. Please try again.";
      if (error.name === "AbortError") {
        errorMessage = "Search took too long. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);

      if (onResults) {
        onResults({
          results: [],
          summary: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSearch,
  };
};
