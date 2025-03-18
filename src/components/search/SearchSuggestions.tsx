
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchSuggestionsProps {
  loading: boolean;
  debouncedQuery: string;
  showSuggestions: boolean;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  loading,
  debouncedQuery,
  showSuggestions,
  suggestions,
  onSuggestionClick,
}) => {
  // Loading state for suggestions
  if (loading && debouncedQuery.length >= 3 && !showSuggestions) {
    return (
      <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
        <div className="py-1 px-4">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </div>
    );
  }

  // Suggestions dropdown
  if (showSuggestions && suggestions.length > 0) {
    return (
      <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
        <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default SearchSuggestions;
