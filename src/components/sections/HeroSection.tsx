
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import GeminiSearchBar from "@/components/search/GeminiSearchBar";

const HeroSection = () => {
  const [animatedLogos, setAnimatedLogos] = useState(false);
  
  useEffect(() => {
    // Start logo animation after component mounts
    const timer = setTimeout(() => {
      setAnimatedLogos(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Popular services that will be shown floating and merging into ONEHUB
  const serviceLogos = [
    { name: "Food Delivery", icon: "🍔", color: "bg-orange-500", delay: 0 },
    { name: "Cab Booking", icon: "🚕", color: "bg-violet-500", delay: 0.3 },
    { name: "Hotel Booking", icon: "🏨", color: "bg-green-500", delay: 0.6 },
    { name: "Shopping", icon: "🛍️", color: "bg-blue-500", delay: 0.9 },
    { name: "Train Tickets", icon: "🚆", color: "bg-pink-500", delay: 1.2 },
    { name: "Fuel Delivery", icon: "⛽", color: "bg-yellow-500", delay: 1.5 },
  ];

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-orange-50 to-green-50 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <span className="inline-block bg-orange-100 text-orange-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              All Essential Services In One Place
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Your Daily Essentials in{" "}
              <span className="bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">
                ONEHUB
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Find and book all your daily services in one app. From food delivery to cab booking, hotel reservations to train tickets - we've got you covered.
            </p>
            
            {/* AI Search Bar */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-2xl">
                <GeminiSearchBar 
                  serviceType="general" 
                  placeholder="Try 'I want to order biriyani, fast and cheap'"
                  className="w-full"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Powered by Gemini AI - Just describe what you need in natural language</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Link to="/dashboard" className="btn-primary flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/#services" className="btn-outline flex items-center justify-center">
                Explore Services
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">10K+</h4>
                <p className="text-gray-600">Daily Users</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">5+</h4>
                <p className="text-gray-600">Services</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">99%</h4>
                <p className="text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>
          
          {/* Integration Illustration */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-96 md:h-[500px]">
              {/* Floating glowing orbs in background */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.2s" }} />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.8s" }} />
              
              {/* ONEHUB center box */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl shadow-xl flex items-center justify-center z-10 animate-pulse-soft">
                <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">ONEHUB</div>
              </div>
              
              {/* Floating service logos that move toward the center */}
              {serviceLogos.map((service, index) => (
                <div 
                  key={index}
                  className={`absolute ${service.color} w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex items-center justify-center text-2xl md:text-3xl z-0 transition-all duration-1000 ease-in-out ${
                    animatedLogos 
                      ? "opacity-0 scale-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                      : "opacity-100"
                  }`}
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${10 + Math.random() * 80}%`,
                    transitionDelay: `${service.delay + 1}s`,
                    transformOrigin: 'center',
                  }}
                >
                  <span role="img" aria-label={service.name}>{service.icon}</span>
                </div>
              ))}
              
              {/* Service category labels */}
              <div className="absolute top-5 left-0 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🍔
                </div>
                <div>
                  <p className="text-xs text-gray-500">Food Delivery</p>
                  <p className="text-sm font-semibold">5 mins away</p>
                </div>
              </div>
              
              <div className="absolute bottom-5 right-0 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1s" }}>
                <div className="bg-violet-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🚕
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cab Booking</p>
                  <p className="text-sm font-semibold">2 mins away</p>
                </div>
              </div>
              
              <div className="absolute top-1/4 right-10 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1.2s" }}>
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🏨
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hotel Booking</p>
                  <p className="text-sm font-semibold">Best deals</p>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 left-10 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1.4s" }}>
                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🛍️
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shopping</p>
                  <p className="text-sm font-semibold">60% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
