
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
import { Hotel, Info, StarIcon, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/components/services/ServiceComparison";

const HotelReservation = () => {
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
          id: "booking",
          name: "Booking.com",
          price: "₹4,500/night",
          rating: 4.7,
          votes: 20423,
          eta: "Instant",
          features: ["Free Cancellation", "Pay at Stay", "24/7 Support"],
          discount: "15% OFF with Genius",
          bestFor: "international hotels",
        },
        {
          id: "makemytrip",
          name: "MakeMyTrip",
          price: "₹4,200/night",
          rating: 4.5,
          votes: 18845,
          eta: "Instant",
          features: ["MMT Luxe", "Zero Cancellation Fee", "Couple Friendly"],
          discount: "Use MMTFIRST for ₹800 OFF",
          bestFor: "domestic options",
        },
        {
          id: "airbnb",
          name: "Airbnb",
          price: "₹3,900/night",
          rating: 4.6,
          votes: 15723,
          eta: "Verification Required",
          features: ["Unique Stays", "Local Experiences", "Long-term Stays"],
          discount: "10% OFF on weekly stays",
          bestFor: "unique experiences",
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
          id: "booking",
          name: "Booking.com",
          price: results?.results?.[0]?.price || "₹4,500/night",
          rating: 4.7,
          votes: 20423,
          eta: "Instant",
          features: ["Free Cancellation", "Pay at Stay"],
          discount: "15% OFF with Genius",
          bestFor: "international hotels",
        },
        {
          id: "makemytrip",
          name: "MakeMyTrip",
          price: results?.results?.[1]?.price || "₹4,200/night",
          rating: 4.5,
          votes: 18845,
          eta: "Instant",
          features: ["MMT Luxe", "Zero Cancellation Fee"],
          discount: "Use MMTFIRST for ₹800 OFF",
          bestFor: "domestic options",
        },
        {
          id: "airbnb",
          name: "Airbnb",
          price: results?.results?.[2]?.price || "₹3,900/night",
          rating: 4.6,
          votes: 15723,
          eta: "Verification Required",
          features: ["Unique Stays", "Local Experiences"],
          discount: "10% OFF on weekly stays",
          bestFor: "unique experiences",
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
              <Hotel className="h-8 w-8 mr-3 text-green-500" />
              Hotel Reservations
            </h1>
            <p className="text-gray-600">
              Find and book the perfect accommodation for your next trip, from luxury hotels to cozy stays
            </p>
          </div>
          
          <div className="mb-8">
            <GeminiSearchBar 
              serviceType="hotel-reservation" 
              onResults={handleSearch}
              placeholder="Search for hotels, locations, amenities..."
              className="max-w-2xl"
            />
          </div>
          
          {searchResults && (
            <Alert className="mb-8 border-green-200 bg-green-50">
              <Info className="h-4 w-4 text-green-500" />
              <AlertTitle>Search Results</AlertTitle>
              <AlertDescription>
                {searchResults.summary || "Here are the search results for your query."}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <ServiceComparison
                title="Compare Hotel Booking Platforms"
                description="Find the best rates and amenities from different providers"
                providers={providers}
                loading={loading}
              />
            </div>
            
            <div>
              <AIRecommendations
                type="hotels"
                title="Recommended Hotels"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIChat
                serviceType="hotel-reservation"
                title="Hotel Booking Assistant"
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Hotels</CardTitle>
                  <CardDescription>Top-rated accommodations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Grand Plaza", type: "5-Star Hotel", rating: 4.9, price: "₹8,500/night", availability: "Limited rooms" },
                      { name: "Urban Stay", type: "Boutique Hotel", rating: 4.7, price: "₹5,200/night", availability: "Available" },
                      { name: "Mountain View", type: "Resort", rating: 4.8, price: "₹7,800/night", availability: "Booking fast" },
                    ].map((hotel, index) => (
                      <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                        <div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center text-lg font-bold text-green-700">
                          {hotel.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{hotel.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{hotel.type}</span>
                            <span className="mx-1">•</span>
                            <span className="flex items-center">
                              <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                              {hotel.rating}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm font-medium text-green-600">{hotel.price}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {hotel.availability}
                            </span>
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

export default HotelReservation;
