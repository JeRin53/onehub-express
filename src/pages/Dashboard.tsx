import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Utensils,
  Car,
  Hotel,
  Fuel,
  Train,
  Wallet,
  Gift,
  Bell,
  Star,
  Clock,
  ArrowRight,
  Search,
  Sparkles
} from "lucide-react";
import ServiceCard from "@/components/ui/ServiceCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import GeminiSearchBar from "@/components/search/GeminiSearchBar";
import AIRecommendations from "@/components/ai/AIRecommendations";
import AIChat from "@/components/ai/AIChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, userProfile: authUserProfile } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard: user:", user ? "exists" : "null", "authUserProfile:", authUserProfile);
  }, [user, authUserProfile]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log("Fetching user data for ID:", user.id);

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile data:", profileError);
        if (authUserProfile) {
          setUserProfile(authUserProfile);
        }
      } else {
        console.log("Profile data fetched:", profileData);
        setUserProfile(profileData);
      }

      const { data: historyData, error: historyError } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (historyError) {
        console.error("Error fetching search history:", historyError);
      } else {
        setSearchHistory(historyData || []);
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
      } else {
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = () => {
    toast.info("Add Money feature would open here");
  };

  const handleRedeemPoints = () => {
    toast.info("Redeem Points feature would open here");
  };

  const handleViewNotifications = () => {
    toast.info("Notifications would open here");
  };

  const handleViewAllServices = () => {
    navigate('/services');
  };

  const handleViewAllActivity = () => {
    toast.info("All activity history would open here");
  };

  const handleViewAllOffers = () => {
    toast.info("All offers would open here");
  };

  const services = [
    {
      id: 1,
      title: "Food Delivery",
      description: "Order food from your favorite restaurants and have it delivered to your doorstep in minutes.",
      icon: <Utensils size={24} />,
      path: "/services/food-delivery",
      color: "orange" as const,
    },
    {
      id: 2,
      title: "Cab Booking",
      description: "Book a safe and reliable ride in seconds. Experienced drivers, fixed fares, no surprises.",
      icon: <Car size={24} />,
      path: "/services/cab-booking",
      color: "violet" as const,
    },
    {
      id: 3,
      title: "Hotel Reservations",
      description: "Find and book the perfect accommodation for your next trip, from luxury hotels to cozy stays.",
      icon: <Hotel size={24} />,
      path: "/services/hotel-reservation",
      color: "green" as const,
    },
    {
      id: 4,
      title: "Fuel Delivery",
      description: "Never run out of fuel again. Get premium quality fuel delivered directly to your vehicle.",
      icon: <Fuel size={24} />,
      path: "/services/fuel-delivery",
      color: "blue" as const,
    },
    {
      id: 5,
      title: "Train Ticket Booking",
      description: "Book train tickets hassle-free with real-time availability, seat selection, and instant confirmation.",
      icon: <Train size={24} />,
      path: "/services/train-booking",
      color: "pink" as const,
    },
  ];

  const recentBookings = bookings.length > 0 
    ? bookings.map(booking => ({
        id: booking.id,
        service: booking.service_type,
        vendor: booking.provider,
        date: new Date(booking.created_at).toLocaleDateString(),
        status: booking.status,
        icon: getServiceIcon(booking.service_type),
        color: getServiceColor(booking.service_type),
      }))
    : [
        {
          id: 1,
          service: "Food Delivery",
          vendor: "Swiggy",
          date: "Today, 2:30 PM",
          status: "On the way",
          icon: <Utensils size={16} />,
          color: "bg-orange-500",
        },
        {
          id: 2,
          service: "Cab Booking",
          vendor: "Uber",
          date: "Yesterday, 10:15 AM",
          status: "Completed",
          icon: <Car size={16} />,
          color: "bg-violet-500",
        },
        {
          id: 3,
          service: "Hotel Reservation",
          vendor: "Booking.com",
          date: "June 15-18, 2023",
          status: "Upcoming",
          icon: <Hotel size={16} />,
          color: "bg-green-500",
        },
      ];

  const offers = [
    {
      id: 1,
      title: "50% OFF on First Ride",
      code: "NEWRIDE50",
      validity: "Valid till Aug 31, 2023",
      color: "bg-gradient-to-r from-violet-500 to-purple-600",
    },
    {
      id: 2,
      title: "Free Delivery on Food Orders",
      code: "FREEFOOD",
      validity: "Valid till Sep 5, 2023",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
    },
  ];

  function getServiceIcon(serviceType: string) {
    switch (serviceType?.toLowerCase()) {
      case 'food delivery':
      case 'food-delivery':
        return <Utensils size={16} />;
      case 'cab booking':
      case 'cab-booking':
        return <Car size={16} />;
      case 'hotel reservation':
      case 'hotel-reservation':
        return <Hotel size={16} />;
      case 'fuel delivery':
      case 'fuel-delivery':
        return <Fuel size={16} />;
      case 'train booking':
      case 'train-booking':
        return <Train size={16} />;
      default:
        return <Search size={16} />;
    }
  }

  function getServiceColor(serviceType: string) {
    switch (serviceType?.toLowerCase()) {
      case 'food delivery':
      case 'food-delivery':
        return 'bg-orange-500';
      case 'cab booking':
      case 'cab-booking':
        return 'bg-violet-500';
      case 'hotel reservation':
      case 'hotel-reservation':
        return 'bg-green-500';
      case 'fuel delivery':
      case 'fuel-delivery':
        return 'bg-blue-500';
      case 'train booking':
      case 'train-booking':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {userProfile?.first_name || user?.email?.split('@')[0] || "User"}!
            </h1>
            <p className="text-gray-600">Manage all your services from your personal dashboard</p>
          </div>
          
          <div className="mb-8">
            <div className="p-6 bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 rounded-2xl text-white">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">Gemini AI Search</h2>
                  <p className="opacity-90">Find exactly what you need across all services with AI-powered search</p>
                </div>
                <GeminiSearchBar 
                  serviceType="general" 
                  placeholder="Search with Gemini AI..."
                  className="w-full md:w-96 bg-white/10 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <Wallet className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold">Your Wallet</h3>
              </div>
              <p className="text-2xl font-bold mb-1">₹249.50</p>
              <p className="text-gray-500 text-sm">Available balance</p>
              <div className="mt-4">
                <button 
                  onClick={handleAddMoney}
                  className="text-orange-500 text-sm font-medium flex items-center"
                >
                  Add Money
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-violet-100 p-3 rounded-lg mr-4">
                  <Gift className="h-6 w-6 text-violet-500" />
                </div>
                <h3 className="font-semibold">Rewards</h3>
              </div>
              <p className="text-2xl font-bold mb-1">750 points</p>
              <p className="text-gray-500 text-sm">Current reward points</p>
              <div className="mt-4">
                <button 
                  onClick={handleRedeemPoints}
                  className="text-violet-500 text-sm font-medium flex items-center"
                >
                  Redeem Points
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Bell className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <p className="text-2xl font-bold mb-1">3 new</p>
              <p className="text-gray-500 text-sm">Unread notifications</p>
              <div className="mt-4">
                <button 
                  onClick={handleViewNotifications}
                  className="text-green-500 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-violet-500" />
                AI Assistant
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Full Chat</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>AI Assistant</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden h-full">
                    <AIChat serviceType="general" className="h-full" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <AIChat 
                serviceType="general" 
                title="How can I help you today?"
              />
            </div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Services</h2>
              <button 
                onClick={handleViewAllServices}
                className="text-orange-500 font-medium flex items-center"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  path={service.path}
                  color={service.color}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-orange-500" />
                Personalized For You
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AIRecommendations
                type="restaurants"
                title="Recommended Restaurants"
              />
              
              <AIRecommendations
                type="hotels"
                title="Hotel Suggestions"
              />
              
              <AIRecommendations
                type="cabs"
                title="Popular Routes"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                  <button 
                    onClick={handleViewAllActivity}
                    className="text-orange-500 text-sm font-medium flex items-center"
                  >
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-lg ${booking.color} flex items-center justify-center text-white mr-4`}>
                        {booking.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.service}</h3>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{booking.vendor}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.date}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <h3 className="font-medium mt-6 mb-3">Recent Searches</h3>
                  {searchHistory.length > 0 ? (
                    searchHistory.slice(0, 3).map((search, index) => (
                      <div key={index} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${getServiceColor(search.service_type)} flex items-center justify-center text-white mr-4`}>
                          {getServiceIcon(search.service_type)}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{search.query}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(search.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No search history yet
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Special Offers</h2>
                  <button 
                    onClick={handleViewAllOffers}
                    className="text-orange-500 text-sm font-medium flex items-center"
                  >
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div 
                      key={offer.id} 
                      className={`p-4 rounded-xl text-white ${offer.color}`}
                    >
                      <h3 className="font-bold mb-1">{offer.title}</h3>
                      <div className="bg-white/20 rounded px-2 py-1 text-sm inline-block mb-3">
                        Code: <span className="font-semibold">{offer.code}</span>
                      </div>
                      <p className="text-xs opacity-80">{offer.validity}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center mb-3">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                      <h3 className="font-semibold">Rate your experience</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Help us improve by sharing your feedback!
                    </p>
                    <button 
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      onClick={() => toast.info("Feedback form would open here")}
                    >
                      Leave Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
