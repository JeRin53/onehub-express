
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchButtonProps {
  loading: boolean;
  onClick: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ loading, onClick }) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="absolute right-0 top-0 h-full"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SearchButton;
