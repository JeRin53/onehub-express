
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
import { Train, Info, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/components/services/ServiceComparison";

const TrainBooking = () => {
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
          id: "irctc",
          name: "IRCTC",
          price: "₹850 (Sleeper)",
          rating: 4.0,
          votes: 24423,
          eta: "Instant",
          features: ["Official Platform", "No Extra Fees", "Direct Booking"],
          discount: "₹50 Cashback with UPI",
          bestFor: "reliable booking",
        },
        {
          id: "makemytrip",
          name: "MakeMyTrip",
          price: "₹875 (Sleeper)",
          rating: 4.2,
          votes: 18845,
          eta: "Instant",
          features: ["MMT Assured", "Alternate Options", "Fare Alerts"],
          discount: "10% OFF with MMT Cards",
          bestFor: "alternate options",
        },
        {
          id: "confirmtkt",
          name: "ConfirmTkt",
          price: "₹850 (Sleeper)",
          rating: 4.4,
          votes: 12723,
          eta: "Instant",
          features: ["Prediction Engine", "Multi-city Planning", "PNR Support"],
          discount: "5% SuperCash",
          bestFor: "seat confirmation",
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
          id: "irctc",
          name: "IRCTC",
          price: results?.results?.[0]?.price || "₹850 (Sleeper)",
          rating: 4.0,
          votes: 24423,
          eta: "Instant",
          features: ["Official Platform", "No Extra Fees"],
          discount: "₹50 Cashback with UPI",
          bestFor: "reliable booking",
        },
        {
          id: "makemytrip",
          name: "MakeMyTrip",
          price: results?.results?.[1]?.price || "₹875 (Sleeper)",
          rating: 4.2,
          votes: 18845,
          eta: "Instant",
          features: ["MMT Assured", "Alternate Options"],
          discount: "10% OFF with MMT Cards",
          bestFor: "alternate options",
        },
        {
          id: "confirmtkt",
          name: "ConfirmTkt",
          price: results?.results?.[2]?.price || "₹850 (Sleeper)",
          rating: 4.4,
          votes: 12723,
          eta: "Instant",
          features: ["Prediction Engine", "Multi-city Planning"],
          discount: "5% SuperCash",
          bestFor: "seat confirmation",
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
              <Train className="h-8 w-8 mr-3 text-pink-500" />
              Train Ticket Booking
            </h1>
            <p className="text-gray-600">
              Book train tickets hassle-free with real-time availability, seat selection, and instant confirmation
            </p>
          </div>
          
          <div className="mb-8">
            <GeminiSearchBar 
              serviceType="train-booking" 
              onResults={handleSearch}
              placeholder="Search for routes, trains, classes, or stations..."
              className="max-w-2xl"
            />
          </div>
          
          {searchResults && (
            <Alert className="mb-8 border-pink-200 bg-pink-50">
              <Info className="h-4 w-4 text-pink-500" />
              <AlertTitle>Search Results</AlertTitle>
              <AlertDescription>
                {searchResults.summary || "Here are the search results for your query."}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ServiceComparison
                title="Compare Train Booking Platforms"
                description="Find the best booking options and features from different providers"
                providers={providers}
                loading={loading}
              />
            </div>
            
            <div>
              <AIRecommendations
                type="general"
                title="Recommended Train Routes"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChat
                serviceType="train-booking"
                title="Train Booking Assistant"
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Routes</CardTitle>
                  <CardDescription>Most booked train journeys</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { route: "Delhi - Mumbai", trains: "12 trains", duration: "16-21 hrs", price: "₹850-₹5,250" },
                      { route: "Bangalore - Chennai", trains: "8 trains", duration: "5-7 hrs", price: "₹450-₹2,100" },
                      { route: "Kolkata - Hyderabad", trains: "5 trains", duration: "26-30 hrs", price: "₹1,200-₹4,500" },
                    ].map((route, index) => (
                      <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                        <div className="h-10 w-10 bg-pink-100 rounded-md flex items-center justify-center">
                          <Train className="h-5 w-5 text-pink-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{route.route}</h3>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{route.trains}</span>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{route.duration}</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-pink-600">
                            {route.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-medium mb-2">Booking Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                        Book 60-90 days in advance for best availability
                      </li>
                      <li className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-pink-500" />
                        Tatkal bookings open 24 hours before departure
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

export default TrainBooking;
