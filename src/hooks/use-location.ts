
import { useState, useEffect } from "react";
import { LocationData } from "./use-search";

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

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
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

  return {
    locationData,
    locationLoading,
    locationEnabled,
  };
};
