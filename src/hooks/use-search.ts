
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
    if (query.trim() === "") return;

    try {
      setLoading(true);

      if (!session) {
        toast.error("Please log in to use the search feature");
        navigate("/login");
        return;
      }

      // Save search to history
      await supabase.from("search_history").insert([
        {
          user_id: session.user.id,
          query: query,
          service_type: serviceType,
        },
      ]);

      // Get search results
      const { data, error } = await supabase.functions.invoke("gemini-search", {
        body: {
          query,
          serviceType,
          location: locationEnabled ? locationData : null,
        },
      });

      if (error) {
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.");
        if (onResults) {
          onResults({
            results: [],
            summary: "Search failed. Please try again.",
          });
        }
        return;
      }

      // Send results to parent component
      if (onResults) {
        onResults(data);
      }

      toast.success("Search completed successfully");

      // Detect service category from data or query
      let detectedService = data?.serviceCategory || serviceType;

      if (detectedService === "general") {
        // If no category detected, try to infer from the query
        const query_lower = query.toLowerCase();
        if (/food|restaurant|meal|eat|dinner|lunch|breakfast|biryani|pizza/i.test(query_lower)) {
          detectedService = "food-delivery";
        } else if (/cab|taxi|ride|car|uber|lift/i.test(query_lower)) {
          detectedService = "cab-booking";
        } else if (/hotel|stay|room|accommodation|lodge/i.test(query_lower)) {
          detectedService = "hotel-reservation";
        } else if (/fuel|gas|petrol|diesel/i.test(query_lower)) {
          detectedService = "fuel-delivery";
        } else if (/train|rail|travel|ticket/i.test(query_lower)) {
          detectedService = "train-booking";
        }
      }

      // Navigate to the appropriate service page
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
      console.error("Search error:", error);
      toast.error(error.message || "Search failed. Please try again.");

      if (onResults) {
        onResults({
          results: [],
          summary: "Search failed. Please try again.",
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
