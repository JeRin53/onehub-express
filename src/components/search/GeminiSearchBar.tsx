
import React, { useState, useEffect } from "react";
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
  const [searchResults, setSearchResults] = useState<any>(null);
  const { session } = useAuth();
  const debouncedQuery = useDebounce(query, 500);
  
  // Custom hooks
  const { locationData, locationLoading, locationEnabled, refreshLocation } = useLocation();
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

  // Re-focus input when query is set externally
  useEffect(() => {
    if (query && !searchLoading) {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [query, searchLoading]);

  const performSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    
    if (!session) {
      toast("For personalized results, please log in", {
        description: "You can still search, but results may not be tailored to you.",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }
      });
    }
    
    console.log("Performing search with query:", query);
    console.log("Location data:", locationData);
    
    try {
      const results = await handleSearch({
        query,
        serviceType,
        locationData,
        locationEnabled,
        onResults
      });
      
      setSearchResults(results);
      
      // If onResults is provided, let the parent component handle displaying results
      if (onResults && results) {
        onResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    }
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

  const handleRefreshLocation = () => {
    refreshLocation();
    toast.success("Refreshing your location...");
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
          className="pr-24 bg-white/90 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
        />
        
        {/* Location indicator */}
        <LocationIndicator 
          loading={locationLoading} 
          enabled={locationEnabled} 
          onRefresh={handleRefreshLocation} 
        />
        
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
      
      {/* Inline search results (if no onResults handler is provided) */}
      {searchResults && !onResults && (
        <div className="mt-4 space-y-4 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg">{searchResults.summary || "Search Results"}</h3>
          
          {searchResults.results && searchResults.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.results.map((result: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {result.image && (
                    <img 
                      src={result.image} 
                      alt={result.title} 
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <h4 className="font-medium text-lg">{result.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    {result.provider && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {result.provider}
                      </span>
                    )}
                    
                    {result.price && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {result.price}
                      </span>
                    )}
                    
                    {result.rating && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ★ {result.rating}
                      </span>
                    )}
                    
                    {result.eta && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {result.eta}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No results found. Try a different search query.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiSearchBar;
