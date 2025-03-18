
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { LocationData } from "./use-search";

interface UseSuggestionsProps {
  query: string;
  serviceType: string;
  locationData: LocationData | null;
  locationEnabled: boolean;
  session: any;
}

export const useSuggestions = ({
  query,
  serviceType,
  locationData,
  locationEnabled,
  session,
}: UseSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3 || !session) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke("gemini-search", {
          body: {
            query: debouncedQuery,
            serviceType,
            location: locationEnabled ? locationData : null,
          },
        });

        if (error) {
          throw error;
        }

        if (data && data.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, serviceType, session, locationData, locationEnabled]);

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    loading,
  };
};
