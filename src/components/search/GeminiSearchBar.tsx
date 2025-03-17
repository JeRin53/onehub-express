
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface GeminiSearchBarProps {
  serviceType?: string;
  onResults?: (results: any) => void;
  placeholder?: string;
  className?: string;
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
  const navigate = useNavigate();
  const { session } = useAuth();
  const debouncedQuery = useDebounce(query, 500);

  // Fetch suggestions as user types
  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3 || !session) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('gemini-search', {
          body: { query: debouncedQuery, serviceType },
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
  }, [debouncedQuery, serviceType, session]);

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
        body: { query, serviceType },
      });

      if (error) throw error;

      // Send results to parent component
      if (onResults) {
        onResults(data);
      }

      toast.success("Search completed successfully");

      // Based on serviceType, navigate to appropriate page
      if (serviceType === "general") {
        switch (true) {
          case /food|restaurant|meal|eat|dinner|lunch|breakfast/i.test(query):
            navigate("/services/food-delivery", { state: { searchQuery: query, searchResults: data } });
            break;
          case /cab|taxi|ride|car|uber|lift/i.test(query):
            navigate("/services/cab-booking", { state: { searchQuery: query, searchResults: data } });
            break;
          case /hotel|stay|room|accommodation|lodge/i.test(query):
            navigate("/services/hotel-reservation", { state: { searchQuery: query, searchResults: data } });
            break;
          case /fuel|gas|petrol|diesel/i.test(query):
            navigate("/services/fuel-delivery", { state: { searchQuery: query, searchResults: data } });
            break;
          case /train|rail|travel|ticket/i.test(query):
            navigate("/services/train-booking", { state: { searchQuery: query, searchResults: data } });
            break;
          default:
            // Stay on current page
            break;
        }
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.message || "Search failed. Please try again.");
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
          className="pr-12"
        />
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
