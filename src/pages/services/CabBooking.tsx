
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
import { Car, Info, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/components/services/ServiceComparison";

const CabBooking = () => {
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
          id: "uber",
          name: "Uber",
          price: 450,
          rating: 4.4,
          votes: 15423,
          eta: "5 min",
          features: ["Fixed Price", "Multiple Payment Options", "Trip Insurance"],
          discount: "20% OFF up to ₹100",
          bestFor: "comfort",
        },
        {
          id: "ola",
          name: "Ola",
          price: 420,
          rating: 4.2,
          votes: 12845,
          eta: "7 min",
          features: ["Ola Money", "Pre-Book", "Ola Select"],
          discount: "₹100 OFF on first ride",
          bestFor: "availability",
        },
        {
          id: "rapido",
          name: "Rapido",
          price: 170,
          rating: 4.0,
          votes: 8723,
          eta: "3 min",
          features: ["Bike Taxi", "Budget Friendly", "Quick Arrival"],
          discount: "30% OFF on bike rides",
          bestFor: "quick trips",
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
          id: "uber",
          name: "Uber",
          price: results?.results?.[0]?.price || 450,
          rating: 4.4,
          votes: 15423,
          eta: "5 min",
          features: ["Fixed Price", "Multiple Payment Options"],
          discount: "20% OFF up to ₹100",
          bestFor: "comfort",
        },
        {
          id: "ola",
          name: "Ola",
          price: results?.results?.[1]?.price || 420,
          rating: 4.2,
          votes: 12845,
          eta: "7 min",
          features: ["Ola Money", "Pre-Book"],
          discount: "₹100 OFF on first ride",
          bestFor: "availability",
        },
        {
          id: "rapido",
          name: "Rapido",
          price: results?.results?.[2]?.price || 170,
          rating: 4.0,
          votes: 8723,
          eta: "3 min",
          features: ["Bike Taxi", "Budget Friendly"],
          discount: "30% OFF on bike rides",
          bestFor: "quick trips",
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
              <Car className="h-8 w-8 mr-3 text-violet-500" />
              Cab Booking
            </h1>
            <p className="text-gray-600">
              Book a safe and reliable ride in seconds with experienced drivers and fixed fares
            </p>
          </div>
          
          <div className="mb-8">
            <GeminiSearchBar 
              serviceType="cab-booking" 
              onResults={handleSearch}
              placeholder="Search for destinations, cab types, or rates..."
              className="max-w-2xl"
            />
          </div>
          
          {searchResults && (
            <Alert className="mb-8 border-violet-200 bg-violet-50">
              <Info className="h-4 w-4 text-violet-500" />
              <AlertTitle>Search Results</AlertTitle>
              <AlertDescription>
                {searchResults.summary || "Here are the search results for your query."}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ServiceComparison
                title="Compare Cab Services"
                description="Find the best fares and wait times from different providers"
                providers={providers}
                loading={loading}
              />
            </div>
            
            <div>
              <AIRecommendations
                type="cabs"
                title="Recommended Routes"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChat
                serviceType="cab-booking"
                title="Cab Booking Assistant"
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                  <CardDescription>Frequently booked locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Airport", distance: "15 km", time: "25 min", price: "₹400-450" },
                      { name: "City Center", distance: "5 km", time: "15 min", price: "₹150-200" },
                      { name: "Metro Station", distance: "3 km", time: "10 min", price: "₹100-120" },
                    ].map((destination, index) => (
                      <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                        <div className="h-10 w-10 bg-violet-100 rounded-md flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-violet-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{destination.name}</h3>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{destination.distance}</span>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{destination.time}</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-violet-600">
                            {destination.price}
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

export default CabBooking;
