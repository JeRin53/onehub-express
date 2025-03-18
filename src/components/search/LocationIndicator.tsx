
import React from "react";
import { MapPin, Loader2 } from "lucide-react";

interface LocationIndicatorProps {
  loading: boolean;
  enabled: boolean;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ loading, enabled }) => {
  return (
    <div className="absolute right-12 top-0 h-full flex items-center">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
      ) : enabled ? (
        <MapPin className="h-4 w-4 text-green-500" title="Location enabled" />
      ) : (
        <MapPin className="h-4 w-4 text-gray-400" title="Location disabled" />
      )}
    </div>
  );
};

export default LocationIndicator;
