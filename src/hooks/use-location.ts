
import { useState, useEffect } from "react";
import { LocationData } from "./use-search";
import { toast } from "sonner";

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setLocationEnabled(false);
        setLocationLoading(false);
        return;
      }

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
          setLocationError(null);
          console.log("Location obtained:", locationInfo);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationEnabled(false);
          setLocationLoading(false);
          
          let errorMessage = "Could not get your location. Some features may be limited.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location services to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get your location timed out.";
              break;
          }
          
          setLocationError(errorMessage);
          toast.error(errorMessage);
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
      );
    };

    // Try to get location on component mount
    getLocation();
    
    // Set up an interval to refresh the location every 5 minutes
    const intervalId = setInterval(getLocation, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const refreshLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
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
          setLocationError(null);
          console.log("Location refreshed:", locationInfo);
          toast.success("Location updated successfully");
        },
        (error) => {
          console.error("Error refreshing location:", error);
          setLocationLoading(false);
          toast.error("Failed to update location");
        }
      );
    } else {
      setLocationLoading(false);
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return {
    locationData,
    locationLoading,
    locationEnabled,
    locationError,
    refreshLocation
  };
};
