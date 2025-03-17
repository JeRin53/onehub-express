
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface GeminiSearchBarProps {
  serviceType?: string;
  onResults?: (results: any) => void;
  placeholder?: string;
  className?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const GeminiSearchBar: React.FC<GeminiSearchBarProps> = ({
  serviceType = "general",
  onResults,
  placeholder = "Search with Gemini AI...",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const debouncedQuery = useDebounce(query, 500);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation && !locationData) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setLocationEnabled(true);
          setLocationLoading(false);
          console.log("Location obtained:", position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationEnabled(false);
          setLocationLoading(false);
          // Don't show toast for location errors as they're common and expected
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3 || !session) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('gemini-search', {
          body: { 
            query: debouncedQuery, 
            serviceType,
            location: locationEnabled ? locationData : null
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
        // No need to show toast for suggestion errors
        // as they're non-critical
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, serviceType, session, locationData, locationEnabled]);

  const handleSearch = async () => {
    if (query.trim() === "") return;

    try {
      setLoading(true);
      setShowSuggestions(false);

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
      const { data, error } = await supabase.functions.invoke('gemini-search', {
        body: { 
          query, 
          serviceType,
          location: locationEnabled ? locationData : null
        },
      });

      if (error) {
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.");
        if (onResults) {
          onResults({ 
            results: [],
            summary: "Search failed. Please try again."
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
            userLocation: locationEnabled ? locationData : null
          } 
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.message || "Search failed. Please try again.");
      
      if (onResults) {
        onResults({ 
          results: [],
          summary: "Search failed. Please try again."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-search with the suggestion
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length >= 3 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pr-24" // Increased padding to accommodate both buttons
        />
        
        {/* Location indicator */}
        <div className="absolute right-12 top-0 h-full flex items-center">
          {locationLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
          ) : locationEnabled ? (
            <MapPin className="h-4 w-4 text-green-500" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {/* Search button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Loading state for suggestions */}
      {loading && debouncedQuery.length >= 3 && !showSuggestions && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
          <div className="py-1 px-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeminiSearchBar;
