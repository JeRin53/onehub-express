
import React from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface LocationIndicatorProps {
  loading: boolean;
  enabled: boolean;
  onRefresh?: () => void;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ 
  loading, 
  enabled,
  onRefresh
}) => {
  return (
    <div className="absolute right-12 top-0 h-full flex items-center">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onRefresh} 
                className="focus:outline-none"
                aria-label={enabled ? "Location enabled, click to refresh" : "Location disabled, click to enable"}
              >
                {onRefresh ? (
                  <div className="relative group">
                    <MapPin 
                      className={`h-4 w-4 ${enabled ? "text-green-500" : "text-gray-400"}`} 
                    />
                    <RefreshCw 
                      className="h-3 w-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" 
                    />
                  </div>
                ) : (
                  <MapPin 
                    className={`h-4 w-4 ${enabled ? "text-green-500" : "text-gray-400"}`} 
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {loading ? "Detecting location..." : 
                  enabled ? "Location enabled (click to refresh)" : "Location disabled (click to enable)"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default LocationIndicator;
