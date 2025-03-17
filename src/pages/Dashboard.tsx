
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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
  ArrowRight
} from "lucide-react";
import ServiceCard from "@/components/ui/ServiceCard";

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const recentBookings = [
    {
      id: 1,
      service: "Food Delivery",
      vendor: "Tasty Treats",
      date: "Today, 2:30 PM",
      status: "On the way",
      icon: <Utensils size={16} />,
      color: "bg-orange-500",
    },
    {
      id: 2,
      service: "Cab Booking",
      vendor: "City Cabs",
      date: "Yesterday, 10:15 AM",
      status: "Completed",
      icon: <Car size={16} />,
      color: "bg-violet-500",
    },
    {
      id: 3,
      service: "Hotel Reservation",
      vendor: "Grand Plaza",
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
      validity: "Valid till June 30, 2023",
      color: "bg-gradient-to-r from-violet-500 to-purple-600",
    },
    {
      id: 2,
      title: "Free Delivery on Food Orders",
      code: "FREEFOOD",
      validity: "Valid till July 5, 2023",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Manage all your services from your personal dashboard</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <Wallet className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold">Your Wallet</h3>
              </div>
              <p className="text-2xl font-bold mb-1">$249.50</p>
              <p className="text-gray-500 text-sm">Available balance</p>
              <div className="mt-4">
                <Link to="/wallet" className="text-orange-500 text-sm font-medium flex items-center">
                  Add Money
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
                <Link to="/rewards" className="text-violet-500 text-sm font-medium flex items-center">
                  Redeem Points
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
                <Link to="/notifications" className="text-green-500 text-sm font-medium flex items-center">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Services</h2>
              <Link to="/services" className="text-orange-500 font-medium flex items-center">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 3).map((service) => (
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
          
          {/* Recent Bookings & Offers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Bookings</h2>
                  <Link to="/bookings" className="text-orange-500 text-sm font-medium flex items-center">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
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
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Special Offers</h2>
                  <Link to="/offers" className="text-orange-500 text-sm font-medium flex items-center">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
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
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
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
