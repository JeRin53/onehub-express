
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GeminiSearchBar from "@/components/search/GeminiSearchBar";
import AIRecommendations from "@/components/ai/AIRecommendations";
import { Utensils, Car, Hotel, Fuel, Train, ArrowRight, Star, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Services = () => {
  const { session } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: "food-delivery",
      title: "Food Delivery",
      description: "Order food from your favorite restaurants and have it delivered to your doorstep.",
      icon: <Utensils className="h-6 w-6" />,
      color: "bg-orange-500",
      link: "/services/food-delivery",
      image: "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      features: [
        "Order from multiple restaurants in one cart",
        "Real-time delivery tracking",
        "Exclusive discounts and offers",
        "Schedule deliveries in advance"
      ],
      providers: ["Swiggy", "Zomato", "EatSure"],
      delay: 0.1
    },
    {
      id: "cab-booking",
      title: "Cab Booking",
      description: "Book a safe and reliable ride in seconds. Experienced drivers, fixed fares.",
      icon: <Car className="h-6 w-6" />,
      color: "bg-violet-500",
      link: "/services/cab-booking",
      image: "https://images.unsplash.com/photo-1592853598064-bb1a7826968d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      features: [
        "Compare prices across providers",
        "Book now or schedule for later",
        "Track your ride in real-time",
        "Multiple vehicle options"
      ],
      providers: ["Uber", "Ola", "Rapido"],
      delay: 0.2
    },
    {
      id: "hotel-reservation",
      title: "Hotel Reservations",
      description: "Find and book the perfect accommodation for your next trip, from luxury to cozy stays.",
      icon: <Hotel className="h-6 w-6" />,
      color: "bg-green-500",
      link: "/services/hotel-reservation",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      features: [
        "Best price guarantee",
        "Verified reviews and photos",
        "Flexible booking options",
        "Special member-only deals"
      ],
      providers: ["MakeMyTrip", "Booking.com", "Airbnb"],
      delay: 0.3
    },
    {
      id: "fuel-delivery",
      title: "Fuel Delivery",
      description: "Never run out of fuel again. Get premium quality fuel delivered directly to your vehicle.",
      icon: <Fuel className="h-6 w-6" />,
      color: "bg-blue-500",
      link: "/services/fuel-delivery",
      image: "https://images.unsplash.com/photo-1565677467616-7a0f7bfc8e22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      features: [
        "On-demand or scheduled delivery",
        "High-quality fuel guarantee",
        "Doorstep service",
        "Digital payment options"
      ],
      providers: ["MyPetrolPump", "FuelBuddy", "Humsafar"],
      delay: 0.4
    },
    {
      id: "train-booking",
      title: "Train Ticket Booking",
      description: "Book train tickets hassle-free with real-time availability and instant confirmation.",
      icon: <Train className="h-6 w-6" />,
      color: "bg-pink-500",
      link: "/services/train-booking",
      image: "https://images.unsplash.com/photo-1503714184981-a7b2c46c8398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
      features: [
        "PNR status tracking",
        "Seat selection capability",
        "Alternative routes suggestion",
        "Travel insurance options"
      ],
      providers: ["IRCTC", "Trainman", "ConfirmTkt"],
      delay: 0.5
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-violet-50 via-orange-50 to-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-orange-100 text-orange-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                  All Services
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Your essential services,
                  <br />
                  all in one place
                </h1>
                <p className="text-lg text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  ONEHUB brings together the best service providers to offer you a seamless, 
                  integrated experience across food delivery, transportation, accommodations, and more.
                </p>
                
                <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-2xl">
                    <GeminiSearchBar 
                      serviceType="general" 
                      placeholder="Try 'I want to order biriyani, fast and cheap'"
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Powered by Gemini AI - Just describe what you need in natural language</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {["Swiggy", "Zomato", "Uber", "Ola", "MakeMyTrip", "IRCTC", "Booking.com", "Amazon", "Flipkart"].map((brand, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center h-20"
                  >
                    <p className="font-medium text-gray-700">{brand}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Services Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block bg-violet-100 text-violet-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                Our Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Everything you need in one app
              </h2>
              <p className="text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                We've partnered with the best service providers in each category to bring you a seamless, 
                integrated experience that saves you time and simplifies your life.
              </p>
            </div>
            
            <div className="space-y-16">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  } animate-fade-in`}
                  style={{ animationDelay: `${service.delay}s` }}
                >
                  <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img 
                        src={service.image}
                        alt={service.title}
                        className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-6 w-full">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white text-xl font-semibold">{service.title}</h3>
                            <div className={`${service.color} text-white p-2 rounded-full`}>
                              {service.icon}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.providers.map((provider, i) => (
                              <span key={i} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                {provider}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-4 text-white text-sm">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              <span>4.8</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Fast</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>Near you</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className={`inline-block ${service.color} text-white p-3 rounded-xl mb-4`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="rounded-full bg-green-100 text-green-500 p-1 mt-0.5 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      to={service.link} 
                      className={`inline-flex items-center px-6 py-3 rounded-full text-white ${service.color} hover:bg-opacity-90 transition-all`}
                    >
                      Explore {service.title}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* AI Recommendations */}
        {session && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-block bg-green-100 text-green-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                  AI Powered
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Personalized for you
                </h2>
                <p className="text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  Our AI analyzes your preferences and usage patterns to provide recommendations 
                  tailored specifically to your needs and tastes.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AIRecommendations type="restaurants" title="Food Recommendations" />
                <AIRecommendations type="hotels" title="Hotel Recommendations" />
                <AIRecommendations type="cabs" title="Cab Recommendations" />
              </div>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-violet-600 to-violet-800 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
              Ready to simplify your life?
            </h2>
            <p className="text-violet-100 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Join thousands of satisfied users who have made ONEHUB an essential part of their daily routine. Get started today and experience the convenience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/dashboard" className="bg-white text-violet-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-out">
                Get Started
              </Link>
              <Link to="/about" className="border border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-full transition-all duration-300 ease-out">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
