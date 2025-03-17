import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GeminiSearchBar from "@/components/search/GeminiSearchBar";
import ServiceComparison from "@/components/services/ServiceComparison";
import AIRecommendations from "@/components/ai/AIRecommendations";
import AIChat from "@/components/ai/AIChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Utensils, Info, Star, Clock, MapPin, PercentIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/components/services/ServiceComparison";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const FoodDelivery = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<any>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(
    state?.userLocation || null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (state?.searchResults) {
      setSearchResults(state.searchResults);
      processSearchResults(state.searchResults);
    } else {
      if (!locationData && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationData({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
            console.log("Location obtained:", position.coords);
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
        );
      }

      setProviders([
        {
          id: "swiggy",
          name: "Swiggy",
          price: "₹100 min order",
          rating: 4.2,
          votes: 10423,
          eta: "35-40 min",
          features: ["Live Tracking", "No Contact Delivery", "Special Offers"],
          discount: "50% OFF up to ₹100",
          bestFor: "quick delivery",
        },
        {
          id: "zomato",
          name: "Zomato",
          price: "₹150 min order",
          rating: 4.5,
          votes: 12845,
          eta: "40-45 min",
          features: ["No Contact Delivery", "Premium Restaurants", "Zomato Pro"],
          discount: "60% OFF up to ₹120",
          bestFor: "restaurant variety",
        },
        {
          id: "eatsure",
          name: "EatSure",
          price: "₹200 min order",
          rating: 4.0,
          votes: 5723,
          eta: "30-35 min",
          features: ["Multiple Cuisines", "Combo Options", "Health Focus"],
          discount: "40% OFF up to ₹80",
          bestFor: "healthy options",
        },
      ]);
    }
  }, [state]);

  const processSearchResults = (results: any) => {
    setLoading(true);
    
    try {
      const foodItem = results?.extracted?.item || "food";
      const priorities = results?.extracted?.priorities || [];
      const hasPrioritySpeed = priorities.some((p: string) => 
        p.toLowerCase().includes("fast") || p.toLowerCase().includes("quick") || p.toLowerCase().includes("speed")
      );
      const hasPriorityPrice = priorities.some((p: string) => 
        p.toLowerCase().includes("cheap") || p.toLowerCase().includes("affordable") || p.toLowerCase().includes("price")
      );
      
      let newProviders: ServiceProvider[] = [
        {
          id: "swiggy",
          name: "Swiggy",
          price: results?.results?.[0]?.price || "₹100 min order",
          rating: 4.2,
          votes: 10423,
          eta: "30-35 min",
          features: ["Live Tracking", "No Contact Delivery"],
          discount: "50% OFF up to ₹100",
          bestFor: "quick delivery",
        },
        {
          id: "zomato",
          name: "Zomato",
          price: results?.results?.[1]?.price || "₹150 min order",
          rating: 4.5,
          votes: 12845,
          eta: "40-45 min",
          features: ["Premium Restaurants", "Zomato Pro"],
          discount: "60% OFF up to ₹120",
          bestFor: "restaurant variety",
        },
        {
          id: "eatsure",
          name: "EatSure",
          price: results?.results?.[2]?.price || "₹200 min order",
          rating: 4.0,
          votes: 5723,
          eta: "25-30 min",
          features: ["Health Focus", "Combo Options"],
          discount: "40% OFF up to ₹80",
          bestFor: "healthy options",
        },
      ];
      
      if (locationData) {
        newProviders[0].eta = "25-30 min";
        newProviders[1].eta = "35-40 min";
        newProviders[2].eta = "20-25 min";
      }
      
      if (hasPrioritySpeed && hasPriorityPrice) {
        newProviders.sort((a, b) => {
          const aEta = parseInt(a.eta?.split('-')[0] || '30');
          const bEta = parseInt(b.eta?.split('-')[0] || '30');
          const aPrice = a.price ? parseInt(String(a.price).replace(/[^\d]/g, '') || '150') : 150;
          const bPrice = b.price ? parseInt(String(b.price).replace(/[^\d]/g, '') || '150') : 150;
          return (aEta + aPrice/100) - (bEta + bPrice/100);
        });
      } else if (hasPrioritySpeed) {
        newProviders.sort((a, b) => {
          const aEta = parseInt(a.eta?.split('-')[0] || '30');
          const bEta = parseInt(b.eta?.split('-')[0] || '30');
          return aEta - bEta;
        });
      } else if (hasPriorityPrice) {
        newProviders.sort((a, b) => {
          const aPrice = a.price ? parseInt(String(a.price).replace(/[^\d]/g, '') || '150') : 150;
          const bPrice = b.price ? parseInt(String(b.price).replace(/[^\d]/g, '') || '150') : 150;
          return aPrice - bPrice;
        });
      }
      
      setProviders(newProviders);
    } catch (err) {
      console.error("Error processing search results:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (results: any) => {
    setSearchResults(results);
    processSearchResults(results);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Utensils className="h-8 w-8 mr-3 text-orange-500" />
              Food Delivery
            </h1>
            <p className="text-gray-600">
              Order food from your favorite restaurants and have it delivered to your doorstep
            </p>
            
            {locationData && (
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1 text-orange-500" />
                <span>Using your current location for delivery estimates</span>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <GeminiSearchBar 
              serviceType="food-delivery" 
              onResults={handleSearch}
              placeholder="Search for restaurants, cuisines, or dishes..."
              className="max-w-2xl"
            />
          </div>
          
          {searchResults && (
            <Alert className="mb-8 border-orange-200 bg-orange-50">
              <Info className="h-4 w-4 text-orange-500" />
              <AlertTitle>Search Results</AlertTitle>
              <AlertDescription>
                {searchResults.summary || "Here are the search results for your query."}
                
                {searchResults.extracted && searchResults.extracted.item && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {searchResults.extracted.item && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                        {searchResults.extracted.item}
                      </Badge>
                    )}
                    
                    {searchResults.extracted.priorities && 
                      searchResults.extracted.priorities.map((priority: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {priority}
                        </Badge>
                      ))
                    }
                    
                    {searchResults.extracted.cuisine && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {searchResults.extracted.cuisine}
                      </Badge>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ServiceComparison
                title="Compare Food Delivery Services"
                description="Find the best prices and delivery times from different providers"
                providers={providers}
                loading={loading}
              />
            </div>
            
            <div>
              <AIRecommendations
                type="restaurants"
                title="Recommended for You"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChat
                serviceType="food-delivery"
                title="Food Delivery Assistant"
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Near You</CardTitle>
                  <CardDescription>Top-rated restaurants in your area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Spice Junction", cuisine: "Indian", rating: 4.8, deliveryTime: "30 min", discount: "50% OFF" },
                      { name: "Pizza Express", cuisine: "Italian", rating: 4.5, deliveryTime: "25 min", discount: "40% OFF" },
                      { name: "Wok & Roll", cuisine: "Chinese", rating: 4.3, deliveryTime: "40 min", discount: "30% OFF" },
                    ].map((restaurant, index) => (
                      <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-lg font-bold text-gray-500">
                          {restaurant.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{restaurant.name}</h3>
                            <div className="flex items-center text-xs font-medium text-green-600">
                              <PercentIcon className="h-3 w-3 mr-0.5" />
                              {restaurant.discount}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{restaurant.cuisine}</span>
                            <div className="flex items-center">
                              <span className="flex items-center mr-2">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                                {restaurant.rating}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {restaurant.deliveryTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FoodDelivery;
