
import React from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationIndicatorProps {
  loading: boolean;
  enabled: boolean;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ loading, enabled }) => {
  return (
    <div className="absolute right-12 top-0 h-full flex items-center">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <MapPin 
                  className={`h-4 w-4 ${enabled ? "text-green-500" : "text-gray-400"}`} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{enabled ? "Location enabled" : "Location disabled"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default LocationIndicator;
