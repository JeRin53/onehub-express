
import { useState, useEffect } from "react";
import { LocationData } from "./use-search";
import { toast } from "sonner";

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && !locationData) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationInfo = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocationData(locationInfo);
          setLocationEnabled(true);
          setLocationLoading(false);
          console.log("Location obtained:", locationInfo);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationEnabled(false);
          setLocationLoading(false);
          toast.error("Could not get your location. Some features may be limited.");
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
      );
    }
  }, []);

  return {
    locationData,
    locationLoading,
    locationEnabled,
  };
};
