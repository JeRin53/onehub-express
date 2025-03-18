
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocation } from "@/hooks/use-location";
import { useSearch } from "@/hooks/use-search";
import { useSuggestions } from "@/hooks/use-suggestions";
import LocationIndicator from "./LocationIndicator";
import SearchButton from "./SearchButton";
import SearchSuggestions from "./SearchSuggestions";
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
  const { session } = useAuth();
  const debouncedQuery = useDebounce(query, 500);
  
  // Custom hooks
  const { locationData, locationLoading, locationEnabled } = useLocation();
  const { loading: searchLoading, handleSearch } = useSearch();
  const { 
    suggestions, 
    showSuggestions, 
    setShowSuggestions, 
    loading: suggestionsLoading 
  } = useSuggestions({
    query,
    serviceType,
    locationData,
    locationEnabled,
    session
  });

  const performSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    
    console.log("Performing search with query:", query);
    await handleSearch({
      query,
      serviceType,
      locationData,
      locationEnabled,
      onResults
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      performSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-search with the suggestion
    setTimeout(() => {
      performSearch();
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
        <LocationIndicator loading={locationLoading} enabled={locationEnabled} />
        
        {/* Search button */}
        <SearchButton loading={searchLoading} onClick={performSearch} />
      </div>

      {/* Suggestions component */}
      <SearchSuggestions
        loading={suggestionsLoading}
        debouncedQuery={debouncedQuery}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
};

export default GeminiSearchBar;
