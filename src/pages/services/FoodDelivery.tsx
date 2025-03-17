
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
import { Utensils, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/components/services/ServiceComparison";

const FoodDelivery = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<any>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if we have search results from navigation
    if (state?.searchResults) {
      setSearchResults(state.searchResults);
      processSearchResults(state.searchResults);
    } else {
      // Set default providers
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
      // In a real app, this would use the actual search results to get provider data
      // For now, we'll simulate this with mock data based on the search
      
      const newProviders: ServiceProvider[] = [
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
          bestFor: "healthy options",
        },
      ];
      
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
                      { name: "Spice Junction", cuisine: "Indian", rating: 4.8, deliveryTime: "30 min" },
                      { name: "Pizza Express", cuisine: "Italian", rating: 4.5, deliveryTime: "25 min" },
                      { name: "Wok & Roll", cuisine: "Chinese", rating: 4.3, deliveryTime: "40 min" },
                    ].map((restaurant, index) => (
                      <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-lg font-bold text-gray-500">
                          {restaurant.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{restaurant.name}</h3>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{restaurant.cuisine}</span>
                            <div className="flex items-center">
                              <span className="flex items-center mr-2">
                                <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                                {restaurant.rating}
                              </span>
                              <span>{restaurant.deliveryTime}</span>
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
