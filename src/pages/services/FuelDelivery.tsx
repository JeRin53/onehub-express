
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
import { Fuel, Info, Clock, Droplet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/components/services/ServiceComparison";

const FuelDelivery = () => {
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
          id: "fuelbuddy",
          name: "FuelBuddy",
          price: "₹102.50/liter",
          rating: 4.3,
          votes: 8423,
          eta: "2-4 hours",
          features: ["Diesel & Petrol", "Quality Tested", "Digital Receipt"],
          discount: "₹2/liter OFF on first order",
          bestFor: "business customers",
        },
        {
          id: "mycarhelpme",
          name: "MyCarHelpMe",
          price: "₹103.75/liter",
          rating: 4.1,
          votes: 6845,
          eta: "1-3 hours",
          features: ["Emergency Delivery", "24/7 Service", "Multiple Payment Options"],
          discount: "Free delivery on first order",
          bestFor: "emergency fuel",
        },
        {
          id: "humsafar",
          name: "Humsafar",
          price: "₹101.90/liter",
          rating: 4.0,
          votes: 5723,
          eta: "3-6 hours",
          features: ["Bulk Orders", "High-Speed Pumps", "GPS Tracking"],
          discount: "10% OFF for bulk orders",
          bestFor: "bulk delivery",
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
          id: "fuelbuddy",
          name: "FuelBuddy",
          price: results?.results?.[0]?.price || "₹102.50/liter",
          rating: 4.3,
          votes: 8423,
          eta: "2-4 hours",
          features: ["Diesel & Petrol", "Quality Tested"],
          discount: "₹2/liter OFF on first order",
          bestFor: "business customers",
        },
        {
          id: "mycarhelpme",
          name: "MyCarHelpMe",
          price: results?.results?.[1]?.price || "₹103.75/liter",
          rating: 4.1,
          votes: 6845,
          eta: "1-3 hours",
          features: ["Emergency Delivery", "24/7 Service"],
          discount: "Free delivery on first order",
          bestFor: "emergency fuel",
        },
        {
          id: "humsafar",
          name: "Humsafar",
          price: results?.results?.[2]?.price || "₹101.90/liter",
          rating: 4.0,
          votes: 5723,
          eta: "3-6 hours",
          features: ["Bulk Orders", "High-Speed Pumps"],
          discount: "10% OFF for bulk orders",
          bestFor: "bulk delivery",
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
              <Fuel className="h-8 w-8 mr-3 text-blue-500" />
              Fuel Delivery
            </h1>
            <p className="text-gray-600">
              Never run out of fuel again. Get premium quality fuel delivered directly to your vehicle
            </p>
          </div>
          
          <div className="mb-8">
            <GeminiSearchBar 
              serviceType="fuel-delivery" 
              onResults={handleSearch}
              placeholder="Search for fuel types, prices, or delivery options..."
              className="max-w-2xl"
            />
          </div>
          
          {searchResults && (
            <Alert className="mb-8 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Search Results</AlertTitle>
              <AlertDescription>
                {searchResults.summary || "Here are the search results for your query."}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ServiceComparison
                title="Compare Fuel Delivery Services"
                description="Find the best rates and delivery times from different providers"
                providers={providers}
                loading={loading}
              />
            </div>
            
            <div>
              <AIRecommendations
                type="general"
                title="Fuel Delivery Recommendations"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChat
                serviceType="fuel-delivery"
                title="Fuel Delivery Assistant"
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Current Fuel Prices</CardTitle>
                  <CardDescription>Updated daily at 6:00 AM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Petrol", price: "₹102.50/liter", change: "+₹0.25", trend: "up" },
                      { type: "Diesel", price: "₹90.75/liter", change: "-₹0.15", trend: "down" },
                      { type: "CNG", price: "₹83.90/kg", change: "No change", trend: "stable" },
                    ].map((fuel, index) => (
                      <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <Droplet className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{fuel.type}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-700">{fuel.price}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              fuel.trend === 'up' 
                                ? 'bg-red-100 text-red-800'
                                : fuel.trend === 'down'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {fuel.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-medium mb-2">Delivery Information</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        Delivery hours: 7:00 AM - 9:00 PM
                      </li>
                      <li className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-500" />
                        Minimum order: 20 liters
                      </li>
                    </ul>
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

export default FuelDelivery;
